import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import type { FlashCode } from "@/lib/flash";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/** Nothing on this site renders an image wider than a full-bleed banner. */
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

/**
 * Upload failure. Carries a flash code rather than a message so the Indonesian
 * copy lives only in lib/flash.ts instead of being thrown, URL-encoded into a
 * redirect, and echoed back to the page.
 */
export type UploadErrorCode = Extract<
  FlashCode,
  "upload-empty" | "upload-large" | "upload-type" | "upload-required"
>;

export class UploadError extends Error {
  constructor(readonly code: UploadErrorCode) {
    super(code);
    this.name = "UploadError";
  }
}

/**
 * Saves an uploaded image to /public/uploads/<subfolder> and returns the public
 * URL path to store on the record (e.g. Testimonial.imageUrl).
 *
 * Originals used to be written to disk byte-for-byte, so a phone photo landed
 * as a multi-megabyte JPEG that the image optimizer then had to decode on every
 * cold request — and with its EXIF GPS coordinates intact in a public folder.
 * Everything is now re-encoded to WebP, capped at MAX_WIDTH, and stripped of
 * metadata (sharp drops EXIF unless withMetadata() is called).
 */
export async function saveUploadedImage(
  file: File,
  subfolder: string
): Promise<string> {
  if (file.size === 0) {
    throw new UploadError("upload-empty");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadError("upload-large");
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new UploadError("upload-type");
  }

  const filename = `${crypto.randomUUID()}.webp`;
  const dir = path.join(UPLOAD_ROOT, subfolder);
  await mkdir(dir, { recursive: true });

  const input = Buffer.from(await file.arrayBuffer());
  const output = await sharp(input, { animated: true })
    // Honour the EXIF orientation flag before it is discarded, otherwise
    // portrait phone photos come out sideways.
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  await writeFile(path.join(dir, filename), output);

  return `/uploads/${subfolder}/${filename}`;
}

/**
 * Deletes a previously uploaded file. Replacing an image used to orphan the old
 * one on disk forever.
 *
 * Resolves and re-checks the path so a malformed or crafted URL can never reach
 * outside /public/uploads. Never throws: losing a stale file is not worth
 * failing an otherwise successful save.
 */
export async function deleteUploadedImage(
  imageUrl: string | null | undefined
): Promise<void> {
  if (!imageUrl?.startsWith("/uploads/")) return;

  const target = path.resolve(
    UPLOAD_ROOT,
    "." + imageUrl.slice("/uploads".length)
  );
  const root = path.resolve(UPLOAD_ROOT);
  if (target !== root && !target.startsWith(root + path.sep)) return;

  try {
    await unlink(target);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      console.error("[upload] gagal menghapus file lama", imageUrl, error);
    }
  }
}

/** Returns the uploaded File from a form field, or null if none was chosen. */
export function getOptionalFile(
  formData: FormData,
  field: string
): File | null {
  const value = formData.get(field);
  if (value instanceof File && value.size > 0) {
    return value;
  }
  return null;
}

/**
 * Resolves the image path to persist from a form's "photo" file field.
 * - If a file was uploaded, it's saved and its path returned.
 * - Otherwise, falls back to `fallback` (e.g. the record's current image
 *   when editing) if provided, or throws if the photo is required.
 */
export async function resolveImage(
  formData: FormData,
  subfolder: string,
  fallback?: string
): Promise<string> {
  const photo = getOptionalFile(formData, "photo");
  if (photo) {
    return saveUploadedImage(photo, subfolder);
  }
  if (fallback) return fallback;
  throw new UploadError("upload-required");
}

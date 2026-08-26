import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export class UploadError extends Error {}

/**
 * Saves an uploaded image file to /public/uploads/<subfolder> and returns
 * the public URL path to store on the record (e.g. Testimonial.imageUrl).
 */
export async function saveUploadedImage(
  file: File,
  subfolder: string
): Promise<string> {
  if (file.size === 0) {
    throw new UploadError("File kosong.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadError("Ukuran file maksimal 5MB.");
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new UploadError("Format file harus JPG, PNG, WEBP, atau GIF.");
  }

  const extension = EXTENSION_BY_TYPE[file.type];
  const filename = `${crypto.randomUUID()}.${extension}`;
  const dir = path.join(process.cwd(), "public", "uploads", subfolder);
  await mkdir(dir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);

  return `/uploads/${subfolder}/${filename}`;
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
  throw new UploadError("Foto wajib diunggah.");
}

import Image, { type ImageProps } from "next/image";
import { withBasePath } from "@/lib/base-path";

/**
 * next/image with the app's basePath applied to local `src` paths. Use this
 * instead of importing next/image directly, or local images 404 when the app
 * runs under a prefix such as /web-cdre.
 */
export default function AppImage({ src, alt, ...props }: ImageProps) {
  return (
    <Image src={typeof src === "string" ? withBasePath(src) : src} alt={alt} {...props} />
  );
}

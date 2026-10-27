import type { CSSProperties } from "react";
import Image from "@/components/ui/AppImage";

type Photo = { id: number; imageUrl: string; caption: string | null };

// Short lists are repeated so one copy of the strip is wider than the screen.
const MIN_PER_COPY = 12;
const AMPLITUDE_PX = 28;

/**
 * An endless strip of activity photos, each lifted or lowered on a sine wave.
 * The list is rendered twice and the track slides by half its width, so the
 * loop is seamless; the wave completes whole cycles per copy for the same
 * reason. `reverse` flips both the order and the direction, so the footer
 * strip never mirrors the homepage one.
 */
export default function PhotoWave({
  photos,
  className = "",
  reverse = false,
}: {
  photos: Photo[];
  className?: string;
  reverse?: boolean;
}) {
  if (photos.length === 0) return null;

  const ordered = reverse ? [...photos].reverse() : photos;
  let copy = ordered;
  while (copy.length < MIN_PER_COPY) copy = copy.concat(ordered);
  const cycles = Math.max(1, Math.round(copy.length / 7));

  return (
    <div className={`marquee overflow-hidden py-10 ${className}`}>
      <div
        className={`marquee-track flex w-max ${reverse ? "is-reverse" : ""}`}
        style={{ "--marquee-duration": `${copy.length * 4}s` } as CSSProperties}
      >
        {[0, 1].map((pass) => (
          <ul key={pass} aria-hidden={pass === 1} className="flex shrink-0 gap-4 pr-4">
            {copy.map((photo, i) => {
              const offset = Math.sin((2 * Math.PI * cycles * i) / copy.length) * AMPLITUDE_PX;
              return (
                <li
                  key={`${photo.id}-${i}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream-dark sm:h-32 sm:w-32"
                  style={{ transform: `translateY(${offset.toFixed(1)}px)` }}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={pass === 0 ? (photo.caption ?? "Dokumentasi kegiatan") : ""}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}

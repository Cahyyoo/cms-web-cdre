import Image from "next/image";
import type { GalleryType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

async function getGalleryItems(type: GalleryType) {
  return prisma.gallery.findMany({
    where: { type },
    orderBy: { id: "desc" },
  });
}

export default async function GalleryGrid({ type }: { type: GalleryType }) {
  const items = await getGalleryItems(type);

  if (items.length === 0) {
    return <p className="text-sm text-slate-400">Belum ada item untuk ditampilkan.</p>;
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 [&>*]:mb-4">
      {items.map((item) => (
        <figure
          key={item.id}
          className="break-inside-avoid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="relative w-full">
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={600}
              height={400}
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
          <figcaption className="p-3">
            <p className="text-sm font-medium text-slate-800">{item.title}</p>
            {item.period && (
              <p className="text-xs text-slate-400">{item.period}</p>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

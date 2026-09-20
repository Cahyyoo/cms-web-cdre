import Image from "next/image";
import type { GalleryType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** This grid has no pagination, so the query needs its own ceiling. */
const MAX_ITEMS = 60;

async function getGalleryItems(type: GalleryType) {
  return prisma.gallery.findMany({
    where: { type },
    select: { id: true, title: true, period: true, imageUrl: true },
    orderBy: { id: "desc" },
    take: MAX_ITEMS,
  });
}

export default async function GalleryGrid({ type }: { type: GalleryType }) {
  const items = await getGalleryItems(type);

  if (items.length === 0) {
    return <p className="text-sm text-slate-400">Belum ada item untuk ditampilkan.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <figure
          key={item.id}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          {/*
            Gallery rows don't store image dimensions, so a hardcoded 600x400
            with h-auto reserved a 3:2 box for images of every shape and the
            grid jumped as each one loaded. An explicit aspect box with `fill`
            is what every other Image in this codebase does.
          */}
          <div className="relative aspect-[3/2] w-full bg-slate-100">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
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

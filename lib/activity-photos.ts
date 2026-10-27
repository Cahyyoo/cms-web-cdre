import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";

const select = { id: true, imageUrl: true, caption: true } as const;

/**
 * Photos for the strips on the homepage and in the footer: the ones an admin
 * ticked "Tampilkan di beranda" on, in their gallery order. Until any are
 * ticked, the latest uploads stand in so the strips are never empty.
 *
 * The footer renders on every public page, hence the cache; activity-gallery
 * actions revalidate the tag.
 */
export const getWavePhotos = unstable_cache(
  async () => {
    const picked = await prisma.activityPhoto.findMany({
      where: { showOnHome: true },
      select,
      orderBy: [{ order: "asc" }, { id: "asc" }],
      take: 24,
    });
    if (picked.length > 0) return picked;
    return prisma.activityPhoto.findMany({
      select,
      orderBy: { createdAt: "desc" },
      take: 16,
    });
  },
  ["wave-photos"],
  { tags: [CACHE_TAGS.activityPhotos] }
);

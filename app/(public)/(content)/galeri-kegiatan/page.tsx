import type { Metadata } from "next";
import ActivityCarousel from "@/components/gallery/ActivityCarousel";
import PageBanner from "@/components/ui/PageBanner";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Galeri Kegiatan",
  description: "Dokumentasi kegiatan PT Stargate Pasific Resource per kategori.",
};

async function getActivityCategories(categoryId?: number) {
  return prisma.activityCategory.findMany({
    where: categoryId ? { id: categoryId } : undefined,
    include: {
      photos: {
        orderBy: [{ order: "asc" }, { id: "asc" }],
      },
    },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}

export default async function GaleriKegiatanPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categoryId = searchParams.category ? Number(searchParams.category) : undefined;
  const categories = await getActivityCategories(categoryId);

  return (
    <div>
      <div className="mb-10">
        <PageBanner
          src="/banners/kegiatan-kesehatan.jpg"
          alt="Dokumentasi kegiatan pemberdayaan masyarakat PT Stargate Pasific Resource"
          title="Galeri Kegiatan"
          subtitle="Dokumentasi kegiatan perusahaan berdasarkan kategori."
        />
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-slate-400">Belum ada kategori kegiatan untuk ditampilkan.</p>
      ) : (
        <div className="space-y-14">
          {categories.map((category) => (
            <section key={category.id} id={`kategori-${category.id}`}>
              <h2 className="mb-4 font-serif text-xl font-semibold text-slate-900 sm:text-2xl">
                {category.name}
              </h2>
              <ActivityCarousel
                photos={category.photos.map((p) => ({
                  id: p.id,
                  imageUrl: p.imageUrl,
                  caption: p.caption,
                }))}
              />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

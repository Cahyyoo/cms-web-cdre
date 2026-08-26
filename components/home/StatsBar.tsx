import { prisma } from "@/lib/prisma";

async function getCounts() {
  const [posts, binaanGroups, penghargaan, activityPhotos] = await Promise.all([
    prisma.post.count(),
    prisma.binaanGroup.count(),
    prisma.gallery.count({ where: { type: "PENGHARGAAN" } }),
    prisma.activityPhoto.count(),
  ]);
  return { posts, binaanGroups, penghargaan, activityPhotos };
}

export default async function StatsBar() {
  const counts = await getCounts();

  const stats = [
    { value: counts.posts, label: "Publikasi CSR & PPM" },
    { value: counts.binaanGroups, label: "Kelompok UMKM Binaan" },
    { value: counts.penghargaan, label: "Penghargaan Diterima" },
    { value: counts.activityPhotos, label: "Dokumentasi Kegiatan" },
  ];

  return (
    <section className="bg-brand-dark">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map(({ value, label }, i) => (
          <div
            key={label}
            className={`text-center ${i > 0 ? "lg:border-l lg:border-white/10" : ""}`}
          >
            <p className="font-serif text-4xl font-semibold text-white sm:text-5xl">
              {value}
              <span className="text-brand-light">+</span>
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-white/60">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

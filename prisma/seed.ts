import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Budi Santoso",
        title: "Kepala Desa Alenggo",
        quote:
          "Program PPM dari PT Stargate Pasific Resource sangat membantu peningkatan ekonomi warga desa kami.",
        imageUrl: "https://picsum.photos/seed/testi1/200/200",
      },
      {
        name: "Siti Aminah",
        title: "Ketua Kelompok UMKM Teras Pangan Alenggo",
        quote:
          "Berkat pendampingan dan pelatihan, produk UMKM kami kini bisa dipasarkan lebih luas.",
        imageUrl: "https://picsum.photos/seed/testi2/200/200",
      },
    ],
  });

  await prisma.category.createMany({
    data: [
      { name: "Pendidikan", type: "PPM", order: 1 },
      { name: "Kesehatan", type: "PPM", order: 2 },
      { name: "Peningkatan Pendapatan Rill", type: "PPM", order: 3 },
      { name: "Kemandirian Ekonomi", type: "PPM", order: 4 },
      { name: "Sosial Budaya", type: "PPM", order: 5 },
      { name: "Lingkungan", type: "PPM", order: 6 },
      { name: "Kelembagaan Masyarakat", type: "PPM", order: 7 },
      { name: "Infrastruktur", type: "PPM", order: 8 },
    ],
  });
  const ppmCategory = await prisma.category.findFirstOrThrow({
    where: { name: "Pendidikan", type: "PPM" },
  });
  const csrCategory = await prisma.category.create({
    data: { name: "Lingkungan", type: "CSR" },
  });

  await prisma.post.createMany({
    data: [
      {
        title: "Bantuan Beasiswa untuk Pelajar Desa Alenggo",
        slug: "bantuan-beasiswa-pelajar-desa-alenggo",
        content: "<p>Konten artikel PPM contoh.</p>",
        thumbnailUrl: "https://picsum.photos/seed/post1/600/400",
        categoryId: ppmCategory.id,
        viewCount: 152,
      },
      {
        title: "Penanaman 1000 Pohon Mangrove",
        slug: "penanaman-1000-pohon-mangrove",
        content: "<p>Konten artikel CSR contoh.</p>",
        thumbnailUrl: "https://picsum.photos/seed/post2/600/400",
        categoryId: csrCategory.id,
        viewCount: 98,
      },
    ],
  });

  const binaanGroup = await prisma.binaanGroup.create({
    data: { name: "Teras Pangan Alenggo" },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Keripik Singkong",
        groupId: binaanGroup.id,
        flavor: "Original",
        description: "Keripik singkong renyah produksi UMKM binaan.",
        imageUrl: "https://picsum.photos/seed/prod1/400/400",
        waNumber: "081234567890",
      },
      {
        name: "Sambal Teri",
        groupId: binaanGroup.id,
        flavor: "Pedas",
        description: "Sambal teri khas produksi UMKM binaan.",
        imageUrl: "https://picsum.photos/seed/prod2/400/400",
        waNumber: "081234567890",
      },
    ],
  });

  await prisma.gallery.createMany({
    data: [
      { title: "Penghargaan PROPER Hijau", type: "PENGHARGAAN", imageUrl: "https://picsum.photos/seed/gal2/500/500" },
    ],
  });

  const kegiatanCategory = await prisma.activityCategory.create({
    data: { name: "Pendidikan", order: 1 },
  });

  await prisma.activityPhoto.createMany({
    data: [
      { caption: "Bantuan sarana belajar", imageUrl: "https://picsum.photos/seed/act1/600/400", categoryId: kegiatanCategory.id, order: 1 },
      { caption: "Kunjungan sekolah binaan", imageUrl: "https://picsum.photos/seed/act2/600/400", categoryId: kegiatanCategory.id, order: 2 },
    ],
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

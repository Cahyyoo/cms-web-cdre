import { HeroSlot } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Metadata for each fixed hero/banner placement on the public site.
 * Rows for every slot are created by the `add_hero_images` migration;
 * `defaultImageUrl` is only a defensive fallback in case a row is ever
 * missing (e.g. a fresh DB that skipped seeding).
 */
export const HERO_SLOTS: Record<
  HeroSlot,
  {
    label: string;
    page: string;
    recommendedSize: string;
    hint: string;
    defaultImageUrl: string;
  }
> = {
  HOME_HERO: {
    label: "Hero Beranda",
    page: "/ (Beranda) — banner utama di bagian atas",
    recommendedSize: "1920×1080px (rasio 16:9)",
    hint: "Gambar lanskap, minimal lebar 1600px — akan dipotong penuh satu layar (object-cover).",
    defaultImageUrl: "/banners/hero-sehat-bareng.jpg",
  },
  HOME_SAMBUTAN: {
    label: "Gambar Sambutan Beranda",
    page: "/ (Beranda) — bagian \"Sambutan\"",
    recommendedSize: "1200×900px (rasio 4:3)",
    hint: "Gambar lanskap/potret rasio 4:3, minimal lebar 1000px.",
    defaultImageUrl: "/banners/bantuan-hewan-qurban.jpg",
  },
  PPM_BANNER: {
    label: "Banner PPM",
    page: "/ppm — banner judul halaman",
    recommendedSize: "1600×600px (rasio ~8:3)",
    hint: "Gambar lanskap lebar, minimal lebar 1400px.",
    defaultImageUrl: "/banners/bantuan-dana-pendidikan.jpg",
  },
  CSR_BANNER: {
    label: "Banner CSR",
    page: "/csr — banner judul halaman",
    recommendedSize: "1600×600px (rasio ~8:3)",
    hint: "Gambar lanskap lebar, minimal lebar 1400px.",
    defaultImageUrl: "/banners/perbaikan-jalan-polora.jpg",
  },
  BINAAN_BANNER: {
    label: "Banner Binaan UMKM",
    page: "/binaan — banner judul halaman",
    recommendedSize: "1600×600px (rasio ~8:3)",
    hint: "Gambar lanskap lebar, minimal lebar 1400px.",
    defaultImageUrl: "/banners/parcel-lebaran.jpg",
  },
  PENGHARGAAN_BANNER: {
    label: "Banner Penghargaan",
    page: "/penghargaan — banner judul halaman",
    recommendedSize: "1600×600px (rasio ~8:3)",
    hint: "Gambar lanskap lebar, minimal lebar 1400px.",
    defaultImageUrl: "/banners/perbaikan-jalan-molore.jpg",
  },
  GALERI_KEGIATAN_BANNER: {
    label: "Banner Galeri Kegiatan",
    page: "/galeri-kegiatan — banner judul halaman",
    recommendedSize: "1600×600px (rasio ~8:3)",
    hint: "Gambar lanskap lebar, minimal lebar 1400px.",
    defaultImageUrl: "/banners/kegiatan-kesehatan.jpg",
  },
};

export const HERO_SLOT_ORDER = Object.keys(HERO_SLOTS) as HeroSlot[];

/** Fetches the current image URL for a single hero slot, with a hardcoded fallback. */
export async function getHeroImageUrl(slot: HeroSlot): Promise<string> {
  const row = await prisma.heroImage.findUnique({ where: { slot } });
  return row?.imageUrl ?? HERO_SLOTS[slot].defaultImageUrl;
}

/** Fetches image URLs for several hero slots at once (e.g. the homepage needs two). */
export async function getHeroImageUrls(
  slots: HeroSlot[]
): Promise<Record<string, string>> {
  const rows = await prisma.heroImage.findMany({
    where: { slot: { in: slots } },
  });
  const bySlot = new Map(rows.map((row) => [row.slot, row.imageUrl]));
  return Object.fromEntries(
    slots.map((slot) => [slot, bySlot.get(slot) ?? HERO_SLOTS[slot].defaultImageUrl])
  );
}

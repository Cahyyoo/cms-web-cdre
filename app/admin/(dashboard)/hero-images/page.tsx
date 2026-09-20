import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { HERO_SLOT_ORDER, HERO_SLOTS } from "@/lib/hero-images";
import { prisma } from "@/lib/prisma";
import FormAlert from "@/components/ui/FormAlert";

export const metadata: Metadata = {
  title: "Gambar Hero & Banner",
};

async function getHeroImages() {
  const rows = await prisma.heroImage.findMany();
  const bySlot = new Map(rows.map((row) => [row.slot, row]));
  return HERO_SLOT_ORDER.map((slot) => ({
    slot,
    ...HERO_SLOTS[slot],
    imageUrl: bySlot.get(slot)?.imageUrl ?? HERO_SLOTS[slot].defaultImageUrl,
    updatedAt: bySlot.get(slot)?.updatedAt ?? null,
  }));
}

export default async function HeroImagesAdminPage({
  searchParams,
}: {
  searchParams: { flash?: string };
}) {
  const items = await getHeroImages();

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold text-slate-900">Gambar Hero &amp; Banner</h1>
        <p className="mt-1 text-sm text-slate-500">
          Gambar-gambar utama yang tampil di halaman publik. Setiap slot sudah
          tetap posisinya — cukup ganti gambarnya, tidak perlu tambah/hapus baris.
        </p>
      </div>

      <FormAlert code={searchParams.flash} />

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Gambar</th>
              <th className="px-4 py-3">Lokasi</th>
              <th className="px-4 py-3">Rekomendasi Ukuran</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.slot}>
                <td className="px-4 py-3">
                  <div className="relative h-12 w-20 overflow-hidden rounded-md bg-slate-100">
                    <Image src={item.imageUrl} alt={item.label} fill sizes="80px" className="object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.page}</p>
                </td>
                <td className="px-4 py-3 text-slate-500">{item.recommendedSize}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/hero-images/${item.slot}`}
                      className="rounded-md px-2 py-1 text-xs font-medium text-brand hover:bg-brand/10"
                    >
                      Ganti Gambar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

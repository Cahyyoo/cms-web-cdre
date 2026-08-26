import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PhotoRequirements from "@/components/admin/PhotoRequirements";
import { fileInputClass, inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { prisma } from "@/lib/prisma";
import { updateGalleryItem } from "../actions";

export const metadata: Metadata = {
  title: "Edit Item Galeri",
};

export default async function EditGalleryItemPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const item = await prisma.gallery.findUnique({
    where: { id: Number(params.id) },
  });
  if (!item) notFound();

  const updateGalleryItemWithId = updateGalleryItem.bind(null, item.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Edit Item Galeri</h1>

      {searchParams.error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {searchParams.error}
        </p>
      )}

      <form action={updateGalleryItemWithId} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className={labelClass}>Judul</label>
          <input id="title" name="title" required defaultValue={item.title} className={inputClass} />
        </div>
        <div>
          <label htmlFor="period" className={labelClass}>
            Periode/Tahun <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <input id="period" name="period" defaultValue={item.period ?? ""} className={inputClass} />
        </div>

        <div>
          <span className={labelClass}>Gambar Saat Ini</span>
          <div className="relative h-16 w-16 overflow-hidden rounded-md bg-slate-100">
            <Image src={item.imageUrl} alt={item.title} fill sizes="64px" className="object-cover" />
          </div>
        </div>
        <div>
          <label htmlFor="photo" className={labelClass}>
            Ganti Gambar <span className="font-normal text-slate-400">(kosongkan jika tidak diganti)</span>
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={fileInputClass}
          />
          <PhotoRequirements
            items={[
              "Format: JPG, PNG, WEBP, atau GIF",
              "Ukuran file maksimal 5MB",
              "Rasio bebas (potret/lanskap), minimal 600px pada sisi terpanjang",
            ]}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan Perubahan</button>
          <Link href="/admin/gallery" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

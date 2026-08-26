import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PhotoRequirements from "@/components/admin/PhotoRequirements";
import { fileInputClass, inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { prisma } from "@/lib/prisma";
import { updateActivityPhoto } from "../actions";

export const metadata: Metadata = {
  title: "Edit Foto Kegiatan",
};

export default async function EditActivityPhotoPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const [item, categories] = await Promise.all([
    prisma.activityPhoto.findUnique({ where: { id: Number(params.id) } }),
    prisma.activityCategory.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
  ]);
  if (!item) notFound();

  const updateActivityPhotoWithId = updateActivityPhoto.bind(null, item.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Edit Foto Kegiatan</h1>

      {searchParams.error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {searchParams.error}
        </p>
      )}

      <form action={updateActivityPhotoWithId} className="mt-6 space-y-4">
        <div>
          <label htmlFor="categoryId" className={labelClass}>Kategori</label>
          <select id="categoryId" name="categoryId" required defaultValue={item.categoryId} className={inputClass}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="caption" className={labelClass}>
            Keterangan <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <input id="caption" name="caption" defaultValue={item.caption ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="order" className={labelClass}>
            Urutan <span className="font-normal text-slate-400">(angka lebih kecil tampil lebih dulu)</span>
          </label>
          <input id="order" name="order" type="number" defaultValue={item.order} className={inputClass} />
        </div>

        <div>
          <span className={labelClass}>Gambar Saat Ini</span>
          <div className="relative h-16 w-16 overflow-hidden rounded-md bg-slate-100">
            <Image src={item.imageUrl} alt={item.caption ?? "Foto kegiatan"} fill sizes="64px" className="object-cover" />
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
              "Rasio lanskap disarankan untuk tampilan carousel",
            ]}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan Perubahan</button>
          <Link href="/admin/activity-gallery" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

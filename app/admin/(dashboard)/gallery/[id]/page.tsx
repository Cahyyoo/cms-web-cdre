import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { prisma } from "@/lib/prisma";
import { updateGalleryItem } from "../actions";

export const metadata: Metadata = {
  title: "Edit Item Galeri",
};

export default async function EditGalleryItemPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await prisma.gallery.findUnique({
    where: { id: Number(params.id) },
  });
  if (!item) notFound();

  const updateGalleryItemWithId = updateGalleryItem.bind(null, item.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Edit Item Galeri</h1>

      <form action={updateGalleryItemWithId} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className={labelClass}>Judul</label>
          <input id="title" name="title" required defaultValue={item.title} className={inputClass} />
        </div>
        <div>
          <label htmlFor="type" className={labelClass}>Tipe</label>
          <select id="type" name="type" required defaultValue={item.type} className={inputClass}>
            <option value="SOUVENIR">Souvenir</option>
            <option value="PENGHARGAAN">Penghargaan</option>
          </select>
        </div>
        <div>
          <label htmlFor="period" className={labelClass}>
            Periode/Tahun <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <input id="period" name="period" defaultValue={item.period ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="imageUrl" className={labelClass}>URL Gambar</label>
          <input id="imageUrl" name="imageUrl" type="url" required defaultValue={item.imageUrl} className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan Perubahan</button>
          <Link href="/admin/gallery" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

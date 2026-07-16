import Link from "next/link";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { createGalleryItem } from "../actions";

export const metadata: Metadata = {
  title: "Tambah Item Galeri",
};

export default function NewGalleryItemPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Tambah Item Galeri</h1>

      <form action={createGalleryItem} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className={labelClass}>Judul</label>
          <input id="title" name="title" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="type" className={labelClass}>Tipe</label>
          <select id="type" name="type" required className={inputClass} defaultValue="SOUVENIR">
            <option value="SOUVENIR">Souvenir</option>
            <option value="PENGHARGAAN">Penghargaan</option>
          </select>
        </div>
        <div>
          <label htmlFor="period" className={labelClass}>
            Periode/Tahun <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <input id="period" name="period" placeholder="2024" className={inputClass} />
        </div>
        <div>
          <label htmlFor="imageUrl" className={labelClass}>URL Gambar</label>
          <input id="imageUrl" name="imageUrl" type="url" required placeholder="https://..." className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan</button>
          <Link href="/admin/gallery" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

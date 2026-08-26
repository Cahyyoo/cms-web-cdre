import Link from "next/link";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { createActivityCategory } from "../actions";

export const metadata: Metadata = {
  title: "Tambah Kategori Kegiatan",
};

export default function NewActivityCategoryPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Tambah Kategori Kegiatan</h1>

      {searchParams.error === "duplicate" && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          Kategori dengan nama tersebut sudah ada.
        </p>
      )}

      <form action={createActivityCategory} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nama Kategori</label>
          <input id="name" name="name" required placeholder="Kunjungan Lapangan, Pelatihan, Bakti Sosial..." className={inputClass} />
        </div>
        <div>
          <label htmlFor="order" className={labelClass}>
            Urutan <span className="font-normal text-slate-400">(angka lebih kecil tampil lebih dulu)</span>
          </label>
          <input id="order" name="order" type="number" defaultValue={0} className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan</button>
          <Link href="/admin/activity-categories" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

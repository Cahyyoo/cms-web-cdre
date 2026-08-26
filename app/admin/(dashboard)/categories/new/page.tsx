import Link from "next/link";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { createCategory } from "../actions";

export const metadata: Metadata = {
  title: "Tambah Kategori",
};

export default function NewCategoryPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Tambah Kategori</h1>

      {searchParams.error === "duplicate" && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          Kategori dengan nama dan tipe yang sama sudah ada.
        </p>
      )}

      <form action={createCategory} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nama Kategori</label>
          <input id="name" name="name" required placeholder="Pendidikan, Kesehatan, Lingkungan..." className={inputClass} />
        </div>
        <div>
          <label htmlFor="type" className={labelClass}>Tipe</label>
          <select id="type" name="type" required className={inputClass} defaultValue="PPM">
            <option value="PPM">PPM</option>
            <option value="CSR">CSR</option>
          </select>
        </div>
        <div>
          <label htmlFor="order" className={labelClass}>
            Urutan <span className="font-normal text-slate-400">(angka lebih kecil tampil lebih dulu)</span>
          </label>
          <input id="order" name="order" type="number" defaultValue={0} className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan</button>
          <Link href="/admin/categories" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { createBinaanGroup } from "../actions";

export const metadata: Metadata = {
  title: "Tambah Kelompok Binaan",
};

export default function NewBinaanGroupPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Tambah Kelompok Binaan</h1>

      <form action={createBinaanGroup} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nama Kelompok</label>
          <input id="name" name="name" required placeholder="Teras Pangan Alenggo" className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan</button>
          <Link href="/admin/binaan-groups" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

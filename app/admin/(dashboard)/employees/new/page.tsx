import Link from "next/link";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { createEmployee } from "../actions";

export const metadata: Metadata = {
  title: "Tambah Karyawan",
};

export default function NewEmployeePage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Tambah Karyawan</h1>

      <form action={createEmployee} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nama</label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="position" className={labelClass}>Jabatan</label>
          <input id="position" name="position" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="photoUrl" className={labelClass}>URL Foto</label>
          <input id="photoUrl" name="photoUrl" type="url" required placeholder="https://..." className={inputClass} />
        </div>
        <div>
          <label htmlFor="sequence" className={labelClass}>Urutan Hierarki</label>
          <input id="sequence" name="sequence" type="number" defaultValue={0} required className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan</button>
          <Link href="/admin/employees" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

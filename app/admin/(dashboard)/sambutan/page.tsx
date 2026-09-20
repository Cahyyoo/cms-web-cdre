import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass } from "@/components/admin/formStyles";
import { getSambutan } from "@/lib/sambutan";
import { updateSambutan } from "./actions";

export const metadata: Metadata = {
  title: "Sambutan",
};

export default async function SambutanAdminPage() {
  const sambutan = await getSambutan();

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Sambutan</h1>
      <p className="mt-1 text-sm text-slate-500">
        Teks kutipan dan deskripsi pada bagian &ldquo;Sambutan&rdquo; di halaman Beranda.
      </p>

      <form action={updateSambutan} className="mt-6 space-y-4">
        <div>
          <label htmlFor="quote" className={labelClass}>Kutipan</label>
          <textarea id="quote" name="quote" required rows={3} defaultValue={sambutan.quote} className={inputClass} />
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>Deskripsi</label>
          <textarea id="description" name="description" required rows={4} defaultValue={sambutan.description} className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan Perubahan</button>
        </div>
      </form>
    </div>
  );
}

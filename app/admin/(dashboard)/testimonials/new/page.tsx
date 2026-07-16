import Link from "next/link";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { createTestimonial } from "../actions";

export const metadata: Metadata = {
  title: "Tambah Testimoni",
};

export default function NewTestimonialPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Tambah Testimoni</h1>

      <form action={createTestimonial} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nama</label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="title" className={labelClass}>Jabatan</label>
          <input id="title" name="title" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="quote" className={labelClass}>Isi Testimonial</label>
          <textarea id="quote" name="quote" required rows={4} className={inputClass} />
        </div>
        <div>
          <label htmlFor="imageUrl" className={labelClass}>URL Foto Profil</label>
          <input id="imageUrl" name="imageUrl" type="url" required placeholder="https://..." className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan</button>
          <Link href="/admin/testimonials" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

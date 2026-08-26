import Link from "next/link";
import type { Metadata } from "next";
import PhotoRequirements from "@/components/admin/PhotoRequirements";
import { fileInputClass, inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { createTestimonial } from "../actions";

export const metadata: Metadata = {
  title: "Tambah Testimoni",
};

export default function NewTestimonialPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Tambah Testimoni</h1>

      {searchParams.error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {searchParams.error}
        </p>
      )}

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
          <label htmlFor="photo" className={labelClass}>Foto Profil</label>
          <input
            id="photo"
            name="photo"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={fileInputClass}
          />
          <PhotoRequirements
            items={[
              "Format: JPG, PNG, WEBP, atau GIF",
              "Ukuran file maksimal 5MB",
              "Rasio persegi (1:1) disarankan, minimal 300x300px",
            ]}
          />
        </div>
        <div className="flex items-center gap-2">
          <input id="isPublished" name="isPublished" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" />
          <label htmlFor="isPublished" className="text-sm text-slate-700">Tampilkan di halaman Beranda</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan</button>
          <Link href="/admin/testimonials" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

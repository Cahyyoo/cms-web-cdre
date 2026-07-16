import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { prisma } from "@/lib/prisma";
import { updateTestimonial } from "../actions";

export const metadata: Metadata = {
  title: "Edit Testimoni",
};

export default async function EditTestimonialPage({
  params,
}: {
  params: { id: string };
}) {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id: Number(params.id) },
  });
  if (!testimonial) notFound();

  const updateTestimonialWithId = updateTestimonial.bind(null, testimonial.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Edit Testimoni</h1>

      <form action={updateTestimonialWithId} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nama</label>
          <input id="name" name="name" required defaultValue={testimonial.name} className={inputClass} />
        </div>
        <div>
          <label htmlFor="title" className={labelClass}>Jabatan</label>
          <input id="title" name="title" required defaultValue={testimonial.title} className={inputClass} />
        </div>
        <div>
          <label htmlFor="quote" className={labelClass}>Isi Testimonial</label>
          <textarea id="quote" name="quote" required rows={4} defaultValue={testimonial.quote} className={inputClass} />
        </div>
        <div>
          <label htmlFor="imageUrl" className={labelClass}>URL Foto Profil</label>
          <input id="imageUrl" name="imageUrl" type="url" required defaultValue={testimonial.imageUrl} className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan Perubahan</button>
          <Link href="/admin/testimonials" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

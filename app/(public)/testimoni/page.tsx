import type { Metadata } from "next";
import SubmitButton from "@/components/ui/SubmitButton";
import FormAlert from "@/components/ui/FormAlert";
import { submitTestimonial } from "./actions";

export const metadata: Metadata = {
  title: "Bagikan Testimoni Anda",
  description:
    "Bagikan pengalaman Anda bersama PT Stargate Pasific Resource.",
};

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";

export default function TestimoniFormPage({
  searchParams,
}: {
  searchParams: { flash?: string };
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Bagikan Testimoni Anda
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Ceritakan pengalaman Anda bersama PT Stargate Pasific Resource.
        Testimoni akan ditinjau terlebih dahulu oleh tim kami sebelum tampil
        di halaman Beranda.
      </p>

      <FormAlert code={searchParams.flash} />

      <form action={submitTestimonial} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            Nama
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="title" className={labelClass}>
            Jabatan / Instansi
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="Kepala Desa, Ketua Kelompok UMKM, ..."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="quote" className={labelClass}>
            Testimoni Anda
          </label>
          <textarea
            id="quote"
            name="quote"
            required
            rows={5}
            placeholder="Ceritakan pengalaman Anda..."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="photo" className={labelClass}>
            Foto{" "}
            <span className="font-normal text-slate-400">
              (opsional, maks. 5MB — JPG/PNG/WEBP/GIF)
            </span>
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-brand-dark`}
          />
        </div>

        <SubmitButton
          pendingLabel="Mengirim..."
          className="w-full rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Kirim Testimoni
        </SubmitButton>
      </form>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sejarah",
  description: "Sejarah PT Stargate Pasific Resource.",
};

export default function SejarahPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Sejarah Perusahaan</h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Konten sejarah PT Stargate Pasific Resource akan ditampilkan di
        halaman ini.
      </p>
    </div>
  );
}

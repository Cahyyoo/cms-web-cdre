import type { Metadata } from "next";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Penghargaan",
  description: "Galeri penghargaan PT Stargate Pasific Resource.",
};

export default function PenghargaanPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Penghargaan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Penghargaan dan pengakuan yang telah diterima perusahaan.
        </p>
      </header>
      <GalleryGrid type="PENGHARGAAN" />
    </div>
  );
}

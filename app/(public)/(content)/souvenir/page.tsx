import type { Metadata } from "next";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Souvenir",
  description: "Galeri souvenir PT Stargate Pasific Resource.",
};

export default function SouvenirPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Souvenir</h1>
        <p className="mt-1 text-sm text-slate-500">
          Dokumentasi souvenir perusahaan dari tahun ke tahun.
        </p>
      </header>
      <GalleryGrid type="SOUVENIR" />
    </div>
  );
}

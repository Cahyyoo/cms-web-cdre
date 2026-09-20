import type { Metadata } from "next";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import PageBanner from "@/components/ui/PageBanner";
import { getHeroImageUrl } from "@/lib/hero-images";

export const metadata: Metadata = {
  title: "Penghargaan",
  description: "Galeri penghargaan PT Stargate Pasific Resource.",
};

export default async function PenghargaanPage() {
  const bannerUrl = await getHeroImageUrl("PENGHARGAAN_BANNER");

  return (
    <div>
      <div className="mb-6">
        <PageBanner
          src={bannerUrl}
          alt="Dokumentasi kegiatan CSR PT Stargate Pasific Resource"
          title="Penghargaan"
          subtitle="Penghargaan dan pengakuan yang telah diterima perusahaan."
        />
      </div>
      <GalleryGrid type="PENGHARGAAN" />
    </div>
  );
}

"use server";

import { HeroSlot } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolveImage, UploadError } from "@/lib/upload";

// Public path revalidated for each slot after its image changes.
const REVALIDATE_PATH: Record<HeroSlot, string> = {
  HOME_HERO: "/",
  HOME_SAMBUTAN: "/",
  PPM_BANNER: "/ppm",
  CSR_BANNER: "/csr",
  BINAAN_BANNER: "/binaan",
  PENGHARGAAN_BANNER: "/penghargaan",
  GALERI_KEGIATAN_BANNER: "/galeri-kegiatan",
};

export async function updateHeroImage(slot: HeroSlot, formData: FormData) {
  try {
    const current = await prisma.heroImage.findUnique({ where: { slot } });
    const imageUrl = await resolveImage(formData, "hero", current?.imageUrl);
    await prisma.heroImage.upsert({
      where: { slot },
      create: { slot, imageUrl },
      update: { imageUrl },
    });
  } catch (error) {
    if (error instanceof UploadError) {
      redirect(`/admin/hero-images/${slot}?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }
  revalidatePath("/admin/hero-images");
  revalidatePath(REVALIDATE_PATH[slot]);
  redirect("/admin/hero-images");
}

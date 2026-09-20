"use server";

import { HeroSlot } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { runAction } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import { resolveImage } from "@/lib/upload";

const ADMIN_PATH = "/admin/hero-images";

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
  return runAction(
    {
      onSuccess: ADMIN_PATH,
      onError: `${ADMIN_PATH}/${slot}`,
      success: "updated",
    },
    async () => {
      const current = await prisma.heroImage.findUnique({ where: { slot } });
      const imageUrl = await resolveImage(formData, "hero", current?.imageUrl);

      await prisma.heroImage.upsert({
        where: { slot },
        create: { slot, imageUrl },
        update: { imageUrl },
      });

      revalidatePath(ADMIN_PATH);
      revalidatePath(REVALIDATE_PATH[slot]);
    }
  );
}

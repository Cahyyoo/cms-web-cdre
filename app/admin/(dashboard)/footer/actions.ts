"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { runAction } from "@/lib/action-helpers";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";

const ADMIN_PATH = "/admin/footer";

export async function updateFooterSettings(formData: FormData) {
  return runAction(
    { onSuccess: ADMIN_PATH, onError: ADMIN_PATH, success: "updated" },
    async () => {
      const data = {
        description: String(formData.get("description") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        facebookUrl: String(formData.get("facebookUrl") ?? "").trim() || "#",
        instagramUrl: String(formData.get("instagramUrl") ?? "").trim() || "#",
        youtubeUrl: String(formData.get("youtubeUrl") ?? "").trim() || "#",
      };

      await prisma.footerSettings.upsert({
        where: { id: 1 },
        create: { id: 1, ...data },
        update: data,
      });

      revalidateTag(CACHE_TAGS.footer);
      revalidatePath(ADMIN_PATH);
      // The footer renders in the public layout, so every public route needs it.
      revalidatePath("/", "layout");
    }
  );
}

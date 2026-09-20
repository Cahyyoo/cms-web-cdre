"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function updateFooterSettings(formData: FormData) {
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

  revalidatePath("/admin/footer");
  revalidatePath("/", "layout");
  redirect("/admin/footer");
}

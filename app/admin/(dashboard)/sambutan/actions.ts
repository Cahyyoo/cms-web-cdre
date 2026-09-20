"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function updateSambutan(formData: FormData) {
  const quote = String(formData.get("quote") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  await prisma.sambutan.upsert({
    where: { id: 1 },
    create: { id: 1, quote, description },
    update: { quote, description },
  });

  revalidatePath("/admin/sambutan");
  revalidatePath("/");
  redirect("/admin/sambutan");
}

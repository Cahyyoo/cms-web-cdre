"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";

const ADMIN_PATH = "/admin/sambutan";

export async function updateSambutan(formData: FormData) {
  return runAction(
    { onSuccess: ADMIN_PATH, onError: ADMIN_PATH, success: "updated" },
    async () => {
      const quote = String(formData.get("quote") ?? "").trim();
      const description = String(formData.get("description") ?? "").trim();

      await prisma.sambutan.upsert({
        where: { id: 1 },
        create: { id: 1, quote, description },
        update: { quote, description },
      });

      revalidatePath(ADMIN_PATH);
      revalidatePath("/");
    }
  );
}

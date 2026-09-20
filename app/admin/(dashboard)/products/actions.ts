"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import { resolveImage } from "@/lib/upload";

const ADMIN_PATH = "/admin/products";

function readFields(formData: FormData) {
  const flavor = String(formData.get("flavor") ?? "").trim();
  return {
    name: String(formData.get("name") ?? ""),
    groupId: Number(formData.get("groupId") ?? 0),
    flavor: flavor ? flavor : null,
    description: String(formData.get("description") ?? ""),
    waNumber: String(formData.get("waNumber") ?? ""),
  };
}

function revalidate() {
  revalidatePath(ADMIN_PATH);
  revalidatePath("/binaan");
}

export async function createProduct(formData: FormData) {
  return runAction(
    { onSuccess: ADMIN_PATH, onError: `${ADMIN_PATH}/new`, success: "created" },
    async () => {
      const imageUrl = await resolveImage(formData, "products");
      await prisma.product.create({
        data: { ...readFields(formData), imageUrl },
      });
      revalidate();
    }
  );
}

export async function updateProduct(id: number, formData: FormData) {
  return runAction(
    { onSuccess: ADMIN_PATH, onError: `${ADMIN_PATH}/${id}`, success: "updated" },
    async () => {
      const current = await prisma.product.findUniqueOrThrow({ where: { id } });
      const imageUrl = await resolveImage(formData, "products", current.imageUrl);
      await prisma.product.update({
        where: { id },
        data: { ...readFields(formData), imageUrl },
      });
      revalidate();
    }
  );
}

export async function deleteProduct(id: number) {
  return runAction(
    { onSuccess: ADMIN_PATH, onError: ADMIN_PATH, success: "deleted" },
    async () => {
      await prisma.product.delete({ where: { id } });
      revalidate();
    }
  );
}

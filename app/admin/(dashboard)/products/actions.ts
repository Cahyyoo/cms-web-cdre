"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolveImage, UploadError } from "@/lib/upload";

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

export async function createProduct(formData: FormData) {
  try {
    const imageUrl = await resolveImage(formData, "products");
    await prisma.product.create({ data: { ...readFields(formData), imageUrl } });
  } catch (error) {
    if (error instanceof UploadError) {
      redirect(`/admin/products/new?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }
  revalidatePath("/admin/products");
  revalidatePath("/binaan");
  redirect("/admin/products");
}

export async function updateProduct(id: number, formData: FormData) {
  try {
    const current = await prisma.product.findUniqueOrThrow({ where: { id } });
    const imageUrl = await resolveImage(formData, "products", current.imageUrl);
    await prisma.product.update({ where: { id }, data: { ...readFields(formData), imageUrl } });
  } catch (error) {
    if (error instanceof UploadError) {
      redirect(`/admin/products/${id}?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }
  revalidatePath("/admin/products");
  revalidatePath("/binaan");
  redirect("/admin/products");
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/binaan");
}

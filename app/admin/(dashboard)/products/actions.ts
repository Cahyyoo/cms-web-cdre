"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function readFields(formData: FormData) {
  const flavor = String(formData.get("flavor") ?? "").trim();
  return {
    name: String(formData.get("name") ?? ""),
    groupId: Number(formData.get("groupId") ?? 0),
    flavor: flavor ? flavor : null,
    description: String(formData.get("description") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    waNumber: String(formData.get("waNumber") ?? ""),
  };
}

export async function createProduct(formData: FormData) {
  await prisma.product.create({ data: readFields(formData) });
  revalidatePath("/admin/products");
  revalidatePath("/binaan");
  redirect("/admin/products");
}

export async function updateProduct(id: number, formData: FormData) {
  await prisma.product.update({ where: { id }, data: readFields(formData) });
  revalidatePath("/admin/products");
  revalidatePath("/binaan");
  redirect("/admin/products");
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/binaan");
}

"use server";

import { Prisma, type CategoryType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    type: String(formData.get("type") ?? "PPM") as CategoryType,
  };
}

export async function createCategory(formData: FormData) {
  await prisma.category.create({ data: readFields(formData) });
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: number, formData: FormData) {
  await prisma.category.update({ where: { id }, data: readFields(formData) });
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      redirect("/admin/categories?error=in-use");
    }
    throw error;
  }
  revalidatePath("/admin/categories");
}

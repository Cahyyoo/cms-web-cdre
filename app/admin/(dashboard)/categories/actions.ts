"use server";

import { Prisma, type CategoryType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    type: String(formData.get("type") ?? "PPM") as CategoryType,
    order: Number(formData.get("order") ?? 0) || 0,
  };
}

export async function createCategory(formData: FormData) {
  try {
    await prisma.category.create({ data: readFields(formData) });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect("/admin/categories/new?error=duplicate");
    }
    throw error;
  }
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: number, formData: FormData) {
  try {
    await prisma.category.update({ where: { id }, data: readFields(formData) });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect(`/admin/categories/${id}?error=duplicate`);
    }
    throw error;
  }
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

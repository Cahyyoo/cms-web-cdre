"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    order: Number(formData.get("order") ?? 0) || 0,
  };
}

export async function createActivityCategory(formData: FormData) {
  try {
    await prisma.activityCategory.create({ data: readFields(formData) });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect("/admin/activity-categories/new?error=duplicate");
    }
    throw error;
  }
  revalidatePath("/admin/activity-categories");
  revalidatePath("/galeri-kegiatan");
  redirect("/admin/activity-categories");
}

export async function updateActivityCategory(id: number, formData: FormData) {
  try {
    await prisma.activityCategory.update({ where: { id }, data: readFields(formData) });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect(`/admin/activity-categories/${id}?error=duplicate`);
    }
    throw error;
  }
  revalidatePath("/admin/activity-categories");
  revalidatePath("/galeri-kegiatan");
  redirect("/admin/activity-categories");
}

export async function deleteActivityCategory(id: number) {
  try {
    await prisma.activityCategory.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      redirect("/admin/activity-categories?error=in-use");
    }
    throw error;
  }
  revalidatePath("/admin/activity-categories");
  revalidatePath("/galeri-kegiatan");
}

"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createBinaanGroup(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  await prisma.binaanGroup.create({ data: { name } });
  revalidatePath("/admin/binaan-groups");
  revalidatePath("/binaan");
  redirect("/admin/binaan-groups");
}

export async function updateBinaanGroup(id: number, formData: FormData) {
  const name = String(formData.get("name") ?? "");
  await prisma.binaanGroup.update({ where: { id }, data: { name } });
  revalidatePath("/admin/binaan-groups");
  revalidatePath("/binaan");
  redirect("/admin/binaan-groups");
}

export async function deleteBinaanGroup(id: number) {
  try {
    await prisma.binaanGroup.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      redirect("/admin/binaan-groups?error=in-use");
    }
    throw error;
  }
  revalidatePath("/admin/binaan-groups");
  revalidatePath("/binaan");
}

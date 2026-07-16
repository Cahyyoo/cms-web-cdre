"use server";

import type { GalleryType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function readFields(formData: FormData) {
  const period = String(formData.get("period") ?? "").trim();
  return {
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? "SOUVENIR") as GalleryType,
    period: period ? period : null,
    imageUrl: String(formData.get("imageUrl") ?? ""),
  };
}

export async function createGalleryItem(formData: FormData) {
  await prisma.gallery.create({ data: readFields(formData) });
  revalidatePath("/admin/gallery");
  revalidatePath("/souvenir");
  revalidatePath("/penghargaan");
  redirect("/admin/gallery");
}

export async function updateGalleryItem(id: number, formData: FormData) {
  await prisma.gallery.update({ where: { id }, data: readFields(formData) });
  revalidatePath("/admin/gallery");
  revalidatePath("/souvenir");
  revalidatePath("/penghargaan");
  redirect("/admin/gallery");
}

export async function deleteGalleryItem(id: number) {
  await prisma.gallery.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/souvenir");
  revalidatePath("/penghargaan");
}

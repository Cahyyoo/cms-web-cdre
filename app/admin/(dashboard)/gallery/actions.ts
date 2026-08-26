"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolveImage, UploadError } from "@/lib/upload";

function readFields(formData: FormData) {
  const period = String(formData.get("period") ?? "").trim();
  return {
    title: String(formData.get("title") ?? ""),
    type: "PENGHARGAAN" as const,
    period: period ? period : null,
  };
}

export async function createGalleryItem(formData: FormData) {
  try {
    const imageUrl = await resolveImage(formData, "gallery");
    await prisma.gallery.create({ data: { ...readFields(formData), imageUrl } });
  } catch (error) {
    if (error instanceof UploadError) {
      redirect(`/admin/gallery/new?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }
  revalidatePath("/admin/gallery");
  revalidatePath("/penghargaan");
  redirect("/admin/gallery");
}

export async function updateGalleryItem(id: number, formData: FormData) {
  try {
    const current = await prisma.gallery.findUniqueOrThrow({ where: { id } });
    const imageUrl = await resolveImage(formData, "gallery", current.imageUrl);
    await prisma.gallery.update({ where: { id }, data: { ...readFields(formData), imageUrl } });
  } catch (error) {
    if (error instanceof UploadError) {
      redirect(`/admin/gallery/${id}?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }
  revalidatePath("/admin/gallery");
  revalidatePath("/penghargaan");
  redirect("/admin/gallery");
}

export async function deleteGalleryItem(id: number) {
  await prisma.gallery.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/penghargaan");
}

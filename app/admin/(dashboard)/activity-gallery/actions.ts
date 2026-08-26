"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolveImage, UploadError } from "@/lib/upload";

function readFields(formData: FormData) {
  const caption = String(formData.get("caption") ?? "").trim();
  return {
    caption: caption ? caption : null,
    categoryId: Number(formData.get("categoryId") ?? 0),
    order: Number(formData.get("order") ?? 0) || 0,
  };
}

export async function createActivityPhoto(formData: FormData) {
  try {
    const imageUrl = await resolveImage(formData, "activity-gallery");
    await prisma.activityPhoto.create({ data: { ...readFields(formData), imageUrl } });
  } catch (error) {
    if (error instanceof UploadError) {
      redirect(`/admin/activity-gallery/new?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }
  revalidatePath("/admin/activity-gallery");
  revalidatePath("/galeri-kegiatan");
  redirect("/admin/activity-gallery");
}

export async function updateActivityPhoto(id: number, formData: FormData) {
  try {
    const current = await prisma.activityPhoto.findUniqueOrThrow({ where: { id } });
    const imageUrl = await resolveImage(formData, "activity-gallery", current.imageUrl);
    await prisma.activityPhoto.update({ where: { id }, data: { ...readFields(formData), imageUrl } });
  } catch (error) {
    if (error instanceof UploadError) {
      redirect(`/admin/activity-gallery/${id}?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }
  revalidatePath("/admin/activity-gallery");
  revalidatePath("/galeri-kegiatan");
  redirect("/admin/activity-gallery");
}

export async function deleteActivityPhoto(id: number) {
  await prisma.activityPhoto.delete({ where: { id } });
  revalidatePath("/admin/activity-gallery");
  revalidatePath("/galeri-kegiatan");
}

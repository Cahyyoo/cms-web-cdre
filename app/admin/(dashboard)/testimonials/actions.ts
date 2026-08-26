"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolveImage, UploadError } from "@/lib/upload";

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    title: String(formData.get("title") ?? ""),
    quote: String(formData.get("quote") ?? ""),
    isPublished: formData.get("isPublished") === "on",
  };
}

export async function createTestimonial(formData: FormData) {
  try {
    const imageUrl = await resolveImage(formData, "testimonials");
    await prisma.testimonial.create({
      data: { ...readFields(formData), imageUrl },
    });
  } catch (error) {
    if (error instanceof UploadError) {
      redirect(`/admin/testimonials/new?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: number, formData: FormData) {
  try {
    const current = await prisma.testimonial.findUniqueOrThrow({ where: { id } });
    const imageUrl = await resolveImage(formData, "testimonials", current.imageUrl);
    await prisma.testimonial.update({
      where: { id },
      data: { ...readFields(formData), imageUrl },
    });
  } catch (error) {
    if (error instanceof UploadError) {
      redirect(`/admin/testimonials/${id}?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: number) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function toggleTestimonialPublished(
  id: number,
  nextValue: boolean
) {
  await prisma.testimonial.update({
    where: { id },
    data: { isPublished: nextValue },
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOptionalFile, saveUploadedImage, UploadError } from "@/lib/upload";

export async function submitTestimonial(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();

  if (!name || !title || !quote) {
    redirect("/testimoni?error=1");
  }

  let imageUrl = "/avatar-placeholder.svg";
  const photo = getOptionalFile(formData, "photo");
  if (photo) {
    try {
      imageUrl = await saveUploadedImage(photo, "testimonials");
    } catch (error) {
      if (error instanceof UploadError) {
        redirect(`/testimoni?error=${encodeURIComponent(error.message)}`);
      }
      throw error;
    }
  }

  // Public submissions always start hidden — an admin must approve them
  // from /admin/testimonials before they appear on the homepage.
  await prisma.testimonial.create({
    data: { name, title, quote, imageUrl, isPublished: false },
  });

  revalidatePath("/admin/testimonials");
  redirect("/testimoni?submitted=1");
}

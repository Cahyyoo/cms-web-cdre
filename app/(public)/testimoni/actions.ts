"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { withFlash } from "@/lib/flash";
import { prisma } from "@/lib/prisma";
import { getOptionalFile, saveUploadedImage, UploadError } from "@/lib/upload";
import { readString } from "@/lib/forms";

export async function submitTestimonial(formData: FormData) {
  const name = readString(formData, "name");
  const title = readString(formData, "title");
  const quote = readString(formData, "quote");

  if (!name || !title || !quote) {
    redirect(withFlash("/testimoni", "testimoni-wajib"));
  }

  let imageUrl = "/avatar-placeholder.svg";
  const photo = getOptionalFile(formData, "photo");
  if (photo) {
    try {
      imageUrl = await saveUploadedImage(photo, "testimonials");
    } catch (error) {
      if (error instanceof UploadError) {
        redirect(withFlash("/testimoni", error.code));
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
  redirect(withFlash("/testimoni", "testimoni-terkirim"));
}

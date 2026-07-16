"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    title: String(formData.get("title") ?? ""),
    quote: String(formData.get("quote") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
  };
}

export async function createTestimonial(formData: FormData) {
  await prisma.testimonial.create({ data: readFields(formData) });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: number, formData: FormData) {
  await prisma.testimonial.update({
    where: { id },
    data: readFields(formData),
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: number) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

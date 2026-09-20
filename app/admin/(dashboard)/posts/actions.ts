"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolveImage, UploadError } from "@/lib/upload";
import { slugify } from "@/lib/utils";

function readFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    content: String(formData.get("content") ?? ""),
    categoryId: Number(formData.get("categoryId") ?? 0),
    publishedAt: new Date(String(formData.get("publishedAt") ?? "")),
  };
}

function isDuplicateSlugError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function createPost(formData: FormData) {
  const fields = readFields(formData);
  const slug = fields.slug.trim() ? slugify(fields.slug) : slugify(fields.title);

  try {
    const thumbnailUrl = await resolveImage(formData, "posts");
    await prisma.post.create({ data: { ...fields, slug, thumbnailUrl } });
  } catch (error) {
    if (error instanceof UploadError) {
      redirect(`/admin/posts/new?error=${encodeURIComponent(error.message)}`);
    }
    if (isDuplicateSlugError(error)) {
      redirect(`/admin/posts/new?error=duplicate-slug`);
    }
    throw error;
  }
  revalidatePath("/admin/posts");
  revalidatePath("/ppm");
  revalidatePath("/csr");
  redirect("/admin/posts");
}

export async function updatePost(id: number, formData: FormData) {
  const fields = readFields(formData);
  const slug = fields.slug.trim() ? slugify(fields.slug) : slugify(fields.title);

  try {
    const current = await prisma.post.findUniqueOrThrow({ where: { id } });
    const thumbnailUrl = await resolveImage(formData, "posts", current.thumbnailUrl);
    await prisma.post.update({ where: { id }, data: { ...fields, slug, thumbnailUrl } });
  } catch (error) {
    if (error instanceof UploadError) {
      redirect(`/admin/posts/${id}?error=${encodeURIComponent(error.message)}`);
    }
    if (isDuplicateSlugError(error)) {
      redirect(`/admin/posts/${id}?error=duplicate-slug`);
    }
    throw error;
  }
  revalidatePath("/admin/posts");
  revalidatePath("/ppm");
  revalidatePath("/csr");
  revalidatePath(`/artikel/${slug}`);
  redirect("/admin/posts");
}

export async function deletePost(id: number) {
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
  revalidatePath("/ppm");
  revalidatePath("/csr");
}

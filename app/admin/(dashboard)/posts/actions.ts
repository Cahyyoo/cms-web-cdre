"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

function readFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    content: String(formData.get("content") ?? ""),
    thumbnailUrl: String(formData.get("thumbnailUrl") ?? ""),
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
    await prisma.post.create({ data: { ...fields, slug } });
  } catch (error) {
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
    await prisma.post.update({ where: { id }, data: { ...fields, slug } });
  } catch (error) {
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

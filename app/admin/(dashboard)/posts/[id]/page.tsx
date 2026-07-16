import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { prisma } from "@/lib/prisma";
import { toDateInputValue } from "@/lib/utils";
import { updatePost } from "../actions";

export const metadata: Metadata = {
  title: "Edit Artikel",
};

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id: Number(params.id) } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!post) notFound();

  const updatePostWithId = updatePost.bind(null, post.id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-slate-900">Edit Artikel</h1>

      {searchParams.error === "duplicate-slug" && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          Slug sudah dipakai artikel lain. Gunakan slug yang berbeda.
        </p>
      )}

      <form action={updatePostWithId} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className={labelClass}>Judul</label>
          <input id="title" name="title" required defaultValue={post.title} className={inputClass} />
        </div>
        <div>
          <label htmlFor="slug" className={labelClass}>Slug</label>
          <input id="slug" name="slug" defaultValue={post.slug} className={inputClass} />
        </div>
        <div>
          <label htmlFor="categoryId" className={labelClass}>Kategori</label>
          <select id="categoryId" name="categoryId" required defaultValue={post.categoryId} className={inputClass}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.type} &middot; {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="thumbnailUrl" className={labelClass}>URL Thumbnail</label>
          <input id="thumbnailUrl" name="thumbnailUrl" type="url" required defaultValue={post.thumbnailUrl} className={inputClass} />
        </div>
        <div>
          <label htmlFor="publishedAt" className={labelClass}>Tanggal Publikasi</label>
          <input
            id="publishedAt"
            name="publishedAt"
            type="date"
            required
            defaultValue={toDateInputValue(post.publishedAt)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="content" className={labelClass}>
            Konten <span className="font-normal text-slate-400">(HTML)</span>
          </label>
          <textarea id="content" name="content" required rows={10} defaultValue={post.content} className={`${inputClass} font-mono text-xs`} />
        </div>
        <p className="text-xs text-slate-400">
          Total dilihat: {post.viewCount.toLocaleString("id-ID")} kali (bertambah otomatis, tidak bisa diedit manual).
        </p>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan Perubahan</button>
          <Link href="/admin/posts" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

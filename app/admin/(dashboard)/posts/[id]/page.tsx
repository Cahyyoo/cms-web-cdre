import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PhotoRequirements from "@/components/admin/PhotoRequirements";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { fileInputClass, inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
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
      {searchParams.error && searchParams.error !== "duplicate-slug" && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {searchParams.error}
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
          <span className={labelClass}>Thumbnail Saat Ini</span>
          <div className="relative h-24 w-36 overflow-hidden rounded-md bg-slate-100">
            <Image src={post.thumbnailUrl} alt={post.title} fill sizes="144px" className="object-cover" />
          </div>
        </div>
        <div>
          <label htmlFor="photo" className={labelClass}>
            Ganti Gambar <span className="font-normal text-slate-400">(kosongkan jika tidak diganti)</span>
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={fileInputClass}
          />
          <PhotoRequirements
            items={[
              "Format: JPG, PNG, WEBP, atau GIF",
              "Ukuran file maksimal 5MB",
              "Rekomendasi: gambar lanskap minimal 1200×800px — dipakai sebagai thumbnail kartu dan gambar utama di halaman artikel",
            ]}
          />
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
          <label className={labelClass}>Konten</label>
          <RichTextEditor name="content" defaultValue={post.content} />
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

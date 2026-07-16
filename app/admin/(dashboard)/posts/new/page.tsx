import Link from "next/link";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { prisma } from "@/lib/prisma";
import { createPost } from "../actions";

export const metadata: Metadata = {
  title: "Tambah Artikel",
};

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const categories = await getCategories();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-slate-900">Tambah Artikel</h1>

      {searchParams.error === "duplicate-slug" && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          Slug sudah dipakai artikel lain. Gunakan judul/slug yang berbeda.
        </p>
      )}

      {categories.length === 0 ? (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Belum ada kategori.{" "}
          <Link href="/admin/categories/new" className="font-semibold underline">
            Buat kategori
          </Link>{" "}
          terlebih dahulu.
        </p>
      ) : (
        <form action={createPost} className="mt-6 space-y-4">
          <div>
            <label htmlFor="title" className={labelClass}>Judul</label>
            <input id="title" name="title" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="slug" className={labelClass}>
              Slug <span className="font-normal text-slate-400">(opsional, otomatis dari judul jika kosong)</span>
            </label>
            <input id="slug" name="slug" placeholder="bantuan-beasiswa-pelajar" className={inputClass} />
          </div>
          <div>
            <label htmlFor="categoryId" className={labelClass}>Kategori</label>
            <select id="categoryId" name="categoryId" required className={inputClass} defaultValue="">
              <option value="" disabled>Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.type} &middot; {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="thumbnailUrl" className={labelClass}>URL Thumbnail</label>
            <input id="thumbnailUrl" name="thumbnailUrl" type="url" required placeholder="https://..." className={inputClass} />
          </div>
          <div>
            <label htmlFor="publishedAt" className={labelClass}>Tanggal Publikasi</label>
            <input id="publishedAt" name="publishedAt" type="date" required defaultValue={today} className={inputClass} />
          </div>
          <div>
            <label htmlFor="content" className={labelClass}>
              Konten <span className="font-normal text-slate-400">(HTML)</span>
            </label>
            <textarea id="content" name="content" required rows={10} className={`${inputClass} font-mono text-xs`} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className={primaryButtonClass}>Simpan</button>
            <Link href="/admin/posts" className={secondaryButtonClass}>Batal</Link>
          </div>
        </form>
      )}
    </div>
  );
}

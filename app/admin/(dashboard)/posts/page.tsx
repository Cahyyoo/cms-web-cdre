import { Plus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";
import { formatDate, formatViews } from "@/lib/utils";
import { deletePost } from "./actions";
import FormAlert from "@/components/ui/FormAlert";

export const metadata: Metadata = {
  title: "Artikel PPM & CSR",
};

async function getPosts() {
  return prisma.post.findMany({
    // The table only shows these columns; `include: { category: true }` would
    // also drag every post's full HTML `content` across the wire.
    select: {
      id: true,
      title: true,
      publishedAt: true,
      viewCount: true,
      category: { select: { name: true, type: true } },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { flash?: string };
}) {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Artikel PPM & CSR</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ditampilkan di /ppm dan /csr sesuai tipe kategorinya.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus size={16} /> Tambah
        </Link>
      </div>

      <FormAlert code={searchParams.flash} />

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((item) => (
              <tr key={item.id}>
                <td className="max-w-sm truncate px-4 py-3 font-medium text-slate-800">
                  {item.title}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                    {item.category.type} &middot; {item.category.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(item.publishedAt)}</td>
                <td className="px-4 py-3 text-slate-500">{formatViews(item.viewCount)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/posts/${item.id}`}
                      className="rounded-md px-2 py-1 text-xs font-medium text-brand hover:bg-brand/10"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deletePost.bind(null, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Belum ada artikel. Buat kategori terlebih dahulu sebelum menambah artikel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

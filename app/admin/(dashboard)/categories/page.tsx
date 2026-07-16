import { Plus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";
import { deleteCategory } from "./actions";

export const metadata: Metadata = {
  title: "Kategori",
};

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Kategori PPM & CSR</h1>
          <p className="mt-1 text-sm text-slate-500">
            Digunakan untuk mengelompokkan artikel di /ppm dan /csr.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus size={16} /> Tambah
        </Link>
      </div>

      {searchParams.error === "in-use" && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          Kategori tidak bisa dihapus karena masih dipakai oleh artikel. Pindahkan atau hapus artikel terkait terlebih dahulu.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3">Jumlah Artikel</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{item._count.posts}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/categories/${item.id}`}
                      className="rounded-md px-2 py-1 text-xs font-medium text-brand hover:bg-brand/10"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteCategory.bind(null, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  Belum ada kategori.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

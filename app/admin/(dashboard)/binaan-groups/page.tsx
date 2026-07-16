import { Plus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";
import { deleteBinaanGroup } from "./actions";

export const metadata: Metadata = {
  title: "Kelompok Binaan",
};

async function getGroups() {
  return prisma.binaanGroup.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export default async function BinaanGroupsPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const groups = await getGroups();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Kelompok Binaan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelompok UMKM binaan, mis. &ldquo;Teras Pangan Alenggo&rdquo;.
          </p>
        </div>
        <Link
          href="/admin/binaan-groups/new"
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus size={16} /> Tambah
        </Link>
      </div>

      {searchParams.error === "in-use" && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          Kelompok tidak bisa dihapus karena masih memiliki produk. Hapus atau pindahkan produk terkait terlebih dahulu.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Nama Kelompok</th>
              <th className="px-4 py-3">Jumlah Produk</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {groups.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                <td className="px-4 py-3 text-slate-500">{item._count.products}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/binaan-groups/${item.id}`}
                      className="rounded-md px-2 py-1 text-xs font-medium text-brand hover:bg-brand/10"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteBinaanGroup.bind(null, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {groups.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                  Belum ada kelompok binaan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

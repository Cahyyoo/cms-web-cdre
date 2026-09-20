import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";
import { deleteGalleryItem } from "./actions";
import FormAlert from "@/components/admin/FormAlert";

export const metadata: Metadata = {
  title: "Galeri Penghargaan",
};

async function getGalleryItems() {
  return prisma.gallery.findMany({ orderBy: { id: "desc" } });
}

export default async function GalleryAdminPage({
  searchParams,
}: {
  searchParams: { flash?: string };
}) {
  const items = await getGalleryItems();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Galeri Penghargaan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ditampilkan di /penghargaan.
          </p>
        </div>
        <Link
          href="/admin/gallery/new"
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
              <th className="px-4 py-3">Gambar</th>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Periode</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md bg-slate-100">
                    <Image src={item.imageUrl} alt={item.title} fill sizes="40px" className="object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{item.title}</td>
                <td className="px-4 py-3 text-slate-500">{item.period ?? "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/gallery/${item.id}`}
                      className="rounded-md px-2 py-1 text-xs font-medium text-brand hover:bg-brand/10"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteGalleryItem.bind(null, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  Belum ada item galeri.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

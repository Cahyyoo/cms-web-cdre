import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";
import { deleteActivityPhoto } from "./actions";
import FormAlert from "@/components/ui/FormAlert";

export const metadata: Metadata = {
  title: "Foto Galeri Kegiatan",
};

async function getActivityPhotos() {
  return prisma.activityPhoto.findMany({
    include: { category: true },
    orderBy: [{ categoryId: "asc" }, { order: "asc" }],
  });
}

export default async function ActivityGalleryAdminPage({
  searchParams,
}: {
  searchParams: { flash?: string };
}) {
  const items = await getActivityPhotos();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Foto Galeri Kegiatan</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ditampilkan sebagai carousel per kategori di /galeri-kegiatan.
          </p>
        </div>
        <Link
          href="/admin/activity-gallery/new"
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
              <th className="px-4 py-3">Keterangan</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Urutan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md bg-slate-100">
                    <Image src={item.imageUrl} alt={item.caption ?? item.category.name} fill sizes="40px" className="object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{item.caption ?? "-"}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                    {item.category.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{item.order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/activity-gallery/${item.id}`}
                      className="rounded-md px-2 py-1 text-xs font-medium text-brand hover:bg-brand/10"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteActivityPhoto.bind(null, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Belum ada foto kegiatan. Tambahkan kategori terlebih dahulu di menu Kategori Kegiatan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

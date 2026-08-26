import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { prisma } from "@/lib/prisma";
import { updateActivityCategory } from "../actions";

export const metadata: Metadata = {
  title: "Edit Kategori Kegiatan",
};

export default async function EditActivityCategoryPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const category = await prisma.activityCategory.findUnique({
    where: { id: Number(params.id) },
  });
  if (!category) notFound();

  const updateActivityCategoryWithId = updateActivityCategory.bind(null, category.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Edit Kategori Kegiatan</h1>

      {searchParams.error === "duplicate" && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          Kategori dengan nama tersebut sudah ada.
        </p>
      )}

      <form action={updateActivityCategoryWithId} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nama Kategori</label>
          <input id="name" name="name" required defaultValue={category.name} className={inputClass} />
        </div>
        <div>
          <label htmlFor="order" className={labelClass}>
            Urutan <span className="font-normal text-slate-400">(angka lebih kecil tampil lebih dulu)</span>
          </label>
          <input id="order" name="order" type="number" defaultValue={category.order} className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan Perubahan</button>
          <Link href="/admin/activity-categories" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { prisma } from "@/lib/prisma";
import { updateCategory } from "../actions";

export const metadata: Metadata = {
  title: "Edit Kategori",
};

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await prisma.category.findUnique({
    where: { id: Number(params.id) },
  });
  if (!category) notFound();

  const updateCategoryWithId = updateCategory.bind(null, category.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Edit Kategori</h1>

      <form action={updateCategoryWithId} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nama Kategori</label>
          <input id="name" name="name" required defaultValue={category.name} className={inputClass} />
        </div>
        <div>
          <label htmlFor="type" className={labelClass}>Tipe</label>
          <select id="type" name="type" required defaultValue={category.type} className={inputClass}>
            <option value="PPM">PPM</option>
            <option value="CSR">CSR</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan Perubahan</button>
          <Link href="/admin/categories" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

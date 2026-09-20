import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { inputClass, labelClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { prisma } from "@/lib/prisma";
import { updateActivityCategory } from "../actions";
import FormAlert from "@/components/admin/FormAlert";
import SubmitButton from "@/components/admin/SubmitButton";

export const metadata: Metadata = {
  title: "Edit Kategori Kegiatan",
};

export default async function EditActivityCategoryPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { flash?: string };
}) {
  const category = await prisma.activityCategory.findUnique({
    where: { id: Number(params.id) },
  });
  if (!category) notFound();

  const updateActivityCategoryWithId = updateActivityCategory.bind(null, category.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Edit Kategori Kegiatan</h1>

      <FormAlert code={searchParams.flash} />

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
          <SubmitButton>Simpan Perubahan</SubmitButton>
          <Link href="/admin/activity-categories" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

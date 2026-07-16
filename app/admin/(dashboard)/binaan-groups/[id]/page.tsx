import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { prisma } from "@/lib/prisma";
import { updateBinaanGroup } from "../actions";

export const metadata: Metadata = {
  title: "Edit Kelompok Binaan",
};

export default async function EditBinaanGroupPage({
  params,
}: {
  params: { id: string };
}) {
  const group = await prisma.binaanGroup.findUnique({
    where: { id: Number(params.id) },
  });
  if (!group) notFound();

  const updateBinaanGroupWithId = updateBinaanGroup.bind(null, group.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Edit Kelompok Binaan</h1>

      <form action={updateBinaanGroupWithId} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nama Kelompok</label>
          <input id="name" name="name" required defaultValue={group.name} className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan Perubahan</button>
          <Link href="/admin/binaan-groups" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

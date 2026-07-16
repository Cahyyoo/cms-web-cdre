import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "../actions";

export const metadata: Metadata = {
  title: "Edit Produk",
};

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, groups] = await Promise.all([
    prisma.product.findUnique({ where: { id: Number(params.id) } }),
    prisma.binaanGroup.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Edit Produk</h1>

      <form action={updateProductWithId} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nama Produk</label>
          <input id="name" name="name" required defaultValue={product.name} className={inputClass} />
        </div>
        <div>
          <label htmlFor="groupId" className={labelClass}>Kelompok Binaan</label>
          <select id="groupId" name="groupId" required defaultValue={product.groupId} className={inputClass}>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="flavor" className={labelClass}>
            Varian <span className="font-normal text-slate-400">(opsional)</span>
          </label>
          <input id="flavor" name="flavor" defaultValue={product.flavor ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>Deskripsi</label>
          <textarea id="description" name="description" required rows={4} defaultValue={product.description} className={inputClass} />
        </div>
        <div>
          <label htmlFor="imageUrl" className={labelClass}>URL Foto Produk</label>
          <input id="imageUrl" name="imageUrl" type="url" required defaultValue={product.imageUrl} className={inputClass} />
        </div>
        <div>
          <label htmlFor="waNumber" className={labelClass}>Nomor WhatsApp</label>
          <input id="waNumber" name="waNumber" required defaultValue={product.waNumber} className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan Perubahan</button>
          <Link href="/admin/products" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";
import { deleteTestimonial, toggleTestimonialPublished } from "./actions";

export const metadata: Metadata = {
  title: "Testimoni",
};

async function getTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  const pendingCount = testimonials.filter((t) => !t.isPublished).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Testimoni</h1>
          <p className="mt-1 text-sm text-slate-500">
            Testimonial yang tampil di slider halaman Beranda.
            {pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                {pendingCount} menunggu moderasi
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus size={16} /> Tambah
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Jabatan</th>
              <th className="px-4 py-3">Quote</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {testimonials.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-slate-500">{item.title}</td>
                <td className="max-w-xs truncate px-4 py-3 text-slate-500">
                  {item.quote}
                </td>
                <td className="px-4 py-3">
                  <form
                    action={toggleTestimonialPublished.bind(
                      null,
                      item.id,
                      !item.isPublished
                    )}
                  >
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                        item.isPublished
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                      title={
                        item.isPublished
                          ? "Klik untuk menyembunyikan dari Beranda"
                          : "Klik untuk menayangkan di Beranda"
                      }
                    >
                      {item.isPublished ? "Tayang" : "Menunggu"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/testimonials/${item.id}`}
                      className="rounded-md px-2 py-1 text-xs font-medium text-brand hover:bg-brand/10"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteTestimonial.bind(null, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Belum ada testimoni.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function getCounts() {
  const [testimonials, employees, posts, products, galleries] =
    await Promise.all([
      prisma.testimonial.count(),
      prisma.employee.count(),
      prisma.post.count(),
      prisma.product.count(),
      prisma.gallery.count(),
    ]);
  return { testimonials, employees, posts, products, galleries };
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  const cards = [
    { label: "Testimoni", value: counts.testimonials, href: "/admin/testimonials" },
    { label: "Karyawan (Struktural)", value: counts.employees, href: "/admin/employees" },
    { label: "Artikel PPM/CSR", value: counts.posts, href: "/admin/posts" },
    { label: "Produk Binaan", value: counts.products, href: "/admin/products" },
    { label: "Item Galeri", value: counts.galleries, href: "/admin/gallery" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ringkasan konten yang tersimpan di database.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

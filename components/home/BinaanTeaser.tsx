import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getLatestProducts() {
  return prisma.product.findMany({
    include: { group: true },
    orderBy: { id: "desc" },
    take: 4,
  });
}

export default async function BinaanTeaser() {
  const products = await getLatestProducts();
  if (products.length === 0) return null;

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
              Pemberdayaan UMKM
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
              Produk Binaan Kami
            </h2>
          </div>
          <Link
            href="/binaan"
            className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Lihat Katalog <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href="/binaan"
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-square w-full bg-slate-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-light">
                  {product.group.name}
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
                  {product.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

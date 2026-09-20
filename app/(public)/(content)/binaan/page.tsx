import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import { getHeroImageUrl } from "@/lib/hero-images";
import { prisma } from "@/lib/prisma";
import { buildWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Binaan UMKM",
  description:
    "Katalog produk UMKM binaan PT Stargate Pasific Resource.",
};

/** Guards against an unbounded catalog: this page has no pagination. */
const MAX_PRODUCTS = 60;

async function getBinaanGroups() {
  return prisma.binaanGroup.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

async function getProducts(groupId?: number) {
  return prisma.product.findMany({
    where: groupId ? { groupId } : undefined,
    // `include: { group: true }` re-fetched the same group rows that
    // getBinaanGroups() already loads below; the name is mapped from there.
    select: {
      id: true,
      name: true,
      groupId: true,
      flavor: true,
      description: true,
      imageUrl: true,
      waNumber: true,
    },
    orderBy: { name: "asc" },
    take: MAX_PRODUCTS,
  });
}

export default async function BinaanPage({
  searchParams,
}: {
  searchParams: { group?: string };
}) {
  const groupId = searchParams.group ? Number(searchParams.group) : undefined;
  const [groups, products, bannerUrl] = await Promise.all([
    getBinaanGroups(),
    getProducts(groupId),
    getHeroImageUrl("BINAAN_BANNER"),
  ]);

  const groupNameById = new Map(groups.map((group) => [group.id, group.name]));

  return (
    <div>
      <div className="mb-6">
        <PageBanner
          src={bannerUrl}
          alt="Penyaluran bantuan parcel Lebaran kepada masyarakat sekitar"
          title="Binaan UMKM"
          subtitle="Produk-produk dari kelompok UMKM binaan PT Stargate Pasific Resource."
        />
      </div>

      {/* Group filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/binaan"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !groupId
              ? "bg-brand text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Semua Kelompok
        </Link>
        {groups.map((group) => (
          <Link
            key={group.id}
            href={`/binaan?group=${group.id}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              groupId === group.id
                ? "bg-brand text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {group.name}
          </Link>
        ))}
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <p className="text-sm text-slate-400">Belum ada produk untuk ditampilkan.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square w-full bg-slate-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-light">
                  {groupNameById.get(product.groupId)}
                </p>
                <h2 className="mt-1 text-base font-semibold text-slate-900">
                  {product.name}
                </h2>
                {product.flavor && (
                  <p className="text-xs text-slate-500">Varian: {product.flavor}</p>
                )}
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">
                  {product.description}
                </p>
                <a
                  href={buildWhatsAppLink(
                    product.waNumber,
                    `Halo, saya tertarik dengan produk ${product.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  <MessageCircle size={16} />
                  Pesan Via WA
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

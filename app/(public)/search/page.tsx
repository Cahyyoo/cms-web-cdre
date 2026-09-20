import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hasil Pencarian",
};

async function searchPosts(query: string) {
  if (!query) return [];
  return prisma.post.findMany({
    where: { title: { contains: query } },
    // Only what the result list renders — without this Prisma also pulls
    // each post's full HTML `content`.
    select: { id: true, slug: true, title: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim() ?? "";
  const results = query ? await searchPosts(query) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-xl font-bold text-slate-900">
        Hasil pencarian untuk &ldquo;{query}&rdquo;
      </h1>

      {results.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">Tidak ada hasil ditemukan.</p>
      ) : (
        <ul className="mt-6 divide-y divide-slate-100">
          {results.map((post) => (
            <li key={post.id} className="py-3">
              <Link
                href={`/artikel/${post.slug}`}
                className="font-medium text-slate-800 hover:text-brand"
              >
                {post.title}
              </Link>
              <p className="text-xs text-slate-400">{formatDate(post.publishedAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

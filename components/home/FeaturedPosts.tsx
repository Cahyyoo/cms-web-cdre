import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import { prisma } from "@/lib/prisma";

async function getLatestPosts() {
  return prisma.post.findMany({
    // PostCard needs six fields; `include` also fetched the @db.Text body.
    select: {
      id: true,
      slug: true,
      title: true,
      thumbnailUrl: true,
      publishedAt: true,
      viewCount: true,
      category: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
}

export default async function FeaturedPosts() {
  const posts = await getLatestPosts();
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Publikasi
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
            Kabar Terbaru CSR &amp; PPM
          </h2>
        </div>
        <div className="flex gap-2">
          <Link
            href="/csr"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-brand hover:text-brand"
          >
            Lihat CSR
          </Link>
          <Link
            href="/ppm"
            className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Lihat PPM <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            slug={post.slug}
            title={post.title}
            thumbnailUrl={post.thumbnailUrl}
            publishedAt={post.publishedAt}
            viewCount={post.viewCount}
            categoryName={post.category.name}
          />
        ))}
      </div>
    </section>
  );
}

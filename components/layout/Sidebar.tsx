import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatViews } from "@/lib/utils";

async function getPopularPosts() {
  return prisma.post.findMany({
    orderBy: { viewCount: "desc" },
    take: 5,
    select: {
      id: true,
      slug: true,
      title: true,
      thumbnailUrl: true,
      publishedAt: true,
      viewCount: true,
    },
  });
}

function PopularPosts({
  posts,
}: {
  posts: Awaited<ReturnType<typeof getPopularPosts>>;
}) {
  if (posts.length === 0) {
    return <p className="text-sm text-slate-400">Belum ada artikel.</p>;
  }

  return (
    <ol className="space-y-4">
      {posts.map((post, index) => (
        <li key={post.id}>
          <Link href={`/artikel/${post.slug}`} className="group flex gap-3">
            <span className="mt-1 w-4 shrink-0 text-sm font-bold text-brand-light">
              {index + 1}
            </span>
            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                sizes="80px"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-medium text-slate-800 group-hover:text-brand">
                {post.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <span>{formatDate(post.publishedAt)}</span>
                <span className="flex items-center gap-0.5">
                  <Eye size={12} /> {formatViews(post.viewCount)}
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function VisitorStats() {
  // Placeholder counter. Wire this up to a real analytics/pageview
  // source (e.g. a PageView table or an external analytics provider)
  // once one is available.
  const totalVisitors = 128_430;

  return (
    <div className="rounded-lg bg-brand px-5 py-4 text-white">
      <p className="text-xs uppercase tracking-wide text-white/70">
        Statistik Pengunjung
      </p>
      <p className="mt-1 text-2xl font-bold">
        {new Intl.NumberFormat("id-ID").format(totalVisitors)}
      </p>
      <p className="text-xs text-white/70">Total kunjungan situs</p>
    </div>
  );
}

function AdBanner() {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-slate-100">
      <Image
        src="https://picsum.photos/seed/stargate-banner/600/800"
        alt="Banner informasi PT Stargate Pasific Resource"
        fill
        sizes="320px"
        className="object-cover"
      />
    </div>
  );
}

export default async function Sidebar() {
  const posts = await getPopularPosts();

  return (
    <aside className="space-y-8">
      <section>
        <h3 className="mb-4 border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wide text-slate-800">
          Artikel Populer
        </h3>
        <PopularPosts posts={posts} />
      </section>

      <section>
        <VisitorStats />
      </section>

      <section>
        <AdBanner />
      </section>
    </aside>
  );
}

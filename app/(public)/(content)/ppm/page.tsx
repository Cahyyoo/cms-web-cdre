import type { Metadata } from "next";
import PostCard from "@/components/blog/PostCard";
import Pagination from "@/components/blog/Pagination";
import { getPostsByType } from "@/lib/posts";

export const metadata: Metadata = {
  title: "PPM (Pengembangan & Pemberdayaan Masyarakat)",
  description: "Publikasi program PPM PT Stargate Pasific Resource.",
};

export default async function PpmPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  const page = Number(searchParams.page ?? 1) || 1;
  const categoryId = searchParams.category
    ? Number(searchParams.category)
    : undefined;

  const { posts, totalPages } = await getPostsByType("PPM", page, categoryId);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          PPM &mdash; Pengembangan &amp; Pemberdayaan Masyarakat
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Berita dan publikasi program pengembangan masyarakat.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-sm text-slate-400">Belum ada artikel untuk ditampilkan.</p>
      ) : (
        <div>
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
      )}

      <Pagination
        basePath="/ppm"
        page={page}
        totalPages={totalPages}
        extraQuery={{ category: searchParams.category }}
      />
    </div>
  );
}

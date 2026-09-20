import { ArrowLeft, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDate, formatViews } from "@/lib/utils";

// `generateMetadata` and the page both need the article; React's `cache`
// collapses them into a single query per request.
const getPost = cache(async (slug: string) =>
  prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  })
);

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  return { title: post?.title ?? "Artikel" };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  // Atomic increment — safe under concurrent requests. Runs after the read so
  // the count shown is the one this visitor arrived with.
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  const backHref = post.category.type === "PPM" ? "/ppm" : "/csr";

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand"
      >
        <ArrowLeft size={14} /> Kembali ke {post.category.type}
      </Link>

      <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        {post.category.name}
      </span>
      <h1 className="mt-3 font-serif text-2xl font-semibold leading-tight text-slate-900 sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <span>{formatDate(post.publishedAt)}</span>
        <span className="flex items-center gap-1">
          <Eye size={12} /> {formatViews(post.viewCount)} views
        </span>
      </div>

      <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={post.thumbnailUrl}
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 800px, 100vw"
          className="object-cover"
        />
      </div>

      {/* content is stored as HTML in the CMS */}
      <div
        className="prose prose-slate mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

import { Eye } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDate, formatViews } from "@/lib/utils";

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!post) return null;

  // Atomic increment — safe under concurrent requests.
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  return post;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: { title: true },
  });
  return { title: post?.title ?? "Artikel" };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article>
      <span className="inline-block rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
        {post.category.name}
      </span>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
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
        className="prose prose-slate mt-6 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate, formatViews } from "@/lib/utils";

type PostCardProps = {
  slug: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: Date;
  viewCount: number;
  categoryName: string;
};

export default function PostCard({
  slug,
  title,
  thumbnailUrl,
  publishedAt,
  viewCount,
  categoryName,
}: PostCardProps) {
  return (
    <Link
      href={`/artikel/${slug}`}
      className="group flex gap-4 border-b border-slate-100 py-4 first:pt-0"
    >
      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-28 sm:w-40">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          sizes="160px"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="min-w-0">
        <span className="inline-block rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
          {categoryName}
        </span>
        <h2 className="mt-1.5 line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-brand sm:text-lg">
          {title}
        </h2>
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
          <span>{formatDate(publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Eye size={12} /> {formatViews(viewCount)} views
          </span>
        </div>
      </div>
    </Link>
  );
}

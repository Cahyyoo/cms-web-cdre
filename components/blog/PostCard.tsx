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
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand shadow-sm">
          {categoryName}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 group-hover:text-brand">
          {title}
        </h2>
        <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-slate-400">
          <span>{formatDate(publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Eye size={12} /> {formatViews(viewCount)}
          </span>
        </div>
      </div>
    </Link>
  );
}

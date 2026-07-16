import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  basePath: string;
  page: number;
  totalPages: number;
  extraQuery?: Record<string, string | undefined>;
};

function buildHref(
  basePath: string,
  page: number,
  extraQuery?: Record<string, string | undefined>
) {
  const params = new URLSearchParams();
  if (extraQuery) {
    for (const [key, value] of Object.entries(extraQuery)) {
      if (value) params.set(key, value);
    }
  }
  params.set("page", String(page));
  return `${basePath}?${params.toString()}`;
}

export default function Pagination({
  basePath,
  page,
  totalPages,
  extraQuery,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <a
        href={buildHref(basePath, Math.max(1, page - 1), extraQuery)}
        aria-disabled={page <= 1}
        className={`flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 ${
          page <= 1 ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <ChevronLeft size={16} />
      </a>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <a
          key={p}
          href={buildHref(basePath, p, extraQuery)}
          className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium ${
            p === page
              ? "bg-brand text-white"
              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {p}
        </a>
      ))}

      <a
        href={buildHref(basePath, Math.min(totalPages, page + 1), extraQuery)}
        aria-disabled={page >= totalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 ${
          page >= totalPages ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <ChevronRight size={16} />
      </a>
    </nav>
  );
}

// Built once — constructing an Intl formatter is comparatively expensive and
// these run per row on list pages.
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(date: Date | string): string {
  return dateFormatter.format(new Date(date));
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}jt`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}rb`;
  return `${views}`;
}

/** Builds a wa.me deep link from a phone number (accepts 08xx or 628xx formats). */
export function buildWhatsAppLink(waNumber: string, message?: string): string {
  const normalized = waNumber.replace(/[^0-9]/g, "").replace(/^0/, "62");
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${normalized}${query}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Formats a Date for the value of an <input type="date">.
 * Uses local date parts, not `toISOString()` — the latter converts to UTC
 * first, which shifts the date back a day for any timestamp before 07:00 WIB
 * and would show the wrong day in the edit form.
 */
export function toDateInputValue(date: Date | string): string {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

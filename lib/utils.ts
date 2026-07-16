export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
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

/** Formats a Date for the value of an <input type="date">. */
export function toDateInputValue(date: Date | string): string {
  return new Date(date).toISOString().slice(0, 10);
}

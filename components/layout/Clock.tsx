"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Render nothing on the server / first client paint to avoid a
  // hydration mismatch between server time and client time.
  if (!now) return <span className="text-xs text-slate-500">&nbsp;</span>;

  const formatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);

  return <span className="text-xs text-slate-500">{formatted}</span>;
}

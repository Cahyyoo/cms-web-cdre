import type { Metadata } from "next";
import "./globals.css";

// Nearly every route (public pages via Navbar/Sidebar, admin pages via
// their data tables) queries the database on render. Force dynamic
// rendering app-wide so `next build` doesn't attempt to prerender pages
// against a database that may not be reachable at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "PT Stargate Pasific Resource",
    template: "%s | PT Stargate Pasific Resource",
  },
  description:
    "Portal resmi PT Stargate Pasific Resource — program CSR, PPM, struktur organisasi, dan pemberdayaan UMKM binaan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

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
    "Publikasi resmi program CSR & PPM, serta pemberdayaan UMKM binaan PT Stargate Pasific Resource.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-white font-sans text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}

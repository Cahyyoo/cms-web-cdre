import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getFooterSettings } from "@/lib/footer-settings";

const NAV_COLUMNS = [
  {
    title: "Publikasi",
    links: [
      { label: "CSR", href: "/csr" },
      { label: "PPM", href: "/ppm" },
      { label: "Bagikan Testimoni", href: "/testimoni" },
    ],
  },
  {
    title: "Lainnya",
    links: [
      { label: "Binaan UMKM", href: "/binaan" },
      { label: "Penghargaan", href: "/penghargaan" },
      { label: "Galeri Kegiatan", href: "/galeri-kegiatan" },
    ],
  },
];

export default async function Footer() {
  const footer = await getFooterSettings();

  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-light/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Image
              src="/logo.png"
              alt="PT Stargate Pasific Resource"
              width={505}
              height={494}
              // Without `sizes` the browser picked a 1080px-wide variant of a
              // logo rendered ~49px tall, on every public page.
              sizes="49px"
              className="h-12 w-auto object-contain brightness-0 invert"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {footer.description}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={footer.facebookUrl}
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-brand hover:text-white"
              >
                <Facebook size={16} />
              </a>
              <a
                href={footer.instagramUrl}
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-brand hover:text-white"
              >
                <Instagram size={16} />
              </a>
              <a
                href={footer.youtubeUrl}
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-brand hover:text-white"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {NAV_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Kontak
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-light" />
                <span>{footer.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-brand-light" />
                <span>{footer.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-brand-light" />
                <span>{footer.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} PT Stargate Pasific Resource. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

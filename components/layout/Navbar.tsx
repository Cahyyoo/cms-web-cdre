import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MobileMenu, { type NavGroup } from "./MobileMenu";
import SearchBar from "./SearchBar";
import { prisma } from "@/lib/prisma";

async function getNavData() {
  const [csrCategories, ppmCategories, binaanGroups, activityCategories] = await Promise.all([
    prisma.category.findMany({
      where: { type: "CSR" },
      select: { id: true, name: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
    prisma.category.findMany({
      where: { type: "PPM" },
      select: { id: true, name: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
    prisma.binaanGroup.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.activityCategory.findMany({
      select: { id: true, name: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
  ]);
  return { csrCategories, ppmCategories, binaanGroups, activityCategories };
}

export default async function Navbar() {
  const { csrCategories, ppmCategories, binaanGroups, activityCategories } = await getNavData();

  const navGroups: NavGroup[] = [
    { label: "Beranda", href: "/" },
    {
      label: "CSR & PPM",
      items: [
        { label: "Semua Publikasi CSR", href: "/csr" },
        ...csrCategories.map((c) => ({ label: c.name, href: `/csr?category=${c.id}` })),
        { label: "Semua Program PPM", href: "/ppm" },
        ...ppmCategories.map((c) => ({ label: c.name, href: `/ppm?category=${c.id}` })),
      ],
    },
    {
      label: "Binaan UMKM",
      items: [
        { label: "Semua Kelompok", href: "/binaan" },
        ...binaanGroups.map((g) => ({ label: g.name, href: `/binaan?group=${g.id}` })),
      ],
    },
    { label: "Penghargaan", href: "/penghargaan" },
    {
      label: "Galeri Kegiatan",
      items: [
        { label: "Semua Kegiatan", href: "/galeri-kegiatan" },
        ...activityCategories.map((c) => ({
          label: c.name,
          href: `/galeri-kegiatan?category=${c.id}`,
        })),
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="PT Stargate Pasific Resource"
            width={505}
            height={494}
            // Deliberately not `priority`: a ~44px-tall logo preloading on
            // every page competes for bandwidth with the real LCP banner.
            sizes="44px"
            className="h-10 w-auto object-contain sm:h-11"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:block">
          <ul className="flex items-center">
            {navGroups.map((group) =>
              group.href ? (
                <li key={group.label}>
                  <Link
                    href={group.href}
                    className="px-4 py-2 text-sm font-medium tracking-wide text-slate-600 transition-colors hover:text-brand"
                  >
                    {group.label}
                  </Link>
                </li>
              ) : (
                <li key={group.label} className="group relative">
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-wide text-slate-600 transition-colors hover:text-brand">
                    {group.label} <ChevronDown size={14} />
                  </button>
                  <div className="invisible absolute left-0 top-full w-60 rounded-xl bg-white py-2 opacity-0 shadow-2xl ring-1 ring-slate-100 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    {group.items?.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </li>
              )
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <SearchBar />
          <MobileMenu groups={navGroups} />
        </div>
      </div>
    </header>
  );
}

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Clock from "./Clock";
import SearchBar from "./SearchBar";
import { prisma } from "@/lib/prisma";

const NAV_LINK_CLASS =
  "px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:text-brand";

async function getPpmCategories() {
  return prisma.category.findMany({
    where: { type: "PPM" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

async function getBinaanGroups() {
  return prisma.binaanGroup.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export default async function Navbar() {
  const [ppmCategories, binaanGroups] = await Promise.all([
    getPpmCategories(),
    getBinaanGroups(),
  ]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* Top bar: logo, clock, search */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="PT Stargate Pasific Resource"
            width={505}
            height={494}
            priority
            className="h-14 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Clock />
          <SearchBar />
        </div>
      </div>

      {/* Horizontal navigation */}
      <nav className="border-t border-slate-100">
        <ul className="mx-auto flex max-w-7xl flex-wrap items-center px-4 sm:px-6 lg:px-8">
          <li>
            <Link href="/" className={NAV_LINK_CLASS}>
              Beranda
            </Link>
          </li>
          <li>
            <Link href="/sejarah" className={NAV_LINK_CLASS}>
              Sejarah
            </Link>
          </li>
          <li>
            <Link href="/struktural" className={NAV_LINK_CLASS}>
              Struktural
            </Link>
          </li>

          {/* PPM dropdown */}
          <li className="group relative">
            <button className={`flex items-center gap-1 ${NAV_LINK_CLASS}`}>
              PPM <ChevronDown size={14} />
            </button>
            <div className="invisible absolute left-0 top-full w-48 rounded-md border border-slate-200 bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              <Link
                href="/ppm"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand"
              >
                Semua Program PPM
              </Link>
              {ppmCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/ppm?category=${category.id}`}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </li>

          <li>
            <Link href="/csr" className={NAV_LINK_CLASS}>
              CSR
            </Link>
          </li>

          {/* Binaan dropdown */}
          <li className="group relative">
            <button className={`flex items-center gap-1 ${NAV_LINK_CLASS}`}>
              Binaan <ChevronDown size={14} />
            </button>
            <div className="invisible absolute left-0 top-full w-56 rounded-md border border-slate-200 bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              <Link
                href="/binaan"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand"
              >
                Semua Kelompok Binaan
              </Link>
              {binaanGroups.map((group) => (
                <Link
                  key={group.id}
                  href={`/binaan?group=${group.id}`}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand"
                >
                  {group.name}
                </Link>
              ))}
            </div>
          </li>

          <li>
            <Link href="/souvenir" className={NAV_LINK_CLASS}>
              Souvenir
            </Link>
          </li>
          <li>
            <Link href="/penghargaan" className={NAV_LINK_CLASS}>
              Penghargaan
            </Link>
          </li>
          <li>
            <Link href="/stakeholder" className={NAV_LINK_CLASS}>
              Stakeholder
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

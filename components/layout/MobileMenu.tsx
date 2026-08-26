"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type NavGroup = {
  label: string;
  href?: string;
  items?: { label: string; href: string }[];
};

export default function MobileMenu({ groups }: { groups: NavGroup[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup menu" : "Buka menu"}
        className="flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-100 bg-white shadow-lg">
          <ul className="divide-y divide-slate-100 px-4">
            {groups.map((group) => (
              <li key={group.label}>
                {group.href ? (
                  <Link
                    href={group.href}
                    onClick={() => setOpen(false)}
                    className="block py-3.5 text-sm font-medium text-slate-700"
                  >
                    {group.label}
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() =>
                        setExpanded((cur) => (cur === group.label ? null : group.label))
                      }
                      className="flex w-full items-center justify-between py-3.5 text-sm font-medium text-slate-700"
                    >
                      {group.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${expanded === group.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {expanded === group.label && group.items && (
                      <ul className="pb-2 pl-4">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className="block py-2 text-sm text-slate-500 hover:text-brand"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

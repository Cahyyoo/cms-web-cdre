import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Struktural",
  description: "Struktur organisasi tim External Relation PT Stargate Pasific Resource.",
};

async function getEmployees() {
  return prisma.employee.findMany({
    orderBy: { sequence: "asc" },
  });
}

export default async function StrukturalPage() {
  const employees = await getEmployees();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Struktur Organisasi
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Tim External Relation PT Stargate Pasific Resource.
        </p>
      </header>

      {employees.length === 0 ? (
        <p className="text-center text-sm text-slate-400">
          Belum ada data struktur organisasi.
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {employees.map((employee) => (
            <div key={employee.id} className="w-40 text-center">
              <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-brand/10 bg-slate-100">
                <Image
                  src={employee.photoUrl}
                  alt={employee.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {employee.name}
              </p>
              <p className="text-xs text-slate-500">{employee.position}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

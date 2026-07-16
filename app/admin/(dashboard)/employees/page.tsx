import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";
import { deleteEmployee } from "./actions";

export const metadata: Metadata = {
  title: "Struktur Organisasi",
};

async function getEmployees() {
  return prisma.employee.findMany({ orderBy: { sequence: "asc" } });
}

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Struktur Organisasi</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ditampilkan pada halaman /struktural, diurutkan berdasarkan urutan hierarki.
          </p>
        </div>
        <Link
          href="/admin/employees/new"
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus size={16} /> Tambah
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Urutan</th>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Jabatan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-slate-500">{item.sequence}</td>
                <td className="px-4 py-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                    <Image src={item.photoUrl} alt={item.name} fill sizes="40px" className="object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                <td className="px-4 py-3 text-slate-500">{item.position}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/employees/${item.id}`}
                      className="rounded-md px-2 py-1 text-xs font-medium text-brand hover:bg-brand/10"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteEmployee.bind(null, item.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Belum ada data karyawan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/formStyles";
import { prisma } from "@/lib/prisma";
import { updateEmployee } from "../actions";

export const metadata: Metadata = {
  title: "Edit Karyawan",
};

export default async function EditEmployeePage({
  params,
}: {
  params: { id: string };
}) {
  const employee = await prisma.employee.findUnique({
    where: { id: Number(params.id) },
  });
  if (!employee) notFound();

  const updateEmployeeWithId = updateEmployee.bind(null, employee.id);

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Edit Karyawan</h1>

      <form action={updateEmployeeWithId} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nama</label>
          <input id="name" name="name" required defaultValue={employee.name} className={inputClass} />
        </div>
        <div>
          <label htmlFor="position" className={labelClass}>Jabatan</label>
          <input id="position" name="position" required defaultValue={employee.position} className={inputClass} />
        </div>
        <div>
          <label htmlFor="photoUrl" className={labelClass}>URL Foto</label>
          <input id="photoUrl" name="photoUrl" type="url" required defaultValue={employee.photoUrl} className={inputClass} />
        </div>
        <div>
          <label htmlFor="sequence" className={labelClass}>Urutan Hierarki</label>
          <input id="sequence" name="sequence" type="number" required defaultValue={employee.sequence} className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className={primaryButtonClass}>Simpan Perubahan</button>
          <Link href="/admin/employees" className={secondaryButtonClass}>Batal</Link>
        </div>
      </form>
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function readFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    position: String(formData.get("position") ?? ""),
    photoUrl: String(formData.get("photoUrl") ?? ""),
    sequence: Number(formData.get("sequence") ?? 0),
  };
}

export async function createEmployee(formData: FormData) {
  await prisma.employee.create({ data: readFields(formData) });
  revalidatePath("/admin/employees");
  revalidatePath("/struktural");
  redirect("/admin/employees");
}

export async function updateEmployee(id: number, formData: FormData) {
  await prisma.employee.update({ where: { id }, data: readFields(formData) });
  revalidatePath("/admin/employees");
  revalidatePath("/struktural");
  redirect("/admin/employees");
}

export async function deleteEmployee(id: number) {
  await prisma.employee.delete({ where: { id } });
  revalidatePath("/admin/employees");
  revalidatePath("/struktural");
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stakeholder",
  description: "Informasi stakeholder PT Stargate Pasific Resource.",
};

export default function StakeholderPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Stakeholder</h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Informasi mengenai pemangku kepentingan PT Stargate Pasific
        Resource akan ditampilkan di halaman ini.
      </p>
    </div>
  );
}

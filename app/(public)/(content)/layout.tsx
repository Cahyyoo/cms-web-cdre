import Sidebar from "@/components/layout/Sidebar";

// Applies the two-column grid (main content 75% / sidebar 25%) described
// in the PRD to every article/catalog-style route nested under this
// group: (content)/ppm, (content)/csr, (content)/binaan,
// (content)/souvenir, (content)/penghargaan.
export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:px-8">
      <div className="lg:col-span-8">{children}</div>
      <div className="lg:col-span-4">
        <Sidebar />
      </div>
    </div>
  );
}

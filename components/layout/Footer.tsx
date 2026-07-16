export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-bold text-white">PT Stargate Pasific Resource</p>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Berkomitmen pada pengembangan program CSR, PPM, dan pemberdayaan
          UMKM binaan di wilayah operasional perusahaan.
        </p>
        <p className="mt-6 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} PT Stargate Pasific Resource. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}

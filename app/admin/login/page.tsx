import type { Metadata } from "next";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-bold text-slate-900">Admin CMS</h1>
        <p className="mt-1 text-sm text-slate-500">
          PT Stargate Pasific Resource
        </p>

        {searchParams.error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            Username atau password salah.
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <input
            type="hidden"
            name="next"
            value={searchParams.next ?? "/admin"}
          />
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoFocus
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

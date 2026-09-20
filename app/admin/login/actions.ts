"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionToken,
  isSecureCookie,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";

/**
 * `next` reaches us from a query string, so an attacker can craft
 * /admin/login?next=https://evil.com and bounce the admin off-site right
 * after a successful login. Only same-origin paths are allowed through
 * ("//host" is rejected too — browsers read it as protocol-relative).
 */
function safeNextPath(next: string): string {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
}

export async function login(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? "/admin"));

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  const isValid =
    !!validUsername &&
    !!validPassword &&
    username === validUsername &&
    password === validPassword;

  if (!isValid) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const token = await createSessionToken();
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect(next);
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
  redirect("/admin/login");
}

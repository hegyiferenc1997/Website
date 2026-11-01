import "server-only";
import { headers } from "next/headers";
import { connection } from "next/server";
import { getAccountDb } from "@/db";
import { createAuth, type Auth } from "./config";

const globalForAuth = globalThis as unknown as { auth?: Promise<Auth> };

/** A bejelentkezés példánya; az első kéréskor jön létre (a build nem igényel titkos kulcsot). */
export function getAuth(): Promise<Auth> {
  globalForAuth.auth ??= getAccountDb().then(createAuth);
  return globalForAuth.auth;
}

export type SessionUser = { id: string; name: string; email: string; image: string | null };

/** Az aktuális kérés bejelentkezett felhasználója, vagy null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  // Mindig a kérés idején fut (a munkamenet lejáratához az aktuális időt nézi), sosem előre elkészítve.
  await connection();
  const [auth, requestHeaders] = await Promise.all([getAuth(), headers()]);
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) return null;
  const { id, name, email, image } = session.user;
  return { id, name, email, image: image ?? null };
}

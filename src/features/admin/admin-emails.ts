// Ki admin: az ADMIN_EMAILS környezeti változóban felsorolt e-mail címek (vesszővel elválasztva).
// Csak a szerveren olvassuk, így a böngészőbe sosem kerül, és a kódban sincs beégetve senki címe.

/** Az admin e-mail címek kisbetűsítve (üres változónál üres lista = nincs admin). */
export function adminEmails(env: string | undefined = process.env.ADMIN_EMAILS): string[] {
  return (env ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Admin-e ez az e-mail cím (kis- és nagybetű nem számít). */
export function isAdminEmail(email: string | null | undefined, env?: string): boolean {
  if (!email) return false;
  return adminEmails(env).includes(email.trim().toLowerCase());
}

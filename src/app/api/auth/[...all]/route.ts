import { getAuth } from "@/features/auth/server";

// Minden bejelentkezési végpont (/api/auth/...) a Better Auth-hoz fut be.
async function handler(request: Request) {
  const auth = await getAuth();
  return auth.handler(request);
}

export { handler as GET, handler as POST };

import { NextResponse } from "next/server";
import { getAccountDb } from "@/db";
import { userProgress } from "@/db/schema";
import { getSessionUser } from "@/features/auth/server";
import { MAX_PROGRESS_BYTES, sanitizeProgress } from "@/features/progress/data";

// A bejelentkezett felhasználó haladása: GET lekéri, PUT elmenti (felülírja).

// A választ se a böngésző, se egy köztes szerver ne tárolja el (személyes adat).
const noStore = { "Cache-Control": "private, no-store" };

/** Haladás lekérése: 401, ha nincs bejelentkezve; null, ha még nincs mentve semmi. */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });
  const db = await getAccountDb();
  const row = await db.query.userProgress.findFirst({
    where: (p, { eq }) => eq(p.userId, user.id),
  });
  return NextResponse.json(
    { progress: row ? sanitizeProgress(row.data) : null },
    { headers: noStore },
  );
}

/** Haladás mentése: ellenőrzések (honnan jön, milyen típusú, mekkora, érvényes JSON-e), majd mentés. */
export async function PUT(request: Request) {
  // CSRF védelem: csak a saját oldalunkról érkező JSON kérést fogadjuk el.
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({ error: "unsupported" }, { status: 415 });
  }
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const raw = await request.text();
  if (raw.length > MAX_PROGRESS_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  // Csak az érvényes részek kerülnek az adatbázisba.
  const data = sanitizeProgress((body as { progress?: unknown })?.progress);

  const db = await getAccountDb();
  // Új sor beszúrása, vagy ha már van a felhasználónak, felülírása.
  await db
    .insert(userProgress)
    .values({ userId: user.id, data })
    .onConflictDoUpdate({ target: userProgress.userId, set: { data, updatedAt: new Date() } });
  return new NextResponse(null, { status: 204 });
}

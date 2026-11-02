import { NextResponse } from "next/server";
import { getAccountDb } from "@/db";
import { addActiveTime } from "@/features/account/activity";
import { getSessionUser } from "@/features/auth/server";

// Az oldalon töltött idő jelentése: a böngésző küldi bejelentkezve, amíg a fül látható.

/** Eltelt idő hozzáadása: { seconds: szám }. Ellenőrzi, honnan jön és ki küldi. */
export async function POST(request: Request) {
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

  let seconds: unknown;
  try {
    seconds = ((await request.json()) as { seconds?: unknown })?.seconds;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  // A felső határt és az eltelt idővel való összevetést az addActiveTime végzi.
  await addActiveTime(await getAccountDb(), user.id, seconds, new Date());
  return new NextResponse(null, { status: 204 });
}

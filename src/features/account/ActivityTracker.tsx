"use client";

import { useEffect } from "react";

// Az oldalon töltött idő mérése bejelentkezve: amíg a fül látható, percenként elküldi
// a szervernek az eltelt másodperceket; elrejtéskor és az oldal elhagyásakor a maradékot is.

/** Ilyen gyakran küldjük el az eltelt időt (ezredmásodperc). */
const REPORT_EVERY_MS = 60_000;

// Mióta látható a fül (null: most nem látható / nincs bejelentkezve).
let visibleSince: number | null = null;

/** Elküldi az utolsó jelentés óta eltelt látható időt (kijelentkezés előtt is hívjuk). */
export function flushActivity(): Promise<void> {
  if (visibleSince === null) return Promise.resolve();
  const now = Date.now();
  const seconds = Math.round((now - visibleSince) / 1000);
  visibleSince = document.visibilityState === "visible" ? now : null;
  if (seconds <= 0) return Promise.resolve();
  // keepalive: az oldal bezárása közben is kimegy a kérés.
  return fetch("/api/activity", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ seconds }),
    keepalive: true,
  }).then(
    () => undefined,
    () => undefined, // hálózati hiba: ez a pár másodperc elveszik, nem gond
  );
}

/** Bejelentkezve elindítja az időmérést; vendégként nem csinál semmit. */
export function ActivityTracker({ userId }: { userId: string | null }) {
  useEffect(() => {
    if (!userId) return;
    visibleSince = document.visibilityState === "visible" ? Date.now() : null;

    // Fül elrejtése: a látható idő elküldése; újra láthatóvá váláskor új mérés indul.
    function onVisibility() {
      if (document.visibilityState === "visible") visibleSince ??= Date.now();
      else void flushActivity();
    }
    const timer = window.setInterval(() => void flushActivity(), REPORT_EVERY_MS);
    const onLeave = () => void flushActivity();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onLeave);
    return () => {
      void flushActivity();
      visibleSince = null;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onLeave);
    };
  }, [userId]);
  return null;
}

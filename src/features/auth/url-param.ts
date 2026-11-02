"use client";

import { useEffect, useSyncExternalStore } from "react";

// Egyszer használatos URL paraméterek (pl. ?token=..., ?error=...) kiolvasása betöltéskor.
// Az értéket megjegyezzük, a címből pedig kivesszük, hogy frissítéskor vagy az előzményekben ne maradjon ott.

// A már kiolvasott paraméterek (oldalbetöltésenként egyszer).
const captured = new Map<string, string | null>();
const noopSubscribe = () => () => {};

// Az első híváskor kiolvassa a címből, utána a megjegyzett értéket adja.
function capture(name: string): string | null {
  if (!captured.has(name)) captured.set(name, new URL(window.location.href).searchParams.get(name));
  return captured.get(name)!;
}

/** A paraméter értéke az oldal betöltésekor; a szerveren és az első kirajzoláskor undefined. */
export function useOneTimeParam(name: string): string | null | undefined {
  const value = useSyncExternalStore(
    noopSubscribe,
    () => capture(name),
    () => undefined,
  );
  useEffect(() => {
    if (!value) return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has(name)) return;
    url.searchParams.delete(name);
    window.history.replaceState(window.history.state, "", url);
  }, [name, value]);
  return value;
}

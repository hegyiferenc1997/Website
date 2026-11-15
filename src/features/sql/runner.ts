"use client";

import { useSyncExternalStore } from "react";

// A böngészős SQL futtató vezérlése a főszálon. A PostgreSQL (PGlite, ~16 MB) csak az első futtatáskor
// (vagy amikor az egér egy futtató gomb fölé ér) töltődik le, egy háttérszálban (public/sql/worker.mjs),
// így a leckék oldalai ugyanolyan gyorsan nyílnak meg, mint eddig. Egyszerre egy futtatás megy;
// a túl hosszú lekérdezést a háttérszál leállításával szakítjuk meg. Szerverre semmi nem megy.

/** A futtató állapota: nincs betöltve / töltődik / kész / éppen fut / nem sikerült betölteni. */
export type SqlState = "idle" | "loading" | "ready" | "running" | "error";

/** Egy utasítás eredménye (a cellák szövegként, a null üres cella). */
export type SqlTable = {
  command: string;
  columns: string[];
  rows: (string | null)[][];
  /** Összesen ennyi sor volt (a megjelenítés legfeljebb 200-at kap). */
  total: number;
  affected: number | null;
};

/** Az ellenőrzés eltérésének oka (a felület fordítja szöveggé). */
export type SqlMismatch =
  | { reason: "noResult" }
  | { reason: "columns"; got: number; expected: number }
  | { reason: "rowCount"; got: number; expected: number }
  | { reason: "row"; row: number }
  | { reason: "values" };

/** Egy futtatás eredménye. */
export type SqlResult = {
  ok: boolean;
  phase?: "setup" | "code" | "check" | null;
  error?: string | null;
  hint?: string | null;
  /** Hányadik sorban volt a hiba (ha a PostgreSQL megmondta). */
  line?: number | null;
  /** Üres volt a kód. */
  empty?: boolean;
  results: SqlTable[];
  mismatch?: SqlMismatch | null;
  got?: SqlTable | null;
  expected?: SqlTable | null;
  timeout?: boolean;
  stopped?: boolean;
  loadFailed?: boolean;
};

/** Mit futtassunk: a kódot a mintaadatbázison, ellenőrzésnél a megoldással és az ellenőrző lekérdezéssel. */
export type SqlRequest = {
  setup: string;
  code: string;
  solution?: string | null;
  check?: string | null;
};

// Honnan töltődik a PGlite (a next.config.ts adja meg a verzióval együtt).
const PGLITE_URL = process.env.NEXT_PUBLIC_PGLITE_URL ?? "/pglite/";
const TIMEOUT = 10_000;
// Az első betöltésre több idő jár (a ~16 MB letöltése lassú neten).
const LOAD_TIMEOUT = 90_000;

// A futtató belső állapota (egy példány az egész oldalon).
let worker: Worker | null = null;
let ready: Promise<void> | null = null;
let state: SqlState = "idle";
let nextId = 1;
let active: {
  id: number;
  finish: (r: SqlResult) => void;
  timer: ReturnType<typeof setTimeout>;
} | null = null;
const listeners = new Set<() => void>();

// Állapotváltás és a feliratkozott komponensek értesítése.
function setState(next: SqlState) {
  state = next;
  listeners.forEach((l) => l());
}

/** A háttérszál indítása és a PGlite betöltése (ha még nem történt meg). */
function ensureWorker(): Promise<void> {
  if (ready) return ready;
  setState("loading");
  const w = new Worker("/sql/worker.mjs", { type: "module" });
  worker = w;
  ready = new Promise<void>((resolve, reject) => {
    const loadTimer = setTimeout(() => {
      reset("error");
      reject(new Error("timeout"));
    }, LOAD_TIMEOUT);
    w.onmessage = (event: MessageEvent) => {
      const data = event.data as
        | { type: "ready" }
        | { type: "loadError"; error: string }
        | { type: "done"; id: number; result: SqlResult };
      if (data.type === "ready") {
        clearTimeout(loadTimer);
        setState("ready");
        resolve();
      } else if (data.type === "loadError") {
        clearTimeout(loadTimer);
        reset("error");
        reject(new Error(data.error));
      } else if (data.type === "done" && active?.id === data.id) {
        active.finish(data.result);
      }
    };
    w.onerror = () => {
      clearTimeout(loadTimer);
      reset("error");
      reject(new Error("worker"));
    };
  });
  // A hibát a hívó kezeli; itt csak azt akadályozzuk meg, hogy kezeletlen hibaként jelenjen meg.
  ready.catch(() => {});
  w.postMessage({ type: "init", baseURL: PGLITE_URL });
  return ready;
}

// A háttérszál eldobása (leállításkor / hibánál); a következő futtatás újra betölti.
function reset(next: SqlState) {
  worker?.terminate();
  worker = null;
  ready = null;
  setState(next);
}

/** Előtöltés: ha valószínű, hogy futtatni fognak (egér a gomb fölött, fókusz a szerkesztőben). */
export function preloadSql() {
  if (state === "idle" || state === "error") void ensureWorker();
}

/** SQL futtatása. Ha már fut valami, előbb azt állítjuk le. */
export async function runSql(request: SqlRequest): Promise<SqlResult> {
  if (active) stopSql();
  await ensureWorker();
  const id = nextId++;
  setState("running");
  return new Promise<SqlResult>((resolve) => {
    const finish = (result: SqlResult) => {
      if (active?.id !== id) return;
      clearTimeout(active.timer);
      active = null;
      if (state === "running") setState("ready");
      resolve(result);
    };
    const timer = setTimeout(() => {
      // Túl sokáig fut: eldobjuk a háttérszálat.
      finish({ ok: false, timeout: true, results: [] });
      reset("idle");
    }, TIMEOUT);
    active = { id, finish, timer };
    worker!.postMessage({
      type: "run",
      id,
      setup: request.setup,
      code: request.code,
      solution: request.solution ?? null,
      check: request.check ?? null,
    });
  });
}

/** A futó lekérdezés leállítása (a háttérszál eldobásával). */
export function stopSql() {
  if (!active) return;
  active.finish({ ok: false, stopped: true, results: [] });
  reset("idle");
}

// Feliratkozás az állapotváltozásokra (useSyncExternalStore-hoz).
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** A futtató állapota komponensekben; a szerveren és az első kirajzoláskor "idle". */
export function useSqlState(): SqlState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => "idle",
  );
}

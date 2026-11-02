"use client";

import { useSyncExternalStore } from "react";

// A böngészős Python futtató vezérlése a főszálon. A Python (Pyodide, ~13 MB) csak az első
// futtatáskor (vagy amikor az egér egy futtató gomb fölé ér) töltődik le, egy háttérszálban
// (public/python/worker.mjs), így a leckék oldalai ugyanolyan gyorsan nyílnak meg, mint eddig.
// Egyszerre egy futtatás megy; a végtelen ciklust a háttérszál leállításával szakítjuk meg.

/** A futtató állapota: nincs betöltve / töltődik / kész / éppen fut / nem sikerült betölteni. */
export type PythonState = "idle" | "loading" | "ready" | "running" | "error";

/** Egy futtatás eredménye. phase: hol volt a hiba (a kódban vagy az ellenőrzésben). */
export type RunResult = {
  ok: boolean;
  phase?: "code" | "test" | null;
  error?: string | null;
  /** Időtúllépés miatt állítottuk le (valószínűleg végtelen ciklus). */
  timeout?: boolean;
  /** A felhasználó állította le. */
  stopped?: boolean;
  /** Nem sikerült betölteni a Pythont (pl. nincs internet). */
  loadFailed?: boolean;
};

/** Mit futtassunk: a kódot, opcionálisan ellenőrző kóddal és bemenettel. */
export type RunRequest = {
  code: string;
  test?: string | null;
  stdin?: string;
  lang: string;
  /** Legfeljebb ennyi ideig futhat (ms), utána leállítjuk. */
  timeoutMs?: number;
};

// Honnan töltődik a Pyodide (a next.config.ts adja meg a verzióval együtt).
const PYODIDE_URL = process.env.NEXT_PUBLIC_PYODIDE_URL ?? "/pyodide/";
const DEFAULT_TIMEOUT = 15_000;

// A futtató belső állapota (egy példány az egész oldalon).
let worker: Worker | null = null;
let ready: Promise<void> | null = null;
let state: PythonState = "idle";
let nextId = 1;
let active: {
  id: number;
  onOutput: (text: string) => void;
  finish: (r: RunResult) => void;
  timer: ReturnType<typeof setTimeout>;
} | null = null;
const listeners = new Set<() => void>();

// Állapotváltás és a feliratkozott komponensek értesítése.
function setState(next: PythonState) {
  state = next;
  listeners.forEach((l) => l());
}

/** A háttérszál indítása és a Pyodide betöltése (ha még nem történt meg). */
function ensureWorker(): Promise<void> {
  if (ready) return ready;
  setState("loading");
  const w = new Worker("/python/worker.mjs", { type: "module" });
  worker = w;
  ready = new Promise<void>((resolve, reject) => {
    w.onmessage = (event: MessageEvent) => {
      const data = event.data as
        | { type: "ready" }
        | { type: "loadError"; error: string }
        | { type: "out"; id: number; text: string }
        | { type: "done"; id: number; result: RunResult };
      if (data.type === "ready") {
        setState("ready");
        resolve();
      } else if (data.type === "loadError") {
        reset("error");
        reject(new Error(data.error));
      } else if (data.type === "out" && active?.id === data.id) {
        active.onOutput(data.text);
      } else if (data.type === "done" && active?.id === data.id) {
        active.finish(data.result);
      }
    };
    w.onerror = () => {
      reset("error");
      reject(new Error("worker"));
    };
  });
  // A hibát a hívó kezeli; itt csak azt akadályozzuk meg, hogy kezeletlen hibaként jelenjen meg.
  ready.catch(() => {});
  w.postMessage({ type: "init", indexURL: PYODIDE_URL });
  return ready;
}

// A háttérszál eldobása (leállításkor / hibánál); a következő futtatás újra betölti.
function reset(next: PythonState) {
  worker?.terminate();
  worker = null;
  ready = null;
  setState(next);
}

/** Előtöltés: ha valószínű, hogy futtatni fognak (egér a gomb fölött, fókusz a szerkesztőben). */
export function preloadPython() {
  if (state === "idle" || state === "error") void ensureWorker();
}

/**
 * Kód futtatása. A kiírt szöveg folyamatosan érkezik az onOutput-ba, a végeredményt a Promise adja.
 * Ha már fut valami, előbb azt állítjuk le.
 */
export async function runPython(
  request: RunRequest,
  onOutput: (text: string) => void,
): Promise<RunResult> {
  if (active) stopPython();
  await ensureWorker();
  const id = nextId++;
  setState("running");
  return new Promise<RunResult>((resolve) => {
    const finish = (result: RunResult) => {
      if (active?.id !== id) return;
      clearTimeout(active.timer);
      active = null;
      if (state === "running") setState("ready");
      resolve(result);
    };
    const timer = setTimeout(() => {
      // Túl sokáig fut (pl. végtelen ciklus): eldobjuk a háttérszálat.
      finish({ ok: false, timeout: true });
      reset("idle");
    }, request.timeoutMs ?? DEFAULT_TIMEOUT);
    active = { id, onOutput, finish, timer };
    worker!.postMessage({
      type: "run",
      id,
      code: request.code,
      test: request.test ?? null,
      stdin: request.stdin ?? "",
      lang: request.lang,
    });
  });
}

/** A futó kód leállítása (a háttérszál eldobásával; a következő futtatás újra betölti). */
export function stopPython() {
  if (!active) return;
  active.finish({ ok: false, stopped: true });
  reset("idle");
}

// Feliratkozás az állapotváltozásokra (useSyncExternalStore-hoz).
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** A futtató állapota komponensekben; a szerveren és az első kirajzoláskor "idle". */
export function usePythonState(): PythonState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => "idle",
  );
}

"use client";

import { useSyncExternalStore } from "react";

// A felhasználó haladása: melyik félév van lenyitva, melyik tárgynál tart, és melyik leckét végezte el.
// Mindig a böngészőben is tároljuk (localStorage), így az oldal villanás nélkül, azonnal mutatja.
// Bejelentkezve ez csak gyorsítótár: minden változás a fiókba is mentődik (lásd ProgressSync).

import { emptyProgress, mergeProgress, sanitizeProgress, type Progress } from "./data";

export type { Progress };

const KEY = "em:progress";
/** Kinek a haladása van most a böngészőben: a felhasználó azonosítója, vagy üres (vendég). */
const OWNER_KEY = "em:progress-owner";
const empty = emptyProgress;

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...empty, ...(JSON.parse(raw) as Partial<Progress>) } : empty;
  } catch {
    cache = empty;
  }
  return cache;
}

function save(next: Progress) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Ha a böngésző tiltja a tárolást, a haladás csak erre a látogatásra él.
  }
  listeners.forEach((l) => l());
}

function write(update: (p: Progress) => Progress) {
  save(update(read()));
  sync.dirty = true;
  scheduleUpload();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** A mentett haladás; a szerveren és az első kirajzoláskor null (ilyenkor az alapértelmezés látszik). */
export function useProgress(): Progress | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export const courseKey = (university: string, course: string) => `${university}/${course}`;

export function setOpenSemesters(university: string, semesters: number[]) {
  write((p) => ({ ...p, openSemesters: { ...p.openSemesters, [university]: semesters } }));
}

export function setLastCourse(university: string, course: string) {
  if (read().lastCourse[university] === course) return;
  write((p) => ({ ...p, lastCourse: { ...p.lastCourse, [university]: course } }));
}

/** Lecke késznek jelölése (vagy a jelölés visszavonása). A lecke azonosítója: lessonKey(témakör, lecke). */
export function setLessonDone(key: string, lesson: string, done: boolean) {
  write((p) => {
    const list = p.doneLessons[key] ?? [];
    if (list.includes(lesson) === done) return p;
    const next = done ? [...list, lesson] : list.filter((l) => l !== lesson);
    return { ...p, doneLessons: { ...p.doneLessons, [key]: next } };
  });
}

export function isLessonDone(p: Progress | null, key: string, lesson: string): boolean {
  return p?.doneLessons[key]?.includes(lesson) ?? false;
}

/** Elvégzett leckék száma a megadottak közül (csak a ma is létező leckék számítanak). */
export function doneCount(p: Progress | null, key: string, lessons: string[]): number {
  if (!p) return 0;
  const done = new Set(p.doneLessons[key] ?? []);
  return lessons.filter((l) => done.has(l)).length;
}

/** Egy tárgy haladása 0 és 1 között: elvégzett / összes lecke. */
export function courseRatio(p: Progress | null, key: string, lessons: string[]): number {
  if (lessons.length === 0) return 0;
  return doneCount(p, key, lessons) / lessons.length;
}

// ---------------------------------------------------------------------------
// Szinkronizálás a fiókkal
// ---------------------------------------------------------------------------

const sync = {
  /** A bejelentkezett felhasználó, akinek a fiókjába mentünk; null, ha vendég (vagy még tölt). */
  userId: null as string | null,
  /** Volt-e helyi változás, ami még nincs a szerveren. */
  dirty: false,
  timer: undefined as ReturnType<typeof setTimeout> | undefined,
  connecting: undefined as { userId: string; promise: Promise<void> } | undefined,
};

function upload(keepalive = false): Promise<void> {
  clearTimeout(sync.timer);
  if (!sync.userId || !sync.dirty) return Promise.resolve();
  sync.dirty = false;
  return fetch("/api/progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ progress: read() }),
    keepalive,
  }).then(
    () => undefined,
    () => {
      sync.dirty = true; // következő változáskor újra próbálja
    },
  );
}

function scheduleUpload() {
  if (!sync.userId) return;
  clearTimeout(sync.timer);
  sync.timer = setTimeout(() => void upload(), 600);
}

function readOwner(): string | null {
  try {
    return localStorage.getItem(OWNER_KEY);
  } catch {
    return null;
  }
}

function setOwner(owner: string | null) {
  try {
    if (owner) localStorage.setItem(OWNER_KEY, owner);
    else localStorage.removeItem(OWNER_KEY);
  } catch {}
}

/**
 * Bejelentkezéskor: a fiók haladásának letöltése és összefésülése a böngészőben lévővel.
 * - Vendégként gyűjtött haladás → hozzáadódik a fiókhoz.
 * - Ugyanennek a felhasználónak a gyorsítótára → a fiók állapota nyer (más eszközön is haladhatott).
 * - Egy másik felhasználó maradéka → eldobjuk.
 */
export function connectAccount(userId: string): Promise<void> {
  if (sync.userId === userId) return Promise.resolve();
  if (sync.connecting?.userId !== userId) {
    const promise = loadAccount(userId).finally(() => {
      if (sync.connecting?.promise === promise) sync.connecting = undefined;
    });
    sync.connecting = { userId, promise };
  }
  return sync.connecting.promise;
}

async function loadAccount(userId: string): Promise<void> {
  sync.userId = null;
  const owner = readOwner();
  sync.dirty = false;
  let remote: Progress | null;
  try {
    const res = await fetch("/api/progress", { cache: "no-store" });
    if (!res.ok) return;
    const body = (await res.json()) as { progress: unknown };
    remote = body.progress ? sanitizeProgress(body.progress) : null;
  } catch {
    return; // hálózati hiba: vendégként működik tovább, a következő oldalbetöltés újrapróbálja
  }
  if (sync.connecting?.userId !== userId) return; // közben kijelentkezett vagy más lépett be
  const local = read();
  const changedWhileLoading = sync.dirty;
  let next: Progress;
  if (owner === userId)
    next = remote && !changedWhileLoading ? remote : mergeProgress(local, remote ?? empty);
  else if (owner === null) next = mergeProgress(local, remote ?? empty);
  else next = remote ?? empty;

  save(next);
  setOwner(userId);
  sync.userId = userId;
  sync.dirty = JSON.stringify(next) !== JSON.stringify(remote);
  void upload();
}

/** A még el nem küldött változások azonnali mentése (pl. kijelentkezés előtt). */
export function flushProgress(): Promise<void> {
  return upload(true);
}

/** Kijelentkezéskor (vagy lejárt munkamenetnél): a fiók haladása nem marad a böngészőben. */
export function disconnectAccount() {
  sync.userId = null;
  sync.connecting = undefined;
  if (readOwner() === null) return;
  setOwner(null);
  save(empty);
}

if (typeof window !== "undefined") {
  // Az oldal elhagyásakor a még el nem küldött változás is kimegy.
  window.addEventListener("pagehide", () => void upload(true));
}

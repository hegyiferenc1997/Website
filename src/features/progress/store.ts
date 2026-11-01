"use client";

import { useSyncExternalStore } from "react";

// A felhasználó haladása: melyik félév van lenyitva, melyik tárgynál tart, és melyik témakört végezte el.
// Amíg nincs bejelentkezés, a böngészőben tároljuk (localStorage); később a fiókhoz kerül.

export type Progress = {
  /** Lenyitott félévek egyetemenként; ha még nincs mentve, az 1. félév nyitott. */
  openSemesters: Record<string, number[]>;
  /** Az utoljára megnyitott tárgy egyetemenként (a tárgy slugja). */
  lastCourse: Record<string, string>;
  /** Elvégzett témakörök tárgyanként ("egyetem/tárgy" kulcs → témakör slugok). */
  doneTopics: Record<string, string[]>;
};

const KEY = "em:progress";
const empty: Progress = { openSemesters: {}, lastCourse: {}, doneTopics: {} };

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

function write(update: (p: Progress) => Progress) {
  cache = update(read());
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Ha a böngésző tiltja a tárolást, a haladás csak erre a látogatásra él.
  }
  listeners.forEach((l) => l());
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

export function toggleTopic(key: string, topic: string) {
  write((p) => {
    const done = p.doneTopics[key] ?? [];
    const next = done.includes(topic) ? done.filter((t) => t !== topic) : [...done, topic];
    return { ...p, doneTopics: { ...p.doneTopics, [key]: next } };
  });
}

/** Egy tárgy haladása 0 és 1 között: elvégzett / összes témakör (csak a ma is létező témakörök számítanak). */
export function courseRatio(p: Progress | null, key: string, topics: string[]): number {
  if (!p || topics.length === 0) return 0;
  const done = new Set(p.doneTopics[key] ?? []);
  return topics.filter((t) => done.has(t)).length / topics.length;
}

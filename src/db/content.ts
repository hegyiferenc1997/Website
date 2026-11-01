import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { LocalizedText } from "./schema";

// A tananyag beolvasása a content/courses mappából. A seed ebből tölti fel a témaköröket és leckéket.
//
// Szerkezet:
//   content/courses/<egyetem>/<tárgy>/
//     01-bevezetes/                     ← témakör (a szám a sorrend, utána a slug)
//       topic.json                      ← { "title": { "hu": "…", "en": "…" }, "description": {…} }
//       01-mi-a-program.hu.md           ← lecke magyarul (kötelező)
//       01-mi-a-program.en.md           ← lecke angolul (ha hiányzik, a magyar jelenik meg)
//
// A lecke fájl elején egy rövid fejléc áll:
//   ---
//   title: Mi a program?
//   summary: Egy mondat a leckéről.
//   minutes: 10
//   ---

export type LessonKind = "lesson" | "practice" | "quiz";

export type LessonContent = {
  slug: string;
  position: number;
  kind: LessonKind;
  title: LocalizedText;
  summary: LocalizedText | null;
  body: LocalizedText;
  minutes: number | null;
};

export type TopicContent = {
  slug: string;
  position: number;
  title: LocalizedText;
  description: LocalizedText | null;
  lessons: LessonContent[];
};

export type CourseContent = { university: string; course: string; topics: TopicContent[] };

const ORDERED = /^(\d+)-([a-z0-9-]+)$/;
const LESSON_FILE = /^(\d+)-([a-z0-9-]+)\.([a-z]{2})\.md$/;
const KINDS: LessonKind[] = ["lesson", "practice", "quiz"];

const dirs = (dir: string) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

/** A fájl eleji `---` közötti `kulcs: érték` sorok és az utána következő szöveg. */
export function parseFrontmatter(source: string): { data: Record<string, string>; body: string } {
  const text = source.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { data: {}, body: text.trim() };
  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: text.slice(match[0].length).trim() };
}

function readTopic(dir: string, name: string): TopicContent {
  const [, position, slug] = ORDERED.exec(name)!;
  const where = path.join(dir, name);
  const meta = JSON.parse(readFileSync(path.join(where, "topic.json"), "utf8")) as {
    title: LocalizedText;
    description?: LocalizedText;
  };
  if (!meta.title?.hu) throw new Error(`Hiányzó magyar cím: ${where}/topic.json`);

  // Leckék összegyűjtése nyelvenként.
  const byLesson = new Map<string, { position: number; files: Record<string, string> }>();
  for (const file of readdirSync(where).sort()) {
    const m = LESSON_FILE.exec(file);
    if (!m) continue;
    const [, pos, lessonSlug, lang] = m;
    const entry = byLesson.get(lessonSlug) ?? { position: Number(pos), files: {} };
    entry.files[lang] = readFileSync(path.join(where, file), "utf8");
    byLesson.set(lessonSlug, entry);
  }

  const lessons: LessonContent[] = [];
  for (const [lessonSlug, { position: pos, files }] of byLesson) {
    if (!files.hu) throw new Error(`Hiányzik a magyar változat: ${where}/${lessonSlug}`);
    const title = { hu: "" } as LocalizedText;
    const summary = { hu: "" } as LocalizedText;
    const body = { hu: "" } as LocalizedText;
    let minutes: number | null = null;
    let kind: LessonKind = "lesson";
    for (const [lang, source] of Object.entries(files)) {
      const { data, body: text } = parseFrontmatter(source);
      if (!data.title) throw new Error(`Hiányzó cím (title): ${where}/${lessonSlug}.${lang}.md`);
      title[lang] = data.title;
      if (data.summary) summary[lang] = data.summary;
      body[lang] = text;
      if (lang === "hu") {
        if (data.minutes) minutes = Number(data.minutes) || null;
        if (KINDS.includes(data.kind as LessonKind)) kind = data.kind as LessonKind;
      }
    }
    lessons.push({
      slug: lessonSlug,
      position: pos,
      kind,
      title,
      summary: summary.hu ? summary : null,
      body,
      minutes,
    });
  }
  lessons.sort((a, b) => a.position - b.position);

  return {
    slug,
    position: Number(position),
    title: meta.title,
    description: meta.description?.hu ? meta.description : null,
    lessons,
  };
}

/** Az összes tárgy tananyaga a mappából (üres lista, ha nincs content mappa). */
export function loadContent(
  // A megjegyzés miatt a Next.js nem próbálja az egész projektet a szerverkódhoz csomagolni.
  root = path.join(/* turbopackIgnore: true */ process.cwd(), "content", "courses"),
): CourseContent[] {
  if (!existsSync(root)) return [];
  const out: CourseContent[] = [];
  for (const university of dirs(root)) {
    for (const course of dirs(path.join(root, university))) {
      const dir = path.join(root, university, course);
      const topics = dirs(dir)
        .filter((d) => ORDERED.test(d))
        .map((d) => readTopic(dir, d));
      out.push({ university, course, topics });
    }
  }
  return out;
}

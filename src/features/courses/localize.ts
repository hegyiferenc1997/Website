import type { LocalizedText } from "@/db/schema";

/** A kért nyelvű szöveg, ha nincs ilyen fordítás, akkor a magyar. */
export function localize(text: LocalizedText, locale: string): string;
export function localize(text: LocalizedText | null, locale: string): string | null;
export function localize(text: LocalizedText | null, locale: string): string | null {
  if (!text) return null;
  return text[locale] ?? text.hu;
}

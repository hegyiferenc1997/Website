import "server-only";
import { getTranslations } from "next-intl/server";
import { localize } from "@/features/courses/localize";
import { getCourseCatalog, getUniversities } from "@/features/courses/queries";
import type { SearchItem } from "./match";

/** Rövidítés a szavak kezdőbetűiből, pl. „Gábor Dénes Egyetem” → „GDE”, hogy arra is lehessen keresni. */
const acronym = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("");

/** A kereső teljes listája (egyetemek és tárgyak). Kicsi, ezért egyben megy a böngészőnek: a keresés azonnali. */
export async function getSearchItems(locale: string): Promise<SearchItem[]> {
  const [universities, catalog, t, tUni] = await Promise.all([
    getUniversities(),
    getCourseCatalog(),
    getTranslations("Search"),
    getTranslations("UniversitiesPage"),
  ]);

  const uniItems: SearchItem[] = universities.map((u) => {
    const name = localize(u.name, locale);
    return {
      kind: "university",
      key: `university:${u.slug}`,
      title: name,
      meta: [u.city, tUni("courseCount", { count: u.courses.length })].filter(Boolean).join(" · "),
      keywords: [u.slug, acronym(name), u.city].filter(Boolean).join(" "),
      university: u.slug,
    };
  });

  const courseItems: SearchItem[] = catalog.map((c) => {
    const uniName = localize(c.university.name, locale);
    return {
      kind: "course",
      key: `course:${c.university.slug}/${c.slug}`,
      title: localize(c.name, locale),
      meta: [
        uniName,
        c.semester !== null ? t("semester", { semester: c.semester }) : null,
        c.credits !== null ? t("credits", { credits: c.credits }) : null,
        c.isActive ? null : t("comingSoon"),
      ]
        .filter(Boolean)
        .join(" · "),
      keywords: [uniName, acronym(uniName), c.university.slug, c.university.city, c.code]
        .filter(Boolean)
        .join(" "),
      university: c.university.slug,
      course: c.slug,
    };
  });

  return [...uniItems, ...courseItems];
}

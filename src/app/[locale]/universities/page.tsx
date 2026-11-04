import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { EmptyState, LinkCardBody, PageHeader, SectionTitle } from "@/components/ui";
import { DEGREE_LEVELS } from "@/features/courses/level";
import { localize } from "@/features/courses/localize";
import { getUniversities } from "@/features/courses/queries";
import { Link } from "@/i18n/navigation";

// A böngészőfül címe ezen az oldalon.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("UniversitiesPage");
  return { title: t("title") };
}

// Ez a két szakasz mindig látszik (üresen is), a PhD / egyéb csak akkor, ha van benne egyetem.
const ALWAYS_SHOWN = new Set(["bsc", "msc"]);

// Egyetemek listája képzési szintenként külön szakaszban (BSc = alapszak, MSc = mesterszak),
// mert ugyanaz az egyetem mindkettőben szerepelhet, más félévekkel és tárgyakkal.
export default async function UniversitiesPage() {
  const [t, locale, list] = await Promise.all([
    getTranslations("UniversitiesPage"),
    getLocale(),
    getUniversities(),
  ]);

  // Szakaszok szintenként; elöl a tárgyakkal rendelkező egyetemek, utánuk a helykitöltők
  // („hamarosan”), mindkét csoporton belül ábécérendben.
  const collator = new Intl.Collator(locale);
  const sections = DEGREE_LEVELS.map((level) => ({
    level,
    list: list
      .filter((u) => u.level === level)
      .sort(
        (a, b) =>
          Number(a.courses.length === 0) - Number(b.courses.length === 0) ||
          collator.compare(localize(a.name, locale), localize(b.name, locale)),
      ),
  })).filter((s) => ALWAYS_SHOWN.has(s.level) || s.list.length > 0);

  return (
    <div className="grid gap-10">
      <PageHeader title={t("title")}>{t("intro")}</PageHeader>
      {list.length === 0 ? (
        <EmptyState>{t("empty")}</EmptyState>
      ) : (
        <>
          {/* Ugrólinkek a szakaszokhoz (hosszú lista esetén is gyorsan elérhető a másik szint) */}
          <nav aria-label={t("levelsNav")} className="-mt-4 flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s.level}
                href={`#${s.level}`}
                className="rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
              >
                {t(`levels.${s.level}`)}{" "}
                <span className="text-fg">· {t("levelCount", { count: s.list.length })}</span>
              </a>
            ))}
          </nav>
          {sections.map((s) => (
            // scroll-mt: a ragadós fejléc ne takarja el a szakasz címét ugráskor.
            <section key={s.level} id={s.level} className="grid scroll-mt-24 gap-4">
              <SectionTitle>{t(`levels.${s.level}`)}</SectionTitle>
              {s.list.length === 0 ? (
                <EmptyState>{t(`levelEmpty.${s.level}`)}</EmptyState>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {s.list.map((u) =>
                    // Tárgy nélküli egyetem: csak helykitöltő, nem kattintható, „hamarosan” címkével.
                    u.courses.length === 0 ? (
                      <li key={u.id}>
                        <span className="flex h-full items-start justify-between gap-4 rounded-lg border border-dashed border-line p-5">
                          <span className="grid flex-1 gap-1.5">
                            <span className="font-mono text-base font-bold text-muted">
                              {localize(u.name, locale)}
                            </span>
                            <span className="text-sm text-muted">
                              {[u.shortName, u.city].filter(Boolean).join(" · ")}
                            </span>
                          </span>
                          <span className="whitespace-nowrap rounded-md border border-line px-2 py-0.5 font-mono text-xs text-muted">
                            {t("comingSoon")}
                          </span>
                        </span>
                      </li>
                    ) : (
                      <li key={u.id}>
                        <Link
                          className="group block h-full"
                          href={{
                            pathname: "/universities/[university]",
                            params: { university: u.slug },
                          }}
                        >
                          <LinkCardBody
                            title={localize(u.name, locale)}
                            meta={[
                              u.shortName,
                              u.city,
                              t("courseCount", { count: u.courses.length }),
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          />
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </section>
          ))}
        </>
      )}
    </div>
  );
}

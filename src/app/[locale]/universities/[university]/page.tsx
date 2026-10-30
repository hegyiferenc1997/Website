import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { localize } from "@/features/courses/localize";
import { getUniversities, getUniversity } from "@/features/courses/queries";
import { EmptyState, LinkCardBody, PageHeader, SectionTitle } from "@/components/ui";
import { Link } from "@/i18n/navigation";

type Props = PageProps<"/[locale]/universities/[university]">;

export async function generateStaticParams() {
  const list = await getUniversities();
  return list.map((u) => ({ university: u.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { university: slug } = await params;
  const [university, locale] = await Promise.all([getUniversity(slug), getLocale()]);
  return university ? { title: localize(university.name, locale) } : {};
}

// Egy egyetem oldala
// Az URL-ből érkező adat (params) <Suspense>-en belül töltődik, így a navigáció azonnali:
// a keret rögtön megjelenik, a tartalom pedig betöltés után kerül a helyére.
export default async function UniversityPage({ params }: Props) {
  const t = await getTranslations("Common");
  return (
    <Suspense fallback={<p className="text-muted">{t("loading")}</p>}>
      <UniversityContent params={params} />
    </Suspense>
  );
}

async function UniversityContent({ params }: Pick<Props, "params">) {
  const { university: slug } = await params;
  const [university, locale, t] = await Promise.all([
    getUniversity(slug),
    getLocale(),
    getTranslations("UniversityPage"),
  ]);
  if (!university) notFound();

  // Tárgyak csoportosítva az ajánlott félév szerint (mint egy mintatanterv); félév nélküliek a végén.
  const groups = new Map<number | null, typeof university.courses>();
  for (const c of university.courses) {
    const semesters = c.programCourses
      .map((pc) => pc.recommendedSemester)
      .filter((s): s is number => s !== null);
    const key = semesters.length > 0 ? Math.min(...semesters) : null;
    groups.set(key, [...(groups.get(key) ?? []), c]);
  }
  const sortedGroups = [...groups.entries()].sort(([a], [b]) =>
    a === null ? 1 : b === null ? -1 : a - b,
  );

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow={
          <Link href="/universities" className="hover:text-accent">
            {t("eyebrow")}
          </Link>
        }
        title={localize(university.name, locale)}
      >
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base">
          {university.city && <span>{university.city}</span>}
          {university.website && (
            <a
              href={university.website}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              {t("website")} ↗
            </a>
          )}
        </span>
      </PageHeader>

      <section className="grid gap-6">
        <SectionTitle>{t("coursesTitle")}</SectionTitle>
        {university.courses.length === 0 ? (
          <EmptyState>{t("noCourses")}</EmptyState>
        ) : (
          sortedGroups.map(([semester, list]) => (
            <div key={semester ?? "none"} className="grid gap-3">
              <h3 className="font-mono text-sm font-medium text-highlight">
                {semester === null ? t("noSemester") : t("semester", { semester })}
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => (
                  <li key={c.id}>
                    <Link
                      className="group block h-full"
                      href={{
                        pathname: "/universities/[university]/courses/[course]",
                        params: { university: university.slug, course: c.slug },
                      }}
                    >
                      <LinkCardBody
                        title={localize(c.name, locale)}
                        meta={c.credits !== null ? t("credits", { credits: c.credits }) : undefined}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { localize } from "@/features/courses/localize";
import { getUniversities, getUniversity } from "@/features/courses/queries";
import { EmptyState, LinkCardBody, PageHeader, SectionTitle } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { CourseCardProgress, SemesterSection } from "@/features/progress/components";
import { courseLessons } from "@/features/courses/lessons";
import { formatDateUntil } from "@/features/account/format";
import { BuyButton } from "@/features/payments/BuyButton";
import { getUniversityAccess } from "@/features/payments/access";

// Az oldal bemenete: az URL paraméterei (nyelv, egyetem azonosító).
type Props = PageProps<"/[locale]/universities/[university]">;

// Build idején minden egyetem oldala előre elkészül, így azonnal betölt.
export async function generateStaticParams() {
  const list = await getUniversities();
  return list.map((u) => ({ university: u.slug }));
}

// Fülcím: az egyetem neve.
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

// A tényleges tartalom: az egyetem adatai és a tárgyak félévenként csoportosítva.
async function UniversityContent({ params }: Pick<Props, "params">) {
  const { university: slug } = await params;
  // A felhasználó megvásárolt félévei is kellenek (a vásárlás gombokhoz), ezért ez a rész kérésenként készül.
  const [university, locale, t, tPay, access] = await Promise.all([
    getUniversity(slug),
    getLocale(),
    getTranslations("UniversityPage"),
    getTranslations("Payments"),
    getUniversityAccess(slug),
  ]);
  // Ismeretlen egyetem → 404 oldal.
  if (!university) notFound();

  // Tárgyak csoportosítva az ajánlott félév szerint (mint egy mintatanterv); félév nélküliek a végén.
  // Egy félévben előbb a közös tárgyak jönnek, utána specializációnként a többi.
  type Course = (typeof university.courses)[number];
  type Specialization = NonNullable<Course["programCourses"][number]["specialization"]>;
  type Group = { common: Course[]; specs: Map<number, { spec: Specialization; list: Course[] }> };
  const groups = new Map<number | null, Group>();
  for (const c of university.courses) {
    const pc = c.programCourses
      .filter((p) => p.recommendedSemester !== null)
      .sort((a, b) => a.recommendedSemester! - b.recommendedSemester!)[0];
    const key = pc?.recommendedSemester ?? null;
    const group: Group = groups.get(key) ?? { common: [], specs: new Map() };
    groups.set(key, group);
    if (pc?.specialization) {
      const entry = group.specs.get(pc.specialization.id) ?? {
        spec: pc.specialization,
        list: [],
      };
      entry.list.push(c);
      group.specs.set(pc.specialization.id, entry);
    } else {
      group.common.push(c);
    }
  }
  // Félévek növekvő sorrendben, a félév nélküli csoport a végén.
  const sortedGroups = [...groups.entries()].sort(([a], [b]) =>
    a === null ? 1 : b === null ? -1 : a - b,
  );
  // A félév kreditje: közös tárgyak + egy specializáció (a hallgató csak egyet választ).
  const sumCredits = (list: Course[]) => list.reduce((s, c) => s + (c.credits ?? 0), 0);
  const semesterCredits = (g: Group) =>
    sumCredits(g.common) + Math.max(0, ...[...g.specs.values()].map((x) => sumCredits(x.list)));
  // Tárgyak ábécérendben, a nyelv szabályai szerint.
  const collator = new Intl.Collator(locale);
  const byName = (list: Course[]) =>
    [...list].sort((a, b) => collator.compare(localize(a.name, locale), localize(b.name, locale)));

  // Tárgykártyák rácsa: név, kredit, „hamarosan” jelzés és haladás csík.
  const courseList = (list: Course[]) => (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {byName(list).map((c) => (
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
              meta={[
                c.credits !== null ? t("credits", { credits: c.credits }) : null,
                c.isActive ? null : t("comingSoon"),
              ]
                .filter(Boolean)
                .join(" · ")}
            >
              <CourseCardProgress
                university={university.slug}
                course={c.slug}
                lessons={courseLessons(c)}
              />
            </LinkCardBody>
          </Link>
        </li>
      ))}
    </ul>
  );

  // A félév fejlécének jobb széle: vásárlás gomb (vagy aktív címke); ha a félévben még nincs kész
  // tananyag, csak egy „hamarosan” jelzés, mert nincs mit megvenni.
  const semesterAction = (semester: number, g: Group) => {
    const all = [...g.common, ...[...g.specs.values()].flatMap((x) => x.list)];
    if (!all.some((c) => c.isActive)) {
      return (
        <span className="whitespace-nowrap font-mono text-xs text-muted">{tPay("comingSoon")}</span>
      );
    }
    const until = access.passes.get(semester);
    return (
      <BuyButton
        university={university.slug}
        semester={semester}
        semesterTitle={semester === 0 ? t("noSemester") : t("semester", { semester })}
        signedIn={access.user !== null}
        activeUntil={until ? formatDateUntil(until, locale) : null}
      />
    );
  };

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

      {/* Tárgyak félévenként lenyitható dobozokban */}
      <section className="grid gap-6">
        <SectionTitle>{t("coursesTitle")}</SectionTitle>
        {university.courses.length === 0 ? (
          <EmptyState>{t("noCourses")}</EmptyState>
        ) : (
          <div className="grid gap-3">
            {sortedGroups.map(([semester, group]) => (
              <SemesterSection
                key={semester ?? "none"}
                university={university.slug}
                semester={semester ?? 0}
                title={semester === null ? t("noSemester") : t("semester", { semester })}
                credits={semesterCredits(group)}
                action={semesterAction(semester ?? 0, group)}
                courses={[...group.common, ...[...group.specs.values()].flatMap((g) => g.list)].map(
                  (c) => ({
                    slug: c.slug,
                    credits: c.credits ?? 0,
                    lessons: courseLessons(c),
                  }),
                )}
              >
                {group.common.length > 0 && courseList(group.common)}
                {[...group.specs.values()]
                  .sort((a, b) => a.spec.position - b.spec.position)
                  .map(({ spec, list }) => (
                    <div key={spec.id} className="grid gap-3 pt-2">
                      <h4 className="font-mono text-xs font-medium text-accent">
                        {t("specialization", { name: localize(spec.name, locale) })}
                      </h4>
                      {courseList(list)}
                    </div>
                  ))}
              </SemesterSection>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

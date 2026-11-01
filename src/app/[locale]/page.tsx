import { getTranslations } from "next-intl/server";
import { MatrixRain } from "@/components/MatrixRain";
import { Link } from "@/i18n/navigation";

// Főoldal: bemutatkozás és az egyetemek böngészése gomb, a háttérben halvány mátrix-animáció. A tárgyak a Tárgyak menüpontban vannak.
export default async function HomePage() {
  const t = await getTranslations("HomePage");

  return (
    <section className="grid gap-5 py-4 sm:py-8">
      <MatrixRain />
      <p className="font-mono text-sm text-accent">{t("eyebrow")}</p>
      <h1 className="text-4xl leading-tight sm:text-6xl sm:leading-[1.05]">{t("title")}</h1>
      <p className="max-w-3xl text-xl leading-snug text-fg sm:text-2xl">{t("tagline")}</p>
      <p className="max-w-2xl text-lg text-muted">{t("intro")}</p>
      <div>
        <Link
          href="/universities"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-semibold text-accent-fg transition-opacity hover:opacity-90"
        >
          {t("browseUniversities")} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

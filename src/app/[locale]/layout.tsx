import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

// Minden nyelvhez előre generált oldalak.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: { default: t("title"), template: `%s | ${t("title")}` },
    description: t("description"),
  };
}

// Közös keret minden oldalhoz. Csak szerkezet: a fejléc, menü és lábléc dizájnja később jön.
export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const t = await getTranslations("Layout");

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <header>
            <Link href="/">{t("siteName")}</Link>
            <nav>
              <ul>
                <li>
                  <Link href="/">{t("nav.home")}</Link>
                </li>
                <li>
                  <Link href="/universities">{t("nav.universities")}</Link>
                </li>
              </ul>
            </nav>
          </header>
          <main>{children}</main>
          <footer>{t("footer")}</footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

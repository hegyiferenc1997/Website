import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import { backLinkClass, NotFoundContent } from "@/components/NotFoundContent";
import { InlineScript } from "@/components/InlineScript";
import { ThemeScript } from "@/components/ThemeScript";
import { routing } from "@/i18n/routing";
import "./globals.css";

// Ugyanazok a betűtípusok, mint a fő layoutban (ez az oldal azt megkerüli).
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-jetbrains-mono" });
const sans = Source_Sans_3({ subsets: ["latin", "latin-ext"], variable: "--font-source-sans" });

// Fülcím.
export const metadata: Metadata = {
  title: "404",
};

// A nem alapértelmezett nyelvek (pl. "en") előtagja alapján még kirajzolás előtt beállítja
// a <html lang>-ot, a CSS pedig csak az annak megfelelő szöveget mutatja. Így nincs villanás.
const others = routing.locales.filter((l) => l !== routing.defaultLocale);
const langScript = `(function(){var l=location.pathname.split("/")[1];if(${JSON.stringify(others)}.indexOf(l)>-1)document.documentElement.lang=l})()`;
const langStyle = routing.locales
  .map((l) => `html:not(:lang(${l})) [data-lang="${l}"]{display:none}`)
  .join("");

// Azokra az URL-ekre, amik egyik útvonalra sem illenek. A layoutot megkerüli, ezért saját <html>-t ad.
// Minden nyelv szövegét tartalmazza, és az URL nyelvének megfelelő látszik.
export default async function GlobalNotFound() {
  const texts = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      t: await getTranslations({ locale, namespace: "NotFound" }),
    })),
  );

  return (
    <html
      lang={routing.defaultLocale}
      className={`${mono.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <InlineScript code={langScript} />
        <style dangerouslySetInnerHTML={{ __html: langStyle }} />
      </head>
      <body>
        <main className="mx-auto w-full max-w-5xl px-4 py-14">
          {texts.map(({ locale, t }) => (
            <div key={locale} data-lang={locale} lang={locale}>
              <NotFoundContent
                code={t("code")}
                title={t("title")}
                text={t("text")}
                action={
                  <Link
                    href={locale === routing.defaultLocale ? "/" : `/${locale}`}
                    className={backLinkClass}
                  >
                    ← {t("backHome")}
                  </Link>
                }
              />
            </div>
          ))}
        </main>
      </body>
    </html>
  );
}

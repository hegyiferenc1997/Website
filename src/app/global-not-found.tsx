import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import { backLinkClass, NotFoundContent } from "@/components/NotFoundContent";
import { ThemeScript } from "@/components/ThemeScript";
import { routing } from "@/i18n/routing";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-jetbrains-mono" });
const sans = Source_Sans_3({ subsets: ["latin", "latin-ext"], variable: "--font-source-sans" });

export const metadata: Metadata = {
  title: "404",
};

// Azokra az URL-ekre, amik egyik útvonalra sem illenek. A layoutot megkerüli, ezért saját <html>-t ad.
export default async function GlobalNotFound() {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: "NotFound" });

  return (
    <html
      lang={routing.defaultLocale}
      className={`${mono.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <main className="mx-auto w-full max-w-5xl px-4 py-14">
          <NotFoundContent
            code={t("code")}
            title={t("title")}
            text={t("text")}
            action={
              <Link href="/" className={backLinkClass}>
                ← {t("backHome")}
              </Link>
            }
          />
        </main>
      </body>
    </html>
  );
}

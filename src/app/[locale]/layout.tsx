import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeScript } from "@/components/ThemeScript";
import { routing } from "@/i18n/routing";
import "../globals.css";

// Betűtípusok: címekhez és kódhoz JetBrains Mono, szöveghez Source Sans 3 (mindkettő tud ő/ű-t).
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
});
const sans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source-sans",
});

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

// Közös keret minden oldalhoz: fejléc, tartalom, lábléc.
export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();

  return (
    // A témát a ThemeScript állítja be a kirajzolás előtt, ezért itt eltérhet a szervertől.
    <html lang={locale} className={`${mono.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <SiteHeader />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:py-14">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { routing } from "@/i18n/routing";
import "./globals.css";

export const metadata: Metadata = {
  title: "404",
};

// Azokra az URL-ekre, amik egyik útvonalra sem illenek. A layoutot megkerüli, ezért saját <html>-t ad.
export default async function GlobalNotFound() {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: "NotFound" });

  return (
    <html lang={routing.defaultLocale}>
      <body>
        <main>
          <h1>{t("title")}</h1>
          <Link href="/">{t("backHome")}</Link>
        </main>
      </body>
    </html>
  );
}

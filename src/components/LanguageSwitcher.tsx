"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

// Nyelvváltó (HU / EN). Ugyanarra az oldalra visz a másik nyelven
// (pl. /egyetemek/gabor-denes-egyetem → /en/universities/gabor-denes-egyetem).
export function LanguageSwitcher() {
  const t = useTranslations("Layout.language");
  const current = useLocale();
  // A belső útvonal mintája (pl. "/universities/[university]") és az URL paraméterei.
  const pathname = usePathname();
  const params = useParams();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex h-9 items-center rounded-md border border-line p-0.5 font-mono text-xs"
    >
      {routing.locales.map((locale: Locale) =>
        locale === current ? (
          <span
            key={locale}
            aria-current="true"
            // Súgó-buborék: melyik nyelv az aktuális (lásd globals.css).
            data-tooltip={t("current", { locale })}
            className="rounded bg-accent-soft px-2 py-1.5 font-bold text-accent"
          >
            {locale.toUpperCase()}
          </span>
        ) : (
          // Sima <a>: a nyelvváltás az egész oldalt (a <html lang>-ot is) újratölti, így a
          // böngészőben futó navigáció tisztán indul az új nyelven. Az oldalak előre elkészítve,
          // azonnal jönnek, a téma pedig a kirajzolás előtt áll be, ezért nincs villanás.
          // A cím közvetlenül a végleges (a magyarnál előtag nélküli), így nincs átirányítás.
          <a
            key={locale}
            href={getPathname({
              // @ts-expect-error -- a pathname és a params mindig az aktuális oldalhoz tartoznak.
              href: { pathname, params },
              locale,
            })}
            hrefLang={locale}
            lang={locale}
            // Súgó-buborék: mit csinál a kattintás, pl. „Váltás angol nyelvre”.
            data-tooltip={t(`switchTo.${locale}`)}
            className="rounded px-2 py-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-fg"
          >
            {locale.toUpperCase()}
          </a>
        ),
      )}
    </div>
  );
}

import { getTranslations } from "next-intl/server";

// Nyelvváltó (HU / EN). Egyelőre csak megjelenik: az angol változat még nem működik,
// ezért az EN nem kattintható. Amikor elkészül a messages/en.json, itt lesz belőle link.
export async function LanguageSwitcher() {
  const t = await getTranslations("Layout.language");

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex h-9 items-center rounded-md border border-line p-0.5 font-mono text-xs"
    >
      <span
        aria-current="true"
        title={t("current")}
        className="rounded px-2 py-1.5 font-bold text-accent bg-accent-soft"
      >
        HU
      </span>
      <span
        aria-disabled="true"
        title={t("soon")}
        className="cursor-not-allowed rounded px-2 py-1.5 text-muted opacity-60"
      >
        EN
      </span>
    </div>
  );
}

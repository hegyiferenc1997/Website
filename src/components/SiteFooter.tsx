import { getTranslations } from "next-intl/server";

// Lábléc. A „Rólunk”, „Kapcsolat” stb. linkek akkor kerülnek ide, amikor elkészülnek az oldalaik.
export async function SiteFooter() {
  const t = await getTranslations("Layout");

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted">
        <span className="font-mono">{t("siteName")}</span>
        <span>{t("footer")}</span>
      </div>
    </footer>
  );
}

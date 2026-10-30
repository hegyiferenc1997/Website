import { getTranslations } from "next-intl/server";
import { backLinkClass, NotFoundContent } from "@/components/NotFoundContent";
import { Link } from "@/i18n/navigation";

// Akkor jelenik meg, ha egy létező útvonalon belül nincs ilyen adat (pl. ismeretlen tárgy).
export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
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
  );
}

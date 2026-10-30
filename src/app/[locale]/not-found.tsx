import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// Akkor jelenik meg, ha egy létező útvonalon belül nincs ilyen adat (pl. ismeretlen tárgy).
export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <>
      <h1>{t("title")}</h1>
      <Link href="/">{t("backHome")}</Link>
    </>
  );
}

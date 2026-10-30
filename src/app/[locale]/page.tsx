import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// Főoldal
export default async function HomePage() {
  const t = await getTranslations("HomePage");

  return (
    <>
      <h1>{t("title")}</h1>
      <p>{t("intro")}</p>
      <Link href="/universities">{t("browseUniversities")}</Link>
    </>
  );
}

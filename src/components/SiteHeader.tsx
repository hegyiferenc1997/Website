import { getLocale, getTranslations } from "next-intl/server";
import { getSearchItems } from "@/features/search/items";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LoginMenu } from "./LoginMenu";
import { NavLink } from "./NavLink";
import { SearchMenu } from "./SearchMenu";
import { ThemeToggle } from "./ThemeToggle";

// Felső menüsor: logó, menüpontok, kereső, témaváltó, nyelvváltó, bejelentkezés.
export async function SiteHeader() {
  const locale = await getLocale();
  const [t, searchItems] = await Promise.all([getTranslations("Layout"), getSearchItems(locale)]);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:gap-x-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-[13px] font-bold sm:gap-2.5 sm:text-[15px]"
        >
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-md bg-accent text-xs text-accent-fg"
          >
            &lt;/&gt;
          </span>
          {t("siteName")}
        </Link>
        <nav
          aria-label={t("nav.label")}
          className="order-last flex-1 basis-[calc(100%-3.5rem)] sm:order-none sm:flex-none sm:basis-auto"
        >
          <ul className="flex gap-1">
            <li>
              <NavLink href="/">{t("nav.home")}</NavLink>
            </li>
            <li>
              <NavLink href="/universities">{t("nav.universities")}</NavLink>
            </li>
            <li>
              <NavLink href="/courses">{t("nav.courses")}</NavLink>
            </li>
          </ul>
        </nav>
        {/* Mobilon a kereső a menüpontok sorának végére kerül, hogy a felső sorban elférjen minden. */}
        <div className="order-last sm:order-none sm:-mr-4 sm:ml-auto">
          <SearchMenu items={searchItems} />
        </div>
        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <ThemeToggle />
          <LanguageSwitcher />
          <LoginMenu />
        </div>
      </div>
    </header>
  );
}

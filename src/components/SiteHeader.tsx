import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";

// Felső menüsor: logó, menüpontok, témaváltó.
export async function SiteHeader() {
  const t = await getTranslations("Layout");

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 font-mono text-[15px] font-bold">
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-md bg-accent text-xs text-accent-fg"
          >
            &lt;/&gt;
          </span>
          {t("siteName")}
        </Link>
        <nav aria-label={t("nav.label")} className="order-last w-full sm:order-none sm:w-auto">
          <ul className="flex gap-1">
            <li>
              <NavLink href="/">{t("nav.home")}</NavLink>
            </li>
            <li>
              <NavLink href="/universities">{t("nav.universities")}</NavLink>
            </li>
          </ul>
        </nav>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

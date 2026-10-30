"use client";

import { useTranslations } from "next-intl";

// Sötét/világos téma váltó. A választás a böngészőben marad (localStorage),
// betöltéskor a ThemeScript állítja vissza még a kirajzolás előtt.
export function ThemeToggle() {
  const t = useTranslations("Layout.theme");

  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Ha a böngésző tiltja a tárolást, a váltás csak erre a látogatásra él.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex size-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:bg-surface-hover hover:text-fg"
    >
      {/* Sötét témában a napot mutatjuk (világosra vált), világosban a holdat. */}
      <span className="light:hidden">
        <span className="sr-only">{t("toLight")}</span>
        <SunIcon />
      </span>
      <span className="hidden light:inline">
        <span className="sr-only">{t("toDark")}</span>
        <MoonIcon />
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

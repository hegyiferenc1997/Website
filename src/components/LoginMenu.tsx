"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";

// Bejelentkezés ikon a fejlécben, kattintásra lenyíló panellel.
// Egyelőre csak megjelenés: a gombok nem jelentkeztetnek be (később Better Auth / Auth.js).
export function LoginMenu() {
  const t = useTranslations("Layout.login");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const id = useId();

  // Bezárás Esc-re vagy a panelen kívüli kattintásra.
  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="sm:relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className={
          "inline-flex size-9 items-center justify-center rounded-md border transition-colors " +
          (open
            ? "border-accent bg-accent-soft text-accent"
            : "border-line text-muted hover:bg-surface-hover hover:text-fg")
        }
      >
        <span className="sr-only">{t("open")}</span>
        <UserIcon />
      </button>

      {open && (
        <div
          id={`${id}-panel`}
          role="dialog"
          aria-labelledby={`${id}-title`}
          className="absolute inset-x-4 top-full z-30 mt-2 rounded-lg border border-line bg-surface p-5 shadow-2xl shadow-black/40 sm:inset-x-auto sm:right-0 sm:w-96"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 id={`${id}-title`} className="text-lg">
              {t("title")}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-muted hover:bg-surface-hover hover:text-fg"
            >
              <span className="sr-only">{t("close")}</span>
              <CloseIcon />
            </button>
          </div>

          <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted">{t("username")}</span>
              <input
                ref={firstFieldRef}
                id={`${id}-username`}
                name="username"
                autoComplete="username"
                className="rounded-md border border-line bg-bg px-3 py-2 text-fg outline-none focus:border-accent"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted">{t("password")}</span>
              <input
                id={`${id}-password`}
                name="password"
                type="password"
                autoComplete="current-password"
                className="rounded-md border border-line bg-bg px-3 py-2 text-fg outline-none focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="mt-1 rounded-md bg-accent px-4 py-2.5 font-semibold text-accent-fg transition-opacity hover:opacity-90"
            >
              {t("submit")}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-line" />
            {t("or")}
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="grid gap-2">
            <button type="button" className={socialClass}>
              <GoogleIcon />
              {t("google")}
            </button>
            <button type="button" className={socialClass}>
              <AppleIcon />
              {t("apple")}
            </button>
          </div>

          <p className="mt-4 text-xs text-muted">{t("soon")}</p>
        </div>
      )}
    </div>
  );
}

const socialClass =
  "flex items-center gap-3 rounded-md border border-line bg-bg px-3 py-2.5 text-left text-sm text-fg transition-colors hover:border-accent hover:bg-surface-hover";

function UserIcon() {
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
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function CloseIcon() {
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
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

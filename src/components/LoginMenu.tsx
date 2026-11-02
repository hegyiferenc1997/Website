"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/features/auth/client";
import { PasswordField } from "@/features/auth/PasswordField";
import { isPasswordValid, type SocialProviders } from "@/features/auth/shared";
import type { SessionUser } from "@/features/auth/server";
import { OPEN_LOGIN_EVENT } from "@/features/auth/open-login";
import { useOneTimeParam } from "@/features/auth/url-param";
import { disconnectAccount, flushProgress } from "@/features/progress/store";
import { flushActivity } from "@/features/account/ActivityTracker";
import { getPathname, Link } from "@/i18n/navigation";

// A panel nézetei: belépés, regisztráció, elfelejtett jelszó.
type Mode = "login" | "register" | "forgot";
// A hibaüzenetek kulcsai (a szövegek a messages/*.json fájlok Layout.login.errors részében vannak).
type ErrorKey =
  | "invalidCredentials"
  | "userExists"
  | "passwordTooShort"
  | "passwordTooLong"
  | "passwordTooWeak"
  | "invalidEmail"
  | "tooMany"
  | "accountNotLinked"
  | "generic";

/** A Better Auth hibakódjából a felhasználónak szóló üzenet kulcsa. */
function errorKey(error: { code?: string; status?: number } | null | undefined): ErrorKey {
  if (error?.status === 429) return "tooMany";
  switch (error?.code?.toUpperCase()) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "invalidCredentials";
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "userExists";
    case "PASSWORD_TOO_SHORT":
      return "passwordTooShort";
    case "PASSWORD_TOO_LONG":
      return "passwordTooLong";
    case "PASSWORD_TOO_WEAK":
      return "passwordTooWeak";
    case "INVALID_EMAIL":
      return "invalidEmail";
    case "ACCOUNT_NOT_LINKED":
      return "accountNotLinked";
    default:
      return "generic";
  }
}

/**
 * Bejelentkezés ikon a fejlécben, kattintásra lenyíló panellel: belépés, regisztráció,
 * elfelejtett jelszó, Google / Apple, bejelentkezve pedig a fiók és a kijelentkezés.
 * A user értéke: undefined = még töltődik, null = vendég.
 */
export function LoginMenu({
  user,
  social,
}: {
  user: SessionUser | null | undefined;
  social: SocialProviders;
}) {
  const t = useTranslations("Layout.login");
  const locale = useLocale();
  const router = useRouter();
  // A panel állapota: nyitva van-e, melyik nézet, fut-e kérés, hiba- és visszajelző üzenet.
  const [open, setOpenState] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorKey | "socialMissing" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Ha a Google / Apple belépés hibával tért vissza (?error=...), a panel nyitva, az üzenettel.
  const returnedError = useOneTimeParam("error");
  const [returnHandled, setReturnHandled] = useState(false);
  const pendingReturn = Boolean(returnedError) && !returnHandled;
  const isOpen = open || pendingReturn;
  const shownError = error ?? (pendingReturn ? errorKey({ code: returnedError! }) : null);
  // Nyitás / zárás; egyben jelzi, hogy a visszatérési hibát már láttuk.
  function setOpen(next: boolean | ((o: boolean) => boolean)) {
    setReturnHandled(true);
    setOpenState(typeof next === "function" ? next(isOpen) : next);
  }

  // Nézetváltás (belépés ↔ regisztráció ↔ elfelejtett jelszó), az üzenetek törlésével.
  function switchMode(next: Mode) {
    setReturnHandled(true);
    setMode(next);
    setError(null);
    setNotice(null);
  }

  // Más helyről is megnyitható (pl. a vásárlás ablak „Jelentkezz be” gombjával): ilyenkor a belépés nézet nyílik.
  useEffect(() => {
    function onOpen() {
      setReturnHandled(true);
      setMode("login");
      setOpenState(true);
    }
    window.addEventListener(OPEN_LOGIN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_LOGIN_EVENT, onOpen);
  }, []);

  // Bezárás Esc-re vagy a panelen kívüli kattintásra; nyitáskor az első mezőre ugrik.
  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.querySelector<HTMLElement>("input, [data-autofocus]")?.focus();
    function close() {
      setReturnHandled(true);
      setOpenState(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    function onClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [isOpen, mode, user]);

  // Sikeres belépés vagy regisztráció után: panel bezárása, oldal frissítése.
  function finishSignIn() {
    setOpen(false);
    switchMode("login");
    router.refresh(); // a fejléc és a haladás-szinkron megkapja a bejelentkezett felhasználót
  }

  // Az űrlap elküldése: a nézettől függően belépés, regisztráció vagy jelszó-visszaállító link kérése.
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (mode === "register" && !isPasswordValid(password)) {
      setError("passwordTooWeak");
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    setReturnHandled(true);
    try {
      if (mode === "login") {
        const { error } = await authClient.signIn.email({
          email,
          password,
          rememberMe: form.get("remember") === "on",
        });
        if (error) setError(errorKey(error));
        else finishSignIn();
      } else if (mode === "register") {
        const { error } = await authClient.signUp.email({
          name: String(form.get("name") ?? "").trim(),
          email,
          password,
        });
        if (error) setError(errorKey(error));
        else finishSignIn();
      } else {
        const redirectTo =
          window.location.origin + getPathname({ href: "/reset-password", locale });
        const { error } = await authClient.requestPasswordReset({ email, redirectTo });
        if (error) setError(errorKey(error));
        else setNotice(t("forgotSent"));
      }
    } catch {
      setError("generic");
    } finally {
      setBusy(false);
    }
  }

  // Belépés Google- vagy Apple-fiókkal (csak ha be vannak állítva a kulcsok).
  async function signInWith(provider: "google" | "apple") {
    if (!social[provider]) {
      setError("socialMissing");
      return;
    }
    setBusy(true);
    setError(null);
    // A szolgáltató oldalára visz, majd ugyanide tér vissza.
    const back = window.location.pathname;
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: back,
      errorCallbackURL: back,
    });
    if (error) {
      setError(errorKey(error));
      setBusy(false);
    }
  }

  // Kijelentkezés: előbb a még el nem küldött haladás és idő mentése, utána a böngészőből törlődik,
  // végül a főoldalra visz.
  async function signOut() {
    setBusy(true);
    await Promise.all([flushProgress(), flushActivity()]);
    await authClient.signOut();
    disconnectAccount();
    setBusy(false);
    setOpen(false);
    // Mindig a főoldalra visz (a jelenlegi nyelven), és frissíti a fejlécet vendég-állapotra.
    router.push(getPathname({ href: "/", locale }));
    router.refresh();
  }

  // A panel címe az állapottól függően.
  const title =
    user != null
      ? t("accountTitle")
      : mode === "register"
        ? t("registerTitle")
        : mode === "forgot"
          ? t("forgotTitle")
          : t("title");

  return (
    <div ref={rootRef} className="sm:relative">
      {/* Fejléc gomb: vendégként ember ikon, bejelentkezve a név kezdőbetűje */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        // Súgó-buborék egérrel fölé érve (lenyitott panelnél nem látszik, lásd globals.css).
        data-tooltip={user ? t("openAccount") : t("open")}
        className={
          "relative inline-flex size-9 items-center justify-center rounded-md border transition-colors " +
          (isOpen
            ? "border-accent bg-accent-soft text-accent"
            : user
              ? "border-accent text-accent hover:bg-surface-hover"
              : "border-line text-muted hover:bg-surface-hover hover:text-fg")
        }
      >
        <span className="sr-only">{user ? t("openAccount") : t("open")}</span>
        {user ? (
          <span aria-hidden="true" className="font-mono text-sm font-bold">
            {initial(user)}
          </span>
        ) : (
          <UserIcon />
        )}
      </button>

      {/* A lenyíló panel */}
      {isOpen && (
        <div
          ref={panelRef}
          id={`${id}-panel`}
          role="dialog"
          aria-labelledby={`${id}-title`}
          className="absolute inset-x-4 top-full z-30 mt-2 rounded-lg border border-line bg-surface p-5 shadow-2xl shadow-black/40 sm:inset-x-auto sm:right-0 sm:w-96"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 id={`${id}-title`} className="text-lg">
              {title}
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

          {user === undefined ? (
            <p className="text-sm text-muted">{t("busy")}</p>
          ) : user ? (
            <div className="grid gap-4">
              <div className="grid gap-0.5 text-sm">
                <span className="text-muted">{t("signedInAs")}</span>
                <span className="font-semibold text-fg">{user.name}</span>
                <span className="break-all text-muted">{user.email}</span>
              </div>
              {/* A fiók menüpontjai: Profil és Tananyagaim */}
              <nav aria-label={t("accountTitle")} className="grid gap-1">
                <Link
                  href="/profile"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className={menuItemClass}
                >
                  <ProfileIcon />
                  {t("profile")}
                </Link>
                <Link href="/my-courses" onClick={() => setOpen(false)} className={menuItemClass}>
                  <BookIcon />
                  {t("myCourses")}
                </Link>
              </nav>
              <p className="text-xs text-muted">{t("synced")}</p>
              <button
                type="button"
                disabled={busy}
                onClick={signOut}
                className="rounded-md border border-line px-4 py-2.5 text-sm transition-colors hover:border-accent hover:bg-surface-hover disabled:opacity-60"
              >
                {busy ? t("busy") : t("signOut")}
              </button>
            </div>
          ) : (
            <>
              <form
                key={mode}
                className="grid gap-3"
                onSubmit={onSubmit}
                onChange={() => shownError && setError(null)}
              >
                {mode === "forgot" && <p className="text-sm text-muted">{t("forgotIntro")}</p>}
                {mode === "register" && (
                  <Field label={t("name")}>
                    <input
                      name="name"
                      required
                      maxLength={100}
                      autoComplete="name"
                      className={inputClass}
                    />
                  </Field>
                )}
                <Field label={t("email")}>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete={mode === "login" ? "username" : "email"}
                    className={inputClass}
                  />
                </Field>
                {mode !== "forgot" && (
                  <PasswordField
                    label={t("password")}
                    name="password"
                    autoComplete={mode === "register" ? "new-password" : "current-password"}
                    withStrength={mode === "register"}
                  />
                )}
                {mode === "login" && (
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <label className="flex cursor-pointer items-center gap-2 text-muted hover:text-fg">
                      <input
                        type="checkbox"
                        name="remember"
                        defaultChecked
                        className="size-4 accent-[var(--accent)]"
                      />
                      {t("remember")}
                    </label>
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="text-accent hover:underline"
                    >
                      {t("forgot")}
                    </button>
                  </div>
                )}
                {shownError && (
                  <p role="alert" className="text-sm text-[var(--danger,#e5534b)]">
                    {shownError === "socialMissing"
                      ? t("socialMissing")
                      : t(`errors.${shownError}`)}
                  </p>
                )}
                {notice && (
                  <p role="status" className="text-sm text-accent">
                    {notice}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-1 rounded-md bg-accent px-4 py-2.5 font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {busy
                    ? t("busy")
                    : mode === "register"
                      ? t("registerSubmit")
                      : mode === "forgot"
                        ? t("forgotSubmit")
                        : t("submit")}
                </button>
              </form>

              {mode === "forgot" ? (
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="mt-3 text-sm text-accent hover:underline"
                >
                  {t("back")}
                </button>
              ) : (
                <>
                  <div className="my-4 flex items-center gap-3 text-xs text-muted">
                    <span className="h-px flex-1 bg-line" />
                    {t("or")}
                    <span className="h-px flex-1 bg-line" />
                  </div>

                  {/* Csak ikonok, egymás mellett; a feliratot a képernyőolvasó és az egérrel rámutatás adja. */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => signInWith("google")}
                      className={socialClass}
                      aria-label={t("google")}
                      title={t("google")}
                    >
                      <GoogleIcon />
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => signInWith("apple")}
                      className={socialClass}
                      aria-label={t("apple")}
                      title={t("apple")}
                    >
                      <AppleIcon />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => switchMode(mode === "login" ? "register" : "login")}
                    className="mt-3 w-full rounded-md border border-dashed border-line px-4 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:bg-surface-hover hover:text-fg"
                  >
                    {mode === "login" ? t("registerPrefix") : t("haveAccountPrefix")}{" "}
                    <span className="font-semibold text-accent">
                      {mode === "login" ? t("register") : t("haveAccount")}
                    </span>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/** A név (vagy e-mail) első betűje a fejléc gombján bejelentkezve. */
function initial(user: SessionUser) {
  return (user.name.trim() || user.email).charAt(0).toLocaleUpperCase();
}

/** Felirat és beviteli mező egy címkében (a feliratra kattintva a mezőbe ugrik). */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}

// Közös stílusok: szöveges mezők, illetve a Google / Apple gombok.
const inputClass =
  "rounded-md border border-line bg-bg px-3 py-2 text-fg outline-none focus:border-accent";

// A fiók menüpontjainak stílusa.
const menuItemClass =
  "flex items-center gap-3 rounded-md border border-line px-3 py-2.5 text-sm text-fg transition-colors hover:border-accent hover:bg-surface-hover";

const socialClass =
  "flex flex-1 items-center justify-center rounded-md border border-line bg-bg py-2.5 text-fg transition-colors hover:border-accent hover:bg-surface-hover disabled:opacity-60";

// Ikonok (SVG rajzok).
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

function ProfileIcon() {
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
      className="shrink-0 text-accent"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="11" r="2.5" />
      <path d="M5.5 17a3.5 3.5 0 0 1 7 0M15 10h3M15 14h3" />
    </svg>
  );
}

function BookIcon() {
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
      className="shrink-0 text-accent"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
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
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
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
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

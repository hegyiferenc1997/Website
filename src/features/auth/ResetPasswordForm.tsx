"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { authClient } from "./client";
import { PasswordField } from "./PasswordField";
import { isPasswordValid } from "./shared";
import { useOneTimeParam } from "./url-param";

// Az űrlap állapotai: kész, folyamatban, sikeres, érvénytelen link, nem egyező jelszavak, gyenge jelszó, egyéb hiba.
type State = "ready" | "busy" | "done" | "invalid" | "mismatch" | "weak" | "error";

/** Új jelszó megadása a linkben kapott kóddal. A kód csak a böngészőben olvasható ki a címből. */
export function ResetPasswordForm() {
  const t = useTranslations("ResetPasswordPage");
  const tl = useTranslations("Layout.login");
  // A kódot a címből olvassuk ki, és rögtön ki is vesszük onnan (ne maradjon az előzményekben).
  const token = useOneTimeParam("token");
  const linkError = useOneTimeParam("error");
  const [submitState, setState] = useState<State>("ready");
  const state: State | "loading" =
    token === undefined ? "loading" : !token || linkError ? "invalid" : submitState;

  // Elküldés: előbb helyben ellenőrizzük a jelszót, aztán a szerver beállítja az újat.
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    if (!isPasswordValid(password)) {
      setState("weak");
      return;
    }
    if (password !== String(form.get("confirm") ?? "")) {
      setState("mismatch");
      return;
    }
    setState("busy");
    const { error } = await authClient.resetPassword({ newPassword: password, token: token! });
    if (!error) setState("done");
    else if (error.code === "INVALID_TOKEN") setState("invalid");
    else if (error.code === "PASSWORD_TOO_WEAK") setState("weak");
    else setState("error");
  }

  // Amíg a kódot kiolvassuk a címből, csak egy „Folyamatban…” felirat látszik.
  if (state === "loading") return <p className="text-sm text-muted">{tl("busy")}</p>;
  // Siker vagy érvénytelen link esetén egy üzenet és egy link a főoldalra.
  if (state === "done" || state === "invalid") {
    return (
      <div className="grid gap-4 text-sm">
        <p
          role="status"
          className={state === "done" ? "text-accent" : "text-[var(--danger,#e5534b)]"}
        >
          {state === "done" ? t("success") : t("invalidToken")}
        </p>
        <Link href="/" className="text-accent hover:underline">
          {t("home")}
        </Link>
      </div>
    );
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={onSubmit}
      onChange={() => submitState !== "busy" && setState("ready")}
    >
      <PasswordField
        label={t("password")}
        name="password"
        autoComplete="new-password"
        withStrength
      />
      <PasswordField label={t("confirm")} name="confirm" autoComplete="new-password" />
      {(state === "mismatch" || state === "weak" || state === "error") && (
        <p role="alert" className="text-sm text-[var(--danger,#e5534b)]">
          {state === "mismatch"
            ? t("mismatch")
            : state === "weak"
              ? tl("errors.passwordTooWeak")
              : tl("errors.generic")}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "busy"}
        className="mt-1 rounded-md bg-accent px-4 py-2.5 font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "busy" ? tl("busy") : t("submit")}
      </button>
    </form>
  );
}

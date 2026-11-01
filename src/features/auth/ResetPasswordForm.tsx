"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { authClient } from "./client";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "./shared";
import { useOneTimeParam } from "./url-param";

type State = "ready" | "busy" | "done" | "invalid" | "mismatch" | "error";

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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password !== String(form.get("confirm") ?? "")) {
      setState("mismatch");
      return;
    }
    setState("busy");
    const { error } = await authClient.resetPassword({ newPassword: password, token: token! });
    if (!error) setState("done");
    else if (error.code === "INVALID_TOKEN") setState("invalid");
    else setState("error");
  }

  if (state === "loading") return <p className="text-sm text-muted">{tl("busy")}</p>;
  if (state === "done" || state === "invalid") {
    return (
      <div className="grid gap-4 text-sm">
        <p role="status" className={state === "done" ? "text-accent" : "text-red-500"}>
          {state === "done" ? t("success") : t("invalidToken")}
        </p>
        <Link href="/" className="text-accent hover:underline">
          {t("home")}
        </Link>
      </div>
    );
  }

  const inputClass =
    "rounded-md border border-line bg-bg px-3 py-2 text-fg outline-none focus:border-accent";
  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      {(["password", "confirm"] as const).map((name) => (
        <label key={name} className="grid gap-1.5 text-sm">
          <span className="text-muted">{t(name)}</span>
          <input
            name={name}
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            maxLength={MAX_PASSWORD_LENGTH}
            autoComplete="new-password"
            className={inputClass}
          />
          {name === "password" && (
            <span className="text-xs text-muted">
              {tl("passwordHint", { min: MIN_PASSWORD_LENGTH })}
            </span>
          )}
        </label>
      ))}
      {(state === "mismatch" || state === "error") && (
        <p role="alert" className="text-sm text-red-500">
          {state === "mismatch" ? t("mismatch") : tl("errors.generic")}
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

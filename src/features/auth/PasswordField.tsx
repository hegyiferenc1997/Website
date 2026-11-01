"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import {
  checkPassword,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  PASSWORD_RULES,
  passwordStrength,
} from "./shared";

const inputClass =
  "w-full rounded-md border border-line bg-bg py-2 pr-10 pl-3 text-fg outline-none focus:border-accent";

/** Erősség szerinti szín a csíkhoz: gyenge piros, közepes sárga, jó és erős türkiz. */
const levelColor = ["", "bg-danger", "bg-highlight", "bg-accent", "bg-accent"] as const;
const levelText = ["", "text-danger", "text-highlight", "text-accent", "text-accent"] as const;
const levelKey = ["", "weak", "fair", "good", "strong"] as const;

/**
 * Jelszómező „szem” gombbal (megjelenítés / elrejtés). Új jelszónál (withStrength)
 * alatta erősségjelző csík és a kötelező szabályok listája, élőben pipálva.
 */
export function PasswordField({
  label,
  name,
  autoComplete,
  withStrength = false,
}: {
  label: string;
  name: string;
  autoComplete: "current-password" | "new-password";
  withStrength?: boolean;
}) {
  const t = useTranslations("Layout.login");
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const id = useId();
  const checks = checkPassword(value);
  const strength = passwordStrength(value);

  return (
    <div className="grid gap-1.5 text-sm">
      <label htmlFor={id} className="text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={withStrength ? MIN_PASSWORD_LENGTH : undefined}
          maxLength={MAX_PASSWORD_LENGTH}
          autoComplete={autoComplete}
          aria-describedby={withStrength ? `${id}-rules` : undefined}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          aria-pressed={visible}
          title={visible ? t("hidePassword") : t("showPassword")}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted transition-colors hover:text-fg"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {withStrength && (
        <div className="grid gap-2 pt-0.5">
          <div className="flex items-center gap-2.5">
            <span
              className="grid flex-1 grid-cols-4 gap-1"
              role="meter"
              aria-label={t("strength.label")}
              aria-valuemin={0}
              aria-valuemax={4}
              aria-valuenow={strength}
              aria-valuetext={strength ? t(`strength.${levelKey[strength]}`) : undefined}
            >
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={
                    "h-1.5 rounded-full transition-colors " +
                    (i <= strength ? levelColor[strength] : "bg-line")
                  }
                />
              ))}
            </span>
            <span
              aria-hidden="true"
              className={"w-14 text-right font-mono text-xs " + levelText[strength]}
            >
              {strength ? t(`strength.${levelKey[strength]}`) : ""}
            </span>
          </div>
          <ul id={`${id}-rules`} className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            {PASSWORD_RULES.map((rule) => (
              <li
                key={rule}
                className={
                  "flex items-center gap-1.5 " + (checks[rule] ? "text-accent" : "text-muted")
                }
              >
                <span aria-hidden="true" className="w-3 font-mono">
                  {checks[rule] ? "✓" : "○"}
                </span>
                {t(`rules.${rule}`, { min: MIN_PASSWORD_LENGTH })}
                <span className="sr-only">{checks[rule] ? t("ruleMet") : t("ruleMissing")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EyeIcon() {
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
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
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
      <path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.6 3.6M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7c1.9 0 3.6-.6 5-1.5" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

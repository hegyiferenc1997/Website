"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { openLoginPanel } from "@/features/auth/open-login";
import { startCheckoutAction } from "./actions";
import { BEST_PLAN, formatHuf, MIN_PRICE_HUF, PLANS, type Plan } from "./plans";

// „Megvásárlás” gomb egy félévhez, és a kattintásra megnyíló ablak a három csomaggal.
// Ha a félév már aktív, a gomb helyett zöld „Aktív … -ig” címke és „Hosszabbítás” látszik.

/** Melyik félév, ki nézi, és meddig aktív (ha aktív). */
type Props = {
  university: string;
  semester: number;
  /** A félév neve az ablak címéhez, pl. „1. félév”. */
  semesterTitle: string;
  signedIn: boolean;
  /** Az aktív hozzáférés lejárata már formázva (pl. „2027. 05. 01.”), vagy null, ha nincs. */
  activeUntil: string | null;
  /** "compact": a félév fejlécében; "large": nagy gomb (pl. a zárolt lecke helyén). */
  size?: "compact" | "large";
};

/** A félév vásárló gombja (vagy aktív címkéje) a csomagválasztó ablakkal. */
export function BuyButton({
  university,
  semester,
  semesterTitle,
  signedIn,
  activeUntil,
  size = "compact",
}: Props) {
  const t = useTranslations("Payments");
  const locale = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      {activeUntil ? (
        // Aktív félév: zöld címke a lejárattal, mellette kis „Hosszabbítás” gomb.
        <span className="flex flex-wrap items-center gap-2">
          <span className="whitespace-nowrap rounded-md border border-accent px-2 py-1 font-mono text-xs text-accent">
            ✓ {t("activeUntil", { date: activeUntil })}
          </span>
          <button
            type="button"
            onClick={open}
            className="whitespace-nowrap rounded-md px-2 py-1 font-mono text-xs text-muted underline-offset-2 transition-colors hover:text-accent hover:underline"
          >
            {t("extend")}
          </button>
        </span>
      ) : (
        // Nincs hozzáférés: kiemelt gomb a legolcsóbb árral.
        <button
          type="button"
          onClick={open}
          className={
            "inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-accent font-mono font-medium text-accent-fg transition-opacity hover:opacity-90 " +
            (size === "large" ? "px-5 py-2.5 text-sm" : "px-3 py-1.5 text-xs")
          }
        >
          <span aria-hidden="true">🔓</span>
          {t("buy")}
          <span className="font-normal opacity-80">
            · {t("fromPrice", { price: formatHuf(MIN_PRICE_HUF, locale) })}
          </span>
        </button>
      )}

      {/* A csomagválasztó ablak (natív <dialog>: Esc-re és a háttérre kattintva is bezárul). */}
      <dialog
        ref={dialogRef}
        aria-labelledby={`buy-title-${university}-${semester}`}
        onClick={(e) => {
          // Kattintás a sötét háttérre (magára a dialog elemre, nem a tartalmára) → bezárás.
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto w-[min(56rem,calc(100vw-2rem))] rounded-xl border border-line bg-bg p-0 text-fg backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="grid gap-6 p-6 sm:p-8">
          <header className="flex items-start justify-between gap-4">
            <div className="grid gap-1.5">
              <p className="font-mono text-xs text-accent">
                {"// "}
                {t("dialogEyebrow")}
              </p>
              <h2 id={`buy-title-${university}-${semester}`} className="text-2xl">
                {t("dialogTitle", { semester: semesterTitle })}
              </h2>
              <p className="max-w-xl text-sm text-muted">{t("dialogText")}</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              data-tooltip={t("close")}
              className="rounded-md px-2 py-1 font-mono text-muted transition-colors hover:bg-surface-hover hover:text-fg"
            >
              ✕
            </button>
          </header>

          {activeUntil && (
            <p className="rounded-md border border-accent/40 bg-accent-soft px-4 py-2.5 text-sm text-fg">
              {t("extendNote", { date: activeUntil })}
            </p>
          )}

          {/* A három csomag kártyája */}
          <ul className="grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => (
              <li key={plan.id}>
                <PlanCard
                  plan={plan}
                  university={university}
                  semester={semester}
                  signedIn={signedIn}
                  onSignIn={() => {
                    close();
                    openLoginPanel();
                  }}
                />
              </li>
            ))}
          </ul>

          <p className="text-center font-mono text-xs text-muted">{t("mockNote")}</p>
        </div>
      </dialog>
    </>
  );
}

/** Egy csomag kártyája: név, rövid leírás, ár, napi ár és a vásárlás gomb. */
function PlanCard({
  plan,
  university,
  semester,
  signedIn,
  onSignIn,
}: {
  plan: Plan;
  university: string;
  semester: number;
  signedIn: boolean;
  onSignIn: () => void;
}) {
  const t = useTranslations("Payments");
  const locale = useLocale();
  // A jelenlegi oldal címe: a fizetés után ide tér vissza a felhasználó.
  const pathname = usePathname();
  const best = plan.id === BEST_PLAN;
  return (
    <form
      action={startCheckoutAction}
      className={
        "relative grid h-full content-start gap-4 rounded-lg border bg-surface p-5 " +
        (best ? "border-accent shadow-[0_0_0_1px_var(--accent)]" : "border-line")
      }
    >
      {/* Rejtett mezők: melyik egyetem, félév, csomag, és hova térjünk vissza */}
      <input type="hidden" name="university" value={university} />
      <input type="hidden" name="semester" value={semester} />
      <input type="hidden" name="plan" value={plan.id} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="back" value={pathname} />

      {best && (
        <span className="absolute -top-2.5 left-5 rounded bg-accent px-2 py-0.5 font-mono text-[0.7rem] font-medium text-accent-fg">
          {t("bestValue")}
        </span>
      )}
      <div className="grid gap-1">
        <h3 className="font-mono text-base font-bold text-highlight">
          {t(`plans.${plan.id}.name`)}
        </h3>
        <p className="text-sm text-muted">{t(`plans.${plan.id}.tagline`)}</p>
      </div>
      <div className="grid gap-0.5">
        <p className="flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-bold tabular-nums">
            {formatHuf(plan.priceHuf, locale)}
          </span>
          <span className="whitespace-nowrap text-sm text-muted">
            / {t("days", { days: plan.days })}
          </span>
        </p>
        <p className="font-mono text-xs text-muted">
          {t("perDay", { price: formatHuf(Math.round(plan.priceHuf / plan.days), locale) })}
        </p>
      </div>
      {signedIn ? (
        <SubmitButton best={best} label={t("choose")} pending={t("redirecting")} />
      ) : (
        <button
          type="button"
          onClick={onSignIn}
          className="rounded-md border border-line px-4 py-2 font-mono text-sm text-fg transition-colors hover:border-accent hover:text-accent"
        >
          {t("signInToBuy")}
        </button>
      )}
    </form>
  );
}

/** A csomag kiválasztása gomb; küldés közben letiltva, „Átirányítás…” felirattal. */
function SubmitButton({ best, label, pending }: { best: boolean; label: string; pending: string }) {
  const status = useFormStatus();
  return (
    <button
      type="submit"
      disabled={status.pending}
      className={
        "rounded-md px-4 py-2 font-mono text-sm font-medium transition-opacity disabled:cursor-wait disabled:opacity-60 " +
        (best
          ? "bg-accent text-accent-fg hover:opacity-90"
          : "border border-accent text-accent hover:bg-accent-soft")
      }
    >
      {status.pending ? pending : label}
    </button>
  );
}

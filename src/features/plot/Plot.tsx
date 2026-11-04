"use client";

import { useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { compileMath } from "@/features/math/expr";
import { derivative, integrate, niceStep, type PlotSpec } from "./spec";

// Interaktív függvényábra a leckékben (```plot blokk): görbék, érintő, terület, Riemann-összeg,
// sorozatpontok, csúszkákkal állítható paraméterekkel. SVG-ben rajzol; a szerver a kezdőállapotot
// már kész ábraként küldi (nincs villanás), a csúszkák mozgatásakor a böngésző rajzol újra.

// Az ábra mérete (SVG egységben; a szélesség a dobozhoz igazodik).
const W = 640;
const H = 380;
const PAD = 28;

// A görbék színei sorban (lásd globals.css: --plot-1 … --plot-5).
const COLORS = [
  "var(--plot-1)",
  "var(--plot-2)",
  "var(--plot-3)",
  "var(--plot-4)",
  "var(--plot-5)",
];

// Szám kiírása a feliratokban: legfeljebb 4 tizedes, fölösleges nullák nélkül.
function fmt(v: number): string {
  if (!Number.isFinite(v)) return "—";
  const r = Math.abs(v) < 1e-10 ? 0 : v;
  return String(Number(r.toFixed(4)));
}

/** Egy interaktív ábra. */
export function Plot({ spec }: { spec: PlotSpec }) {
  const t = useTranslations("Plot");
  const initial = useMemo(
    () => Object.fromEntries(spec.params.map((p) => [p.name, p.value])),
    [spec.params],
  );
  const [values, setValues] = useState<Record<string, number>>(initial);
  const names = spec.params.map((p) => p.name);
  // Egyedi azonosító a levágó maszkhoz (egy leckében több ábra is lehet).
  const clipId = "plot-clip-" + useId().replace(/[^a-zA-Z0-9]/g, "");

  // A kifejezések egyszer fordulnak le (a csúszkák csak az értékeket váltják).
  const compiled = useMemo(
    () =>
      spec.items.map((it) => {
        if (it.kind === "seq") return { main: compileMath(it.expr, ["n", ...names]) };
        if (it.kind === "point")
          return { px: compileMath(it.x, names), py: compileMath(it.y, names) };
        if (it.kind === "value") return { main: compileMath(it.expr, names) };
        return {
          main: compileMath(it.expr, ["x", ...names]),
          at: it.kind === "tangent" ? compileMath(it.at, names) : undefined,
          from: "from" in it ? compileMath(it.from, names) : undefined,
          to: "to" in it ? compileMath(it.to, names) : undefined,
          n: "n" in it && it.n ? compileMath(it.n, names) : undefined,
        };
      }),
    // A spec a szerverről jön, és nem változik.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [spec],
  );

  const [x0, x1] = spec.x;
  const [y0, y1] = spec.y;
  // Koordináta → SVG pont (1 tizedesre kerekítve, hogy a szerver és a böngésző ugyanazt írja).
  const sx = (x: number) => +(PAD + ((x - x0) / (x1 - x0)) * (W - 2 * PAD)).toFixed(1);
  const sy = (y: number) => +(H - PAD - ((y - y0) / (y1 - y0)) * (H - 2 * PAD)).toFixed(1);
  // Ennyire nyúlhat ki egy görbe az ábrából, mielőtt levágjuk (a meredek szakaszokhoz).
  const yRange = y1 - y0;

  // Egy függvény görbéje SVG útvonalként; szakadásnál (NaN, nagy ugrás) új szakasz kezdődik.
  function curvePath(f: (x: number) => number, a = x0, b = x1, steps = 480): string {
    let d = "";
    let prev: number | null = null;
    for (let i = 0; i <= steps; i++) {
      const x = a + ((b - a) * i) / steps;
      const y = f(x);
      if (!Number.isFinite(y) || y < y0 - 4 * yRange || y > y1 + 4 * yRange) {
        prev = null;
        continue;
      }
      const jump = prev !== null && Math.abs(y - prev) > 2 * yRange;
      d += `${prev === null || jump ? "M" : "L"}${sx(x)} ${sy(y)}`;
      prev = y;
    }
    return d;
  }

  // Rácsvonalak és tengelyfeliratok.
  const gx = niceStep(x1 - x0);
  const gy = niceStep(y1 - y0);
  const ticks = (lo: number, hi: number, step: number) => {
    const out: number[] = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
    return out;
  };
  const xs = ticks(x0, x1, gx);
  const ys = ticks(y0, y1, gy);
  const axisY = y0 <= 0 && y1 >= 0 ? sy(0) : sy(y0);
  const axisX = x0 <= 0 && x1 >= 0 ? sx(0) : sx(x0);

  // A kiírandó számértékek (érintő meredeksége, terület, összeg, value sorok).
  const readouts: { label: string; value: string; color: string }[] = [];
  // A kirajzolt elemek.
  const shapes: React.ReactNode[] = [];
  // A feliratos görbék a jelmagyarázathoz.
  const legend: { label: string; color: string; dashed: boolean }[] = [];
  let colorIndex = 0;

  spec.items.forEach((it, i) => {
    const c = compiled[i];
    const color = COLORS[colorIndex % COLORS.length];
    if (it.kind === "value") {
      readouts.push({ label: it.label, value: fmt(c.main!(values)), color: "var(--fg)" });
      return;
    }
    if (it.kind === "point") {
      const px = c.px!(values);
      const py = c.py!(values);
      if (Number.isFinite(px) && Number.isFinite(py))
        shapes.push(
          <g key={i}>
            <circle cx={sx(px)} cy={sy(py)} r={4.5} fill="var(--highlight)" />
            {it.label && (
              <text x={sx(px) + 7} y={sy(py) - 7} className="plot-label" fill="var(--highlight)">
                {it.label}
              </text>
            )}
          </g>,
        );
      return;
    }
    colorIndex++;
    if (it.kind === "seq") {
      const dots: React.ReactNode[] = [];
      for (let n = it.from; n <= it.to; n++) {
        const y = c.main!({ ...values, n });
        if (Number.isFinite(y) && y >= y0 && y <= y1)
          dots.push(<circle key={n} cx={sx(n)} cy={sy(y)} r={3} fill={color} />);
      }
      shapes.push(<g key={i}>{dots}</g>);
      if (it.label) legend.push({ label: it.label, color, dashed: false });
      return;
    }
    const f = (x: number) => c.main!({ ...values, x });
    if (it.kind === "f" || it.kind === "dash") {
      shapes.push(
        <path
          key={i}
          d={curvePath(f)}
          fill="none"
          stroke={color}
          strokeWidth={it.kind === "dash" ? 1.5 : 2.5}
          strokeDasharray={it.kind === "dash" ? "6 5" : undefined}
          opacity={it.kind === "dash" ? 0.7 : 1}
        />,
      );
      if (it.label) legend.push({ label: it.label, color, dashed: it.kind === "dash" });
      return;
    }
    if (it.kind === "tangent") {
      const a = c.at!(values);
      const fa = f(a);
      const m = derivative(f, a);
      shapes.push(
        <g key={i}>
          <path d={curvePath(f)} fill="none" stroke={color} strokeWidth={2.5} />
          {Number.isFinite(fa) && Number.isFinite(m) && (
            <>
              <path
                d={curvePath((x) => fa + m * (x - a), x0, x1, 2)}
                fill="none"
                stroke="var(--highlight)"
                strokeWidth={1.75}
              />
              <circle cx={sx(a)} cy={sy(fa)} r={4.5} fill="var(--highlight)" />
            </>
          )}
        </g>,
      );
      if (it.label) legend.push({ label: it.label, color, dashed: false });
      readouts.push({ label: t("slope", { x: fmt(a) }), value: fmt(m), color: "var(--highlight)" });
      return;
    }
    // Terület vagy Riemann-összeg.
    const a = c.from!(values);
    const b = c.to!(values);
    const lo = Math.max(Math.min(a, b), x0);
    const hi = Math.min(Math.max(a, b), x1);
    const parts: React.ReactNode[] = [];
    if (it.kind === "area") {
      // Kitöltött sokszög a görbe és az x tengely között.
      let d = `M${sx(lo)} ${sy(0)}`;
      const steps = 240;
      for (let k = 0; k <= steps; k++) {
        const x = lo + ((hi - lo) * k) / steps;
        const y = Math.max(Math.min(f(x), y1 + yRange), y0 - yRange);
        if (Number.isFinite(y)) d += `L${sx(x)} ${sy(y)}`;
      }
      d += `L${sx(hi)} ${sy(0)}Z`;
      parts.push(<path key="a" d={d} fill={color} opacity={0.22} />);
      readouts.push({
        label: t("area", { a: fmt(a), b: fmt(b) }),
        value: fmt(integrate(f, a, b)),
        color,
      });
    } else {
      // Téglalapok a felezőpontbeli függvényértékkel.
      const n = Math.max(1, Math.min(200, Math.round(c.n!(values))));
      const h = (b - a) / n;
      let total = 0;
      for (let k = 0; k < n; k++) {
        const left = a + k * h;
        const y = f(left + h / 2);
        if (!Number.isFinite(y)) continue;
        total += y * h;
        const top = Math.max(Math.min(y, y1 + yRange), y0 - yRange);
        parts.push(
          <rect
            key={k}
            x={Math.min(sx(left), sx(left + h))}
            y={Math.min(sy(top), sy(0))}
            width={Math.abs(sx(left + h) - sx(left))}
            height={Math.abs(sy(0) - sy(top))}
            fill={color}
            fillOpacity={0.2}
            stroke={color}
            strokeWidth={0.75}
          />,
        );
      }
      readouts.push({ label: t("riemann", { n }), value: fmt(total), color });
      readouts.push({
        label: t("area", { a: fmt(a), b: fmt(b) }),
        value: fmt(integrate(f, a, b)),
        color: "var(--muted)",
      });
    }
    shapes.push(
      <g key={i}>
        {parts}
        <path d={curvePath(f)} fill="none" stroke={color} strokeWidth={2.5} />
      </g>,
    );
    if (it.label) legend.push({ label: it.label, color, dashed: false });
  });

  const changed = spec.params.some((p) => values[p.name] !== p.value);

  return (
    <figure className="code-block plot-block" data-role="plot">
      <div className="code-label py-toolbar">
        <span>
          {t("label")}
          {spec.title && <> · {spec.title}</>}
        </span>
        {spec.params.length > 0 && (
          <span className="py-actions">
            <button
              type="button"
              className="quiz-btn"
              onClick={() => setValues(initial)}
              disabled={!changed}
            >
              ↺ {t("reset")}
            </button>
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="plot-svg"
        role="img"
        aria-label={spec.title ?? t("label")}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} />
          </clipPath>
        </defs>
        {/* Rács */}
        <g className="plot-grid">
          {xs.map((v) => (
            <line key={"x" + v} x1={sx(v)} x2={sx(v)} y1={PAD} y2={H - PAD} />
          ))}
          {ys.map((v) => (
            <line key={"y" + v} x1={PAD} x2={W - PAD} y1={sy(v)} y2={sy(v)} />
          ))}
        </g>
        {/* Tengelyek és számok */}
        <g className="plot-axis">
          <line x1={PAD} x2={W - PAD} y1={axisY} y2={axisY} />
          <line x1={axisX} x2={axisX} y1={PAD} y2={H - PAD} />
        </g>
        <g className="plot-ticks">
          {xs.map((v) =>
            v === 0 ? null : (
              <text key={"tx" + v} x={sx(v)} y={axisY + 14} textAnchor="middle">
                {fmt(v)}
              </text>
            ),
          )}
          {ys.map((v) =>
            v === 0 ? null : (
              <text key={"ty" + v} x={axisX - 5} y={sy(v) + 4} textAnchor="end">
                {fmt(v)}
              </text>
            ),
          )}
        </g>
        <g clipPath={`url(#${clipId})`}>{shapes}</g>
      </svg>

      {(legend.length > 0 || spec.params.length > 0 || readouts.length > 0) && (
        <figcaption className="plot-controls">
          {legend.length > 0 && (
            <ul className="plot-legend">
              {legend.map((l, i) => (
                <li key={i}>
                  <span
                    className="plot-swatch"
                    style={{ borderColor: l.color, borderStyle: l.dashed ? "dashed" : "solid" }}
                  />
                  {l.label}
                </li>
              ))}
            </ul>
          )}
          {spec.params.map((p) => (
            <label key={p.name} className="plot-slider">
              <span className="plot-param">
                {p.name} = <b>{fmt(values[p.name])}</b>
              </span>
              <input
                type="range"
                min={p.min}
                max={p.max}
                step={p.step}
                value={values[p.name]}
                onChange={(e) => setValues((v) => ({ ...v, [p.name]: Number(e.target.value) }))}
              />
            </label>
          ))}
          {readouts.length > 0 && (
            <dl className="plot-readouts">
              {readouts.map((r, i) => (
                <div key={i}>
                  <dt>{r.label}</dt>
                  <dd style={{ color: r.color }}>{r.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </figcaption>
      )}
    </figure>
  );
}

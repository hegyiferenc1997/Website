// A leckék interaktív függvényábráinak (```plot blokk) leírása és feldolgozása.
// Tiszta függvények: a szerver (Markdown → darabok), a böngésző (rajzolás) és a tesztek is ezt használják.
//
// Példa:
//   title: Az eltolt parabola
//   x: -5, 5
//   y: -2, 8
//   param: a = 1, -3, 3, 0.1        (név = kezdőérték, min, max, lépésköz → csúszka)
//   f: a*(x - c)^2 # f(x)           (görbe; a # után a felirat)
//   dash: x^2 # alap                (szaggatott görbe)
//   tangent: x^2 @ t                (érintő az x = t pontban, a meredekség kiírásával)
//   area: x^2 @ 0, b                (terület a görbe alatt a és b között, az integrál értékével)
//   riemann: x^2 @ 0, b, n          (n téglalapos közelítő összeg, felezőpontokkal)
//   seq: 1/n @ 1, 30                (sorozat pontjai: (n, aₙ), n = 1 … 30)
//   point: t, t^2 # P               (pont)
//   value: f(t) = t^2               (kiírt érték a csúszkák alatt)

import { parseMath } from "@/features/math/expr";

/** Egy csúszka (paraméter). */
export type PlotParam = { name: string; value: number; min: number; max: number; step: number };

/** Az ábra egy eleme; a kifejezések szövegként maradnak (a böngésző fordítja le őket). */
export type PlotItem =
  | { kind: "f" | "dash"; expr: string; label: string | null }
  | { kind: "tangent"; expr: string; at: string; label: string | null }
  | { kind: "area" | "riemann"; expr: string; from: string; to: string; n: string | null; label: string | null }
  | { kind: "seq"; expr: string; from: number; to: number; label: string | null }
  | { kind: "point"; x: string; y: string; label: string | null }
  | { kind: "value"; label: string; expr: string };

/** Egy teljes ábra. */
export type PlotSpec = {
  title: string | null;
  x: [number, number];
  y: [number, number];
  params: PlotParam[];
  items: PlotItem[];
};

// Két szám „a, b” alakból.
function pair(text: string, where: string): [number, number] {
  const parts = text.split(",").map((s) => Number(s.trim()));
  if (parts.length !== 2 || parts.some((v) => !Number.isFinite(v)) || !(parts[0] < parts[1]))
    throw new Error(`Hibás tartomány (${where}): ${text}`);
  return [parts[0], parts[1]];
}

// A felirat leválasztása: „kifejezés # felirat”.
function splitLabel(text: string): [string, string | null] {
  const i = text.indexOf("#");
  return i < 0 ? [text.trim(), null] : [text.slice(0, i).trim(), text.slice(i + 1).trim() || null];
}

/**
 * A ```plot blokk szövegének feldolgozása. Minden kifejezést kipróbál (x vagy n és a paraméterek
 * változóival), így a hibás ábra már a teszteknél kiderül. Hibánál kivételt dob.
 */
export function parsePlot(text: string): PlotSpec {
  const spec: PlotSpec = { title: null, x: [-5, 5], y: [-5, 5], params: [], items: [] };
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  for (const line of lines) {
    const colon = line.indexOf(":");
    if (colon < 0) throw new Error(`Értelmezhetetlen sor: ${line}`);
    const key = line.slice(0, colon).trim();
    const rest = line.slice(colon + 1).trim();
    switch (key) {
      case "title":
        spec.title = rest;
        break;
      case "x":
        spec.x = pair(rest, "x");
        break;
      case "y":
        spec.y = pair(rest, "y");
        break;
      case "param": {
        const m = /^([a-zA-Z][a-zA-Z0-9]*)\s*=\s*(.+)$/.exec(rest);
        const nums = m?.[2].split(",").map((s) => Number(s.trim())) ?? [];
        if (!m || nums.length !== 4 || nums.some((v) => !Number.isFinite(v)))
          throw new Error(`Hibás paraméter: ${line}`);
        const [value, min, max, step] = nums;
        // Az x és az n az ábra saját változója (vízszintes tengely, sorozat indexe).
        if (m && (m[1] === "x" || m[1] === "n")) throw new Error(`Foglalt paraméternév: ${line}`);
        if (!(min < max) || step <= 0 || value < min || value > max)
          throw new Error(`Hibás paraméter-tartomány: ${line}`);
        spec.params.push({ name: m[1], value, min, max, step });
        break;
      }
      case "f":
      case "dash": {
        const [expr, label] = splitLabel(rest);
        spec.items.push({ kind: key, expr, label });
        break;
      }
      case "tangent": {
        const [body, label] = splitLabel(rest);
        const [expr, at] = body.split("@").map((s) => s.trim());
        if (!at) throw new Error(`Hiányzó „@ pont”: ${line}`);
        spec.items.push({ kind: "tangent", expr, at, label });
        break;
      }
      case "area":
      case "riemann": {
        const [body, label] = splitLabel(rest);
        const [expr, bounds] = body.split("@").map((s) => s.trim());
        const parts = (bounds ?? "").split(",").map((s) => s.trim());
        if (parts.length !== (key === "area" ? 2 : 3)) throw new Error(`Hibás határok: ${line}`);
        spec.items.push({
          kind: key,
          expr,
          from: parts[0],
          to: parts[1],
          n: key === "riemann" ? parts[2] : null,
          label,
        });
        break;
      }
      case "seq": {
        const [body, label] = splitLabel(rest);
        const [expr, bounds] = body.split("@").map((s) => s.trim());
        const [from, to] = pair(bounds ?? "", "seq");
        if (!Number.isInteger(from) || !Number.isInteger(to) || to - from > 400)
          throw new Error(`A sorozat határai egészek legyenek (legfeljebb 400 tag): ${line}`);
        spec.items.push({ kind: "seq", expr, from, to, label });
        break;
      }
      case "point": {
        const [body, label] = splitLabel(rest);
        const parts = splitTopLevel(body);
        if (parts.length !== 2) throw new Error(`A pont két koordinátája kell: ${line}`);
        spec.items.push({ kind: "point", x: parts[0], y: parts[1], label });
        break;
      }
      case "value": {
        const eq = rest.lastIndexOf("=");
        if (eq < 0) throw new Error(`Hiányzó „=”: ${line}`);
        spec.items.push({ kind: "value", label: rest.slice(0, eq).trim(), expr: rest.slice(eq + 1).trim() });
        break;
      }
      default:
        throw new Error(`Ismeretlen kulcs: ${key}`);
    }
  }
  if (spec.items.length === 0) throw new Error("Üres ábra");
  // Minden kifejezés próbája a megfelelő változókkal.
  const p = spec.params.map((x) => x.name);
  for (const it of spec.items) {
    if (it.kind === "seq") parseMath(it.expr, ["n", ...p]);
    else if (it.kind === "point") {
      parseMath(it.x, p);
      parseMath(it.y, p);
    } else if (it.kind === "value") parseMath(it.expr, p);
    else {
      parseMath(it.expr, ["x", ...p]);
      if (it.kind === "tangent") parseMath(it.at, p);
      if (it.kind === "area" || it.kind === "riemann") {
        parseMath(it.from, p);
        parseMath(it.to, p);
        if (it.n) parseMath(it.n, p);
      }
    }
  }
  return spec;
}

// Vesszőnél bontás, de csak a zárójeleken kívül („t, sin(t, 2)” → 2 rész).
function splitTopLevel(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const c of s) {
    if (c === "(" || c === "[") depth++;
    if (c === ")" || c === "]") depth--;
    if (c === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  out.push(cur.trim());
  return out;
}

/** „Szép” rácsköz a tartományhoz (1, 2 vagy 5 szorozva tíz hatványával), kb. 8 vonallal. */
export function niceStep(range: number): number {
  const raw = range / 8;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

/** Simpson-szabály: ∫ f(x) dx az [a, b] szakaszon (az ábrák területértékéhez). */
export function integrate(f: (x: number) => number, a: number, b: number, n = 400): number {
  if (a === b) return 0;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

/** Numerikus derivált (központi differencia) az érintőhöz. */
export function derivative(f: (x: number) => number, x: number): number {
  const h = 1e-5 * Math.max(1, Math.abs(x));
  return (f(x + h) - f(x - h)) / (2 * h);
}

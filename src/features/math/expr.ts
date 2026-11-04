// Valós függvénykifejezések (pl. „2x·sin(x) + e^x”) feldolgozása és kiértékelése.
// Tiszta függvények: a grafikonok (```plot), a kvíz képletes kérdései (fn:) és a tesztek is ezt használják.
// Nem használ eval-t: a szöveget saját elemzővel fává alakítjuk, és azt számoljuk ki.

/** A kifejezés fája. */
export type MathNode =
  | { t: "num"; v: number }
  | { t: "var"; name: string }
  | { t: "neg"; a: MathNode }
  | { t: "bin"; op: "+" | "-" | "*" | "/" | "^"; a: MathNode; b: MathNode }
  | { t: "fact"; a: MathNode }
  | { t: "call"; fn: string; args: MathNode[] }
  // Összegzés: sum(k, alsó, felső, tag) – a Taylor- és Fourier-összegekhez.
  | { t: "sum"; k: string; from: MathNode; to: MathNode; body: MathNode };

// Faktoriális (nem egész számnál a gamma-függvény helyett NaN).
function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// Binomiális együttható: n alatt a k.
function binom(n: number, k: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(k) || k < 0 || n < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

// A hívható függvények; a kulcs a beírható név.
const FUNCS: Record<string, (...a: number[]) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  tg: Math.tan,
  cot: (x) => 1 / Math.tan(x),
  ctg: (x) => 1 / Math.tan(x),
  arcsin: Math.asin,
  arccos: Math.acos,
  arctan: Math.atan,
  arctg: Math.atan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  sh: Math.sinh,
  ch: Math.cosh,
  th: Math.tanh,
  exp: Math.exp,
  ln: Math.log,
  // A magyar jelölés: lg = tízes alapú, log = tízes alapú (két paraméterrel: log(alap, x)).
  lg: Math.log10,
  log: (a, b) => (b === undefined ? Math.log10(a) : Math.log(b) / Math.log(a)),
  log2: Math.log2,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  sgn: Math.sign,
  sign: Math.sign,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  min: Math.min,
  max: Math.max,
  fact: factorial,
  binom,
  // Előjelfüggvény-szerű négyszögjel helyett a periodikus jelekhez: mod(a, b) mindig nemnegatív.
  mod: (a, b) => ((a % b) + b) % b,
};

// A nevesített állandók.
const CONSTS: Record<string, number> = { pi: Math.PI, π: Math.PI, e: Math.E };

// Az egy karakteres műveleti jelek egységesítése.
const OPS: Record<string, string> = {
  "+": "+",
  "-": "-",
  "−": "-",
  "–": "-",
  "*": "*",
  "·": "*",
  "⋅": "*",
  "×": "*",
  "/": "/",
  "÷": "/",
  ":": "/",
  "^": "^",
  "(": "(",
  ")": ")",
  "[": "(",
  "]": ")",
  ",": ",",
  ";": ",",
  "!": "!",
  "|": "|",
  "√": "√",
};

// A felső indexes számjegyek (x² → x^2).
const SUPERSCRIPT: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁻": "-",
};

type Tok = { k: "num"; v: number } | { k: "id"; name: string } | { k: "op"; op: string };

/**
 * Szöveg → tokenek. A betűsorozatot ismert nevekre bontjuk (pl. „xsinx” → x, sin, x),
 * a `vars` a megengedett változónevek (egybetűs vagy hosszabb, pl. x, t, n, a0).
 */
function tokenize(src: string, vars: Set<string>): Tok[] {
  // A felső indexeket ^(…) alakra írjuk át; a ** a hatványozás másik jele.
  let s = src.replace(/\*\*/g, "^");
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => "^(" + [...m].map((c) => SUPERSCRIPT[c]).join("") + ")");
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    // Szám: egész vagy tizedes ponttal (2.5, .5). A vessző a paraméterek elválasztója.
    if (/[0-9.]/.test(c)) {
      const m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
      if (!m) throw new Error("Hibás szám");
      out.push({ k: "num", v: Number(m[1]) });
      i += m[1].length;
      continue;
    }
    if (/[\p{L}_]/u.test(c) && c !== "π") {
      let j = i;
      while (j < s.length && /[\p{L}0-9_]/u.test(s[j]) && s[j] !== "π") j++;
      out.push(...splitWord(s.slice(i, j), vars));
      i = j;
      continue;
    }
    if (c === "π") {
      out.push({ k: "id", name: "pi" });
      i++;
      continue;
    }
    const op = OPS[c];
    if (!op) throw new Error(`Ismeretlen jel: ${c}`);
    out.push({ k: "op", op });
    i++;
  }
  return out;
}

// Egy betűsorozat felbontása ismert nevekre (függvény, állandó, változó), a leghosszabb illeszkedéssel.
function splitWord(word: string, vars: Set<string>): Tok[] {
  const known = (w: string) => w in FUNCS || w in CONSTS || vars.has(w) || w === "sum";
  if (known(word)) return [{ k: "id", name: word }];
  const out: Tok[] = [];
  let i = 0;
  while (i < word.length) {
    let found = "";
    for (let j = word.length; j > i; j--) {
      const part = word.slice(i, j);
      if (known(part)) {
        found = part;
        break;
      }
    }
    if (!found) throw new Error(`Ismeretlen név: ${word}`);
    out.push({ k: "id", name: found });
    i += found.length;
  }
  return out;
}

/**
 * Kifejezés → fa. A `vars` a megengedett változók (alapból: x).
 * Jelölések: + − · × * / : ^ ** (x² is), zárójel ( ) [ ], abszolút érték |x|, √x, n!, implicit szorzás
 * (2x, 3(x+1), x sin x), függvények zárójel nélkül is (sin x = sin(x)).
 * Erősorrend: hatvány (jobbról) > előjel > szorzás/osztás > összeadás. −x^2 = −(x^2).
 * Hibás kifejezésnél kivételt dob.
 */
export function parseMath(src: string, vars: string[] = ["x"]): MathNode {
  const varSet = new Set(vars);
  // A sum(k, …) futó változóját (k) előre felvesszük, hogy a tagban is felismerjük.
  for (const m of src.matchAll(/sum\s*\(\s*([\p{L}][\p{L}0-9_]*)\s*,/gu)) varSet.add(m[1]);
  const toks = tokenize(src, varSet);
  let pos = 0;
  // Hány nyitott |…| van (a záró | felismeréséhez).
  let absDepth = 0;
  const peek = () => toks[pos];
  const isOp = (op: string) => peek()?.k === "op" && (peek() as { op: string }).op === op;
  const expect = (op: string) => {
    if (!isOp(op)) throw new Error(`Hiányzó „${op}”`);
    pos++;
  };

  // Összeadás, kivonás.
  function sum(): MathNode {
    let left = product();
    while (isOp("+") || isOp("-")) {
      const op = (toks[pos++] as { op: "+" | "-" }).op;
      left = { t: "bin", op, a: left, b: product() };
    }
    return left;
  }
  // Kezdődhet-e itt új tényező (implicit szorzáshoz).
  function startsFactor(): boolean {
    const t = peek();
    if (!t) return false;
    if (t.k !== "op") return true;
    if (t.op === "(" || t.op === "√") return true;
    // A | csak akkor nyit, ha nincs nyitott abszolút érték (különben záró jel).
    return t.op === "|" && absDepth === 0;
  }
  // Szorzás, osztás (kiírt jellel vagy egymás mellé írva).
  function product(): MathNode {
    let left = unary();
    for (;;) {
      if (isOp("*") || isOp("/")) {
        const op = (toks[pos++] as { op: "*" | "/" }).op;
        left = { t: "bin", op, a: left, b: unary() };
      } else if (startsFactor()) {
        left = { t: "bin", op: "*", a: left, b: power() };
      } else return left;
    }
  }
  // Előjel (−x^2 = −(x^2)).
  function unary(): MathNode {
    if (isOp("-")) {
      pos++;
      return { t: "neg", a: unary() };
    }
    if (isOp("+")) {
      pos++;
      return unary();
    }
    return power();
  }
  // Hatvány (jobbról köt: 2^3^2 = 2^9); a kitevőben lehet előjel (e^-x).
  function power(): MathNode {
    const base = postfix();
    if (isOp("^")) {
      pos++;
      return { t: "bin", op: "^", a: base, b: unary() };
    }
    return base;
  }
  // Faktoriális: n!
  function postfix(): MathNode {
    let e = atom();
    while (isOp("!")) {
      pos++;
      e = { t: "fact", a: e };
    }
    return e;
  }
  // Szám, változó, állandó, függvényhívás, zárójel, |…|, √…
  function atom(): MathNode {
    const t = toks[pos++];
    if (!t) throw new Error("Hiányos kifejezés");
    if (t.k === "num") return { t: "num", v: t.v };
    if (t.k === "op") {
      if (t.op === "(") {
        const e = sum();
        expect(")");
        return e;
      }
      if (t.op === "|") {
        absDepth++;
        const e = sum();
        absDepth--;
        expect("|");
        return { t: "call", fn: "abs", args: [e] };
      }
      if (t.op === "√") return { t: "call", fn: "sqrt", args: [power()] };
      throw new Error(`Váratlan jel: ${t.op}`);
    }
    const name = t.name;
    if (name === "sum") {
      // sum(k, alsó, felső, tag): a k itt változó, csak a tagon belül.
      expect("(");
      const kt = toks[pos++];
      if (!kt || kt.k !== "id") throw new Error("A sum első paramétere a futó változó");
      expect(",");
      const from = sum();
      expect(",");
      const to = sum();
      expect(",");
      const inner = sum();
      expect(")");
      return { t: "sum", k: kt.name, from, to, body: inner };
    }
    if (name in FUNCS) {
      // Zárójeles hívás (több paraméterrel is), vagy zárójel nélkül: sin x, sin 2x → sin(2x).
      if (isOp("(")) {
        pos++;
        const args = [sum()];
        while (isOp(",")) {
          pos++;
          args.push(sum());
        }
        expect(")");
        // sin(x)^2 = (sin x)^2 – ezt a power() kezeli, mert a hívás egy atom.
        return { t: "call", fn: name, args };
      }
      // sin^2 x = (sin x)^2
      if (isOp("^")) {
        pos++;
        const exp = postfix();
        return { t: "bin", op: "^", a: { t: "call", fn: name, args: [noParenArg()] }, b: exp };
      }
      return { t: "call", fn: name, args: [noParenArg()] };
    }
    // A változó elsőbbséget kap az állandóval szemben (pl. egy „e” nevű csúszka az ábrán).
    if (varSet.has(name)) return { t: "var", name };
    if (name in CONSTS) return { t: "num", v: CONSTS[name] };
    throw new Error(`Ismeretlen név: ${name}`);
  }
  // Zárójel nélküli függvényparaméter: a következő tényezők hatványai (sin 2x → sin(2x)),
  // a következő függvénynévig vagy műveleti jelig (sin x cos x = sin(x)·cos(x)).
  function noParenArg(): MathNode {
    let e = power();
    for (;;) {
      const t = peek();
      if (!t || t.k === "op" || (t.k === "id" && t.name in FUNCS)) return e;
      e = { t: "bin", op: "*", a: e, b: power() };
    }
  }

  const e = sum();
  if (pos !== toks.length) throw new Error("Fölösleges jel a kifejezés végén");
  return e;
}

/** A fa értéke a megadott változóértékeknél (hibás tartományban NaN vagy ±Infinity). */
export function evalMath(e: MathNode, env: Record<string, number>): number {
  switch (e.t) {
    case "num":
      return e.v;
    case "var": {
      const v = env[e.name];
      return v === undefined ? NaN : v;
    }
    case "neg":
      return -evalMath(e.a, env);
    case "fact":
      return factorial(evalMath(e.a, env));
    case "bin": {
      const a = evalMath(e.a, env);
      const b = evalMath(e.b, env);
      switch (e.op) {
        case "+":
          return a + b;
        case "-":
          return a - b;
        case "*":
          return a * b;
        case "/":
          return a / b;
        case "^":
          return powReal(a, b);
      }
      return NaN;
    }
    case "call":
      return FUNCS[e.fn](...e.args.map((x) => evalMath(x, env)));
    case "sum": {
      const from = Math.ceil(evalMath(e.from, env));
      const to = Math.floor(evalMath(e.to, env));
      // Túl hosszú összegnél megállunk (a böngésző ne akadjon meg).
      if (!Number.isFinite(from) || !Number.isFinite(to) || to - from > 10000) return NaN;
      let s = 0;
      const inner = { ...env };
      for (let k = from; k <= to; k++) {
        inner[e.k] = k;
        s += evalMath(e.body, inner);
      }
      return s;
    }
  }
}

// Valós hatvány: negatív alap páratlan nevezőjű tört kitevőnél is (pl. (−8)^(1/3) = −2).
function powReal(a: number, b: number): number {
  if (a >= 0 || Number.isInteger(b)) return Math.pow(a, b);
  // A kitevő tört alakja kis nevezővel (1/3, 2/5 …).
  for (let q = 3; q <= 15; q += 2) {
    const p = Math.round(b * q);
    if (Math.abs(p / q - b) < 1e-12) return (p % 2 === 0 ? 1 : -1) * Math.pow(-a, b);
  }
  return NaN;
}

/** Kifejezés szövegből egy lépésben kiértékelhető függvénnyé (a grafikonokhoz). */
export function compileMath(src: string, vars: string[] = ["x"]) {
  const tree = parseMath(src, vars);
  return (env: Record<string, number>) => evalMath(tree, env);
}

/** Egy képletes válasz ellenőrzésének eredménye. */
export type FnCheck = "ok" | "wrong" | "invalid";

/**
 * Egyenértékű-e a begépelt kifejezés a várt kifejezéssel: a változók sok véletlenszerű (de rögzített)
 * értékénél összevetjük a két értéket. `upToConstant`: határozatlan integrálnál a különbség lehet
 * állandó (+C); ilyenkor a C (vagy c) nevű tagot nullának vesszük.
 */
export function checkFn(
  q: { vars: string[]; expr: string; domain: [number, number]; upToConstant: boolean },
  given: string,
): FnCheck {
  const vars = q.upToConstant ? [...q.vars, "C", "c"] : q.vars;
  let user: MathNode;
  try {
    user = parseMath(given, vars);
  } catch {
    return "invalid";
  }
  const ref = parseMath(q.expr, q.vars);
  const [lo, hi] = q.domain;
  // Rögzített „véletlen” pontok (ugyanaz minden futáskor, így a teszt is determinisztikus).
  let seed = 12345;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  let offset: number | null = null;
  let compared = 0;
  for (let tries = 0; tries < 200 && compared < 24; tries++) {
    const env: Record<string, number> = { C: 0, c: 0 };
    for (const v of q.vars) env[v] = lo + (hi - lo) * rand();
    const want = evalMath(ref, env);
    if (!Number.isFinite(want)) continue;
    const got = evalMath(user, env);
    if (!Number.isFinite(got)) return "wrong";
    let diff = got - want;
    if (q.upToConstant) {
      offset ??= diff;
      diff -= offset;
    }
    if (Math.abs(diff) > 1e-6 * Math.max(1, Math.abs(want))) return "wrong";
    compared++;
  }
  return compared >= 5 ? "ok" : "wrong";
}

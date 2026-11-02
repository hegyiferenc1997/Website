// A leckék kvízfeladatainak (```quiz blokkok) közös logikája: a blokk szövegének feldolgozása,
// logikai kifejezések kiértékelése, igazságtáblák számolása és a válaszok ellenőrzése.
// Tiszta függvények: a szerver (Markdown → darabok), a böngésző (ellenőrzés) és a tesztek is ezt használják.

// ---------------------------------------------------------------------------
// Logikai kifejezések
// ---------------------------------------------------------------------------

/**
 * Egy logikai kifejezés fája. Változó: nagybetű, utána számjegyek (A, B, Q0, Q1 …).
 * Jelölések (a tananyagban és a hallgató válaszában is):
 *   NEM:  A' · A̅ · ¬A · !A · ~A · not A
 *   ÉS:   A·B · A*B · A&B · A∧B · AB (egymás mellé írva) · A and B
 *   VAGY: A+B · A|B · A∨B · A or B
 *   XOR:  A⊕B · A^B · A xor B        XNOR: A⊙B · A xnor B
 * Erősorrend: NEM > ÉS > XOR/XNOR > VAGY; zárójel: ( ) vagy [ ].
 */
export type Expr =
  | { op: "var"; name: string }
  | { op: "const"; value: 0 | 1 }
  | { op: "not"; a: Expr }
  | { op: "and" | "or" | "xor" | "xnor"; a: Expr; b: Expr };

// A kifejezés egy eleme (token).
type Tok =
  | { t: "var"; name: string }
  | { t: "const"; value: 0 | 1 }
  | { t: "not" | "post" | "and" | "or" | "xor" | "xnor" | "(" | ")" };

// Az egy karakteres műveleti jelek.
const SYMBOLS: Record<string, Tok["t"]> = {
  "'": "post",
  "’": "post",
  "̅": "post", // kombináló felülvonás: A̅
  "¬": "not",
  "!": "not",
  "~": "not",
  "·": "and",
  "⋅": "and",
  "*": "and",
  "&": "and",
  "∧": "and",
  "+": "or",
  "|": "or",
  "∨": "or",
  "⊕": "xor",
  "^": "xor",
  "⊙": "xnor",
  "(": "(",
  "[": "(",
  ")": ")",
  "]": ")",
};

// A szöveges műveleti szavak (kisbetűvel, hogy ne keveredjenek a nagybetűs változókkal).
const WORDS: Record<string, Tok["t"]> = {
  not: "not",
  and: "and",
  or: "or",
  xor: "xor",
  xnor: "xnor",
};

/** A kifejezés szövegének tokenekre bontása; hibás karakternél kivételt dob. */
function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  const s = src.normalize("NFD");
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[A-Z]/.test(c)) {
      let j = i + 1;
      while (j < s.length && /[0-9]/.test(s[j])) j++;
      out.push({ t: "var", name: s.slice(i, j) });
      i = j;
      continue;
    }
    if (c === "0" || c === "1") {
      out.push({ t: "const", value: c === "1" ? 1 : 0 });
      i++;
      continue;
    }
    if (/[a-z]/.test(c)) {
      let j = i;
      while (j < s.length && /[a-z]/.test(s[j])) j++;
      const word = WORDS[s.slice(i, j)];
      if (!word) throw new Error(`Ismeretlen szó: ${s.slice(i, j)}`);
      out.push({ t: word } as Tok);
      i = j;
      continue;
    }
    const sym = SYMBOLS[c];
    if (!sym) throw new Error(`Ismeretlen jel: ${c}`);
    out.push({ t: sym } as Tok);
    i++;
  }
  return out;
}

/** Logikai kifejezés feldolgozása fává. Hibás kifejezésnél kivételt dob. */
export function parseExpr(src: string): Expr {
  const toks = tokenize(src);
  let pos = 0;
  const peek = () => toks[pos];

  // VAGY szint (a leggyengébb).
  function orLevel(): Expr {
    let left = xorLevel();
    while (peek()?.t === "or") {
      pos++;
      left = { op: "or", a: left, b: xorLevel() };
    }
    return left;
  }
  // XOR / XNOR szint.
  function xorLevel(): Expr {
    let left = andLevel();
    while (peek()?.t === "xor" || peek()?.t === "xnor") {
      const op = toks[pos++].t as "xor" | "xnor";
      left = { op, a: left, b: andLevel() };
    }
    return left;
  }
  // ÉS szint: kiírt jellel vagy egymás mellé írva (AB, A(B+C)).
  function andLevel(): Expr {
    let left = unary();
    for (;;) {
      const t = peek()?.t;
      if (t === "and") {
        pos++;
        left = { op: "and", a: left, b: unary() };
      } else if (t === "var" || t === "const" || t === "not" || t === "(") {
        left = { op: "and", a: left, b: unary() };
      } else return left;
    }
  }
  // Előtagos NEM, majd az alap és az utótagos negálások (A', A̅, (A+B)').
  function unary(): Expr {
    if (peek()?.t === "not") {
      pos++;
      return { op: "not", a: unary() };
    }
    let e = primary();
    while (peek()?.t === "post") {
      pos++;
      e = { op: "not", a: e };
    }
    return e;
  }
  // Változó, konstans vagy zárójeles kifejezés.
  function primary(): Expr {
    const tok = toks[pos++];
    if (!tok) throw new Error("Hiányos kifejezés");
    if (tok.t === "var") return { op: "var", name: tok.name };
    if (tok.t === "const") return { op: "const", value: tok.value };
    if (tok.t === "(") {
      const e = orLevel();
      if (toks[pos++]?.t !== ")") throw new Error("Hiányzó záró zárójel");
      return e;
    }
    throw new Error("Váratlan műveleti jel");
  }

  const e = orLevel();
  if (pos !== toks.length) throw new Error("Fölösleges jel a kifejezés végén");
  return e;
}

/** A kifejezés értéke adott változóértékeknél (0 vagy 1). */
export function evalExpr(e: Expr, env: Record<string, number>): 0 | 1 {
  switch (e.op) {
    case "var": {
      const v = env[e.name];
      if (v === undefined) throw new Error(`Ismeretlen változó: ${e.name}`);
      return v ? 1 : 0;
    }
    case "const":
      return e.value;
    case "not":
      return evalExpr(e.a, env) ? 0 : 1;
    case "and":
      return (evalExpr(e.a, env) & evalExpr(e.b, env)) as 0 | 1;
    case "or":
      return (evalExpr(e.a, env) | evalExpr(e.b, env)) as 0 | 1;
    case "xor":
      return (evalExpr(e.a, env) ^ evalExpr(e.b, env)) as 0 | 1;
    case "xnor":
      return (1 ^ evalExpr(e.a, env) ^ evalExpr(e.b, env)) as 0 | 1;
  }
}

/** A kifejezésben előforduló változók nevei. */
export function exprVars(e: Expr, out = new Set<string>()): Set<string> {
  if (e.op === "var") out.add(e.name);
  else if (e.op === "not") exprVars(e.a, out);
  else if (e.op !== "const") {
    exprVars(e.a, out);
    exprVars(e.b, out);
  }
  return out;
}

/** Hány változó-előfordulás (literál) van a kifejezésben, pl. A·B + A̅ → 3. */
export function literalCount(e: Expr): number {
  if (e.op === "var") return 1;
  if (e.op === "const") return 0;
  if (e.op === "not") return literalCount(e.a);
  return literalCount(e.a) + literalCount(e.b);
}

/** Az igazságtábla sorai: minden bemeneti kombináció binárisan növekvő sorrendben (000, 001, …). */
export function inputRows(inputs: string[]): Record<string, number>[] {
  const n = inputs.length;
  return Array.from({ length: 2 ** n }, (_, row) =>
    Object.fromEntries(inputs.map((name, i) => [name, (row >> (n - 1 - i)) & 1])),
  );
}

/** Egy kifejezés kimeneti oszlopa az igazságtáblában. */
export function truthColumn(e: Expr, inputs: string[]): (0 | 1)[] {
  return inputRows(inputs).map((env) => evalExpr(e, env));
}

// ---------------------------------------------------------------------------
// A ```quiz blokk szövege
// ---------------------------------------------------------------------------

/** Egy kérdés közös része: kérdés szövege (Markdown), és a hibás válasz utáni tipp. */
type QuestionBase = { prompt: string; hint: string | null };

/** Egy kvízkérdés. */
export type QuizQuestion =
  | (QuestionBase & {
      /** Rövid válasz begépelése (szám, kód, szó). Több elfogadott válasz is lehet. */
      kind: "input";
      answers: string[];
    })
  | (QuestionBase & {
      /** Egy jó válasz a felsoroltak közül. */
      kind: "choice";
      choices: string[];
      correct: number;
    })
  | (QuestionBase & {
      /** Igazságtábla kitöltése: a kimeneti oszlopokat a kifejezésekből számoljuk. */
      kind: "table";
      inputs: string[];
      outputs: { name: string; expr: string; values: (0 | 1)[] }[];
    })
  | (QuestionBase & {
      /** Logikai kifejezés begépelése: bármely vele egyenértékű kifejezés jó. */
      kind: "expr";
      inputs: string[];
      expr: string;
      values: (0 | 1)[];
      /** Legfeljebb ennyi literál lehet a válaszban (az egyszerűsítő feladatoknál). */
      limit: number | null;
      /** Az eredeti (egyszerűsítendő) kifejezés; a tesztek ellenőrzik, hogy egyenértékű a válasszal. */
      same: string | null;
      /** Közömbös sorok (az igazságtábla sorszámai): itt bármi lehet a válasz értéke. */
      dc: number[];
    });

/** Egy feladatlap: kérdések sorban. */
export type Quiz = { questions: QuizQuestion[] };

// Egy „bemenetek -> …” rész felbontása: „A, B, C -> Y = …”.
function splitArrow(spec: string, where: string): [string[], string] {
  const i = spec.indexOf("->");
  if (i < 0) throw new Error(`Hiányzó „->”: ${where}`);
  const inputs = spec
    .slice(0, i)
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (inputs.length === 0 || inputs.length > 5) throw new Error(`1–5 bemenet kell: ${where}`);
  for (const name of inputs) if (!/^[A-Z][0-9]*$/.test(name)) throw new Error(`Hibás név: ${name}`);
  return [inputs, spec.slice(i + 2).trim()];
}

// Ellenőrzi, hogy a kifejezés csak a megadott bemeneteket használja.
function checkVars(e: Expr, inputs: string[], where: string) {
  for (const v of exprVars(e))
    if (!inputs.includes(v)) throw new Error(`Ismeretlen változó (${v}): ${where}`);
}

/**
 * A ```quiz blokk szövegének feldolgozása. Soronként:
 *   ? kérdés            – új kérdés (Markdown is lehet benne)
 *   = válasz            – begépelendő válasz (több „=” sor = több elfogadott alak)
 *   + jó válasz / - rossz válasz   – feleletválasztás
 *   table: A, B -> Y = A·B; Z = A+B – igazságtábla kitöltése
 *   expr: A, B, C -> A + C          – kifejezés begépelése (egyenértékűséget nézünk)
 *   limit: 2            – legfeljebb ennyi literál a kifejezésben
 *   same: A + A̅·C       – az eredeti kifejezés (a tesztek nézik, hogy egyenértékű)
 *   dc: 10, 11          – közömbös sorok (az igazságtábla sorszámai), ott bármi elfogadott
 *   ! tipp              – hibás válasz után megjelenő segítség
 * Hibás blokknál kivételt dob (a tesztek így minden blokkot ellenőriznek).
 */
export function parseQuiz(text: string): Quiz {
  const questions: QuizQuestion[] = [];
  // Az épp épülő kérdés nyers adatai.
  type Draft = {
    prompt: string;
    hint: string | null;
    answers: string[];
    choices: { text: string; ok: boolean }[];
    table: string | null;
    expr: string | null;
    limit: number | null;
    same: string | null;
    dc: number[];
  };
  let d: Draft | null = null;

  // A kész nyers kérdés átalakítása és ellenőrzése.
  const finish = () => {
    if (!d) return;
    const where = d.prompt.slice(0, 60);
    const kinds = [d.answers.length > 0, d.choices.length > 0, !!d.table, !!d.expr].filter(Boolean);
    if (kinds.length !== 1) throw new Error(`Egy kérdéshez pontosan egyféle válasz kell: ${where}`);
    const base = { prompt: d.prompt, hint: d.hint };
    if (d.answers.length) {
      questions.push({ ...base, kind: "input", answers: d.answers });
    } else if (d.choices.length) {
      const correct = d.choices.findIndex((c) => c.ok);
      if (d.choices.filter((c) => c.ok).length !== 1 || d.choices.length < 2)
        throw new Error(`Pontosan egy jó („+”) és legalább egy rossz válasz kell: ${where}`);
      questions.push({ ...base, kind: "choice", choices: d.choices.map((c) => c.text), correct });
    } else if (d.table) {
      const [inputs, rest] = splitArrow(d.table, where);
      const outputs = rest.split(";").map((part) => {
        const eq = part.indexOf("=");
        if (eq < 0) throw new Error(`Hiányzó „=” a kimenetnél: ${where}`);
        const name = part.slice(0, eq).trim();
        const expr = part.slice(eq + 1).trim();
        const tree = parseExpr(expr);
        checkVars(tree, inputs, where);
        return { name, expr, values: truthColumn(tree, inputs) };
      });
      questions.push({ ...base, kind: "table", inputs, outputs });
    } else if (d.expr) {
      const [inputs, expr] = splitArrow(d.expr, where);
      const tree = parseExpr(expr);
      checkVars(tree, inputs, where);
      if (d.same) checkVars(parseExpr(d.same), inputs, where);
      if (d.dc.some((r) => !Number.isInteger(r) || r < 0 || r >= 2 ** inputs.length))
        throw new Error(`Hibás közömbös sor: ${where}`);
      questions.push({
        ...base,
        kind: "expr",
        inputs,
        expr,
        values: truthColumn(tree, inputs),
        limit: d.limit,
        same: d.same,
        dc: d.dc,
      });
    }
    d = null;
  };

  for (const raw of text.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("?")) {
      finish();
      d = {
        prompt: line.slice(1).trim(),
        hint: null,
        answers: [],
        choices: [],
        table: null,
        expr: null,
        limit: null,
        same: null,
        dc: [],
      };
      continue;
    }
    if (!d) throw new Error(`A kvíz kérdéssel („?”) kezdődjön: ${line}`);
    const cur: Draft = d;
    if (line.startsWith("=")) cur.answers.push(line.slice(1).trim());
    else if (line.startsWith("+ ") || line.startsWith("- "))
      cur.choices.push({ text: line.slice(2).trim(), ok: line[0] === "+" });
    else if (line.startsWith("!")) cur.hint = line.slice(1).trim();
    else if (line.startsWith("table:")) cur.table = line.slice(6).trim();
    else if (line.startsWith("expr:")) cur.expr = line.slice(5).trim();
    else if (line.startsWith("limit:")) cur.limit = Number(line.slice(6).trim()) || null;
    else if (line.startsWith("same:")) cur.same = line.slice(5).trim();
    else if (line.startsWith("dc:"))
      cur.dc = line
        .slice(3)
        .split(",")
        .map((x) => Number(x.trim()));
    // A folytatósor a kérdés szövegéhez tartozik (hosszabb kérdéseknél).
    else if (!cur.answers.length && !cur.choices.length && !cur.table && !cur.expr)
      cur.prompt += " " + line;
    else throw new Error(`Értelmezhetetlen sor: ${line}`);
  }
  finish();
  if (questions.length === 0) throw new Error("Üres kvíz");
  return { questions };
}

// ---------------------------------------------------------------------------
// Válaszok ellenőrzése
// ---------------------------------------------------------------------------

/**
 * A begépelt válasz egységesítése: kisbetű, szóközök, aláhúzás és alsó indexes számrendszer-jelölés
 * nélkül, tizedesvessző → pont. Így pl. „1011₂”, „1011” és „10 11” ugyanaz.
 */
export function normalizeAnswer(s: string): string {
  return s
    .normalize("NFC")
    .toLowerCase()
    .replace(/[\s_]/g, "")
    .replace(/[₀-₉]+$/, "")
    .replace(/,/g, ".");
}

/** Jó-e a begépelt rövid válasz. */
export function checkInput(q: { answers: string[] }, given: string): boolean {
  const g = normalizeAnswer(given);
  return g !== "" && q.answers.some((a) => normalizeAnswer(a) === g);
}

/** Egy begépelt kifejezés ellenőrzésének eredménye. */
export type ExprCheck = "ok" | "wrong" | "invalid" | "too-long";

/** Jó-e a begépelt logikai kifejezés: helyes alak, csak a megadott változók, ugyanaz az igazságtábla. */
export function checkExpr(
  q: { inputs: string[]; values: (0 | 1)[]; limit: number | null; dc?: number[] },
  given: string,
): ExprCheck {
  let tree: Expr;
  try {
    tree = parseExpr(given);
    for (const v of exprVars(tree)) if (!q.inputs.includes(v)) return "invalid";
  } catch {
    return "invalid";
  }
  const values = truthColumn(tree, q.inputs);
  // A közömbös sorokban bármi lehet.
  if (values.some((v, i) => v !== q.values[i] && !q.dc?.includes(i))) return "wrong";
  if (q.limit !== null && literalCount(tree) > q.limit) return "too-long";
  return "ok";
}

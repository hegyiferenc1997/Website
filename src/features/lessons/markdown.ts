import "server-only";
import { Marked, type Token, type Tokens, type TokensList } from "marked";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { parseQuiz, type QuizQuestion } from "@/features/quiz/logic";
import { parseCodeInfo, parseQuizInfo, type CodeRole } from "./code-info";

// A leckék Markdown szövegét HTML-lé alakítja a szerveren, színezett kódrészletekkel.
// A böngészőbe kész HTML megy, így a kódkiemeléshez nem kell JavaScriptet letölteni.
// A színek a téma szerint váltanak (lásd .lesson-body a globals.css-ben).

// A kiemelhető programozási nyelvek (a kódblokk ```nyelv jelölése alapján).
const LANGS = {
  python: () => import("shiki/langs/python.mjs"),
  bash: () => import("shiki/langs/bash.mjs"),
  c: () => import("shiki/langs/c.mjs"),
  cpp: () => import("shiki/langs/cpp.mjs"),
  csharp: () => import("shiki/langs/csharp.mjs"),
  java: () => import("shiki/langs/java.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  ruby: () => import("shiki/langs/ruby.mjs"),
  go: () => import("shiki/langs/go.mjs"),
  rust: () => import("shiki/langs/rust.mjs"),
  kotlin: () => import("shiki/langs/kotlin.mjs"),
  // Hardverleíró nyelvek és az FPGA-s kényszerfájlok (XDC, QSF) nyelve a Digitális technikához.
  vhdl: () => import("shiki/langs/vhdl.mjs"),
  verilog: () => import("shiki/langs/verilog.mjs"),
  tcl: () => import("shiki/langs/tcl.mjs"),
};

// Más nevek ugyanarra a nyelvre, pl. ```py → python.
const ALIASES: Record<string, keyof typeof LANGS> = {
  py: "python",
  python3: "python",
  sh: "bash",
  shell: "bash",
  console: "bash",
  "c++": "cpp",
  cs: "csharp",
  "c#": "csharp",
  js: "javascript",
  ts: "typescript",
  rb: "ruby",
  golang: "go",
  rs: "rust",
  kt: "kotlin",
  v: "verilog",
  xdc: "tcl",
  qsf: "tcl",
};

/** A kódblokk fejlécében megjelenő név. */
const LABELS: Partial<Record<keyof typeof LANGS, string>> = {
  python: "Python",
  bash: "terminál",
  cpp: "C++",
  csharp: "C#",
  javascript: "JavaScript",
  typescript: "TypeScript",
  json: "JSON",
  sql: "SQL",
  c: "C",
  java: "Java",
  ruby: "Ruby",
  go: "Go",
  rust: "Rust",
  kotlin: "Kotlin",
  vhdl: "VHDL",
  verilog: "Verilog",
  tcl: "Tcl",
};

// Ezekhez a jelölésekhez nem írunk fejlécet (sima szöveg, kimenet).
const NO_LABEL = new Set(["", "text", "txt", "plaintext", "output"]);

// A kódkiemelő egyszer jön létre, utána újrahasznosítjuk (lassú elindítani).
let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [import("shiki/themes/github-dark.mjs"), import("shiki/themes/github-light.mjs")],
    langs: Object.values(LANGS).map((load) => load()),
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

// A különleges karakterek kódolása, hogy a szöveg ne HTML-ként értelmeződjön.
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// A szerepek felirata a kódblokk fejlécében, nyelvenként.
const ROLE_LABELS: Record<string, Record<CodeRole | "required", string>> = {
  hu: {
    run: "futtatható példa",
    starter: "kiinduló kód",
    solution: "megoldás",
    test: "ellenőrzés",
    required: "a lecke feladata",
  },
  en: {
    run: "runnable example",
    starter: "starter code",
    solution: "solution",
    test: "check",
    required: "lesson exercise",
  },
};

// Az ellenőrző kód lenyitható dobozának címe.
const TEST_SUMMARY: Record<string, string> = {
  hu: "Mit ellenőriz a gép? (ellenőrző kód)",
  en: "What does the checker test? (check code)",
};

/** A kódblokk fejlécének felirata, pl. „Python · futtatható példa”. */
function blockLabel(info: string | undefined, locale: string): string {
  const { lang: raw, role, required } = parseCodeInfo(info);
  const name = (raw in LANGS ? raw : ALIASES[raw]) as keyof typeof LANGS | undefined;
  const base = name ? LABELS[name] : NO_LABEL.has(raw) ? "" : raw;
  const labels = ROLE_LABELS[locale] ?? ROLE_LABELS.hu;
  const roleLabel = role ? labels[required ? "required" : role] : "";
  return [base, roleLabel].filter(Boolean).join(" · ");
}

/** Csak a színezett kód (<pre>), fejléc nélkül. */
function highlightCode(h: HighlighterCore, text: string, info: string | undefined): string {
  const { lang: raw } = parseCodeInfo(info);
  const name = (raw in LANGS ? raw : ALIASES[raw]) as keyof typeof LANGS | undefined;
  return name
    ? h.codeToHtml(text, {
        lang: name,
        themes: { dark: "github-dark", light: "github-light" },
        defaultColor: false,
      })
    : `<pre class="shiki"><code>${escapeHtml(text)}</code></pre>`;
}

// Egy kódblokk HTML-je: fejléc a nyelv nevével (és szerepével), alatta a színezett kód
// (ismeretlen nyelvnél színezés nélkül). Az ellenőrző kód (test) alapból becsukott dobozba kerül.
function codeBlock(h: HighlighterCore, { text, lang }: Tokens.Code, locale: string): string {
  const { lang: raw, role } = parseCodeInfo(lang);
  const name = (raw in LANGS ? raw : ALIASES[raw]) as keyof typeof LANGS | undefined;
  const label = blockLabel(lang, locale);
  const header = label ? `<div class="code-label">${escapeHtml(label)}</div>` : "";
  // A data-role / data-lang jelzi, melyik blokk mit jelent (a stílus és a tesztek is ezt nézik).
  const data = role ? ` data-role="${role}" data-lang="${escapeHtml(name ?? raw)}"` : "";
  const block = `<div class="code-block"${data}>${header}${highlightCode(h, text, lang)}</div>`;
  if (role !== "test") return block;
  const summary = TEST_SUMMARY[locale] ?? TEST_SUMMARY.hu;
  return `<details class="check-details"><summary>${escapeHtml(summary)}</summary>\n${block}</details>`;
}

// A Marked beállítása: saját kódblokk, címsor, link és táblázat kinézet.
function createMarked(h: HighlighterCore, locale: string) {
  return new Marked({
    gfm: true,
    renderer: {
      code: (token) => codeBlock(h, token, locale),
      // Címsorok egy szinttel lejjebb.
      heading({ tokens, depth }) {
        const level = Math.min(depth + 1, 6);
        return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>`;
      },
      // A külső link új lapon nyílik, ↗ jellel.
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const attrs = [
          `href="${escapeHtml(href)}"`,
          title ? `title="${escapeHtml(title)}"` : "",
          external ? 'target="_blank" rel="noreferrer"' : "",
        ]
          .filter(Boolean)
          .join(" ");
        return `<a ${attrs}>${text}${external ? " ↗" : ""}</a>`;
      },
      table(token) {
        // A széles táblázat mobilon vízszintesen görgethető, nem tolja szét az oldalt.
        const cell = (c: Tokens.TableCell, tag: "th" | "td") =>
          `<${tag}${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</${tag}>`;
        const head = `<tr>${token.header.map((c) => cell(c, "th")).join("")}</tr>`;
        const body = token.rows
          .map((row) => `<tr>${row.map((c) => cell(c, "td")).join("")}</tr>`)
          .join("");
        return `<div class="table-wrap"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
      },
    },
  });
}

/**
 * Markdown → HTML. A címsorok egy szinttel lejjebb kerülnek (# → h2), mert az oldal címe a h1.
 * A `locale` a kódblokkok szerep-feliratainak nyelve.
 */
export async function renderMarkdown(markdown: string, locale = "hu"): Promise<string> {
  const h = await getHighlighter();
  return createMarked(h, locale).parse(markdown, { async: false });
}

/**
 * A lecke egy darabja: sima HTML, futtatható Python példa, vagy feladat (szerkesztővel és ellenőrzéssel).
 * A futtatható részeket a lecke oldala interaktív komponensként rajzolja ki (lásd features/python).
 */
export type LessonSegment =
  | { kind: "html"; html: string }
  | { kind: "run"; code: string; label: string; codeHtml: string }
  | {
      kind: "exercise";
      /** Hányadik feladat a leckében (0-tól), a mentett piszkozat kulcsához. */
      index: number;
      starter: string;
      /** Az ellenőrző kód (ha van); a tanuló kódja után fut. */
      test: string | null;
      /** A lecke kötelező feladata-e (sikeres ellenőrzés = kész a lecke). */
      required: boolean;
      label: string;
    }
  | {
      kind: "quiz";
      /** Hányadik kvíz a leckében (0-tól). */
      index: number;
      /** A kérdések; a kérdés és a válaszlehetőségek szövege már HTML (a szerveren alakítva). */
      questions: QuizQuestion[];
      required: boolean;
    };

// Hány <details> nyílik / záródik egy HTML darabban (a lenyitható dobozokon belüli kódot nem bontjuk ki).
const detailsDelta = (raw: string) =>
  (raw.match(/<details[\s>]/g) ?? []).length - (raw.match(/<\/details>/g) ?? []).length;

/**
 * Markdown → darabok. A Python `run` és `starter` blokkok külön darabot kapnak (ha nem lenyitható
 * dobozban vannak); a starter blokk mellé a hozzá tartozó (utána következő) `test` kódot is odaadjuk.
 */
export async function renderLessonSegments(
  markdown: string,
  locale = "hu",
): Promise<LessonSegment[]> {
  const h = await getHighlighter();
  const marked = createMarked(h, locale);
  const tokens = marked.lexer(markdown);
  const segments: LessonSegment[] = [];
  let pending: Token[] = [];
  let depth = 0;
  let exerciseIndex = 0;

  // Az eddig összegyűlt sima tartalom HTML-lé alakítása egy darabba.
  const flush = () => {
    if (pending.length === 0) return;
    const list = Object.assign(pending, { links: tokens.links }) as TokensList;
    segments.push({ kind: "html", html: marked.parser(list) });
    pending = [];
  };

  let quizIndex = 0;

  // A kvíz kérdéseinek és válaszlehetőségeinek szövege soron belüli Markdown → HTML.
  const inline = (text: string) => marked.parseInline(text, { async: false });

  tokens.forEach((token, i) => {
    if (token.type === "html") depth = Math.max(0, depth + detailsDelta(token.raw));
    // Kvízblokk (```quiz): interaktív feladatlap lesz belőle.
    const quizInfo = token.type === "code" ? parseQuizInfo((token as Tokens.Code).lang) : null;
    if (quizInfo?.quiz && depth === 0) {
      flush();
      const { questions } = parseQuiz((token as Tokens.Code).text);
      segments.push({
        kind: "quiz",
        index: quizIndex++,
        required: quizInfo.required,
        questions: questions.map((q) => ({
          ...q,
          prompt: inline(q.prompt),
          hint: q.hint && inline(q.hint),
          ...(q.kind === "choice" ? { choices: q.choices.map(inline) } : {}),
        })),
      });
      return;
    }
    const info = token.type === "code" ? parseCodeInfo((token as Tokens.Code).lang) : null;
    if (
      !info ||
      info.lang !== "python" ||
      depth > 0 ||
      (info.role !== "run" && info.role !== "starter")
    ) {
      pending.push(token);
      return;
    }
    flush();
    const code = (token as Tokens.Code).text;
    const label = blockLabel((token as Tokens.Code).lang, locale);
    if (info.role === "run") {
      segments.push({ kind: "run", code, label, codeHtml: highlightCode(h, code, "python") });
      return;
    }
    // A feladathoz tartozó ellenőrzés: az első test blokk a következő starter előtt.
    let test: string | null = null;
    for (const next of tokens.slice(i + 1)) {
      if (next.type !== "code") continue;
      const role = parseCodeInfo((next as Tokens.Code).lang).role;
      if (role === "starter") break;
      if (role === "test") {
        test = (next as Tokens.Code).text;
        break;
      }
    }
    segments.push({
      kind: "exercise",
      index: exerciseIndex++,
      starter: code,
      test,
      required: info.required,
      label,
    });
  });
  flush();
  return segments;
}

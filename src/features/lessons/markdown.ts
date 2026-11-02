import "server-only";
import { Marked, type Tokens } from "marked";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { parseCodeInfo, type CodeRole } from "./code-info";

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
const ROLE_LABELS: Record<string, Record<CodeRole, string>> = {
  hu: {
    run: "futtatható példa",
    starter: "kiinduló kód",
    solution: "megoldás",
    test: "ellenőrzés",
  },
  en: { run: "runnable example", starter: "starter code", solution: "solution", test: "check" },
};

// Egy kódblokk HTML-je: fejléc a nyelv nevével (és szerepével), alatta a színezett kód
// (ismeretlen nyelvnél színezés nélkül).
function codeBlock(h: HighlighterCore, { text, lang }: Tokens.Code, locale: string): string {
  const { lang: raw, role } = parseCodeInfo(lang);
  const name = (raw in LANGS ? raw : ALIASES[raw]) as keyof typeof LANGS | undefined;
  const base = name ? LABELS[name] : NO_LABEL.has(raw) ? "" : raw;
  const roleLabel = role ? (ROLE_LABELS[locale] ?? ROLE_LABELS.hu)[role] : "";
  const label = [base, roleLabel].filter(Boolean).join(" · ");
  const code = name
    ? h.codeToHtml(text, {
        lang: name,
        themes: { dark: "github-dark", light: "github-light" },
        defaultColor: false,
      })
    : `<pre class="shiki"><code>${escapeHtml(text)}</code></pre>`;
  const header = label ? `<div class="code-label">${escapeHtml(label)}</div>` : "";
  // A data-role / data-lang a későbbi futtatónak szól (melyik blokk mit jelent).
  const data = role ? ` data-role="${role}" data-lang="${escapeHtml(name ?? raw)}"` : "";
  return `<div class="code-block"${data}>${header}${code}</div>`;
}

/**
 * Markdown → HTML. A címsorok egy szinttel lejjebb kerülnek (# → h2), mert az oldal címe a h1.
 * A `locale` a kódblokkok szerep-feliratainak nyelve.
 */
export async function renderMarkdown(markdown: string, locale = "hu"): Promise<string> {
  const h = await getHighlighter();
  const marked = new Marked({
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
  return marked.parse(markdown, { async: false });
}

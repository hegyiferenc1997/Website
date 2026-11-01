import "server-only";
import { Marked, type Tokens } from "marked";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// A leckék Markdown szövegét HTML-lé alakítja a szerveren, színezett kódrészletekkel.
// A böngészőbe kész HTML megy, így a kódkiemeléshez nem kell JavaScriptet letölteni.
// A színek a téma szerint váltanak (lásd .lesson-body a globals.css-ben).

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
};

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
};

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [import("shiki/themes/github-dark.mjs"), import("shiki/themes/github-light.mjs")],
    langs: Object.values(LANGS).map((load) => load()),
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function codeBlock(h: HighlighterCore, { text, lang }: Tokens.Code): string {
  const raw = (lang ?? "").trim().split(/\s+/)[0].toLowerCase();
  const name = (raw in LANGS ? raw : ALIASES[raw]) as keyof typeof LANGS | undefined;
  const label = name ? LABELS[name] : raw;
  const code = name
    ? h.codeToHtml(text, {
        lang: name,
        themes: { dark: "github-dark", light: "github-light" },
        defaultColor: false,
      })
    : `<pre class="shiki"><code>${escapeHtml(text)}</code></pre>`;
  const header = label ? `<div class="code-label">${escapeHtml(label)}</div>` : "";
  return `<div class="code-block">${header}${code}</div>`;
}

/** Markdown → HTML. A címsorok egy szinttel lejjebb kerülnek (# → h2), mert az oldal címe a h1. */
export async function renderMarkdown(markdown: string): Promise<string> {
  const h = await getHighlighter();
  const marked = new Marked({
    gfm: true,
    renderer: {
      code: (token) => codeBlock(h, token),
      heading({ tokens, depth }) {
        const level = Math.min(depth + 1, 6);
        return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>`;
      },
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

// Képletek a leckékben: $…$ (soron belül) és $$…$$ (külön sorban) LaTeX-jelöléssel.
// A KaTeX a szerveren kész HTML-t készít belőlük, így a böngészőnek csak a stíluslap és a betűk kellenek
// (lásd scripts/copy-katex.mjs és a lecke oldala). Hibás képletnél kivételt dob (a tesztek így kiszűrik).

import katex from "katex";
import type { MarkedExtension, Tokens } from "marked";

/** A KaTeX verziója: a stíluslap a public/katex/<verzió>/ mappában van. */
export const KATEX_VERSION: string = katex.version;

/** Egy képlet HTML-je. */
export function renderTex(tex: string, display: boolean): string {
  return katex.renderToString(tex, {
    displayMode: display,
    throwOnError: true,
    // Csak HTML + MathML (felolvasóprogramoknak); a \def és társai nem kellenek.
    output: "htmlAndMathml",
    strict: "ignore",
  });
}

// Soron belüli képlet: $…$, a nyitó $ után és a záró $ előtt nincs szóköz, a záró $ után nincs számjegy
// (így pl. az „5$ és 10$” nem lesz képlet). A \$ a képleten belül megengedett.
const INLINE = /^\$(?!\s)((?:\\\$|[^$\n])+?)(?<!\s)\$(?!\d)/;
// Külön sorban álló képlet: $$…$$ (több soros is lehet).
const BLOCK = /^\$\$([\s\S]+?)\$\$[ \t]*(?:\n|$)/;

/** A Marked bővítménye a képletekhez. */
export const mathExtension: MarkedExtension = {
  extensions: [
    {
      name: "mathBlock",
      level: "block",
      start: (src) => {
        const i = src.indexOf("$$");
        return i < 0 ? undefined : i;
      },
      tokenizer(src) {
        const m = BLOCK.exec(src);
        if (m) return { type: "mathBlock", raw: m[0], text: m[1].trim() };
      },
      renderer: (token) =>
        `<div class="math-display">${renderTex((token as Tokens.Generic).text, true)}</div>\n`,
    },
    {
      name: "mathInline",
      level: "inline",
      start: (src) => {
        const i = src.indexOf("$");
        return i < 0 ? undefined : i;
      },
      tokenizer(src) {
        const m = /^\$\$([^$]+?)\$\$/.exec(src) ?? INLINE.exec(src);
        if (m)
          return {
            type: "mathInline",
            raw: m[0],
            text: m[1].trim(),
            display: src.startsWith("$$"),
          };
      },
      renderer: (token) =>
        renderTex((token as Tokens.Generic).text, (token as Tokens.Generic).display),
    },
  ],
};

/** Van-e képlet a kész HTML-ben (ilyenkor kell a KaTeX stíluslapja). */
export const hasMath = (html: string) => html.includes('class="katex');

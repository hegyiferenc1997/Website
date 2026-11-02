// Kicsi, gyors Python kódszínező a szerkesztőhöz. A szerveren és a böngészőben is ugyanezt használjuk,
// így gépeléskor nem ugrálnak a színek. (A leckék statikus kódjait a Shiki színezi, lásd markdown.ts;
// az túl nagy ahhoz, hogy minden leütésnél a böngészőben fusson.)

const KEYWORDS = new Set(
  (
    "False None True and as assert async await break class continue def del elif else except " +
    "finally for from global if import in is lambda nonlocal not or pass raise return try while with yield " +
    "match case"
  ).split(" "),
);

const BUILTINS = new Set(
  (
    "print input len range int float str bool list dict set tuple type isinstance sum min max abs round " +
    "sorted reversed enumerate zip map filter any all open super object iter next repr ord chr divmod pow " +
    "hasattr getattr setattr id hash format frozenset bytes help dir vars callable exit self"
  ).split(" "),
);

// Egy menetben felismert elemek: megjegyzés, szöveg (egy- és háromszoros idézőjel, f-string), szám, név.
const TOKEN =
  /(#[^\n]*)|((?:[rRbBuUfF]{0,2})(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?))|(\b\d[\d_]*(?:\.\d*)?(?:[eE][+-]?\d+)?j?\b)|([A-Za-z_À-ɏ][\wÀ-ɏ]*)|(@[\w.]+)/g;

// HTML-ben különleges karakterek kódolása.
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Python kód → HTML színezett <span>-okkal (osztályok: py-kw, py-str, py-com, py-num, py-fn, py-def). */
export function highlightPython(code: string): string {
  let out = "";
  let last = 0;
  // A def / class utáni név külön színt kap.
  let afterDef = false;
  for (const m of code.matchAll(TOKEN)) {
    const [text, comment, string, number, name, decorator] = m;
    out += escape(code.slice(last, m.index));
    last = m.index + text.length;
    let cls = "";
    if (comment) cls = "py-com";
    else if (string) cls = "py-str";
    else if (number) cls = "py-num";
    else if (decorator) cls = "py-fn";
    else if (name) {
      if (afterDef) cls = "py-def";
      else if (KEYWORDS.has(name)) cls = "py-kw";
      else if (BUILTINS.has(name)) cls = "py-fn";
    }
    afterDef = name === "def" || name === "class";
    out += cls ? `<span class="${cls}">${escape(text)}</span>` : escape(text);
  }
  out += escape(code.slice(last));
  // Az utolsó üres sor is látsszon (különben a szövegdoboz és a színezett réteg elcsúszna).
  return out + "\n";
}

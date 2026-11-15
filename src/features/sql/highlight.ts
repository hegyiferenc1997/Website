// Kicsi, gyors SQL kódszínező a szerkesztőhöz (a Python színezőhöz hasonlóan, lásd python/highlight.ts).
// Ugyanazokat a CSS osztályokat használja (py-kw, py-str, …), így a színek egységesek.

const KEYWORDS = new Set(
  (
    "select from where and or not in is null like ilike between as distinct order by asc desc limit offset " +
    "group having join inner left right full outer cross on using natural union intersect except all any some " +
    "exists case when then else end insert into values update set delete returning create table view index " +
    "unique primary key foreign references check default constraint drop alter add column rename to cascade " +
    "restrict if begin commit rollback savepoint release transaction grant revoke role user with recursive " +
    "materialized explain analyze true false conflict do nothing nulls first last over partition window " +
    "rollup cube grouping sets filter lateral schema sequence trigger function returns language replace " +
    "policy enable row level security for to public isolation serializable read committed repeatable " +
    "temporary temp generated always identity serial bigserial vacuum truncate"
  ).split(" "),
);

const TYPES = new Set(
  (
    "int integer bigint smallint numeric decimal real float double precision text varchar char character " +
    "varying boolean bool date time timestamp timestamptz interval json jsonb uuid bytea money"
  ).split(" "),
);

const FUNCS = new Set(
  (
    "count sum avg min max coalesce nullif round upper lower length trim substring concat now extract " +
    "date_trunc cast row_number rank dense_rank lag lead string_agg array_agg jsonb_build_object to_char " +
    "abs floor ceil greatest least age current_date current_timestamp generate_series"
  ).split(" "),
);

// Egy menetben felismert elemek: megjegyzés (-- és /* */), szöveg ('…'), azonosító ("…"), szám, név.
const TOKEN =
  /(--[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|('(?:''|[^'])*'?)|("(?:""|[^"])*"?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_À-ɏ][\wÀ-ɏ]*)/g;

// HTML-ben különleges karakterek kódolása.
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** SQL kód → HTML színezett <span>-okkal. */
export function highlightSql(code: string): string {
  let out = "";
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    const [text, comment, string, , number, name] = m;
    out += escape(code.slice(last, m.index));
    last = m.index + text.length;
    let cls = "";
    if (comment) cls = "py-com";
    else if (string) cls = "py-str";
    else if (number) cls = "py-num";
    else if (name) {
      const lower = name.toLowerCase();
      if (KEYWORDS.has(lower)) cls = "py-kw";
      else if (TYPES.has(lower)) cls = "py-def";
      else if (FUNCS.has(lower)) cls = "py-fn";
    }
    out += cls ? `<span class="${cls}">${escape(text)}</span>` : escape(text);
  }
  out += escape(code.slice(last));
  // Az utolsó üres sor is látsszon (különben a szövegdoboz és a színezett réteg elcsúszna).
  return out + "\n";
}

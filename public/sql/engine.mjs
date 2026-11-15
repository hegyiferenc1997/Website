// A böngészős SQL futtató közös logikája (PostgreSQL a böngészőben, PGlite). Ezt használja a háttérszál
// (worker.mjs) és a tesztek is (tests/sql-examples.test.ts), így ami a teszten átmegy, az az oldalon is.
// Minden futtatás egy friss, a memóriában élő adatbázis-másolaton fut: a tanuló semmit nem ronthat el
// tartósan, és nincs szerver, amit elérhetne (a kód csak a saját böngészőjében fut).

// Legfeljebb ennyi sort küldünk vissza megjelenítésre utasításonként (az összevetés a teljes eredményt nézi).
export const MAX_ROWS = 200;
// Legfeljebb ennyi utasítás eredményét mutatjuk (a végéről).
const MAX_RESULTS = 20;
// A kód hossza felső korláttal (egy lecke feladatához bőven elég).
const MAX_CODE = 20_000;

// Dátum- és időtípusok azonosítói a PostgreSQL-ben (date, timestamp, timestamptz).
const DATE_OID = 1082;
const TIMESTAMP_OIDS = new Set([1114, 1184]);

// Két számjegyre kiegészítés a dátumokhoz.
const pad = (n) => String(n).padStart(2, "0");

/** Egy cella értéke szövegként (null marad null), hogy a megjelenítés és az összevetés egyszerű legyen. */
export function formatValue(value, typeId) {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) {
    const d = `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`;
    if (typeId === DATE_OID) return d;
    if (TIMESTAMP_OIDS.has(typeId) || value.getUTCHours() || value.getUTCMinutes()) {
      return `${d} ${pad(value.getUTCHours())}:${pad(value.getUTCMinutes())}:${pad(value.getUTCSeconds())}`;
    }
    return d;
  }
  // A bytea (bináris) értéket a PostgreSQL szokásos \x… hexa alakjában mutatjuk.
  if (value instanceof Uint8Array) {
    return "\\x" + Array.from(value, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/** Egy utasítás eredménye egyszerű, átküldhető alakban. */
function toResult(r) {
  const columns = r.fields.map((f) => f.name);
  const rows = r.rows.map((row) => row.map((v, i) => formatValue(v, r.fields[i]?.dataTypeID)));
  return {
    command: r.command ?? "",
    columns,
    rows,
    total: rows.length,
    // Az INSERT / UPDATE / DELETE ennyi sort érintett.
    affected: typeof r.rowCount === "number" ? r.rowCount : null,
  };
}

/** A hibaüzenet és hogy hányadik sorban volt (a PostgreSQL karakterpozíciót ad). */
function describeError(error, code) {
  const message = String(error?.message ?? error);
  const pos = Number(error?.position);
  const line = pos > 0 && code ? code.slice(0, pos - 1).split("\n").length : null;
  return { error: message, hint: error?.hint ? String(error.hint) : null, line };
}

/** Utasítások futtatása; a hibát kivételként dobja (a hívó dönti el, mit jelent). */
async function execAll(db, sql) {
  const results = await db.exec(sql, { rowMode: "array" });
  return results.map(toResult);
}

// Az utolsó olyan eredmény, amelynek vannak oszlopai (SELECT, RETURNING, EXPLAIN …).
const lastTable = (results) => [...results].reverse().find((r) => r.columns.length > 0) ?? null;

// Számnak látszó értékek egységesítése (2.50 = 2.5, AVG sok tizedese), hogy a forma ne számítson.
function normalizeCell(v) {
  if (v === null) return "\u0000NULL";
  if (/^[-+]?\d+(\.\d+)?(e[-+]?\d+)?$/i.test(v)) {
    const n = Number(v);
    if (Number.isFinite(n)) return String(Math.round(n * 1e6) / 1e6);
  }
  return v;
}

/**
 * A tanuló eredményének összevetése a várt eredménnyel. Az oszlopok nevét nem nézzük (az alias lehet
 * más), csak a számukat és az értékeket. ordered = számít-e a sorok sorrendje (ORDER BY a megoldásban).
 * Visszaad: null, ha egyezik; különben az eltérés oka.
 */
export function compareResults(got, expected, ordered) {
  if (!expected) return null;
  if (!got) return { reason: "noResult" };
  if (got.columns.length !== expected.columns.length)
    return { reason: "columns", got: got.columns.length, expected: expected.columns.length };
  if (got.total !== expected.total)
    return { reason: "rowCount", got: got.total, expected: expected.total };
  const key = (row) => JSON.stringify(row.map(normalizeCell));
  const a = got.allRows.map(key);
  const b = expected.allRows.map(key);
  if (!ordered) {
    a.sort();
    b.sort();
  }
  const i = a.findIndex((k, idx) => k !== b[idx]);
  if (i === -1) return null;
  return ordered ? { reason: "row", row: i + 1 } : { reason: "values" };
}

// Számít-e a sorrend: ha a megoldás (vagy az ellenőrző lekérdezés) rendez.
const isOrdered = (sql) => /\border\s+by\b/i.test(sql ?? "");

/** Az eredmény levágása a megjelenítéshez (a teljes sorokat az összevetés még használja). */
function forDisplay(r) {
  if (!r) return null;
  const { allRows, ...rest } = r;
  return { ...rest, rows: (allRows ?? r.rows).slice(0, MAX_ROWS) };
}

// A teljes sorok megőrzése az összevetéshez (a megjelenítés később vágja le).
const keepAll = (results) => results.map((r) => ({ ...r, allRows: r.rows }));

/**
 * Az SQL futtató. `PGlite` az osztály (a böngészőben a public/pglite/<verzió>/ mappából, a tesztben az
 * npm csomagból); egy üres alap-adatbázist egyszer indít el, és minden futtatáshoz klónozza.
 */
export function createSqlEngine(PGlite) {
  let base = null;
  // Az utolsó mintaadatbázis (setup) kész állapota: ugyanannál a leckénél nem kell újra felépíteni.
  let cached = null;

  async function getBase() {
    base ??= await PGlite.create();
    return base;
  }

  /** Friss adatbázis a mintaadatokkal (a setup SQL-lel). */
  async function freshDb(setup) {
    const root = await getBase();
    if (!setup) return root.clone();
    if (cached?.setup !== setup) {
      const db = await root.clone();
      await db.exec(setup);
      if (cached) await cached.db.close();
      cached = { setup, db };
    }
    return cached.db.clone();
  }

  // Ideiglenes adatbázis lezárása (felszabadítja a memóriát), a hibát elnyeljük.
  async function closeQuietly(db) {
    try {
      await db?.close();
    } catch {}
  }

  /**
   * Egy futtatás. Ha van `solution`, ellenőrzés is: a tanuló kódja és a megoldás után (külön-külön
   * friss adatbázison) lefut az ellenőrző lekérdezés (`check`), vagy ha nincs, az utolsó lekérdezésük
   * eredményét vetjük össze.
   * @param {{ setup?: string, code?: string, solution?: string | null, check?: string | null }} opts
   */
  async function run({ setup = "", code = "", solution = null, check = null }) {
    if (typeof code !== "string" || code.length > MAX_CODE) {
      return { ok: false, phase: "code", error: "Too long", results: [] };
    }
    if (!code.trim()) return { ok: false, phase: "code", empty: true, results: [] };
    let db = null;
    try {
      try {
        db = await freshDb(setup);
      } catch (e) {
        return { ok: false, phase: "setup", ...describeError(e, setup), results: [] };
      }
      let results;
      try {
        results = keepAll(await execAll(db, code));
      } catch (e) {
        return { ok: false, phase: "code", ...describeError(e, code), results: [] };
      }
      const shown = results.slice(-MAX_RESULTS).map(forDisplay);
      if (solution === null) return { ok: true, results: shown };

      // Ellenőrzés: a tanuló oldala.
      let got;
      try {
        got = check ? lastTable(keepAll(await execAll(db, check))) : lastTable(results);
      } catch (e) {
        return { ok: false, phase: "check", ...describeError(e, check), results: shown };
      }
      // A várt eredmény: ugyanez a megoldással, friss adatbázison.
      let expected;
      const db2 = await freshDb(setup);
      try {
        const solved = keepAll(await execAll(db2, solution));
        expected = check ? lastTable(keepAll(await execAll(db2, check))) : lastTable(solved);
      } finally {
        await closeQuietly(db2);
      }
      const mismatch = compareResults(got, expected, isOrdered(check ?? solution));
      return {
        ok: mismatch === null,
        phase: mismatch ? "check" : null,
        mismatch,
        results: shown,
        // Hibás eredménynél megmutatjuk az ellenőrzés saját és várt kimenetét is.
        got: mismatch && check ? forDisplay(got) : null,
        expected: mismatch ? forDisplay(expected) : null,
      };
    } finally {
      await closeQuietly(db);
    }
  }

  return { run, ready: getBase };
}

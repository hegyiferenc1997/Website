// A böngészős SQL futtató háttérszála (Web Worker). Itt fut a PGlite (PostgreSQL WebAssemblyben), így
// egy nagyon lassú lekérdezés sem fagyasztja le az oldalt: a főszál egyszerűen leállítja a workert.
// Üzenetek (lásd src/features/sql/runner.ts):
//   be:  { type: "init", baseURL }                           – a PGlite betöltése (egyszer)
//        { type: "run", id, setup, code, solution, check }   – futtatás / ellenőrzés
//   ki:  { type: "ready" } | { type: "loadError", error }
//        { type: "done", id, result }

import { createSqlEngine } from "./engine.mjs";

let engine = null;

// Betöltés: a PGlite csak a saját szerverünk verziózott mappájából jöhet (más címet nem fogadunk el).
async function init(baseURL) {
  try {
    if (typeof baseURL !== "string" || !/^\/pglite\/[\w.-]+\/$/.test(baseURL))
      throw new Error("url");
    const { PGlite } = await import(/* webpackIgnore: true */ baseURL + "index.js");
    engine = createSqlEngine(PGlite);
    await engine.ready();
    postMessage({ type: "ready" });
  } catch (error) {
    postMessage({ type: "loadError", error: String(error) });
  }
}

// Egy futtatás; csak szöveges mezőket adunk tovább.
async function run({ id, setup, code, solution, check }) {
  const str = (v) => (typeof v === "string" ? v : null);
  let result;
  try {
    result = await engine.run({
      setup: str(setup) ?? "",
      code: str(code) ?? "",
      solution: str(solution),
      check: str(check),
    });
  } catch (error) {
    result = { ok: false, phase: "code", error: String(error), results: [] };
  }
  postMessage({ type: "done", id, result });
}

onmessage = (event) => {
  const data = event.data;
  if (data?.type === "init") void init(data.baseURL);
  else if (data?.type === "run" && engine) void run(data);
};

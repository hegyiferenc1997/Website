// A böngészős Python futtató háttérszála (Web Worker). Itt fut a Pyodide (Python WebAssemblyben),
// így egy hosszú vagy végtelen ciklus sem fagyasztja le az oldalt: a főszál egyszerűen leállítja a workert.
// Üzenetek (lásd src/features/python/runner.ts):
//   be:  { type: "init", indexURL }            – a Pyodide betöltése (egyszer)
//        { type: "run", id, code, test, stdin, lang } – kód futtatása
//   ki:  { type: "ready" } | { type: "loadError", error }
//        { type: "out", id, text }             – kiírt szöveg (folyamatosan)
//        { type: "done", id, result }          – vége: { ok, phase, error }

let pyodide = null;
let harness = null;
// Melyik futtatáshoz tartozik a most érkező kimenet.
let currentId = 0;

// A kiírt szöveget kis csomagokban küldjük, hogy sok print se lassítsa a felületet.
let buffer = "";
let flushTimer = 0;
function emit(text) {
  buffer += text;
  if (!flushTimer) flushTimer = setTimeout(flush, 30);
}
function flush() {
  clearTimeout(flushTimer);
  flushTimer = 0;
  if (buffer) postMessage({ type: "out", id: currentId, text: buffer });
  buffer = "";
}

// Betöltés: a Pyodide motor, majd a keret (harness.py) Python modulként.
async function init(indexURL) {
  try {
    const { loadPyodide } = await import(/* webpackIgnore: true */ indexURL + "pyodide.mjs");
    pyodide = await loadPyodide({ indexURL });
    // A Python kimenete bájtonként érkezik; szöveggé alakítjuk és továbbküldjük.
    const writer = () => {
      const decoder = new TextDecoder();
      return { write: (bytes) => (emit(decoder.decode(bytes, { stream: true })), bytes.length) };
    };
    pyodide.setStdout(writer());
    pyodide.setStderr(writer());
    const source = await (await fetch(new URL("./harness.py", import.meta.url))).text();
    pyodide.FS.writeFile("/home/pyodide/em_harness.py", source);
    harness = pyodide.pyimport("em_harness");
    postMessage({ type: "ready" });
  } catch (error) {
    postMessage({ type: "loadError", error: String(error) });
  }
}

// Egy futtatás: a keret run() függvénye, az eredmény sima JS objektumként megy vissza.
function run({ id, code, test, stdin, lang }) {
  currentId = id;
  let result;
  try {
    const py = harness.run(code, test ?? null, stdin ?? "", lang ?? "hu", id);
    result = py.toJs({ dict_converter: Object.fromEntries });
    py.destroy();
  } catch (error) {
    result = { ok: false, phase: "code", error: String(error) };
  }
  flush();
  postMessage({ type: "done", id, result });
}

onmessage = (event) => {
  const data = event.data;
  if (data.type === "init") void init(data.indexURL);
  else if (data.type === "run") run(data);
};

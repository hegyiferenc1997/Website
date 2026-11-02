# A böngészős Python futtató „kerete”: lefuttatja a tanuló kódját (és ha van, az ellenőrző kódot),
# elkapja a kimenetet és a hibákat, és barátságos eredményt ad vissza.
# A böngészőben a Pyodide (public/python/worker.mjs), a tesztekben a gépi Python használja
# (tests/python-examples.test.ts), így a kettő pontosan ugyanúgy viselkedik.

import builtins
import io
import linecache
import os
import sys
import traceback

# A tanuló kódjának és az ellenőrzésnek a „fájlneve” a hibaüzenetekben.
CODE_FILE = "<kód>"
TEST_FILE = "<ellenőrzés>"

# A keret saját üzenetei a felület nyelvén.
MESSAGES = {
    "hu": {
        "eof": "Nincs több bemenet: írd a beolvasandó sorokat a „Bemenet” mezőbe!",
    },
    "en": {
        "eof": "No more input: type the lines to read into the “Input” box!",
    },
}


class Tee(io.TextIOBase):
    """Kimeneti áramlás, amely az eredeti helyre is ír, és közben el is menti a szöveget."""

    def __init__(self, target):
        self.target = target
        self.parts = []

    def write(self, text):
        self.parts.append(text)
        self.target.write(text)
        return len(text)

    def flush(self):
        self.target.flush()

    def value(self):
        return "".join(self.parts)


def register_source(filename, code):
    """A kód sorait a linecache-be tesszük, hogy a hibaüzenet a hibás sort is megmutassa."""
    linecache.cache[filename] = (len(code), None, code.splitlines(True), filename)


def format_error(exc):
    """A hibaüzenet (traceback) csak a tanuló kódjának és az ellenőrzésnek a soraival, a keret nélkül."""
    te = traceback.TracebackException.from_exception(exc)
    # A keret saját sorait (pl. a saját input()) kiszűrjük, a láncolt kivételekben is.
    seen = set()
    stack = [te]
    while stack:
        item = stack.pop()
        if id(item) in seen:
            continue
        seen.add(id(item))
        item.stack = traceback.StackSummary.from_list(
            [f for f in item.stack if f.filename in (CODE_FILE, TEST_FILE)]
        )
        stack += [x for x in (item.__cause__, item.__context__) if x is not None]
    return "".join(te.format())


def run(code, test=None, stdin="", lang="hu", run_id=0):
    """
    Lefuttatja a kódot, majd (ha van) az ellenőrzést ugyanabban a névtérben.
    Az ellenőrzés a `kimenet` / `output` változóban megkapja a kód teljes kiírását.
    Eredmény: {"ok": bool, "phase": None | "code" | "test", "error": szöveg vagy None}.
    """
    msg = MESSAGES.get(lang, MESSAGES["hu"])
    lines = stdin.splitlines()

    # Saját input(): kiírja a kérdést és a „beírt” sort is, mint egy igazi terminálban.
    def fake_input(prompt=""):
        print(prompt, end="")
        if not lines:
            print()
            raise EOFError(msg["eof"])
        line = lines.pop(0)
        print(line)
        return line

    # Minden futtatás saját, üres mappában indul (a fájlkezelős példák ne zavarják egymást).
    old_cwd = os.getcwd()
    if run_id:
        folder = f"/tmp/futtatas-{run_id}"
        os.makedirs(folder, exist_ok=True)
        os.chdir(folder)

    out = Tee(sys.stdout)
    old_stdout, old_stdin, old_input = sys.stdout, sys.stdin, builtins.input
    sys.stdout, sys.stdin, builtins.input = out, io.StringIO(stdin), fake_input
    namespace = {"__name__": "__main__", "__builtins__": builtins}
    phase = "code"
    try:
        register_source(CODE_FILE, code)
        exec(compile(code, CODE_FILE, "exec"), namespace)
        if test:
            phase = "test"
            sys.stdout.flush()
            namespace["kimenet"] = namespace["output"] = out.value()
            register_source(TEST_FILE, test)
            exec(compile(test, TEST_FILE, "exec"), namespace)
        return {"ok": True, "phase": None, "error": None}
    except SystemExit as exc:
        # A sys.exit() / exit() nem hiba, ha 0 vagy None a kódja.
        if exc.code in (None, 0) and phase == "code" and not test:
            return {"ok": True, "phase": None, "error": None}
        return {"ok": False, "phase": phase, "error": format_error(exc)}
    except BaseException as exc:  # noqa: BLE001 – minden hibát a tanulónak mutatunk
        return {"ok": False, "phase": phase, "error": format_error(exc)}
    finally:
        sys.stdout.flush()
        sys.stdout, sys.stdin, builtins.input = old_stdout, old_stdin, old_input
        os.chdir(old_cwd)

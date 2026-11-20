---
title: Deeper – The Runtime Environment from the Inside
summary: Where your program really runs – the sys and platform modules tell you (in the browser, in WebAssembly), where Python loads modules from, checking version constraints in a requirements file, settings from environment variables without secrets, and command-line parameters with argparse.
minutes: 50
---

## What you will learn in this lesson

- how to **ask** from within the program what environment it's running in,
- where Python **loads** modules from, and why a virtual environment is needed,
- how to check whether the installed packages meet the **version constraints**,
- how a program gets **settings** from outside: from environment variables and command-line parameters.

## 1. Where does your program run?

In the basic lesson we saw that the same Python code can run on your own machine, a server, a container – or on this page, in the browser. The `sys` and `platform` modules tell us where we are right now:

```python run
# Querying the runtime environment from the program
import platform
import sys

print("Python version:  ", sys.version.split()[0])
print("implementation:  ", platform.python_implementation())
print("operating system:", sys.platform)
print("machine:         ", platform.machine() or "(unknown)")
print("byte order:      ", sys.byteorder)
print("largest index:   ", sys.maxsize)

if sys.platform == "emscripten":
    print("→ you're running in the browser, with Python compiled to WebAssembly (Pyodide)")
else:
    print("→ you're running on a traditional operating system")
```

If you run this here, on the page, the operating system will be `emscripten`: the CPython interpreter was compiled to **WebAssembly**, and your browser runs it – without a server. On your own machine the same code prints `win32`, `linux` or `darwin` (macOS). Programs sometimes decide based on this: e.g. file paths look different on Windows and Linux.

## 2. Where do modules come from?

The `import` statement looks for the module in the folders listed in `sys.path`, **in order** – the first match wins. That's why it can be a surprise if you name your own file `random.py`: Python loads that instead of the built-in one:

```python run
# The module search path and where a module lives
import sys
import json

print("the first few entries of the search path:")
for folder in sys.path[:4]:
    print("  ", folder or "(the current folder)")
print("the json module came from:", json.__file__)
print("number of loaded modules:", len(sys.modules))
print("built-in modules (a few):", sorted(sys.builtin_module_names)[:6], "...")
```

A **virtual environment** (`python -m venv .venv`) gives the installed packages their own folder and puts it on `sys.path`. This way one project's packages don't mix with another's: one can use a library in version 1.x, the other in 2.x, on the same machine.

## 3. Checking version constraints

A project's dependencies are listed in a `requirements.txt` (or `pyproject.toml`) file, **with version constraints**. Let's write a small checker that tells whether the installed versions meet them:

```python run
# Checking requirements-style version constraints
import re

requirements = """
requests>=2.31
numpy==2.1.0
pandas>=2.0,<3
flask
"""
installed = {"requests": "2.32.3", "numpy": "2.0.1", "pandas": "2.2.2", "flask": "3.0.3"}

def version(v):
    return tuple(int(x) for x in v.split("."))      # "2.10.1" → (2, 10, 1): compares as numbers

OPERATIONS = {">=": lambda a, b: a >= b, "<=": lambda a, b: a <= b, "==": lambda a, b: a == b,
              ">": lambda a, b: a > b, "<": lambda a, b: a < b}

for line in requirements.strip().splitlines():
    name = re.match(r"[A-Za-z0-9_-]+", line).group()
    constraints = re.findall(r"(>=|<=|==|>|<)([\d.]+)", line)
    have = version(installed[name])
    bad = [f"{op}{v}" for op, v in constraints if not OPERATIONS[op](have, version(v))]
    status = "ok" if not bad else "does NOT match: " + ", ".join(bad)
    print(f"{name:<9} {installed[name]:<7} {line[len(name):] or '(any)':<12} {status}")
```

The `numpy==2.1.0` constraint asks for an exact version, but 2.0.1 is installed – this is the situation where a program "works on my machine, not on yours". That's why teams pin **exact** versions in a lockfile: this way everyone, the server included, installs byte-for-byte the same packages.

## 4. Settings from outside: environment variables and the command line

**Don't** write a program's settings (port, database address, debug mode) into the code: let it get them from the environment. This way the same code can run on the developer's machine and in production, and a **password** never ends up in version control:

```python run
# Settings from environment variables (with defaults) and command-line parameters
import argparse
import os

os.environ.setdefault("APP_PORT", "8080")                # set here only for the example

port = int(os.environ.get("APP_PORT", "8000"))
debug = os.environ.get("APP_DEBUG", "0").lower() in ("1", "true", "yes")
print(f"port: {port}, debug mode: {debug}")
print("password in the code? NO – in production the environment provides it:", "DB_PASSWORD" in os.environ)

# command-line parameters: in reality an empty parse_args() reads sys.argv
parser = argparse.ArgumentParser(prog="grades", description="Summing grades from a CSV")
parser.add_argument("file", help="the CSV file to read")
parser.add_argument("--min", type=int, default=2, help="the smallest grade taken into account")
parser.add_argument("--verbose", action="store_true", help="verbose output")

args = parser.parse_args(["grades.csv", "--min", "3", "--verbose"])
print("parsed parameters:", args)
print("file:", args.file, "| min:", args.min, "| verbose:", args.verbose)
parser.print_help()
```

`argparse` gives you **help** (`--help`), type checking (`--min abc` gives an error) and defaults for free. Environment variables are always **strings** – we have to convert numbers and booleans ourselves, and watch out: the string `"0"` would be true as a boolean (`bool("0")` → `True`)!

| Viewpoint     | What do they expect from the runtime environment?                                        |
| ------------- | ---------------------------------------------------------------------------------------- |
| **developer** | "works on my machine" = works everywhere: virtual environment, pinned versions           |
| **operator**  | configuration via environment variables, without rebuilding; the same package everywhere |
| **security**  | passwords and API keys never in the code; dependencies' vulnerabilities must be watched  |
| **user**      | it should run without installation (browser, web app), or with a single click            |

## Summary

- The `sys` and `platform` modules show the runtime environment; in the browser Python runs in WebAssembly.
- `import` searches the folders of `sys.path`; a virtual environment gives each project its own package folder.
- Version constraints and a lockfile make installation reproducible.
- Settings should come from environment variables and command-line parameters; secrets never belong in the code.

## Lesson exercise: reading settings

Write the `config(env)` function, which makes a settings dictionary with three keys from a dictionary of environment variables (like `os.environ`)!

- `"port"`: the value of `PORT` as an integer; `8000` if not given.
- `"debug"`: `True` if the value of `DEBUG` (case-insensitively) is `"1"`, `"true"` or `"yes"`; `False` in every other case (and if missing).
- `"db_url"`: the value of `DB_URL`; this is required – if missing, raise a `KeyError`.

```python starter required
def config(env):
    return {
        "port": 8000,
        "debug": False,
        "db_url": "",
    }


print(config({"DB_URL": "postgres://localhost/app", "DEBUG": "True"}))
```

<details>
<summary>Solution</summary>

```python solution
def config(env):
    return {
        "port": int(env.get("PORT", "8000")),
        "debug": env.get("DEBUG", "").lower() in ("1", "true", "yes"),
        "db_url": env["DB_URL"],
    }


print(config({"DB_URL": "postgres://localhost/app", "DEBUG": "True"}))
```

</details>

```python test
c = config({"DB_URL": "postgres://localhost/app", "DEBUG": "True"})
assert c == {"port": 8000, "debug": True, "db_url": "postgres://localhost/app"}, "default port, DEBUG=True is true"
assert config({"DB_URL": "x", "PORT": "5000"})["port"] == 5000, "PORT is converted to an integer"
assert config({"DB_URL": "x", "DEBUG": "0"})["debug"] is False, "'0' is false (not bool('0')!)"
assert config({"DB_URL": "x", "DEBUG": "YES"})["debug"] is True, "case-insensitive"
try:
    config({"PORT": "5000"})
    assert False, "a missing DB_URL needs a KeyError"
except KeyError:
    pass
```

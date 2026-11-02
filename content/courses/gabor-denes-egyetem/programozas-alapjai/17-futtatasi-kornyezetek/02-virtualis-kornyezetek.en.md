---
title: Modules, Packages and Virtual Environments
summary: import, the standard library, pip, venv and requirements.txt – how to manage a program's dependencies.
minutes: 15
---

## What you will learn

- the difference between a **module**, a **package** and a **library**,
- how to install an external package with **pip**,
- what a **virtual environment** (`venv`) is for and how to create one,
- how to record dependencies in **`requirements.txt`**.

## Modules and the standard library

- **Module:** a `.py` file that can be imported.
- **Package:** a folder of modules.
- **Standard library:** the modules installed together with Python – "batteries included".

```python run
import math                      # import a whole module
from random import randint, seed # only certain names
import datetime as dt            # with a shorter alias
from collections import Counter

seed(1)                          # repeatable random numbers
print(math.sqrt(16), math.pi)
print(1 <= randint(1, 6) <= 6)
print(dt.date(2026, 9, 1).strftime("%Y-%m-%d"))
print(Counter("programming").most_common(2))
```

Some useful standard modules: `math`, `random`, `datetime`, `os`, `pathlib`, `json`, `csv`, `collections`, `itertools`, `statistics`, `unittest`, `argparse`, `logging`.

## Where does Python look for modules?

`import` searches the folders in the `sys.path` list: first the running script's folder, then the standard library, finally the installed packages (`site-packages`).

```python run
import sys

# The first few entries of the search path.
print(len(sys.path) > 0)
print(any("site-packages" in p or "dist-packages" in p for p in sys.path) or "no site-packages")
```

> Don't name your own file like a standard module (e.g. `random.py`, `math.py`) – Python would import your file instead!

## External packages: pip

External packages are available on **PyPI** (the Python Package Index, [pypi.org](https://pypi.org)) and are installed with the **pip** package manager:

```bash
pip install requests          # install
pip install requests==2.32.3  # a specific version
pip list                      # installed packages
pip show requests             # details of a package
pip uninstall requests        # remove
```

Popular packages: `requests` (HTTP), `numpy` (computation), `pandas` (tabular data), `matplotlib` (charts), `pytest` (testing), `flask`/`django` (web).

## Virtual environments (venv)

**Problem:** one project needs `numpy` 1.x, another needs 2.x. If everything is installed into the machine's shared Python, the projects clash.

**Solution:** each project gets its own **virtual environment** – a folder with its own Python interpreter and its own packages.

```bash
# 1. Create it in the project folder (creates the .venv folder)
python -m venv .venv

# 2. Activate
.venv\Scripts\activate        # Windows (PowerShell / cmd)
source .venv/bin/activate     # macOS / Linux

# 3. From now on pip installs into the environment
pip install requests

# 4. Leave
deactivate
```

In an active environment its name appears at the start of the prompt: `(.venv) C:\project>`. VS Code recognises the project's `.venv` folder automatically.

The program itself can check whether it runs in a virtual environment:

```python run
import sys

# In a virtual environment sys.prefix is the environment folder, which differs from the base Python's.
virtual = sys.prefix != sys.base_prefix
print("Running in a virtual environment:", virtual)
```

## requirements.txt

We record dependencies in a text file so that someone else (or you on another machine) can recreate exactly the same environment:

```bash
pip freeze > requirements.txt     # write out the installed packages
pip install -r requirements.txt   # install from the file
```

```text
requests==2.32.3
numpy==2.1.0
```

> **Don't** push the `.venv` folder to Git (put it in `.gitignore`) – anyone can recreate it from `requirements.txt`.

## Summary

- **Module** = a `.py` file, **package** = a folder of modules; the standard library offers many ready-made modules.
- External packages come from **PyPI**, via **pip**.
- Each project gets its own **virtual environment** (`python -m venv .venv`).
- Dependencies go into **`requirements.txt`**, the `.venv` folder into `.gitignore`.

## Lesson exercise: Checking installed packages

A project's `requirements.txt` pins exact versions. Write a `check(requirements, installed)` function that compares it with the packages actually installed in the environment:

- `requirements`: the text of `requirements.txt`; every non-empty, non-comment line looks like `name==version` (a trailing `#` comment is allowed),
- `installed`: a `{name: version}` dictionary,
- compare package names **normalised**: lowercased, and `_` and `.` mean the same as `-` (so `Flask_Login` = `flask-login`),
- result: a dictionary with two keys: `"missing"` – the normalised names of missing packages in **alphabetical order**; `"mismatch"` – an alphabetical list of `(name, wanted, installed)` triples for packages whose version differs.

```python starter required
def check(requirements, installed):
    missing = []
    for line in requirements.splitlines():
        name, version = line.split("==")
        if name not in installed:
            missing.append(name)
    return {"missing": missing, "mismatch": []}


req = "requests==2.32.3\nFlask_Login==0.6.3\n"
print(check(req, {"requests": "2.31.0"}))
```

<details>
<summary>Solution</summary>

```python solution
def normalise(name):
    # In package names case and the characters _ . - are equivalent
    return name.strip().lower().replace("_", "-").replace(".", "-")


def check(requirements, installed):
    present = {normalise(n): v for n, v in installed.items()}
    missing, mismatch = [], []
    for line in requirements.splitlines():
        line = line.split("#", 1)[0].strip()   # strip the comment
        if not line:
            continue
        name, version = line.split("==", 1)
        name, version = normalise(name), version.strip()
        if name not in present:
            missing.append(name)
        elif present[name] != version:
            mismatch.append((name, version, present[name]))
    return {"missing": sorted(missing), "mismatch": sorted(mismatch)}


req = "requests==2.32.3\nFlask_Login==0.6.3\n"
print(check(req, {"requests": "2.31.0"}))
```

</details>

```python test
req = """
# For web requests
requests==2.32.3
Flask_Login==0.6.3   # login
numpy==2.1.0

zope.interface==7.0
"""
installed = {"Requests": "2.31.0", "flask-login": "0.6.3", "Zope-Interface": "7.0"}
assert check(req, installed) == {"missing": ["numpy"], "mismatch": [("requests", "2.32.3", "2.31.0")]}, "Compare normalised names and skip comments and empty lines."
assert check("b==1\na==1\n", {}) == {"missing": ["a", "b"], "mismatch": []}, "Missing packages in alphabetical order."
assert check("z==2\ny==3\n", {"y": "1", "z": "1"})["mismatch"] == [("y", "3", "1"), ("z", "2", "1")], "Mismatches in alphabetical order."
assert check("", {"x": "1"}) == {"missing": [], "mismatch": []}, "An empty requirements.txt has no differences."
```

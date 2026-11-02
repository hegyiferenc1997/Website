---
title: Running Python Programs
summary: Installation, interactive mode (REPL), scripts, command-line arguments, VS Code, Jupyter and online environments.
minutes: 15
---

## What you will learn

- how to **install** Python and check its version,
- the difference between **interactive mode** and running a **script**,
- what `if __name__ == "__main__":` and **command-line arguments** are for,
- which **development environments** you can work in.

## Installation and version

Python can be downloaded from [python.org](https://www.python.org/downloads/) (on Windows, tick **"Add python.exe to PATH"** in the installer). Check it in the terminal:

```bash
python --version      # Windows
python3 --version     # macOS / Linux
```

A running program can also query which Python and which system runs it:

```python run
import platform
import sys

print("Python version:", platform.python_version())
print("Major version:", sys.version_info.major)
print("Interpreter location:", "found" if sys.executable else "unknown")
print("Operating system:", platform.system() or "unknown")
```

> Always use **Python 3**. Python 2 support ended in 2020, and the two versions are incompatible (e.g. `print "hi"` only worked in Python 2).

## Interactive mode (REPL)

If you just type `python` in the terminal, the **interactive interpreter** starts (REPL: _Read–Eval–Print Loop_). The result of an expression typed after the `>>>` prompt is printed immediately:

```text
>>> 2 + 3
5
>>> name = "Anna"
>>> name.upper()
'ANNA'
>>> exit()
```

Great for quick experiments, as a calculator, or for checking how a function behaves. But the code you typed is lost when you exit.

## Running a script

A lasting program is written to a **file with the `.py` extension** and run like this:

```bash
python hello.py
```

The interpreter executes the file from top to bottom. In a script, expression values are **not** printed automatically – you need `print()` for that.

## `if __name__ == "__main__":`

Every module has a `__name__` variable. If you **run the file directly**, its value is `"__main__"`; if another file **imports** it, it is the module's name. This separates the "main program" from reusable functions:

```python run
def greet(name: str) -> str:
    """A function that other modules can import."""
    return f"Hi, {name}!"

def main() -> None:
    # This runs only when executed directly, not when imported.
    print(greet("world"))

print("The module's name is now:", __name__)

if __name__ == "__main__":
    main()
```

## Command-line arguments

A program can receive input from the command line when it starts: `python add.py 3 5`. These are in the `sys.argv` list (element 0 is the script name). For bigger programs the `argparse` module is more convenient:

```python run
import argparse

parser = argparse.ArgumentParser(description="Add two numbers")
parser.add_argument("a", type=int, help="the first number")
parser.add_argument("b", type=int, help="the second number")
parser.add_argument("--verbose", action="store_true", help="detailed output")

# parse_args() reads sys.argv by default; for this example we pass a list,
# as if we had typed: python add.py 3 5 --verbose
args = parser.parse_args(["3", "5", "--verbose"])

if args.verbose:
    print(f"{args.a} + {args.b} = {args.a + args.b}")
else:
    print(args.a + args.b)
```

## Development environments

| Environment                            | Good for                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **IDLE**                               | installed with Python, simple editor + REPL – enough to start                                    |
| **VS Code** + Python extension         | free, popular; autocomplete, debugger, terminal, Git in one place                                |
| **PyCharm**                            | a full IDE made specifically for Python (the Community edition is free)                          |
| **Jupyter Notebook / JupyterLab**      | a "notebook" split into cells: code, results, charts and text together – ideal for data analysis |
| **Online** (e.g. Google Colab, Replit) | no installation, in the browser – accessible from anywhere                                       |

In VS Code you can run with the ▶ button in the top right or in the terminal (`python file.py`), and **F5** starts the program with the debugger.

## Summary

- **REPL** for quick experiments, a **`.py` script** for lasting programs.
- `if __name__ == "__main__":` separates the main program from importable parts.
- Command-line arguments: `sys.argv`, more conveniently `argparse`.
- To start, **VS Code** or **IDLE** is recommended; for data analysis, **Jupyter**.

## Lesson exercise: Grade average from the command line

Write a `grade_average(argv)` function that uses `argparse` to process the command-line arguments (the `argv` list, e.g. `["5", "4", "4", "--decimals", "1"]`) and **returns a string**:

- `grades`: one or more integers, only between 1 and 5 (`nargs="+"`, `choices=range(1, 6)`),
- `--decimals N`: how many decimals to round to (integer, default `2`),
- `--verbose`: a flag (`store_true`); when given, the grades are listed too.

The result looks like `Average: 4.33`, in verbose mode `Grades: 5, 4, 4 | Average: 4.33`. For invalid input (e.g. a grade of `6`) `argparse` stops the program by itself (`SystemExit`) – you don't need to catch it.

```python starter required
import argparse


def grade_average(argv):
    parser = argparse.ArgumentParser(description="Grade average")
    parser.add_argument("grades", nargs="+")
    args = parser.parse_args(argv)
    return f"Average: {args.grades}"


print(grade_average(["5", "4", "4"]))
```

<details>
<summary>Solution</summary>

```python solution
import argparse


def grade_average(argv):
    parser = argparse.ArgumentParser(description="Grade average")
    parser.add_argument("grades", type=int, nargs="+", choices=range(1, 6))
    parser.add_argument("--decimals", type=int, default=2)
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args(argv)
    average = round(sum(args.grades) / len(args.grades), args.decimals)
    if args.verbose:
        listing = ", ".join(str(g) for g in args.grades)
        return f"Grades: {listing} | Average: {average}"
    return f"Average: {average}"


print(grade_average(["5", "4", "4"]))
print(grade_average(["5", "4", "4", "--decimals", "1", "--verbose"]))
```

</details>

```python test
import contextlib, io
assert grade_average(["5", "4", "4"]) == "Average: 4.33", "Round to 2 decimals by default."
assert grade_average(["5", "4", "4", "--decimals", "1"]) == "Average: 4.3", "The --decimals option sets the rounding."
assert grade_average(["--verbose", "3", "5"]) == "Grades: 3, 5 | Average: 4.0", "Verbose mode: Grades: 3, 5 | Average: 4.0"
assert grade_average(["2"]) == "Average: 2.0", "A single grade is enough."
for bad in (["6"], ["0", "5"], [], ["four"]):
    try:
        with contextlib.redirect_stderr(io.StringIO()):
            grade_average(bad)
        assert False, f"For invalid input ({bad}) argparse must stop the program."
    except SystemExit:
        pass
```

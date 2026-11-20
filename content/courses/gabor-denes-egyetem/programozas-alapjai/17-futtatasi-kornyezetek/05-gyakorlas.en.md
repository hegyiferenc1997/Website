---
title: Practice – Runtime Environments
summary: Review questions, a command-line calculator, settings from environment variables and parsing requirements.txt.
minutes: 50
kind: practice
---

## Review questions

**1. What is the difference between the REPL and running a script?**

<details>
<summary>Answer</summary>

The REPL (interactive mode) evaluates and prints expressions line by line immediately, but the code is lost when you exit. A script is a `.py` file that the interpreter runs from start to finish; results appear only with `print()`, but the code is kept.

</details>

**2. What is the value of `__name__` when another program imports the file `calculation.py`?**

<details>
<summary>Answer</summary>

`"calculation"` (the module's name). Only when run directly is it `"__main__"`, which is why the `if __name__ == "__main__":` block doesn't run on import.

</details>

**3. Why should every project have its own virtual environment?**

<details>
<summary>Answer</summary>

So that the projects' packages and their versions don't clash: each project uses its own dependencies, and the environment can be recreated exactly anywhere from `requirements.txt`.

</details>

**4. How does the portability of Java on the JVM differ from a natively compiled C program?**

<details>
<summary>Answer</summary>

Java bytecode runs on any machine with a JVM ("write once, run anywhere"). A C program must be compiled separately for each platform (processor + operating system).

</details>

**5. What problem does a Docker container solve?**

<details>
<summary>Answer</summary>

The "works on my machine" problem: the container packages the program with its whole runtime environment (interpreter, libraries, settings), so it runs the same way everywhere.

</details>

**6. Why don't we put passwords and API keys in the source code?**

<details>
<summary>Answer</summary>

Because code often ends up in public places (e.g. Git), where anyone could read it. Secrets are passed in environment variables (or a secrets manager), and the program reads them at run time.

</details>

## Exercises

### Exercise 1: Command-line calculator

Write a function `calculator(argv)` that uses `argparse` to parse an argument list of the form `number1 operator number2` (e.g. `["3", "+", "4.5"]`) and returns the result as a `float`. Supported operators: `+`, `-`, `*`, `/`. Division by zero raises `ZeroDivisionError`.

```python starter
import argparse

def calculator(argv):
    parser = argparse.ArgumentParser(description="Simple calculator")
    # TODO: add the arguments and perform the operation
    pass
```

<details>
<summary>Solution</summary>

```python solution
import argparse
import operator

# The functions belonging to each operator symbol.
OPERATIONS = {"+": operator.add, "-": operator.sub, "*": operator.mul, "/": operator.truediv}

def calculator(argv):
    """Evaluate the expression given on the command line, e.g. 3 + 4.5."""
    parser = argparse.ArgumentParser(description="Simple calculator")
    parser.add_argument("number1", type=float)
    parser.add_argument("op", choices=OPERATIONS.keys())
    parser.add_argument("number2", type=float)
    args = parser.parse_args(argv)
    return OPERATIONS[args.op](args.number1, args.number2)

if __name__ == "__main__":
    print(calculator(["3", "+", "4.5"]))
```

</details>

```python test
assert calculator(["3", "+", "4.5"]) == 7.5
assert calculator(["10", "-", "4"]) == 6.0
assert calculator(["2", "*", "8"]) == 16.0
assert calculator(["9", "/", "2"]) == 4.5
try:
    calculator(["1", "/", "0"])
    assert False, "Expected ZeroDivisionError"
except ZeroDivisionError:
    pass
print("All checks passed!")
```

### Exercise 2: Settings from environment variables

Write a function `setting(name, default)` that returns the value of the environment variable `name` **converted to the type of the default** (`int`, `float`, `bool` or `str`). If the variable isn't set, return the default. For `bool`, `"1"`, `"true"` and `"yes"` (case-insensitive) mean true.

```python starter
import os

def setting(name, default):
    # TODO
    pass
```

<details>
<summary>Solution</summary>

```python solution
import os

TRUE_VALUES = {"1", "true", "yes"}

def setting(name, default):
    """Read an environment variable converted to the default's type."""
    value = os.environ.get(name)
    if value is None:
        return default
    # Check bool before int, because bool is a subtype of int.
    if isinstance(default, bool):
        return value.strip().lower() in TRUE_VALUES
    if isinstance(default, int):
        return int(value)
    if isinstance(default, float):
        return float(value)
    return value
```

</details>

```python test
os.environ["EM_PORT"] = "8080"
os.environ["EM_RATIO"] = "0.25"
os.environ["EM_DEBUG"] = "Yes"
os.environ["EM_NAME"] = "test"
assert setting("EM_PORT", 3000) == 8080
assert setting("EM_RATIO", 1.0) == 0.25
assert setting("EM_DEBUG", False) is True
assert setting("EM_NAME", "default") == "test"
assert setting("EM_NO_SUCH_VAR", 42) == 42
os.environ["EM_DEBUG"] = "no"
assert setting("EM_DEBUG", True) is False
print("All checks passed!")
```

### Exercise 3: Parsing requirements.txt

Write a function `dependencies(text)` that builds a dictionary from the contents of a `requirements.txt`: the key is the package name **in lower case**, the value is the pinned version (after `==`), or `None` if none is given. Ignore blank lines and comments starting with `#` (including end-of-line comments).

```python starter
def dependencies(text):
    # TODO
    pass
```

<details>
<summary>Solution</summary>

```python solution
def dependencies(text):
    """requirements.txt contents → {package name: version or None}."""
    result = {}
    for line in text.splitlines():
        line = line.split("#", 1)[0].strip()  # cut off the comment
        if not line:
            continue
        if "==" in line:
            name, version = line.split("==", 1)
            result[name.strip().lower()] = version.strip()
        else:
            result[line.lower()] = None
    return result
```

</details>

```python test
text = """
# For web requests
requests==2.32.3
NumPy==2.1.0   # for computations

pytest
"""
assert dependencies(text) == {"requests": "2.32.3", "numpy": "2.1.0", "pytest": None}
assert dependencies("") == {}
print("All checks passed!")
```

### Exercise 4: Set up your own project (on your machine)

Do this exercise on your own computer:

1. Create a folder `first_project` and open it in VS Code.
2. Create a virtual environment in it (`python -m venv .venv`) and activate it.
3. Install the `requests` package, then write out the dependencies: `pip freeze > requirements.txt`.
4. Write a `main.py` with an `if __name__ == "__main__":` block that prints the Python version and whether it runs in a virtual environment.
5. Create a `.gitignore` file containing: `.venv/`.

<details>
<summary>A possible main.py</summary>

```python run
import platform
import sys

def main() -> None:
    """Print information about the runtime environment."""
    print("Python:", platform.python_version())
    print("Virtual environment:", sys.prefix != sys.base_prefix)

if __name__ == "__main__":
    main()
```

</details>

## Summary exercise: Currency converter command-line program

Build a complete command-line program with a `main(argv, env)` entry point that converts forints to another currency. `main` **returns an exit code** (`0` = success) and prints the result.

- Arguments (`argparse`): `amount` (float, in forints), `--currency` (`EUR` or `USD`), `--decimals` (integer, default `2`).
- If there is no `--currency`, the `CURRENCY` environment variable decides; if that is missing too, `EUR`.
- Rates: `RATES = {"EUR": 400.0, "USD": 370.0}` (how many forints one unit is). The `RATE_EUR` / `RATE_USD` environment variable can override them.
- Success: prints e.g. `10000 HUF = 25.00 EUR` (the amount as given, the result formatted to `--decimals` decimals) and returns `0`.
- An invalid rate in the environment (not a number or not positive), or an invalid `CURRENCY`: prints `Error: ...` and returns `1` – it must not crash.
- For bad arguments `argparse` raises `SystemExit`: catch it and return its code (`2`).

`env` is a dictionary (in the real program `os.environ`), so the program can be tested independently of the environment.

```python starter required
import argparse

RATES = {"EUR": 400.0, "USD": 370.0}


def main(argv, env):
    parser = argparse.ArgumentParser(description="Currency converter")
    parser.add_argument("amount", type=float)
    args = parser.parse_args(argv)
    print(args.amount / 400)


main(["10000"], {})
```

<details>
<summary>Solution</summary>

```python solution
import argparse

RATES = {"EUR": 400.0, "USD": 370.0}


def main(argv, env):
    parser = argparse.ArgumentParser(description="Currency converter")
    parser.add_argument("amount", type=float)
    parser.add_argument("--currency", choices=sorted(RATES))
    parser.add_argument("--decimals", type=int, default=2)
    try:
        args = parser.parse_args(argv)
    except SystemExit as error:
        return error.code   # argparse's error code (2)

    # The currency: argument > environment variable > default
    currency = args.currency or env.get("CURRENCY", "EUR")
    if currency not in RATES:
        print(f"Error: unknown currency: {currency}")
        return 1

    rate = RATES[currency]
    if f"RATE_{currency}" in env:
        try:
            rate = float(env[f"RATE_{currency}"])
        except ValueError:
            print(f"Error: RATE_{currency} is not a number.")
            return 1
        if rate <= 0:
            print(f"Error: RATE_{currency} is not positive.")
            return 1

    result = args.amount / rate
    amount = int(args.amount) if args.amount.is_integer() else args.amount
    print(f"{amount} HUF = {result:.{args.decimals}f} {currency}")
    return 0


if __name__ == "__main__":
    code = main(["10000"], {})
    print("Exit code:", code)
```

</details>

```python test
import contextlib, io

def run_cli(argv, env):
    out = io.StringIO()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(io.StringIO()):
        code = main(argv, env)
    return code, out.getvalue().strip()

assert run_cli(["10000"], {}) == (0, "10000 HUF = 25.00 EUR"), "EUR and 2 decimals by default: 10000 HUF = 25.00 EUR"
assert run_cli(["3700", "--currency", "USD", "--decimals", "1"], {}) == (0, "3700 HUF = 10.0 USD"), "The --currency and --decimals options don't work."
assert run_cli(["1000"], {"CURRENCY": "USD", "RATE_USD": "400"}) == (0, "1000 HUF = 2.50 USD"), "Take the CURRENCY and RATE_USD environment variables into account."
assert run_cli(["800", "--currency", "EUR"], {"CURRENCY": "USD"}) == (0, "800 HUF = 2.00 EUR"), "The argument beats the environment variable."
assert run_cli(["1234.6"], {"RATE_EUR": "100"}) == (0, "1234.6 HUF = 12.35 EUR"), "Fractional amounts are allowed."
code, out = run_cli(["1000"], {"RATE_EUR": "lots"})
assert code == 1 and out.startswith("Error:"), "A non-numeric rate gives 'Error: ...' and code 1."
code, out = run_cli(["1000"], {"RATE_EUR": "0"})
assert code == 1 and out.startswith("Error:"), "A non-positive rate gives 'Error: ...' and code 1."
code, out = run_cli(["1000"], {"CURRENCY": "GBP"})
assert code == 1 and out.startswith("Error:"), "An unknown CURRENCY gives 'Error: ...' and code 1."
assert run_cli(["lots"], {})[0] == 2 and run_cli([], {})[0] == 2, "For bad arguments return argparse's code (2)."
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Programming exercises

**1.** **Is the version sufficient?** Write the `version_ok(version, minimum)` function, which compares version numbers of the form `"3.10.2"` part by part **as numbers** (not as text!), and returns `True` if `version >= minimum`! Careful: `"3.10"` is newer than `"3.9"`.

```python starter
def version_ok(version, minimum):
    return version >= minimum
```

<details>
<summary>Solution</summary>

```python solution
def version_ok(version, minimum):
    def parts(v):
        return [int(p) for p in v.split(".")]   # "3.10.2" -> [3, 10, 2]
    a, b = parts(version), parts(minimum)
    length = max(len(a), len(b))
    a += [0] * (length - len(a))            # "3.10" == "3.10.0"
    b += [0] * (length - len(b))
    return a >= b                           # lists compare element by element
```

</details>

```python test
assert version_ok("3.10", "3.9")
assert not version_ok("3.9", "3.10")
assert version_ok("3.12.0", "3.12")
assert not version_ok("2.7.18", "3")
assert version_ok("1.0.0", "1.0.0")
print("All checks passed!")
```

**2.** **Boolean value of an environment variable.** Write the `env_bool(value, default=False)` function, which converts the text value of an environment variable to a boolean! True: `"1"`, `"true"`, `"yes"`, `"igen"`, `"on"`; false: `"0"`, `"false"`, `"no"`, `"nem"`, `"off"` (case and surrounding spaces don't matter). For `None` or an unknown value the result should be `default`.

```python starter
def env_bool(value, default=False):
    return bool(value)
```

<details>
<summary>Solution</summary>

```python solution
TRUE = {"1", "true", "yes", "igen", "on"}
FALSE = {"0", "false", "no", "nem", "off"}

def env_bool(value, default=False):
    if value is None:
        return default                      # not set
    clean = value.strip().lower()
    if clean in TRUE:
        return True
    if clean in FALSE:
        return False
    return default
```

</details>

```python test
assert env_bool("true") is True
assert env_bool(" YES ") is True
assert env_bool("0") is False
assert env_bool("false", True) is False
assert env_bool(None, True) is True
assert env_bool("maybe") is False
print("All checks passed!")
```

**3.** **Command-line switches.** Write the `parse_args(arguments)` function, which turns a `sys.argv`-like list (without the program name) into a dictionary! The form `--name=value` becomes `{"name": "value"}`, the bare `--name` form becomes `{"name": True}`; the rest (positional) elements go into a list under the `"_"` key.

```python starter
def parse_args(arguments):
    return {"_": arguments}
```

<details>
<summary>Solution</summary>

```python solution
def parse_args(arguments):
    result = {"_": []}
    for arg in arguments:
        if arg.startswith("--"):
            name, has_value, value = arg[2:].partition("=")   # split at the first = sign
            result[name] = value if has_value else True
        else:
            result["_"].append(arg)         # positional argument
    return result
```

</details>

```python test
assert parse_args(["in.txt", "--verbose", "--level=3"]) == {"_": ["in.txt"], "verbose": True, "level": "3"}
assert parse_args([]) == {"_": []}
assert parse_args(["--url=a=b"]) == {"_": [], "url": "a=b"}
print("All checks passed!")
```

### Quick check questions

```quiz
? Which command creates a virtual environment named `.venv`?
- pip install venv
+ python -m venv .venv
- python --venv .venv
- venv create .venv
! Then it needs to be activated (on Windows `.venv\Scripts\activate`).

? What is the value of `sys.argv[0]`?
+ the name of the script being run
- the first user argument
- the number of arguments
- always an empty string
! User arguments start at `sys.argv[1]`.

? Why is comparing version numbers as text a bad idea?
- because Python can't compare strings
+ because as text `"3.10" < "3.9"`, since the character "1" is smaller than "9"
- because the dots cause errors
- because a version number is always an integer
! They have to be converted to numbers part by part.

? What does `requirements.txt` typically store?
- the program's source code
+ the list of packages used by the project (with versions)
- the passwords
- the test results
! `pip install -r requirements.txt` installs them.
```

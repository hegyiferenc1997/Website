---
title: Practice – Runtime Environments
summary: Review questions, a command-line calculator, settings from environment variables and parsing requirements.txt.
minutes: 25
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

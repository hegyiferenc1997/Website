---
title: Exception Handling Patterns and Good Practice
summary: What to catch and what not, EAFP versus LBYL, logging, managing resources – and the most common anti-patterns.
minutes: 15
---

## What you will learn

- **good practices** of exception handling,
- the two basic approaches: **EAFP** and **LBYL**,
- how to **log** errors,
- the most common **anti-patterns**.

## 1. Only catch what you can handle

```python run
# BAD: swallows every error – even the typo (NameError)!
def bad_convert(text):
    try:
        return int(txet)         # typo: txet
    except:
        return 0

print(bad_convert("42"))        # 0 – and you'll never find out why

# GOOD: only catch the expected error.
def good_convert(text):
    try:
        return int(text)
    except ValueError:
        return 0

print(good_convert("42"), good_convert("abc"))
```

> A bare `except:` or `except Exception:` hides programming errors. It's only justified at the very top level of a program (e.g. so a server doesn't crash) – and even there the error must be logged.

## 2. Keep the try block small

Put only the line that can raise the expected exception in the `try` block. That way you don't catch something else by accident.

```python run
data = {"score": "87"}

try:
    raw = data["score"]          # only this can raise KeyError
except KeyError:
    raw = "0"

score = int(raw)                 # this is outside
print(score)
```

## 3. Don't silently swallow errors

An empty `except: pass` can cause hours of debugging. If the error really can be ignored, at least write a comment saying _why_.

```python run
import contextlib
import os

# If the file doesn't exist, that's fine for us – deliberately ignored.
with contextlib.suppress(FileNotFoundError):
    os.remove("temporary_missing.txt")
print("Done.")
```

## 4. EAFP or LBYL?

- **LBYL** – _Look Before You Leap_: check first, then act.
- **EAFP** – _Easier to Ask Forgiveness than Permission_: try it, and handle the exception if it fails.

```python run
prices = {"apple": 300}

# LBYL
if "pear" in prices:
    print(prices["pear"])
else:
    print("no pear")

# EAFP – more common in Python
try:
    print(prices["pear"])
except KeyError:
    print("no pear")
```

EAFP is idiomatic in Python because it is often shorter and avoids the race between checking and using (e.g. someone deletes the file after the check). In simple cases LBYL is perfectly fine too (`dict.get`, `if x in …`).

## 5. Clean up: with and finally

**Always** release resources (files, network connections, locks), even if an error happened. `with` is best for this:

```python run
import os
import tempfile

path = os.path.join(tempfile.gettempdir(), "example_with.txt")
with open(path, "w", encoding="utf-8") as f:
    f.write("hi")
# here the file is guaranteed to be closed – even on error
print(open(path, encoding="utf-8").read())
os.remove(path)
```

## 6. Log, don't just print

In real programs errors are logged with the `logging` module: with timestamps, severity levels, and optionally to a file.

```python run
import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s")
log = logging.getLogger("example")

def process(text):
    try:
        return int(text)
    except ValueError:
        log.warning("Invalid input, skipped: %r", text)
        return None

print([process(s) for s in ["1", "x", "3"]])
```

## 7. Fail fast and clearly

Validate input at the **start** of a function, and raise an exception with a clear message immediately for invalid data. That way the error shows up where it originated, not ten functions later.

```python run
def discounted_price(price, discount_percent):
    if price < 0:
        raise ValueError("The price cannot be negative.")
    if not 0 <= discount_percent <= 100:
        raise ValueError("The discount must be between 0 and 100.")
    return price * (1 - discount_percent / 100)

print(discounted_price(10_000, 15))
```

## Common anti-patterns

| Anti-pattern                                              | Why it's bad                     | Instead                       |
| --------------------------------------------------------- | -------------------------------- | ----------------------------- |
| `except: pass`                                            | swallows every error             | a specific exception, logging |
| a huge `try` block                                        | catches other things by accident | only the risky line inside    |
| returning `-1` / `None` as an "error code"                | the caller forgets to check      | `raise`                       |
| exceptions for normal control flow (e.g. stopping a loop) | slow, hard to read               | `if`, `break`                 |
| `raise ValueError()` without a message                    | it's unclear what's wrong        | a descriptive message         |

## Summary

- Catch specific exceptions with a small `try` block; don't silently swallow errors.
- **EAFP** is idiomatic in Python, but LBYL is fine in simple cases.
- Use `with` / `finally` for resources and `logging` for errors.
- Raise an exception with a clear message immediately for invalid input.

## Lesson exercise: Reading a setting EAFP-style

Settings are stored in a nested dictionary, e.g. `{"database": {"port": "5432"}}`. Write a `setting(config, path, default=None)` function that reads the value along a dot-separated path (e.g. `"database.port"`).

- Work in **EAFP** style: don't check the keys in advance, just try it and catch `KeyError` (and `TypeError`, if you run into something that is not a dictionary on the way).
- If the value is not found, return `default`.
- Catch only the exceptions you can handle – a bare `except:` would be a mistake here!

```python starter required
def setting(config, path, default=None):
    value = config
    # for key in path.split("."): ...  try / except KeyError, TypeError
    return value


config = {"database": {"port": "5432", "name": "test"}}
print(setting(config, "database.port"))   # 5432
```

<details>
<summary>Solution</summary>

```python solution
def setting(config, path, default=None):
    value = config
    try:
        for key in path.split("."):
            value = value[key]
    except (KeyError, TypeError):
        return default
    return value


config = {"database": {"port": "5432", "name": "test"}}
print(setting(config, "database.port"))   # 5432
```

</details>

```python test
config = {"database": {"port": "5432", "name": "test"}, "debug": False}
assert setting(config, "database.port") == "5432", "database.port → \"5432\""
assert setting(config, "debug") is False, "False is a valid value too (not the default)."
assert setting(config, "database.password", "none") == "none", "A missing key gives the default."
assert setting(config, "database.port.number", 0) == 0, "Running into a non-dictionary on the way: default."
assert setting(config, "log.level") is None, "The default default is None."
```

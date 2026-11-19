---
title: Deeper – Exception Handling in Real Life
summary: Why an overly broad except is dangerous, your own exception classes with a hierarchy and chaining, with and finally as guaranteed cleanup (with your own context manager), and retrying with exponential backoff for a flaky service – with runnable programs, a chart and a programming exercise.
minutes: 50
---

## What you will learn in this lesson

- why you should catch **exactly** the exception you expect – and what an overly broad `except` hides,
- how to write **your own exception classes**, and how to pass on the original cause (**chaining**),
- how `finally` and `with` guarantee that a resource is released even on error,
- how to handle **transient** errors by retrying.

## 1. An overly broad except hides the bug

In the basic lesson we saw that `try–except` catches the error, and the program can keep running. It's very tempting to catch "everything" – but that swallows programming errors too:

```python run
# An overly broad except "handles" a typo too – so the bug stays hidden
def mean_bad(numbers):
    try:
        return sum(numbers) / len(numbrs)        # TYPO: numbrs (NameError)
    except Exception:
        return 0                                 # "0 for an empty list" – but this swallows EVERYTHING

def mean_good(numbers):
    try:
        return sum(numbers) / len(numbers)
    except ZeroDivisionError:                    # we only expect what can really happen
        return 0

print("bad version [4, 5]: ", mean_bad([4, 5]), " ← a wrong result, and nobody knows why")
print("good version [4, 5]:", mean_good([4, 5]))
print("good version []:    ", mean_good([]))

# the exception hierarchy: except catches the subclasses too
print("ZeroDivisionError ⊂ ArithmeticError ⊂ Exception:",
      issubclass(ZeroDivisionError, ArithmeticError), issubclass(ArithmeticError, Exception))
```

The bad version gives 0 for every input – it treats the `NameError` (the typo) as an "empty list" too. You can hunt for such a bug for days. The rule: **only catch what you expect and can handle meaningfully**; let everything else crash with an understandable error message. The broadest `except:` (without a type) even catches Ctrl+C – never use it.

## 2. Your own exceptions: hierarchy and chaining

In a bigger program it's worth creating your own exception classes: the caller then knows exactly what happened, and we can attach **data** to the error. `raise … from …` keeps the original cause:

```python run
# Our own exception hierarchy with data, and exception chaining (raise ... from ...)
class OrderError(Exception):
    """The ancestor of all errors of order handling."""

class OutOfStock(OrderError):
    def __init__(self, product, wanted, available):
        super().__init__(f"{product}: {wanted} needed, only {available} available")
        self.product, self.shortage = product, wanted - available   # the caller can use it

class InvalidOrder(OrderError):
    pass

stock = {"pen": 10, "notebook": 2}

def order(line):
    try:
        product, qty = line.split(":")
        qty = int(qty)
    except ValueError as e:
        raise InvalidOrder(f"bad format: {line!r}") from e        # the original cause is kept
    if stock.get(product, 0) < qty:
        raise OutOfStock(product, qty, stock.get(product, 0))
    stock[product] -= qty
    return f"OK: {qty} {product}"

for line in ["pen:3", "notebook:5", "eraser", "pen:lots"]:
    try:
        print(order(line))
    except OutOfStock as e:
        print("Shortage:", e, f"→ reorder {e.shortage}")
    except OrderError as e:                      # all other order errors
        print("Order error:", e, "| original cause:", repr(e.__cause__))
```

The caller can decide: it handles `OutOfStock` separately (and uses the `shortage` data), the rest together via the ancestor `OrderError`. Thanks to chaining the original `ValueError` is visible in the log too, which makes debugging much easier.

## 3. Guaranteed cleanup: finally and with

An opened file, database connection or lock must **always** be released, even if an error happened meanwhile. That's what `finally` is for, and even more conveniently the `with` statement, which uses a **context manager**:

```python run
# Our own context manager: the "exit" runs even on error
class Connection:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        print(f"  [{self.name}] connection opened")
        return self

    def __exit__(self, exc_type, exc, traceback):
        print(f"  [{self.name}] connection closed" + (f" (there was an error: {exc_type.__name__})" if exc_type else ""))
        return False                             # False: we don't swallow the error, it continues

print("successful operation:")
with Connection("database") as c:
    print("  query running...")

print("failing operation:")
try:
    with Connection("database") as c:
        print("  query running...")
        raise TimeoutError("the server doesn't respond")
except TimeoutError as e:
    print("  the caller caught it:", e)
```

In the second case the connection closed **despite the error**, before the caller caught the exception. That's also why we write file handling as `with open(...) as f:`: the file is closed even if an error happens while reading. If we neglect this, a long-running server sooner or later runs out of files or connections it can open.

## 4. Transient errors: retrying with exponential backoff

A network service is sometimes unavailable for a moment (overload, restart). For such a **transient** error it's worth retrying – but not immediately and not forever, rather with increasingly long pauses, so we don't burden the struggling server further:

```plot
title: Waiting time (s) before the n-th retry
x: 0, 8
y: 0, 30
param: a = 0.1, 0.05, 1, 0.05
f: a*2^x # exponential backoff: doubles after every attempt
```

```python run
# Retrying with exponential backoff for a flaky (simulated) service
import random

random.seed(4)

def flaky_service():
    if random.random() < 0.6:                    # a transient error with 60% probability
        raise ConnectionError("service temporarily unavailable")
    return "data arrived"

def retry(operation, max_attempts=5, base=0.1):
    for attempt in range(max_attempts):
        try:
            return operation()
        except ConnectionError as e:
            wait = base * 2 ** attempt           # 0.1 s, 0.2 s, 0.4 s, ...
            print(f"  attempt {attempt + 1} failed ({e}), waiting {wait:.1f} s")
            # in a real program here: time.sleep(wait)
    raise ConnectionError(f"still failing after {max_attempts} attempts")

for round_ in range(3):
    print(f"request {round_ + 1}:")
    try:
        print("  result:", retry(flaky_service))
    except ConnectionError as e:
        print("  final error:", e)
```

An important difference: a `ConnectionError` is **transient** – worth retrying; but a `ValueError` (bad data) or a "permission denied" error is **permanent**: retrying only wastes time, the error must be reported immediately. Real systems also add a little randomness to the wait (jitter), so that a thousand clients stuck at the same moment don't all retry at exactly the same time.

| Viewpoint     | What do they expect from error handling?                                   |
| ------------- | -------------------------------------------------------------------------- |
| **user**      | an understandable message ("Not enough stock, 3 missing"), not a traceback |
| **developer** | the exact error and the original cause in the log – nothing lost silently  |
| **operator**  | resources are always released; the system recovers from transient errors   |
| **security**  | the error message shouldn't reveal internal details (password, path, SQL)  |

## Summary

- Only catch the exception you expect; an overly broad `except` hides programming errors.
- With your own exception classes the caller knows exactly what happened; `raise … from …` keeps the cause.
- `finally` and `with` guarantee that a resource is released even on error.
- For transient errors we retry with increasing waits; for permanent errors we report immediately.

## Lesson exercise: checked input with your own exception

The starter code gives you your own exception class: `RangeError`, a subclass of `ValueError`. Write the `read_number(text, low, high)` function, which makes an integer from the text! If the text isn't an integer, the `ValueError` raised by `int()` should pass through (don't catch it). If the number is outside the range `[low, high]`, raise a `RangeError`. Otherwise return the number. Spaces at the start and end of the text shouldn't matter.

```python starter required
class RangeError(ValueError):
    pass


def read_number(text, low, high):
    return int(text)


print(read_number(" 42 ", 1, 100))
```

<details>
<summary>Solution</summary>

```python solution
class RangeError(ValueError):
    pass


def read_number(text, low, high):
    number = int(text.strip())
    if not low <= number <= high:
        raise RangeError(f"{number} is not between {low} and {high}")
    return number


print(read_number(" 42 ", 1, 100))
```

</details>

```python test
assert read_number(" 42 ", 1, 100) == 42, "spaces don't matter"
assert read_number("1", 1, 100) == 1 and read_number("100", 1, 100) == 100, "the limits are still fine"
try:
    read_number("150", 1, 100)
    assert False, "150 needs a RangeError"
except RangeError:
    pass
try:
    read_number("forty", 1, 100)
    assert False, "a non-number needs a ValueError"
except RangeError:
    assert False, "a non-number needs a plain ValueError, not a RangeError"
except ValueError:
    pass
```

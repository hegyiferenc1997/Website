---
title: Raising Exceptions and Custom Exceptions
summary: The raise statement, custom exception classes, re-raising and chaining exceptions, and assert.
minutes: 15
---

## What you will learn

- how to **raise** an exception with `raise`,
- how to create a **custom exception class**,
- how to **re-raise** an exception,
- what `assert` is for.

## raise – raising an exception

If a function ends up in a situation it can't handle sensibly (e.g. invalid input), it should **signal it with an exception** – not silently return a wrong value.

```python run
def square_root(x):
    if x < 0:
        raise ValueError(f"A negative number has no real square root: {x}")
    return x ** 0.5

print(square_root(16))
try:
    square_root(-4)
except ValueError as error:
    print("Error:", error)
```

Which built-in exception to choose?

- `ValueError` – right type but invalid value (negative age, empty name),
- `TypeError` – parameter of the wrong type,
- `KeyError` / `IndexError` – missing key / index,
- `NotImplementedError` – not written yet (e.g. a base class method).

## Custom exception class

In a larger program it's worth defining your own exceptions so the caller knows exactly what happened. A custom exception is a **subclass** of `Exception` (or one of its subclasses).

```python run
class BankError(Exception):
    """Common base exception for banking operations."""


class InsufficientFunds(BankError):
    def __init__(self, balance, amount):
        super().__init__(f"Insufficient funds: balance {balance}, requested {amount}")
        self.balance = balance
        self.amount = amount


def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("The amount must be positive.")
    if amount > balance:
        raise InsufficientFunds(balance, amount)
    return balance - amount


try:
    withdraw(5000, 8000)
except InsufficientFunds as error:
    print(error)
    print("Missing:", error.amount - error.balance)
except BankError:
    print("Other banking error.")
```

## Re-raising an exception

Sometimes we catch an exception (e.g. to log it) but leave the handling to the caller. A bare `raise` **re-raises** the same exception:

```python run
def parse(text):
    try:
        return int(text)
    except ValueError:
        print(f"Log: invalid input: {text!r}")
        raise   # pass it on to the caller

try:
    parse("x12")
except ValueError:
    print("The caller handled the error.")
```

## Chaining exceptions

When turning a low-level exception into a more meaningful higher-level one, `raise … from …` keeps the original cause:

```python run
class ConfigError(Exception):
    pass

def read_port(settings):
    try:
        return int(settings["port"])
    except (KeyError, ValueError) as original:
        raise ConfigError("Invalid or missing port setting") from original

try:
    read_port({"port": "eighty"})
except ConfigError as error:
    print(error, "| original cause:", repr(error.__cause__))
```

## assert – internal checks

`assert condition, "message"` raises `AssertionError` if the condition is false. It's for **self-checks** during development and for **tests** – for "this must definitely be true here".

```python run
def average(grades):
    assert len(grades) > 0, "At least one grade is needed for an average"
    return sum(grades) / len(grades)

print(average([4, 5]))
```

> **Don't use `assert` to validate user input!** When Python runs with the `-O` flag it skips `assert` lines. For input use `if` + `raise ValueError`.

## Summary

- `raise Exception("message")` – raise an exception in an invalid situation.
- Custom exception: `class MyError(Exception): ...`; give related errors a common base.
- Bare `raise` – re-raise; `raise New(...) from original` – chaining.
- `assert` – internal checks and tests, not input validation.

## Lesson exercise: A custom exception for recording grades

1. Create a custom exception class called `InvalidGradeError` that derives from `ValueError`.
2. Write a `record_grade(grades, grade)` function that appends the grade to the end of the list and returns the list – but if the grade is not an integer (or is a `bool`), or not between 1 and 5, **raise** `InvalidGradeError` with the wrong value in its message.

For an invalid grade the list must not change!

```python starter required
class InvalidGradeError(ValueError):
    pass


def record_grade(grades, grade):
    # validation, raise InvalidGradeError(f"..."), then append
    pass


print(record_grade([5], 4))   # [5, 4]
```

<details>
<summary>Solution</summary>

```python solution
class InvalidGradeError(ValueError):
    pass


def record_grade(grades, grade):
    if isinstance(grade, bool) or not isinstance(grade, int) or not 1 <= grade <= 5:
        raise InvalidGradeError(f"Invalid grade: {grade!r}")
    grades.append(grade)
    return grades


print(record_grade([5], 4))   # [5, 4]
```

</details>

```python test
assert issubclass(InvalidGradeError, ValueError), "InvalidGradeError must derive from ValueError."
assert record_grade([5], 4) == [5, 4], "A valid grade is appended: [5, 4]"
for bad in [0, 6, 3.5, "5", True]:
    items = [3]
    try:
        record_grade(items, bad)
        assert False, f"The grade {bad!r} must raise InvalidGradeError."
    except InvalidGradeError as e:
        assert repr(bad) in str(e) or str(bad) in str(e), "The message should contain the wrong value."
    assert items == [3], "For an invalid grade the list must not change."
```

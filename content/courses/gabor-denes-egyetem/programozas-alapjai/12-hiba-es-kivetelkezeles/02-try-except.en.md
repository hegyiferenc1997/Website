---
title: Exception Handling – try, except, else, finally
summary: The try–catch block in Python: catching exceptions, several except branches, the role of else and finally.
minutes: 18
---

## What you will learn

- how to **catch** an exception with `try`–`except` (`try`–`catch` in other languages),
- how to handle **several kinds** of exceptions,
- what the `else` and `finally` branches are for,
- how to get the exception's **message**.

## The basic structure

```python run
try:
    number = int("abc")        # an exception occurs here
    print("This no longer runs.")
except ValueError:
    print("That's not a number!")   # control jumps here
print("The program continues.")
```

How it works:

1. Python executes the `try` block.
2. If no exception occurs, the `except` block is **skipped**.
3. If an exception occurs, the **rest of the `try` block is skipped** and control jumps to the first matching `except` branch.
4. If no `except` matches, the exception propagates to the caller (and if nobody catches it, the program stops).

## The same in other languages

```java
// Java / C#
try {
    int number = Integer.parseInt("abc");
} catch (NumberFormatException e) {
    System.out.println("That's not a number!");
} finally {
    System.out.println("Always runs.");
}
```

The idea is the same; in Python `catch` is called `except`.

## Safe input

The typical use: keep asking until we get valid data.

```python run
def ask_number(message):
    while True:
        try:
            return int(input(message))
        except ValueError:
            print("Please enter a whole number!")

age = ask_number("How old are you? ")
print("Next year you'll be", age + 1)
```

## Several except branches

```python run
def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        print("You can't divide by zero.")
    except TypeError:
        print("Only numbers can be divided.")
    return None

print(divide(10, 2))
print(divide(10, 0))
print(divide("10", 2))
```

You can catch several exceptions in one branch too: `except (ValueError, TypeError):`

> `except` branches are checked **in order**. Put the more specific (subclass) exception first and the more general one later – otherwise the general one swallows the specific one.

## The exception's message: as

```python run
try:
    {"a": 1}["b"]
except KeyError as error:
    print("Missing key:", error)
    print("Type:", type(error).__name__)
```

## else – if there was no exception

The `else` branch runs if **no** exception happened in the `try` block. Put code here that comes after the successful operation but whose errors you don't want handled by the same `except`.

```python run
text = "42"
try:
    number = int(text)
except ValueError:
    print("Invalid number.")
else:
    print("Converted successfully, doubled:", number * 2)
```

## finally – always runs

The `finally` branch **always** runs: with no exception, with a caught exception, even with an uncaught one or after a `return`. Use it to release resources (closing a file, closing a connection).

```python run
def process(data):
    print("Resource opened.")
    try:
        return 100 / data
    except ZeroDivisionError:
        print("Error: division by zero.")
        return None
    finally:
        print("Resource closed.")   # runs in both cases

print(process(4))
print(process(0))
```

For files the `with` statement does this automatically (see the **File Handling** topic).

## The full structure

```text
try:
    risky code
except SpecificError as e:
    handle the error
except (OtherError, ThirdError):
    ...
else:
    if there was no exception
finally:
    always runs (cleanup)
```

## Summary

- `try`: the risky code; `except Type`: the handling; `as e`: the exception object.
- There can be several `except` branches; put the more specific one first.
- `else`: if there was no exception; `finally`: always runs.

## Lesson exercise: Safe division

Write a `safe_divide(a, b)` function that converts two numbers given **as text** (e.g. `"10"`, `"2.5"`) to floats and divides them. Handle errors with a `try – except` block and return a text message in that case:

- if either is not a number (`ValueError`): `"Invalid number"`,
- if you would divide by zero (`ZeroDivisionError`): `"Cannot divide by zero"`,
- otherwise the result (`float`) – return it in the `else` branch.

Use several `except` branches, not one general `except`!

```python starter required
def safe_divide(a, b):
    try:
        pass
    except ValueError:
        pass
    # more branches: ZeroDivisionError, else


print(safe_divide("10", "4"))   # 2.5
```

<details>
<summary>Solution</summary>

```python solution
def safe_divide(a, b):
    try:
        result = float(a) / float(b)
    except ValueError:
        return "Invalid number"
    except ZeroDivisionError:
        return "Cannot divide by zero"
    else:
        return result


print(safe_divide("10", "4"))   # 2.5
```

</details>

```python test
assert safe_divide("10", "4") == 2.5, "10 / 4 = 2.5"
assert safe_divide("-3", "1.5") == -2.0, "-3 / 1.5 = -2.0"
assert safe_divide("ten", "2") == "Invalid number", "Non-numeric input: Invalid number"
assert safe_divide("1", "") == "Invalid number", "An empty string is not a number either."
assert safe_divide("1", "0") == "Cannot divide by zero", "Division by zero: Cannot divide by zero"
```

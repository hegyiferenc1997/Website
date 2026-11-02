---
title: Variable Scope and Lifetime
summary: Local and global variables, the LEGB rule, the global keyword, and why we avoid global state.
minutes: 12
---

## What you will learn

- what **scope** and **lifetime** are,
- the difference between **local** and **global** variables,
- how Python looks up names (the **LEGB** rule),
- why it's worth avoiding the `global` keyword.

## Local variables

A variable created inside a function is **local**: it exists only inside the function and disappears when the function ends.

```python run
def function():
    message = "I'm inside"   # local variable
    print(message)

function()
# print(message)  → NameError: it doesn't exist outside the function
```

The same name means different variables in different functions – so they don't interfere.

## Global variables

A variable created outside functions, at module level, is **global**: functions can **read** it.

```python run
VAT = 0.27   # global (a constant)

def gross(net):
    return net * (1 + VAT)   # reading is allowed

print(gross(1000))
```

## Shadowing

If you assign to a variable inside a function with the same name as a global, it becomes a **new local** variable that hides ("shadows") the global:

```python run
x = 10

def f():
    x = 99          # a new local x, the global doesn't change
    print("inside:", x)

f()
print("outside:", x)  # 10
```

## The global keyword

If a function must **modify** a global variable, it has to say so with `global`:

```python run
counter = 0

def increment():
    global counter
    counter += 1

increment()
increment()
print(counter)   # 2
```

> **Avoid `global`!** A function that modifies a global is hard to test, and the value can change anywhere in the program. It's better if the function takes a parameter and returns a value:

```python run
def increment(counter):
    return counter + 1

c = 0
c = increment(c)
c = increment(c)
print(c)   # 2
```

## The LEGB rule

When Python looks up a name, it searches in this order:

1. **L**ocal – the function's own variables,
2. **E**nclosing – variables of the enclosing (outer) function,
3. **G**lobal – module-level variables,
4. **B**uilt-in – built-in names (`print`, `len`, `sum` …).

```python run
x = "global"

def outer():
    x = "enclosing"
    def inner():
        print(x)        # no local x → the enclosing function's
    inner()

outer()
print(len("abc"))       # len comes from the Built-in namespace
```

> Don't name variables after built-in functions (`list`, `sum`, `max`, `input`)! After `sum = 0`, the `sum()` function is no longer available.

## Lifetime

- A local variable is **created when the call starts** and **destroyed at the end**. Every call gets new variables.
- A global variable lives for the **whole run** of the program.

## Summary

- **Local**: inside a function, visible only there, destroyed at the end of the call.
- **Global**: module level, functions can read it; modifying needs `global` – but better avoid it.
- Name lookup: **L → E → G → B**.

## Lesson exercise: Without a global variable

The starter code is broken: the function tries to modify the global `total` variable, but it raises `UnboundLocalError` (run it!). The `global` keyword would "fix" it, but global state is bad practice.

Rewrite it **without a global variable**: the `add(total, value)` function receives the total so far as a parameter and **returns** the new one. The `sum_all(values)` function uses it to add up the elements of a list (collecting in a local variable).

```python starter required
total = 0


def add(value):
    total = total + value
    return total


def sum_all(values):
    for value in values:
        add(value)
    return total


print(sum_all([1, 2, 3]))
```

<details>
<summary>Solution</summary>

```python solution
def add(total, value):
    return total + value


def sum_all(values):
    total = 0
    for value in values:
        total = add(total, value)
    return total


print(sum_all([1, 2, 3]))
```

</details>

```python test
assert add(10, 5) == 15, "add(10, 5) → 15 (two parameters: the total so far and the value)"
assert sum_all([1, 2, 3]) == 6, "sum_all([1, 2, 3]) → 6"
assert sum_all([1, 2, 3]) == 6, "6 again the second time – nothing may remain from the previous call."
assert sum_all([]) == 0, "An empty list gives 0."
assert "total" not in globals() or globals()["total"] == 0, "Don't use a global total variable."
```

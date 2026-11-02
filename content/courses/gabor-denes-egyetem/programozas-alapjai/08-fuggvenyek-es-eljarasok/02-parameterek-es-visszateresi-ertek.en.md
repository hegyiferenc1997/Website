---
title: Parameters and Return Values
summary: Formal and actual parameters, default values, keyword arguments, returning several values.
minutes: 15
---

## What you will learn

- what **formal** and **actual** parameters (arguments) are,
- how to give a **default** value,
- how to call a function with **keyword** arguments,
- how to return **several values**.

## Formal and actual parameters

```python run
def rectangle_area(a, b):    # a and b: formal parameters (in the definition)
    return a * b

print(rectangle_area(3, 5))  # 3 and 5: actual parameters, i.e. arguments (in the call)
```

- A **formal parameter** is a name in the function definition.
- An **actual parameter (argument)** is the value passed in the call.
- On a call the arguments are bound to the parameters **in order**.

Passing the wrong number of arguments raises `TypeError`:

```python
rectangle_area(3)   # TypeError: missing 1 required positional argument: 'b'
```

## Default values

```python run
def greeting(name, salutation="Hi"):
    return f"{salutation}, {name}!"

print(greeting("Anna"))                    # Hi, Anna!
print(greeting("Bela", "Good morning"))    # Good morning, Bela!
```

Parameters with default values go at the **end** of the list.

## Keyword arguments

In a call you can also give the parameter name – then the order doesn't matter and the call is more readable:

```python run
def enrol(name, course, semester=1):
    return f"{name} – {course} (semester {semester})"

print(enrol("Anna", "Programming Fundamentals"))
print(enrol(course="Mathematics", name="Bela", semester=2))
print(enrol("Csilla", "Physics", semester=3))
```

## Return values

`return` can return a value of any type: a number, a string, a list, a dictionary, even another function.

```python run
def statistics(numbers):
    return {"min": min(numbers), "max": max(numbers), "avg": sum(numbers) / len(numbers)}

print(statistics([4, 8, 15, 16, 23, 42]))
```

## Returning several values

In Python you can return several values separated by commas – actually a **tuple** comes back, which can be unpacked:

```python run
def divide(a, b):
    return a // b, a % b      # quotient and remainder

q, r = divide(17, 5)
print("quotient:", q, "remainder:", r)

# The built-in divmod does the same:
print(divmod(17, 5))
```

## Validating input

A good function checks its parameters and reports errors clearly:

```python run
def average(numbers):
    if len(numbers) == 0:
        raise ValueError("An empty list has no average.")
    return sum(numbers) / len(numbers)

print(average([2, 4, 6]))
```

## What should be a parameter?

- Whatever the result **depends on** should be passed as a parameter – don't read global variables.
- **Return** the result (`return`); don't print it inside the function if you want to calculate with it elsewhere.

```python run
# Bad: it prints, but the result can't be used further.
def bad_sum(a, b):
    print(a + b)

# Good: it returns, and the caller decides what to do with it.
def good_sum(a, b):
    return a + b

print(good_sum(2, 3) * 10)   # 50
```

Parameter kinds (`*args`, `**kwargs`) and how values get into a function are covered in the **Parameter Evaluation and Passing** topic.

## Summary

- Formal parameter: name in the definition; actual parameter (argument): value in the call.
- Default value: `def f(x, y=0)`; keyword call: `f(y=1, x=2)`.
- Returning several values: `return a, b` (a tuple).
- A function should return its result, not print it.

## Lesson exercise: A price calculator with default parameters

Write a `price_calculator(net, vat=27, discount=0)` function that returns **two values**: the gross price to pay and the amount saved with the discount (both rounded to a whole number).

1. gross = net · (1 + vat/100),
2. the discount is `discount` percent of the gross,
3. to pay = gross − savings.

Validate the input: for a negative net price or a discount outside 0–100 raise `ValueError`.

```python starter required
def price_calculator(net, vat=27, discount=0):
    # validate input, compute, return to_pay, savings
    pass


print(price_calculator(10000))                # (12700, 0)
print(price_calculator(10000, discount=10))   # (11430, 1270)
```

<details>
<summary>Solution</summary>

```python solution
def price_calculator(net, vat=27, discount=0):
    if net < 0:
        raise ValueError("The net price cannot be negative.")
    if not 0 <= discount <= 100:
        raise ValueError("The discount must be between 0 and 100.")
    gross = net * (1 + vat / 100)
    savings = gross * discount / 100
    return round(gross - savings), round(savings)


print(price_calculator(10000))                # (12700, 0)
print(price_calculator(10000, discount=10))   # (11430, 1270)
```

</details>

```python test
assert price_calculator(10000) == (12700, 0), "With the default 27% VAT and no discount: (12700, 0)"
assert price_calculator(10000, discount=10) == (11430, 1270), "With a 10% discount: (11430, 1270)"
assert price_calculator(10000, vat=5) == (10500, 0), "With 5% VAT: (10500, 0)"
assert price_calculator(net=2000, discount=50, vat=0) == (1000, 1000), "Keyword arguments in any order."
for bad in [dict(net=-1), dict(net=100, discount=120), dict(net=100, discount=-5)]:
    try:
        price_calculator(**bad)
        assert False, f"Invalid input must raise ValueError: {bad}"
    except ValueError:
        pass
```

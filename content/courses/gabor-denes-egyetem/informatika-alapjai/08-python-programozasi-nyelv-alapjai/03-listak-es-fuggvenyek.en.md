---
title: Lists and Functions
summary: Creating lists, indexing, iterating, common operations; your own function with parameters and a return value.
minutes: 20
---

## What you will learn

- how to store several values in a **list** and access its elements,
- the most common **list operations**,
- how to write a **function** with parameters and a return value.

## Lists

```python run
grades = [5, 3, 4, 5, 2]
print(grades[0], grades[-1])   # first and last element: 5 2
print(grades[1:3])             # slice: [3, 4]
print(len(grades))             # length: 5
grades.append(4)               # append to the end
grades[1] = 4                  # modify an element
print(grades)
```

Indexing starts at **0**; a negative index counts from the end.

| Operation                    | Meaning               |
| ---------------------------- | --------------------- |
| `len(l)`                     | number of elements    |
| `l.append(x)`                | append                |
| `l.remove(x)`                | remove the first `x`  |
| `x in l`                     | is it in the list     |
| `sum(l)`, `min(l)`, `max(l)` | sum, minimum, maximum |
| `sorted(l)`                  | sorted copy           |

```python run
grades = [5, 3, 4, 5, 2]
for g in grades:
    print("*" * g)
print("average:", sum(grades) / len(grades))
```

## Functions

A **function** is a named, reusable piece of code. `def` introduces it, `return` gives back the result.

```python run
def square(x):
    return x * x

def greet(name, lang="en"):    # default parameter
    if lang == "hu":
        return f"Szia, {name}!"
    return f"Hello, {name}!"

print(square(7))
print(greet("Anna"))
print(greet("Anna", "hu"))
```

Why is it good? You write the code **once** and use it many times; the program splits into **parts** that can be tested separately.

## Summary

- List: `[a, b, c]`, index from 0, `len`, `append`, `in`, `sum`, `sorted`.
- Function: `def name(param):` … `return result`.
- `print` outputs, `return` gives back – not the same!

## Exercise: above average

Write the function `above_average(numbers)` that returns the **list** of elements (in original order) that are **greater** than the list's average. For example `above_average([1, 2, 3, 4, 10])` returns `[10]` (the average is 4).

```python starter required
def above_average(numbers):
    average = sum(numbers) / len(numbers)
    result = []
    # walk through the numbers and append those greater than the average
    return result


print(above_average([1, 2, 3, 4, 10]))
```

<details>
<summary>Solution</summary>

```python solution
def above_average(numbers):
    average = sum(numbers) / len(numbers)
    result = []
    for x in numbers:
        if x > average:
            result.append(x)
    return result


print(above_average([1, 2, 3, 4, 10]))
```

</details>

```python test
assert above_average([1, 2, 3, 4, 10]) == [10], "the average is 4, only 10 is greater"
assert above_average([5, 1, 9, 3]) == [5, 9], "the average is 4.5"
assert above_average([2, 2, 2]) == [], "nobody is above the average"
```

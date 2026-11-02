---
title: Maps and Dictionaries
summary: Storing key–value pairs: creation, access, modification, iteration, counting and nested dictionaries.
minutes: 18
---

## What you will learn

- what a **map** (associative array) is and how the Python **dictionary** (`dict`) implements it,
- how to access, add, modify and delete elements,
- how to **iterate** over a dictionary,
- typical patterns: **counting**, **grouping**, nested data.

## What is a map?

A **map** (also associative array, dictionary) stores **key–value pairs**. A value is accessed not by index but by **key** – like a phone book where we look up a name and get the number.

| Language   | Map type                         |
| ---------- | -------------------------------- |
| Python     | `dict`                           |
| Java       | `HashMap`, `TreeMap`             |
| C#         | `Dictionary<K, V>`               |
| C++        | `std::map`, `std::unordered_map` |
| JavaScript | `Map`, objects                   |

Keys are **unique** and immutable (strings, numbers, tuples); values can be anything. The Python dictionary uses a hash table, so access is **O(1)** on average, and it preserves insertion order (since Python 3.7).

## Creating and accessing

```python run
student = {
    "name": "Anna Kiss",
    "student_id": "ABC123",
    "semester": 1,
    "grades": [5, 4, 5],
}

print(student["name"])                     # access by key
print(student.get("email"))                # None – no error if the key is missing
print(student.get("email", "not given"))   # default value
print("student_id" in student)             # checking a key
# student["email"]  → KeyError
```

## Modifying, adding, deleting

```python run
prices = {"apple": 300, "pear": 450}
prices["plum"] = 520        # add a new key
prices["apple"] = 320       # modify an existing value
del prices["pear"]          # delete (KeyError if absent)
price = prices.pop("plum")  # remove and return
print(prices, price)

prices.update({"peach": 690, "apple": 350})   # several keys at once
print(prices)
```

## Iteration

```python run
prices = {"bread": 650, "milk": 420, "butter": 890}

for product in prices:                # by default iterates over the keys
    print(product)

for price in prices.values():         # values
    print(price, end=" ")
print()

for product, price in prices.items(): # key–value pairs
    print(f"{product}: {price}")

# Sorting by value
for product, price in sorted(prices.items(), key=lambda p: p[1]):
    print(product, price)
```

## Dictionary comprehensions

```python run
squares = {x: x * x for x in range(1, 6)}
print(squares)

prices = {"bread": 650, "milk": 420, "butter": 890}
expensive = {k: v for k, v in prices.items() if v > 500}
print(expensive)
```

## Typical pattern: counting

```python run
text = "the basics of programming the basics"
frequency = {}
for word in text.split():
    frequency[word] = frequency.get(word, 0) + 1
print(frequency)

# The same with the Counter class:
from collections import Counter
print(Counter(text.split()).most_common(2))
```

## Typical pattern: grouping

```python run
students = [("Anna", "A"), ("Bela", "B"), ("Csilla", "A"), ("Dora", "B"), ("Ede", "A")]
groups = {}
for name, group in students:
    groups.setdefault(group, []).append(name)   # inserts an empty list if the key is new
print(groups)
```

## Nested data

Real data is often a list of dictionaries or dictionaries inside dictionaries (e.g. JSON):

```python run
course = {
    "name": "Programming Fundamentals",
    "credits": 8,
    "students": [
        {"name": "Anna", "score": 92},
        {"name": "Bela", "score": 61},
    ],
}
for s in course["students"]:
    print(s["name"], s["score"])
average = sum(s["score"] for s in course["students"]) / len(course["students"])
print("Average:", average)
```

## Summary

- A map stores key–value pairs; in Python it's `dict`, with **O(1)** access on average.
- Access: `d[k]` (KeyError if missing) or `d.get(k, default)`; iteration: `keys()`, `values()`, `items()`.
- Patterns: counting (`get(k, 0) + 1`, `Counter`), grouping (`setdefault`).

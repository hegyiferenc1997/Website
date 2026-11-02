---
title: Loops – for
summary: Counting loops with range(), iterating over lists and strings, enumerate and zip.
minutes: 15
---

## What you will learn

- how to use the `for` loop as a **counting** loop with `range()`,
- how to **iterate** over the elements of a list or string,
- what `enumerate()` and `zip()` are for,
- how Python's `for` differs from the C/Java `for`.

## Counting loop: range()

When we **know in advance** how many times to repeat, the `for` loop is the most convenient.

```python run
for i in range(5):          # 0, 1, 2, 3, 4 – 5 is not included!
    print(i, end=" ")
print()

for i in range(1, 6):       # from 1 to 5
    print(i, end=" ")
print()

for i in range(0, 20, 5):   # step: 0, 5, 10, 15
    print(i, end=" ")
print()

for i in range(10, 0, -3):  # backwards: 10, 7, 4, 1
    print(i, end=" ")
print()
```

| Call                | Values                              |
| ------------------- | ----------------------------------- |
| `range(n)`          | 0, 1, …, n−1                        |
| `range(a, b)`       | a, a+1, …, b−1                      |
| `range(a, b, step)` | a, a+step, … (up to b, excluding b) |

## Iterating loop (for-each)

Python's `for` is really an **iterating** loop: it goes through the elements of a collection one by one.

```python run
fruits = ["apple", "pear", "plum"]
for fruit in fruits:
    print(fruit.upper())

for letter in "Hello":
    print(letter, end="-")
print()
```

## Index and element together: enumerate()

```python run
names = ["Anna", "Bela", "Csilla"]
for number, name in enumerate(names, start=1):
    print(f"{number}. {name}")
```

## Several lists in parallel: zip()

```python run
names = ["Anna", "Bela", "Csilla"]
scores = [87, 64, 92]
for name, score in zip(names, scores):
    print(f"{name}: {score} points")
```

## Summing with a for loop

```python run
# The sum of the numbers from 1 to 100.
total = 0
for i in range(1, 101):
    total += i
print(total)   # 5050

# The same with a built-in function:
print(sum(range(1, 101)))
```

## for in other languages

In C and Java `for` has three parts: initial value, condition, step.

```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
```

This is essentially a compactly written `while` loop. Python's `for i in range(5):` does the same. Java and C# also have iterating loops: `for (String s : list)` and `foreach (var s in list)`.

## while or for?

| Use `for` if …                              | Use `while` if …                   |
| ------------------------------------------- | ---------------------------------- |
| the number of repetitions is known          | you don't know in advance how many |
| you go through the elements of a collection | you repeat until a condition holds |

> **Don't modify** the list you are iterating over (don't remove or add elements) – the result is unpredictable. Build a new list instead.

## Summary

- `for i in range(a, b, step)` – counting loop; the upper bound is excluded.
- `for item in collection` – iteration; `enumerate()` also gives the index, `zip()` pairs things up.
- Python's `for` is an iterating loop; the C/Java `for` is a compact `while`.

## Lesson exercise: A ranking with zip and enumerate

There are two parallel lists: the students' names and their scores. Write a `ranking(names, scores)` function that returns a list of lines like these, in **descending** order of score:

```text
1. Cecil (92)
2. Anna (87)
3. Bob (64)
```

Use `zip()` for pairing, `sorted()` for sorting and `enumerate(..., start=1)` for the position! For equal scores keep the original order (`sorted` does this by itself).

```python starter required
def ranking(names, scores):
    pairs = list(zip(names, scores))
    # sort by score descending, then build the lines with enumerate
    pass


print(ranking(["Anna", "Bob", "Cecil"], [87, 64, 92]))
```

<details>
<summary>Solution</summary>

```python solution
def ranking(names, scores):
    pairs = list(zip(names, scores))
    ordered = sorted(pairs, key=lambda pair: pair[1], reverse=True)
    lines = []
    for place, (name, score) in enumerate(ordered, start=1):
        lines.append(f"{place}. {name} ({score})")
    return lines


print(ranking(["Anna", "Bob", "Cecil"], [87, 64, 92]))
```

</details>

```python test
assert ranking(["Anna", "Bob", "Cecil"], [87, 64, 92]) == ["1. Cecil (92)", "2. Anna (87)", "3. Bob (64)"], "The example ranking is not right."
assert ranking([], []) == [], "Empty lists give an empty ranking."
assert ranking(["X", "Y"], [50, 50]) == ["1. X (50)", "2. Y (50)"], "Equal scores keep the original order."
```

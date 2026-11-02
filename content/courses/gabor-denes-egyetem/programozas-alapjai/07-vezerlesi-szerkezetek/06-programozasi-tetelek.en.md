---
title: Basic Algorithm Patterns
summary: The patterns most tasks are built from: summation, counting, maximum, decision, selection, search, filtering.
minutes: 25
---

## What you will learn

The **basic algorithm patterns** (in Hungarian curricula: "programozási tételek") are proven templates that solve most tasks. Once you recognise which pattern fits, the solution practically writes itself. For each one we give the template and Python's built-in shortcut.

| Pattern           | Question                                      | Result          |
| ----------------- | --------------------------------------------- | --------------- |
| summation         | what is the sum of the elements?              | one value       |
| counting          | how many elements satisfy the condition?      | a number        |
| maximum selection | which is the largest?                         | element / index |
| decision          | is there an element satisfying the condition? | true / false    |
| selection         | where is the (surely existing) element?       | index           |
| linear search     | is it there, and if so, where?                | index or "none" |
| filtering         | which ones satisfy the condition?             | new list        |

## 1. Summation

```python run
def summation(values):
    total = 0                  # initial value: the neutral element of the operation
    for x in values:
        total += x
    return total

grades = [5, 3, 4, 5, 2]
print(summation(grades), sum(grades))
```

For a product the initial value is 1, for joining strings `""`.

## 2. Counting

```python run
def counting(values):
    count = 0
    for x in values:
        if x >= 4:             # the condition
            count += 1
    return count

grades = [5, 3, 4, 5, 2]
print(counting(grades))                     # 3
print(sum(1 for x in grades if x >= 4))     # shorter
```

## 3. Maximum selection

```python run
def max_index(values):
    # We assume the list is not empty.
    best = 0                          # index of the largest so far
    for i in range(1, len(values)):
        if values[i] > values[best]:
            best = i
    return best

scores = [64, 87, 92, 71]
i = max_index(scores)
print(i, scores[i])                   # 2 92
print(max(scores), scores.index(max(scores)))
```

> If you chose `0` as the initial _value_, it would fail for negative numbers. That's why we start from the **first element**.

## 4. Decision

Is there an element satisfying the condition? As soon as we find one, we can stop.

```python run
def has_fail(grades):
    i = 0
    while i < len(grades) and not (grades[i] == 1):
        i += 1
    return i < len(grades)

print(has_fail([5, 3, 4]), has_fail([5, 1, 4]))
print(any(g == 1 for g in [5, 1, 4]))   # built in: any(); "all of them": all()
```

## 5. Selection

We know there is a matching element – we want its index.

```python run
def selection(values):
    i = 0
    while not (values[i] % 7 == 0):   # no i < len check needed: one surely exists
        i += 1
    return i

print(selection([3, 10, 14, 21]))     # 2
```

## 6. Linear search

Decision and selection combined: is it there, and if so, where?

```python run
def search(values, target):
    for i, x in enumerate(values):
        if x == target:
            return i
    return -1                          # convention: -1 means not found

names = ["Anna", "Bela", "Csilla"]
print(search(names, "Bela"), search(names, "Dora"))
```

## 7. Filtering

Collect the elements satisfying the condition into a new list.

```python run
def filtering(values):
    result = []
    for x in values:
        if x % 2 == 0:
            result.append(x)
    return result

numbers = [3, 8, 11, 14, 20]
print(filtering(numbers))
print([x for x in numbers if x % 2 == 0])   # with a list comprehension
```

## Combining patterns

Real tasks combine patterns. For example: _"What is the average of the grades 4 or better?"_ = filtering + summation + counting.

```python run
grades = [5, 3, 4, 5, 2, 4]
good = [g for g in grades if g >= 4]        # filtering
if good:                                    # decision: are there any at all
    print(sum(good) / len(good))            # summation / counting
```

## Summary

- The basic patterns are ready-made templates: **summation, counting, maximum selection, decision, selection, search, filtering**.
- Many have built-in Python equivalents: `sum`, `max`, `any`, `all`, `index`, comprehensions – but for exams and other languages you need to know the template.
- Try to break every task down into patterns.

## Lesson exercise: Weather analysis with the basic algorithms

The daily mean temperatures of a month are given in a list. Write an `analyse(temperatures)` function that returns a five-element tuple – each element is one basic algorithm:

1. **summation**: the average temperature rounded to one decimal,
2. **maximum selection**: the **position** of the warmest day (counting from 1; for ties the first),
3. **decision**: was there a freezing day (below 0 °C) – `True`/`False`,
4. **counting**: how many summer days there were (at least 25 °C),
5. **search**: the position of the first freezing day (from 1), or `None` if there was none.

Write the algorithms with loops (`max()` and `sum()` don't count now!). The list is not empty.

```python starter required
def analyse(temperatures):
    # 1. summation  2. maximum selection  3. decision  4. counting  5. search
    pass


print(analyse([3, -2, 7, 26, 25, -1]))   # (9.7, 4, True, 2, 2)
```

<details>
<summary>Solution</summary>

```python solution
def analyse(temperatures):
    total = 0
    max_index = 0
    summer = 0
    first_frost = None
    for i, t in enumerate(temperatures):
        total += t
        if t > temperatures[max_index]:
            max_index = i
        if t >= 25:
            summer += 1
        if t < 0 and first_frost is None:
            first_frost = i + 1
    average = round(total / len(temperatures), 1)
    had_frost = first_frost is not None
    return (average, max_index + 1, had_frost, summer, first_frost)


print(analyse([3, -2, 7, 26, 25, -1]))   # (9.7, 4, True, 2, 2)
```

</details>

```python test
assert analyse([3, -2, 7, 26, 25, -1]) == (9.7, 4, True, 2, 2), "The example result is not right."
assert analyse([10, 12, 12]) == (11.3, 2, False, 0, None), "For equal maximums the first counts; without frost None."
assert analyse([-5]) == (-5.0, 1, True, 0, 1), "A single freezing day."
```

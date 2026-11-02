---
title: Final Review – the Whole Semester
summary: Mixed review questions and exercises from the entire course, to prepare for tests and the project.
minutes: 45
kind: practice
---

This practice covers every topic of the semester. First try to solve the exercises **without help**, and only then look at the solution! If something doesn't work out, the number in brackets next to the question tells you which topic to revisit.

## Review questions

**1. What is the difference between a compiler and an interpreter? (3)**

<details>
<summary>Answer</summary>

A compiler converts the whole program to machine (or intermediate) code in advance, and running it is a separate step. An interpreter interprets and executes the program statement by statement while it runs. Python compiles to bytecode, then interprets that.

</details>

**2. What does it print? `print(7 // 2, 7 % 2, 7 / 2, 2 ** 3)` (6)**

<details>
<summary>Answer</summary>

`3 1 3.5 8` – integer division, remainder, true division, exponentiation.

</details>

**3. What does it mean that Python is dynamically but strongly typed? (5)**

<details>
<summary>Answer</summary>

Dynamic: a variable's type is decided at run time, and the same name can later refer to a value of another type. Strong: there is no automatic conversion between incompatible types, e.g. `"5" + 2` raises `TypeError`.

</details>

**4. What does it print, and why? (9)**

```python
def add(item, items=[]):
    items.append(item)
    return items

print(add(1), add(2))
```

<details>
<summary>Answer</summary>

`[1, 2] [1, 2]` – the default list is created once, when the function is defined, and every call modifies the same list. Correctly: `items=None`, then inside the function `if items is None: items = []`.

</details>

**5. Which data structure would you choose for: (a) tracking unique visitors, (b) student name → grades, (c) an undo feature? (10)**

<details>
<summary>Answer</summary>

(a) a set – it filters out duplicates automatically; (b) a dictionary whose values are lists; (c) a stack (a list with `append`/`pop`) – we always undo the most recent action.

</details>

**6. What are the two required parts of recursion, and what happens if one is missing? (11)**

<details>
<summary>Answer</summary>

A base case (where the recursion stops) and a recursive step (which moves towards the base case). Without a base case, or without moving towards it, the calls nest endlessly and a `RecursionError` occurs.

</details>

**7. What is the `finally` clause for, and what is the advantage of the `with` statement for files? (12–13)**

<details>
<summary>Answer</summary>

`finally` always runs, whether there was an exception or not – it's for releasing resources. `with` closes the file automatically at the end of the block, even on error, so you don't have to call `close()` by hand.

</details>

**8. What is the difference between a unit test and an integration test? (14)**

<details>
<summary>Answer</summary>

A unit test examines a single small unit (function, class) in isolation. An integration test checks whether several units work correctly together.

</details>

**9. What would you improve in this code? `def f(l): return sum(l)/len(l)` (15)**

<details>
<summary>Answer</summary>

Meaningful names (`average(numbers)`), a docstring, type hints, and handling of the empty list (division by zero): e.g. `if not numbers: return 0.0` or a clear `ValueError`.

</details>

**10. Why is a real-time program controlling a microcontroller-based robot usually not written in Python, and what might be an exception? (16–18)**

<details>
<summary>Answer</summary>

A microcontroller has little memory and is slow; C/C++ needs few resources, is fast and accesses the hardware directly. Exceptions are MicroPython, which is enough for smaller tasks, and more powerful machines like the Raspberry Pi (e.g. with ROS), where Python is common too.

</details>

## Exercises

### Exercise 1: Binary search (7, 10)

Write a function `binary_search(items, target)` that finds an element in a **sorted** list with a loop and returns its index, or `-1` if it isn't there.

```python starter
def binary_search(items, target):
    # TODO
    pass
```

<details>
<summary>Solution</summary>

```python solution
def binary_search(items, target):
    """Search a sorted list; the index or -1. Number of steps: O(log n)."""
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            low = mid + 1       # continue in the right half
        else:
            high = mid - 1      # continue in the left half
    return -1
```

</details>

```python test
numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
assert binary_search(numbers, 23) == 5
assert binary_search(numbers, 2) == 0
assert binary_search(numbers, 91) == 9
assert binary_search(numbers, 7) == -1
assert binary_search([], 1) == -1
print("All checks passed!")
```

### Exercise 2: Checking brackets with a stack (10)

Write a function `brackets_ok(text)` that decides whether the brackets `()`, `[]`, `{}` are correctly paired and nested. Ignore all other characters.

```python starter
def brackets_ok(text):
    # TODO
    pass
```

<details>
<summary>Solution</summary>

```python solution
PAIRS = {")": "(", "]": "[", "}": "{"}

def brackets_ok(text):
    """Are the brackets correctly paired and nested?"""
    stack = []
    for ch in text:
        if ch in "([{":
            stack.append(ch)
        elif ch in PAIRS:
            if not stack or stack.pop() != PAIRS[ch]:
                return False
    return not stack    # no open bracket may remain at the end
```

</details>

```python test
assert brackets_ok("(a + b) * [c - {d / e}]")
assert brackets_ok("")
assert not brackets_ok("(]")
assert not brackets_ok("([)]")
assert not brackets_ok("((")
assert not brackets_ok("())")
print("All checks passed!")
```

### Exercise 3: Digit sum recursively and iteratively (11)

Write the digit sum of a non-negative integer in two ways: `digit_sum_rec(n)` with recursion and `digit_sum_it(n)` with a loop.

```python starter
def digit_sum_rec(n):
    # TODO
    pass

def digit_sum_it(n):
    # TODO
    pass
```

<details>
<summary>Solution</summary>

```python solution
def digit_sum_rec(n):
    """Recursive version: last digit + sum of the remaining digits."""
    if n < 10:          # base case: a single digit
        return n
    return n % 10 + digit_sum_rec(n // 10)

def digit_sum_it(n):
    """Iterative version: while there are digits, cut one off and add it."""
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total
```

</details>

```python test
for n, expected in [(0, 0), (7, 7), (123, 6), (9999, 36), (1001, 2)]:
    assert digit_sum_rec(n) == expected, n
    assert digit_sum_it(n) == expected, n
print("All checks passed!")
```

### Exercise 4: Grouping into a dictionary (8, 10)

Write a function `group(students)` that builds a dictionary from a list of `(name, programme)` pairs: the key is the programme, the value is the **alphabetically sorted** list of its students.

```python starter
def group(students):
    # TODO
    pass
```

<details>
<summary>Solution</summary>

```python solution
def group(students):
    """(name, programme) pairs → {programme: sorted list of names}."""
    groups = {}
    for name, programme in students:
        groups.setdefault(programme, []).append(name)
    return {programme: sorted(names) for programme, names in groups.items()}
```

</details>

```python test
data = [("Ben", "computer eng."), ("Anna", "business IT"), ("Adam", "computer eng."), ("Clara", "computer eng.")]
assert group(data) == {"computer eng.": ["Adam", "Ben", "Clara"], "business IT": ["Anna"]}
assert group([]) == {}
print("All checks passed!")
```

> Note: `sorted()` sorts by character codes by default, so accented capitals (e.g. "Á") end up after "Z". For language-aware ordering you need the `locale` module or a custom sort key.

### Exercise 5: Safe data processing (12, 13)

Write a function `summarise(lines)` that processes a list of text lines in the format `"name;score"` and returns a `(total, bad_line_count)` pair. A line is bad if it doesn't consist of exactly two parts or the score isn't an integer. Skip empty lines (they don't count as bad).

```python starter
def summarise(lines):
    # TODO
    pass
```

<details>
<summary>Solution</summary>

```python solution
def summarise(lines):
    """"name;score" lines → (sum of scores, number of bad lines)."""
    total, bad = 0, 0
    for line in lines:
        if not line.strip():
            continue
        try:
            name, score = line.split(";")   # ValueError if not 2 parts
            total += int(score)             # ValueError if not a number
        except ValueError:
            bad += 1
    return total, bad
```

</details>

```python test
assert summarise(["Anna;10", "Ben;7", "", "Clara;abc", "bad line", "Dan;3;x", "Emma; 5"]) == (22, 3)
assert summarise([]) == (0, 0)
print("All checks passed!")
```

## What next?

If every exercise worked out: congratulations, you have mastered the semester's material! Keep practising with the mini projects' extension ideas, and apply what you've learned in the group project.

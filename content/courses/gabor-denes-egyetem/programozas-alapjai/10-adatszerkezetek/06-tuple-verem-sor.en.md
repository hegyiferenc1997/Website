---
title: Tuples, Stacks, Queues – and Which to Choose
summary: The immutable tuple, the LIFO stack and the FIFO queue, plus a summary table for choosing data structures.
minutes: 15
---

## What you will learn

- what a **tuple** is and when to use it instead of a list,
- what a **stack** and a **queue** are and how to implement them in Python,
- how to **choose** a data structure for a task.

## Tuple – ordered and immutable

A **tuple** is like a list, but it **can't be modified** after creation. We use it for related, fixed data (coordinates, dates, records).

```python run
point = (3, 4)
date = (2026, 11, 2)
single = (5,)            # the comma is needed, otherwise it's just a parenthesised number!

print(point[0], len(date))
x, y = point             # unpacking
print(x, y)
# point[0] = 10  → TypeError: 'tuple' object does not support item assignment

# Since it's immutable, it can be a dictionary key or a set element.
distances = {("Budapest", "Gyor"): 121, ("Budapest", "Pecs"): 197}
print(distances[("Budapest", "Gyor")])
```

With named fields, `namedtuple` is more readable:

```python run
from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p.x, p.y, p)
```

## Stack – LIFO

A **stack** works on the "last in, first out" (**LIFO**) principle, like a pile of plates. Operations: **push** (put on top), **pop** (take from the top), **peek/top** (look at the top).

Uses: undo (Ctrl+Z), the browser's back button, function calls (the call stack), checking brackets.

```python run
stack = []
stack.append("A")     # push
stack.append("B")
stack.append("C")
print(stack[-1])      # peek: C
print(stack.pop())    # pop: C
print(stack.pop())    # pop: B
print(stack)          # ['A']
```

```python run
# Checking that brackets match, using a stack.
def brackets_ok(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in text:
        if c in "([{":
            stack.append(c)
        elif c in pairs:
            if not stack or stack.pop() != pairs[c]:
                return False
    return not stack

print(brackets_ok("(a[b]{c})"), brackets_ok("(a[b)]"))
```

## Queue – FIFO

A **queue** works on the "first in, first out" (**FIFO**) principle, like waiting in line. Operations: **enqueue** (join at the back), **dequeue** (take from the front).

Uses: print queues, task scheduling, message queues, breadth-first search.

Removing from the front of a list is slow (O(n)), so for queues we use `collections.deque`:

```python run
from collections import deque

queue = deque()
queue.append("customer 1")   # enqueue
queue.append("customer 2")
queue.append("customer 3")
print(queue.popleft())       # dequeue: customer 1 – O(1)
print(queue.popleft())
print(list(queue))
```

## Which data structure to choose?

| Question / need                                     | Choice                          |
| --------------------------------------------------- | ------------------------------- |
| order matters, access and modify by index           | **list**                        |
| fixed, related values that don't change             | **tuple**                       |
| only "is it in there?" matters; removing duplicates | **set**                         |
| looking up values by key                            | **dictionary (map)**            |
| always need the most recently added element         | **stack** (list `append`/`pop`) |
| process in order of arrival                         | **queue** (`deque`)             |
| many insertions/deletions at the front or middle    | **linked list** / `deque`       |

## Cost of operations – summary

|                     | list  | tuple | set      | dict           | deque    |
| ------------------- | ----- | ----- | -------- | -------------- | -------- |
| access by index     | O(1)  | O(1)  | –        | –              | O(n)     |
| search (`in`)       | O(n)  | O(n)  | **O(1)** | **O(1)** (key) | O(n)     |
| insert at the end   | O(1)* | –     | O(1)*    | O(1)*          | O(1)     |
| insert at the front | O(n)  | –     | –        | –              | **O(1)** |
| mutable             | yes   | no    | yes      | yes            | yes      |

\* on average

## Summary

- A **tuple** is an immutable list; it can be a dictionary key.
- **Stack**: LIFO, in Python list `append` + `pop`.
- **Queue**: FIFO, in Python `deque` `append` + `popleft`.
- When choosing, think about: order, index, fast search, keys, mutability.

## Lesson exercise: Checking brackets with a stack

Write a `brackets_ok(text)` function that uses a **stack** to decide whether the `()`, `[]` and `{}` brackets are correctly paired in a text. Ignore every other character.

- For an opening bracket push it onto the stack (`append`).
- For a closing one look at the top of the stack (`pop`): the matching opening bracket must be there – if the stack is empty or it doesn't match, the answer is `False`.
- At the end the stack must be empty.

Tip: a dictionary for the pairs: `{")": "(", "]": "[", "}": "{"}`.

```python starter required
def brackets_ok(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in text:
        pass
    return True


print(brackets_ok("f(a[1]) + {x}"))   # True
print(brackets_ok("(]"))              # False
```

<details>
<summary>Solution</summary>

```python solution
def brackets_ok(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in text:
        if c in "([{":
            stack.append(c)
        elif c in pairs:
            if not stack or stack.pop() != pairs[c]:
                return False
    return not stack


print(brackets_ok("f(a[1]) + {x}"))   # True
print(brackets_ok("(]"))              # False
```

</details>

```python test
for text, expected in [("f(a[1]) + {x}", True), ("(]", False), ("", True), ("((", False), ("())", False),
                       ("{[()()]}", True), ("([)]", False), ("no brackets here", True), (")(", False)]:
    assert brackets_ok(text) is expected, f"{text!r} → {expected}"
```

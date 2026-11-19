---
title: Deeper – Measuring and Comparing Algorithms
summary: Counting steps in linear and binary search, bubble sort versus merge sort, the stack in bracket checking and the undo button, the queue in a print queue, and collisions in a hash table – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- how to **measure** an algorithm's step count, and read the O-notation from it,
- why a **faster sort** wins on large data, even if it's more complicated,
- where real software uses **stacks** and **queues**,
- what a **collision** is in a hash table, and why it slows things down.

## 1. Counting steps: linear and binary search

In the basic lesson we said linear search is $O(n)$ and binary search $O(\log n)$. Let's not just believe it – let's **count** the steps! The program increments a counter at every comparison:

```python run
# Measuring step counts: linear and binary search in the worst case
def linear(items, target):
    steps = 0
    for x in items:
        steps += 1
        if x == target:
            break
    return steps

def binary(items, target):
    steps, left, right = 0, 0, len(items) - 1
    while left <= right:
        steps += 1
        mid = (left + right) // 2
        if items[mid] == target:
            break
        if items[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return steps

for n in [10, 100, 1000, 10_000, 1_000_000]:
    items = list(range(n))
    target = n - 1                             # the worst case: the last element
    print(f"n = {n:>9}: linear {linear(items, target):>9} steps, binary {binary(items, target):>2} steps")
```

With a million elements, linear search takes a million steps, binary search only **20**. If the list is ten times bigger, linear search takes ten times as many steps, binary search only about 3 more. But don't forget the **condition**: binary search needs a **sorted** list – and sorting has a cost too.

## 2. A sorting race

Bubble sort is simple, but $O(n^2)$: a list twice as long needs **four times** as many comparisons. **Merge sort** uses a different idea: it cuts the list in half, sorts both halves (recursively), then merges the two sorted halves in a single pass. That's $O(n \log n)$:

```python run
# Number of comparisons: bubble sort vs. merge sort
import random

def bubble(items):
    a, count = items[:], 0
    for i in range(len(a) - 1):
        for j in range(len(a) - 1 - i):
            count += 1
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a, count

def merge_sort(items):
    if len(items) <= 1:
        return items, 0
    k = len(items) // 2
    left, c1 = merge_sort(items[:k])
    right, c2 = merge_sort(items[k:])
    out, i, j, count = [], 0, 0, c1 + c2
    while i < len(left) and j < len(right):    # merging the two sorted halves
        count += 1
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:], count

random.seed(2)
for n in [10, 100, 1000]:
    items = [random.randint(0, 9999) for _ in range(n)]
    b, cb = bubble(items)
    m, cm = merge_sort(items)
    assert b == m == sorted(items)             # both sort correctly
    print(f"n = {n:>5}: bubble {cb:>7} comparisons, merge {cm:>6}")
```

With a thousand elements, bubble sort makes about half a million comparisons, merge sort about nine thousand. The chart shows why: the $n^2/2$ curve shoots up, while $n \log_2 n$ stays almost straight. With the slider you can put a factor in front of bubble sort – you can even assume each bubble step is ten times faster:

```plot
title: Step count as a function of list length
x: 1, 200
y: 0, 5000
param: c = 1, 0.1, 1, 0.05
f: c*x^2/2 # bubble sort (sped up c times)
f: x*log2(x) # merge sort
```

Even if bubble sort's steps are ten times faster ($c = 0.1$), above a certain size $n \log n$ **always** wins. That's the essence of O-notation: on large data the **shape** of growth decides, not the constant factor. (On small lists, though, the simple algorithm can be faster – Python's built-in `sorted()` also uses simple insertion sort for short runs.)

## 3. Stacks and queues in practice

A **stack** (LIFO: last in, first out) is useful wherever you need to return to the most recent thing. Two examples: a text editor's **undo** button, and **bracket checking** – that's how compilers and code editors flag an unclosed bracket:

```python run
# Stack: bracket checking and undo
PAIRS = {")": "(", "]": "[", "}": "{"}

def brackets_ok(text):
    stack = []
    for c in text:
        if c in "([{":
            stack.append(c)                        # opening: onto the top of the stack
        elif c in PAIRS:
            if not stack or stack.pop() != PAIRS[c]:
                return False                       # no partner, or the wrong partner
    return not stack                               # did every opening bracket close?

for code in ["print(items[0])", "f(x[1)]", "{'a': [1, 2]}", "if (a > b:"]:
    print(f"{code:<18} → {'ok' if brackets_ok(code) else 'ERROR'}")

# undo: every action goes onto the stack
text, history = "", []
for action in ["Hello", " world", "!!!"]:
    history.append(text)
    text += action
print("\ntext:", text)
text = history.pop()
print("after undo:", text)
```

A **queue** (FIFO: first in, first out) is the "fair" order: a print queue, a web server's incoming requests, or a help-desk system's tickets. In Python use `collections.deque` for it, because removing from the front of a list is slow ($O(n)$), while `deque.popleft()` is $O(1)$.

```python run
# Queue: a print queue with deque
from collections import deque

queue = deque()
for document in ["thesis.pdf", "notes.docx", "timetable.png"]:
    queue.append(document)                       # to the end of the queue
    print(f"arrived: {document} (waiting: {len(queue)})")
while queue:
    print("printing:", queue.popleft())         # the oldest always comes next
```

## 4. Hash tables and collisions

A hash table (in Python, `dict` and `set`) is fast because a **hash function** computes from the key which "bucket" it goes into – there's no need to look through them all. But what if two keys land in the same bucket? That's a **collision**: then a small list in that bucket has to be searched. With a deliberately bad hash function the difference is clear:

```python run
# Hash table: good and bad hash functions, collisions
def bad_hash(word, buckets):
    return len(word) % buckets                   # only looks at the length: many collisions

def good_hash(word, buckets):
    h = 0
    for c in word:
        h = (h * 31 + ord(c)) % buckets          # every letter counts, and their order
    return h

words = ["alma", "körte", "szilva", "barack", "dinnye", "meggy", "eper", "kiwi", "mangó", "citrom", "füge", "datolya"]
for name, f in [("bad", bad_hash), ("good", good_hash)]:
    buckets = [[] for _ in range(8)]
    for w in words:
        buckets[f(w, 8)].append(w)
    longest = max(len(b) for b in buckets)
    print(f"{name:>4} hash: bucket sizes {[len(b) for b in buckets]}, longest chain: {longest}")
```

With the bad hash function the words crowd into a few buckets, and searching the longest chain becomes almost linear. That's why a good hash function must **spread evenly**. (There's a security viewpoint too: if an attacker knows how the hash function works, they can deliberately send colliding keys and slow the server down – that's why Python randomises string hashing at every start.)

| Data structure  | Search      | Insert at end / front | When to choose it?                       |
| --------------- | ----------- | --------------------- | ---------------------------------------- |
| list (array)    | $O(n)$      | $O(1)$ / $O(n)$       | order matters, access by index           |
| sorted list     | $O(\log n)$ | $O(n)$                | you search a lot, insert rarely          |
| `deque` (queue) | $O(n)$      | $O(1)$ / $O(1)$       | frequent in and out at both ends         |
| `dict` / `set`  | $O(1)$ avg. | $O(1)$ avg.           | fast lookup by key, order doesn't matter |

## Summary

- Counting steps lets you check O-notation: linear search takes $n$ steps, binary search about $\log_2 n$ – but it only works on a sorted list.
- An $O(n \log n)$ sort (e.g. merge sort) beats an $O(n^2)$ one on large data even if the latter's steps are faster.
- A stack (LIFO) is for undo and bracket checking, a queue (FIFO) for fair service.
- A hash table is $O(1)$ on average but slows down with collisions; a good hash function spreads evenly.

## Lesson exercise

```quiz required
? At most how many steps does binary search need in a sorted list of 1024 elements?
= 11
! Each step halves the range: $1024 \to 512 \to \ldots \to 1$ is 10 halvings, plus the last comparison, 11 in total.

? Bubble sort makes about $n^2/2$ comparisons for $n$ elements. By what factor does this grow if the list becomes three times as long?
= 9
! $(3n)^2 / 2 = 9 \cdot n^2/2$.

? Which data structure fits the "Undo" (Ctrl+Z) button?
+ stack
- queue
- hash table
- sorted list
! We always undo the most recent action (LIFO).

? Which bracket sequence is correct?
- `( [ ) ]`
+ `{ ( [ ] ) }`
- `( ( )`
- `] [`
! Every closing bracket closes its most recently opened partner.

? What happens in a hash table if many keys land in the same bucket?
- nothing, it stays just as fast
+ lookup slows down, because the elements in the bucket have to be checked one by one
- the table deletes the old keys
- we get an error message
! That's why an evenly spreading hash function is needed.
```

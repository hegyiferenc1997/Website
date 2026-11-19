---
title: Deeper – Choosing the Right Data Structure
summary: Why a set is faster than a list for "is it in there?" (measured and on a chart), path finding in a maze with a queue (deque), grouping with Counter and defaultdict, your own linked list, and the basis of a search engine, the inverted index – with runnable programs and a programming exercise.
minutes: 55
---

## What you will learn in this lesson

- how to **choose** a data structure for the task – and how much a good choice matters,
- how to find the **shortest path** in a maze with the help of a **queue**,
- how to **group** and **count** conveniently with dictionaries,
- how a **linked list** is built, and when it's better than a plain list.

## 1. List or set: the "is it in there?" question

In the basic lessons we saw all the basic data structures. The most important question is always: **which operation** do we perform most often? If we often ask whether an element is in there, a list searches from start to end, while a set uses the hash function to jump **straight** to the right place:

```plot
title: Steps for an "is it in there?" question, with n elements
x: 0, 10000
y: 0, 5000
f: x/2 # list: half of it has to be looked through on average
f: 1 # set/dictionary: a single step on average
```

```python run
# Comparing a list and a set by measuring: 100 lookups among 100,000 elements
import time

items = list(range(100_000))
as_list, as_set = items, set(items)
wanted = range(99_900, 100_000)                # from the end of the list – the list's worst case

for name, container in [("list", as_list), ("set", as_set)]:
    start = time.perf_counter()
    hits = sum(1 for w in wanted if w in container)
    ms = (time.perf_counter() - start) * 1000
    print(f"{name:>4}: {hits} hits, {ms:8.2f} ms")
```

The exact times differ from machine to machine, but the set is **orders of magnitude** faster. The price: a set doesn't keep order, it can't contain duplicates, and only "hashable" (immutable) elements can go in. Typical uses: elements already seen, a blocklist, unique visitors.

## 2. Queue: path finding in a maze

A **queue** (FIFO) is the basis of "breadth-first search" (BFS): starting from the start point, we first look at the cells 1 step away, then those 2 steps away, and so on – so the first time we reach the goal, it's surely the **shortest** path. Navigation, game AI and network routing are all based on this idea:

```python run
# Shortest path in a maze with breadth-first search (queue = deque)
from collections import deque

maze = [
    "S.#.....",
    ".##.###.",
    "....#...",
    ".##...#G",
]

def shortest(grid):
    rows, cols = len(grid), len(grid[0])
    start = next((r, c) for r in range(rows) for c in range(cols) if grid[r][c] == "S")
    queue = deque([(start, 0)])                 # (cell, steps so far)
    seen = {start}
    while queue:
        (r, c), steps = queue.popleft()         # take from the FRONT of the queue
        if grid[r][c] == "G":
            return steps
        for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != "#" and (nr, nc) not in seen:
                seen.add((nr, nc))              # set: a fast "have we been here?"
                queue.append(((nr, nc), steps + 1))
    return None

print("length of the shortest path:", shortest(maze), "steps")
```

Why a `deque` and not a list? `list.pop(0)` shifts every element forward by one, which is slow for a big list; `deque.popleft()` is a single step. Two data structures work together in the example: the **queue** keeps the order of traversal, the **set** the cells already seen. If we did the same with a stack (taking from the end), we'd get depth-first search, which finds a path, but not necessarily the shortest.

## 3. Dictionaries: grouping and counting

A very common task: arranging elements into **groups**, or **counting** how many there are of each. Two helpers of the `collections` module make this shorter and safer:

```python run
# Grouping with defaultdict, counting with Counter
from collections import Counter, defaultdict

results = [("Anna", 5), ("Ben", 3), ("Cecily", 5), ("Dan", 4), ("Emma", 3), ("Frank", 5)]

# grouping: grade → list of names
groups = defaultdict(list)                      # automatically an empty list for a missing key
for name, grade in results:
    groups[grade].append(name)
for grade in sorted(groups, reverse=True):
    print(f"grade {grade}: {', '.join(groups[grade])}")

# counting: how many of each grade, and which is the most common
counts = Counter(grade for _, grade in results)
print("distribution:", dict(sorted(counts.items())), "| most common:", counts.most_common(1))

# the most common words in a text
text = "the dog and the cat and the horse and the dog"
print("words:", Counter(text.split()).most_common(3))
```

Without `defaultdict` you'd have to check before every addition whether the key already exists (`if grade not in groups: groups[grade] = []`). And `Counter` is a dictionary designed for counting: `most_common(k)` gives the k most common straight away.

## 4. Linked list: when inserting in the middle is common

A Python list is a **contiguous** array in memory: adding to the end is fast, but inserting at the front or in the middle is slow, because every element after it has to be shifted. A **linked list**'s elements are scattered, and each points to the next – inserting at the front is a single step here:

```python run
# Our own singly linked list: inserting at the front, traversal, search
class Node:
    def __init__(self, value, next_node=None):
        self.value = value
        self.next_node = next_node              # pointer to the next node

class LinkedList:
    def __init__(self):
        self.head = None

    def push_front(self, value):
        self.head = Node(value, self.head)      # the new node points to the old head

    def __iter__(self):
        current = self.head
        while current is not None:
            yield current.value
            current = current.next_node

    def contains(self, value):
        return any(v == value for v in self)

browser_history = LinkedList()
for page in ["home", "news", "sport", "weather"]:
    browser_history.push_front(page)            # the most recent page goes to the front
print("history (most recent first):", list(browser_history))
print("did we visit the sport page?", browser_history.contains("sport"))
```

In practice we rarely write our own linked list in Python (`deque` works similarly inside), but it's worth understanding, because many other data structures (trees, graphs) are built the same way, with **pointers**.

| Task                                   | Good choice           | Why?                                           |
| -------------------------------------- | --------------------- | ---------------------------------------------- |
| order matters, access by index         | list                  | `l[i]` is one step, appending is fast          |
| "is it in there?", removing duplicates | set                   | hashing: one step on average                   |
| lookup by key (name → data)            | dictionary            | hashing, and a value belongs to the key        |
| processing in arrival order            | queue (`deque`)       | one step at both ends                          |
| "undo", most recent first              | stack (end of a list) | `append` and `pop` at the end are one step     |
| immutable record, dictionary key       | tuple                 | hashable, and can't be overwritten by accident |

## Summary

- The most common operation decides the right data structure; for "is it in there?" a set is orders of magnitude faster.
- Breadth-first search with a queue finds the shortest path; `deque.popleft()` is fast, `list.pop(0)` is slow.
- `defaultdict` is handy for grouping, `Counter` for counting.
- Inserting at the front of a linked list is one step; trees and graphs are built with pointers too.

## Lesson exercise: an inverted index

The basis of search engines is the **inverted index**: for every word they store which documents it occurs in. Write the `inverted_index(documents)` function, which makes a dictionary from a list of strings: the key is the (lowercased) word, the value is the **increasing list without duplicates** of the indices of the documents in which the word occurs! Words are separated by `split()` (you don't need to deal with punctuation this time).

```python starter required
def inverted_index(documents):
    index = {}
    # go through the documents (enumerate) and their words
    return index


print(inverted_index(["the dog barks", "the cat meows", "dog and cat"]))
```

<details>
<summary>Solution</summary>

```python solution
def inverted_index(documents):
    index = {}
    for i, doc in enumerate(documents):
        for word in set(doc.lower().split()):
            index.setdefault(word, []).append(i)
    return {word: sorted(places) for word, places in index.items()}


print(inverted_index(["the dog barks", "the cat meows", "dog and cat"]))
```

</details>

```python test
idx = inverted_index(["the dog barks", "the cat meows", "dog and cat"])
assert idx["dog"] == [0, 2], "'dog' is in documents 0 and 2"
assert idx["the"] == [0, 1], "'the' is in documents 0 and 1"
assert idx["meows"] == [1], "'meows' only in 1"
assert inverted_index(["Apple apple APPLE"]) == {"apple": [0]}, "lowercased, without duplicates"
assert inverted_index([]) == {}, "an empty dictionary for an empty list"
```

---
title: Practice – Data Structures and Algorithms
summary: Review questions and a summary worksheet on algorithms and data structures.
minutes: 20
kind: practice
---

## Review questions

<details>
<summary>1. Write pseudocode that counts how many even numbers are in a list!</summary>

```text
count ← 0
for every element x in list:
    if x mod 2 = 0 then count ← count + 1
return count
```

</details>

<details>
<summary>2. Which data structure would you choose for the “undo” feature of a text editor, and why?</summary>

A stack: the latest operation must always be undone first (LIFO).

</details>

<details>
<summary>3. Why is it faster to search a phone book by name than by phone number?</summary>

Because names are in alphabetical order, so we can halve the range (binary search); numbers are unordered, so we can only find one by checking them in order (linearly).

</details>

<details>
<summary>4. If an O(n²) algorithm runs for 1 second on 1000 elements, roughly how long does it run on 2000?</summary>

Twice the size means four times the time: about 4 seconds.

</details>

```python run
# Count even numbers and sort the list
items = [8, 3, 6, 11, 4, 7]
count = 0
for x in items:
    if x % 2 == 0:
        count += 1
print(count, sorted(items))
```

## Summary worksheet

```quiz required
? Which data structure fits a print queue?
- stack
+ queue
- tree
- hash table
! The first document sent is printed first (FIFO).

? How many steps does linear search need **in the worst case** in a list of 500 elements?
= 500
! Linear search: O(n).

? Which data structure is Python's `dict`?
- stack
- linked list
+ hash table
- graph
! It looks up by key in one step on average.

? If an O(n²) algorithm runs for 2 seconds on 1000 elements, roughly how many seconds does it run on 3000?
= 18
! Three times the size → nine times the time: 2 · 9 = 18.

? What is the top element of a tree, the one without a parent, called?
= root
! In a folder structure it is the root directory.

? Which grows fastest for large n?
- O(log n)
- O(n)
- O(n log n)
+ O(n²)
! n² grows fastest.
```

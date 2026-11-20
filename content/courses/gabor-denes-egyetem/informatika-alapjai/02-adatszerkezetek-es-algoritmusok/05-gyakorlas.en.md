---
title: Practice – Data Structures and Algorithms
summary: Review questions and a summary worksheet on algorithms and data structures.
minutes: 45
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Binary search with a step count.** Write the `binary_search(items, target)` function, which finds the index of `target` in a sorted list and returns the pair `(index, number of steps)`! If it isn't there, the index is `-1`. One step is examining one middle element.

```python starter
def binary_search(items, target):
    if target in items:
        return (items.index(target), 1)
    return (-1, 1)
```

<details>
<summary>Solution</summary>

```python solution
def binary_search(items, target):
    left, right, steps = 0, len(items) - 1, 0
    while left <= right:
        steps += 1
        mid = (left + right) // 2
        if items[mid] == target:
            return (mid, steps)
        if items[mid] < target:
            left = mid + 1                   # continue in the right half
        else:
            right = mid - 1
    return (-1, steps)
```

</details>

```python test
l = list(range(0, 100, 2))
assert binary_search(l, 48) == (24, 1)
assert binary_search(l, 98) == (49, 6)
assert binary_search(l, 7)[0] == -1
assert binary_search([], 3) == (-1, 0)
print("All checks passed!")
```

**2.** **Checking brackets.** Write the `balanced(text)` function, which uses a stack to check whether the `()`, `[]`, `{}` brackets are correctly paired (ignore all other characters)!

```python starter
def balanced(text):
    return text.count("(") == text.count(")")
```

<details>
<summary>Solution</summary>

```python solution
PAIR = {")": "(", "]": "[", "}": "{"}

def balanced(text):
    stack = []
    for c in text:
        if c in "([{":
            stack.append(c)
        elif c in PAIR:
            if not stack or stack.pop() != PAIR[c]:   # its pair is missing or wrong
                return False
    return not stack
```

</details>

```python test
assert balanced("f(x[1])") is True
assert balanced("([)]") is False
assert balanced("((") is False
assert balanced("{a: [1, (2)]}") is True
assert balanced(")(") is False
print("All checks passed!")
```

**3.** **Bubble sort with a counter.** Write the `bubble(items)` function, which returns a sorted copy of the list and the number of swaps as `(sorted_list, swaps)`! The original list must not change.

```python starter
def bubble(items):
    return (sorted(items), 0)
```

<details>
<summary>Solution</summary>

```python solution
def bubble(items):
    a, swaps = items[:], 0                    # we work on a copy
    for i in range(len(a) - 1):
        for j in range(len(a) - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swaps += 1
    return (a, swaps)
```

</details>

```python test
original = [3, 1, 2]
assert bubble(original) == ([1, 2, 3], 2)
assert original == [3, 1, 2]
assert bubble([5, 4, 3, 2, 1]) == ([1, 2, 3, 4, 5], 10)
assert bubble([1, 2, 3]) == ([1, 2, 3], 0)
print("All checks passed!")
```

### Quick check questions

```quiz
? Which data structure works on a "first in, first out" basis?
- stack
+ queue
- tree
- hash table
! FIFO: a print queue works this way too.

? At most how many steps does binary search need in a sorted list of 1000 elements?
= 10
! $2^{10} = 1024 \geq 1000$.

? How many times longer does an $O(n^2)$ algorithm run if the data size grows tenfold?
= 100
! $10^2 = 100$.

? Why is lookup fast in a Python dictionary?
- because a dictionary is always sorted
+ because the hash function tells directly which bucket the key is in
- because the dictionary is small
- it isn't fast
! On average $O(1)$ steps.
```

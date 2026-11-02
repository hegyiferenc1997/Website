---
title: Practice – Data Structures
summary: Review questions and exercises on arrays, lists, linked lists, sets, dictionaries and stacks.
minutes: 40
kind: practice
---

## Review questions

**1. Why is accessing the i-th element of an array O(1), but O(n) for a linked list?**

<details>
<summary>Answer</summary>

Array elements are consecutive and the same size, so the address can be computed (`start + i · size`). In a linked list the elements are scattered, so we must follow the pointers from the head.

</details>

**2. Which data structure would you use for: a) counting word frequencies, b) the browser's back button, c) print jobs, d) unique visitors?**

<details>
<summary>Answer</summary>

a) dictionary (or `Counter`), b) stack, c) queue, d) set.

</details>

**3. What does it print? `print({1, 2, 3} & {2, 3, 4}, {1, 2} | {5})`**

<details>
<summary>Answer</summary>

`{2, 3} {1, 2, 5}`

</details>

**4. Why can't a list be a dictionary key?**

<details>
<summary>Answer</summary>

Because a list is mutable, so it has no stable hash value; a dictionary's hash table only works with hashable (immutable) keys. A tuple can be a key, though.

</details>

**5. What's wrong? `m = [[0] * 3] * 3; m[0][0] = 1`**

<details>
<summary>Answer</summary>

All three rows are the same list, so the first element of every row becomes 1. Correctly: `[[0] * 3 for _ in range(3)]`.

</details>

## Exercises

### Exercise 1: Transposing a matrix

Write a function `transpose(m)` that returns the transpose of a matrix (rows become columns)!

```python starter
def transpose(m):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def transpose(m):
    return [[m[i][j] for i in range(len(m))] for j in range(len(m[0]))]
```

</details>

```python test
assert transpose([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]]
assert transpose([[7]]) == [[7]]
print("All checks passed!")
```

### Exercise 2: Removing duplicates, keeping order

Write a function `unique(items)` that skips duplicates but **keeps the order** of first occurrences! (Hint: record what you've seen in a set.)

```python starter
def unique(items):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def unique(items):
    seen = set()
    result = []
    for x in items:
        if x not in seen:
            seen.add(x)
            result.append(x)
    return result
```

</details>

```python test
assert unique([3, 1, 3, 2, 1, 4]) == [3, 1, 2, 4]
assert unique([]) == []
assert unique(["b", "a", "b"]) == ["b", "a"]
print("All checks passed!")
```

### Exercise 3: Word frequency

Write a function `frequency(text)` returning a dictionary of how many times each word occurs! Case should not matter.

```python starter
def frequency(text):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def frequency(text):
    result = {}
    for word in text.lower().split():
        result[word] = result.get(word, 0) + 1
    return result
```

</details>

```python test
assert frequency("The dog and the cat") == {"the": 2, "dog": 1, "and": 1, "cat": 1}
assert frequency("") == {}
print("All checks passed!")
```

### Exercise 4: Anagram

Two words are **anagrams** if they consist of the same letters (e.g. "listen" and "silent"). Write a function `is_anagram(a, b)`! Case should not matter.

```python starter
def is_anagram(a, b):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def is_anagram(a, b):
    return sorted(a.lower()) == sorted(b.lower())
```

</details>

```python test
assert is_anagram("listen", "Silent") is True
assert is_anagram("evil", "vile") is True
assert is_anagram("apple", "apples") is False
print("All checks passed!")
```

### Exercise 5: Length and sum of a linked list

For the linked list built with the `Node` class below, write functions `length(head)` and `total(head)` that traverse the list!

```python starter
class Node:
    def __init__(self, data, next=None):
        self.data = data
        self.next = next

def length(head):
    pass

def total(head):
    pass
```

<details>
<summary>Solution</summary>

```python solution
class Node:
    def __init__(self, data, next=None):
        self.data = data
        self.next = next

def length(head):
    count = 0
    cur = head
    while cur is not None:
        count += 1
        cur = cur.next
    return count

def total(head):
    s = 0
    cur = head
    while cur is not None:
        s += cur.data
        cur = cur.next
    return s
```

</details>

```python test
lst = Node(3, Node(5, Node(10)))
assert length(lst) == 3
assert total(lst) == 18
assert length(None) == 0 and total(None) == 0
print("All checks passed!")
```

### Exercise 6: Reversing a linked list

Write a function `reverse(head)` that reverses the linked list in place (by re-pointing the links) and returns the new head!

```python starter
class Node:
    def __init__(self, data, next=None):
        self.data = data
        self.next = next

def reverse(head):
    pass
```

<details>
<summary>Solution</summary>

```python solution
class Node:
    def __init__(self, data, next=None):
        self.data = data
        self.next = next

def reverse(head):
    prev = None
    cur = head
    while cur is not None:
        nxt = cur.next       # remember the next one
        cur.next = prev      # point the link backwards
        prev = cur
        cur = nxt
    return prev
```

</details>

```python test
head = reverse(Node(1, Node(2, Node(3))))
values = []
while head:
    values.append(head.data)
    head = head.next
assert values == [3, 2, 1]
assert reverse(None) is None
print("All checks passed!")
```

### Exercise 7: Grouping by grade

Write a function `by_grade(results)` that turns a `{name: grade}` dictionary into a `{grade: [names in alphabetical order]}` dictionary!

```python starter
def by_grade(results):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def by_grade(results):
    groups = {}
    for name, grade in results.items():
        groups.setdefault(grade, []).append(name)
    return {grade: sorted(names) for grade, names in groups.items()}
```

</details>

```python test
result = by_grade({"Bela": 4, "Anna": 5, "Ede": 4, "Dora": 2})
assert result == {4: ["Bela", "Ede"], 5: ["Anna"], 2: ["Dora"]}
print("All checks passed!")
```

## Summary exercise: Analysing library loans

The summary exercise of the topic: lists, tuples, sets and dictionaries together – each where it fits best.

Loans are given as a list of `(reader, book)` pairs (a reader may have borrowed the same book several times). Write a `loan_report(loans)` function that returns a `(by_reader, popular)` pair:

- `by_reader`: a dictionary – reader → alphabetical list of the **different** books they borrowed;
- `popular`: alphabetical list of the books borrowed by **at least two different** readers.

Tip: collect into sets first (reader → set of books, book → set of readers), and only turn them into sorted lists at the end.

```python starter required
def loan_report(loans):
    books_of = {}     # reader → set of books
    readers_of = {}   # book → set of readers
    for reader, book in loans:
        pass
    # build the sorted lists
    pass


data = [("Anna", "Dune"), ("Bob", "Dune"), ("Anna", "Hobbit"), ("Anna", "Dune")]
print(loan_report(data))
```

<details>
<summary>Solution</summary>

```python solution
def loan_report(loans):
    books_of = {}
    readers_of = {}
    for reader, book in loans:
        books_of.setdefault(reader, set()).add(book)
        readers_of.setdefault(book, set()).add(reader)
    by_reader = {reader: sorted(books) for reader, books in books_of.items()}
    popular = sorted(book for book, readers in readers_of.items() if len(readers) >= 2)
    return by_reader, popular


data = [("Anna", "Dune"), ("Bob", "Dune"), ("Anna", "Hobbit"), ("Anna", "Dune")]
print(loan_report(data))
```

</details>

```python test
data = [("Anna", "Dune"), ("Bob", "Dune"), ("Anna", "Hobbit"), ("Anna", "Dune"), ("Cecil", "Hobbit"), ("Bob", "Emma")]
by_reader, popular = loan_report(data)
assert by_reader == {"Anna": ["Dune", "Hobbit"], "Bob": ["Dune", "Emma"], "Cecil": ["Hobbit"]}, "The per-reader lists are not right (no repeats, alphabetical)."
assert popular == ["Dune", "Hobbit"], "Popular: borrowed by at least two different readers."
assert loan_report([("Anna", "X"), ("Anna", "X")]) == ({"Anna": ["X"]}, []), "The same reader twice: not popular."
assert loan_report([]) == ({}, []), "An empty list gives an empty result."
```

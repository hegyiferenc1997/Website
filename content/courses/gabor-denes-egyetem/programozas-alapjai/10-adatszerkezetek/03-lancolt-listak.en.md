---
title: Linked Lists
summary: Nodes and pointers: singly and doubly linked lists, operations, and comparison with arrays.
minutes: 20
---

## What you will learn

- what a **linked list** is and how it differs from an array,
- how to build a linked list from **nodes** in Python,
- how **traversal**, **insertion** and **deletion** work,
- when a linked list is better and when an array is.

## What is a linked list?

The elements (**nodes**) of a **linked list** are not next to each other in memory but **anywhere**. Each node stores its data and a **reference (pointer)** to the next node. The last node's pointer is empty (`None`). The start of the list is marked by the **head**.

```text
 head
  │
  ▼
┌────┬───┐    ┌────┬───┐    ┌────┬───┐
│ 12 │ ●─┼───▶│  7 │ ●─┼───▶│ 33 │ ∅ │
└────┴───┘    └────┴───┘    └────┴───┘
 data  next
```

## Node and list in Python

```python run
class Node:
    """An element of a linked list: data + reference to the next one."""
    def __init__(self, data, next=None):
        self.data = data
        self.next = next


class LinkedList:
    def __init__(self):
        self.head = None         # empty list: no first element

    def push_front(self, data):
        """Insert at the front – O(1): only the head changes."""
        self.head = Node(data, self.head)

    def push_back(self, data):
        """Insert at the back – O(n): we must walk to the last element."""
        new = Node(data)
        if self.head is None:
            self.head = new
            return
        cur = self.head
        while cur.next is not None:
            cur = cur.next
        cur.next = new

    def remove(self, data):
        """Remove the first element with the given value: re-link the previous element."""
        if self.head is None:
            return False
        if self.head.data == data:
            self.head = self.head.next
            return True
        prev = self.head
        while prev.next is not None:
            if prev.next.data == data:
                prev.next = prev.next.next
                return True
            prev = prev.next
        return False

    def to_list(self):
        """Traverse from the head to the end, collecting elements into a Python list."""
        result = []
        cur = self.head
        while cur is not None:
            result.append(cur.data)
            cur = cur.next
        return result


l = LinkedList()
l.push_back(7)
l.push_back(33)
l.push_front(12)
print(l.to_list())    # [12, 7, 33]
l.remove(7)
print(l.to_list())    # [12, 33]
```

## Inserting in the middle – as a drawing

Inserting a new element (`X`) after `A`: two pointers change, **nothing needs to shift**.

```text
before:   A ──▶ B
step 1:   X.next = A.next     (X ──▶ B)
step 2:   A.next = X          (A ──▶ X ──▶ B)
```

## Doubly linked list

Each node points to **both the next and the previous** node. It can be traversed in both directions, and deleting a given node is O(1) once you have it. In exchange it uses more memory.

```text
∅ ◀─┤ 12 ├─▶◀─┤ 7 ├─▶◀─┤ 33 ├─▶ ∅
```

Python's `collections.deque` (double-ended queue) is internally a similar structure of linked blocks: insertion and deletion at both ends are O(1).

```python run
from collections import deque
d = deque([7, 33])
d.appendleft(12)   # front O(1)
d.append(50)       # back O(1)
print(d, d.popleft(), d.pop())
```

## Array or linked list?

| Operation                          | Array (Python list)     | Linked list                           |
| ---------------------------------- | ----------------------- | ------------------------------------- |
| access element i                   | **O(1)**                | O(n) – must step through              |
| insert / delete at the front       | O(n)                    | **O(1)**                              |
| insert / delete after a known node | O(n)                    | **O(1)**                              |
| append to the end                  | O(1) on average         | O(n) (O(1) if we also store the tail) |
| search by value                    | O(n)                    | O(n)                                  |
| memory                             | compact                 | extra pointer(s) per element          |
| cache-friendly                     | yes (consecutive cells) | less                                  |

> **In practice** a dynamic array (Python `list`) is the better choice for most tasks. A linked list is worth it when you insert or delete a lot at the start or middle and rarely need access by index. Linked lists are also the basis of many other data structures (stacks, queues, trees, graphs).

## Summary

- A linked list consists of nodes: **data + pointer** to the next one (and to the previous one when doubly linked).
- Insertion/deletion at a known position is **O(1)**, but access by index is **O(n)**.
- Python has no built-in linked list class; you can write one with classes or use `collections.deque`.

## Lesson exercise: Reversing a linked list

Extend the lesson's `LinkedList` class with a `reverse()` method that reverses the list **in place**: it creates no new nodes, it only redirects the `next` references. Work with three helper variables: `previous`, `current` and `following` – in every step the current node should point "backwards", and at the end the head should be the old last element.

```python starter required
class Node:
    def __init__(self, data, next=None):
        self.data = data
        self.next = next


class LinkedList:
    def __init__(self, items=()):
        self.head = None
        for data in reversed(items):
            self.head = Node(data, self.head)

    def to_list(self):
        result, current = [], self.head
        while current is not None:
            result.append(current.data)
            current = current.next
        return result

    def reverse(self):
        previous = None
        current = self.head
        # while current is not None: ... (three steps: save, turn back, move on)
        pass


ll = LinkedList([1, 2, 3])
ll.reverse()
print(ll.to_list())   # [3, 2, 1]
```

<details>
<summary>Solution</summary>

```python solution
class Node:
    def __init__(self, data, next=None):
        self.data = data
        self.next = next


class LinkedList:
    def __init__(self, items=()):
        self.head = None
        for data in reversed(items):
            self.head = Node(data, self.head)

    def to_list(self):
        result, current = [], self.head
        while current is not None:
            result.append(current.data)
            current = current.next
        return result

    def reverse(self):
        previous = None
        current = self.head
        while current is not None:
            following = current.next   # remember where to go next
            current.next = previous    # point backwards
            previous = current
            current = following
        self.head = previous


ll = LinkedList([1, 2, 3])
ll.reverse()
print(ll.to_list())   # [3, 2, 1]
```

</details>

```python test
ll = LinkedList([1, 2, 3, 4])
nodes = []
current = ll.head
while current:
    nodes.append(current)
    current = current.next
ll.reverse()
assert ll.to_list() == [4, 3, 2, 1], "Reversed: [4, 3, 2, 1]"
assert ll.head is nodes[-1], "Reverse in place: the head must be the old last node (don't create new ones)."
empty = LinkedList()
empty.reverse()
assert empty.to_list() == [], "An empty list reversed is still empty."
one = LinkedList(["a"])
one.reverse()
assert one.to_list() == ["a"], "A one-element list is itself."
```

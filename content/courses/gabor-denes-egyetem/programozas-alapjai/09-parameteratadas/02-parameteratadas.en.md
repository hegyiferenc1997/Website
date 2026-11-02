---
title: Parameter Passing – by Value and by Reference
summary: Pass by value, by reference and by sharing; mutable and immutable objects in Python.
minutes: 18
---

## What you will learn

- what **pass by value** and **pass by reference** are,
- how Python passes parameters (**pass by object sharing**),
- the difference between **mutable** and **immutable** objects,
- how to avoid unexpected side effects.

## Pass by value

The function receives a **copy** of the argument. Whatever it does, the original variable doesn't change. This is how primitive types work in C, Java and C#.

```c
void increment(int x) { x = x + 1; }   /* increments the copy */

int a = 5;
increment(a);
/* a is still 5 */
```

## Pass by reference

The function receives the **address** of the original variable, so it can modify it. In C++ use `&`, in C# `ref`, in C a pointer.

```c
void increment(int *x) { *x = *x + 1; }   /* increments the original via its address */

int a = 5;
increment(&a);
/* a is now 6 */
```

## In Python: pass by sharing

In Python every variable is a **reference to an object**. On a call the parameter refers to **the same object** as the argument. The consequence depends on whether the object is **mutable**.

| Immutable                                      | Mutable                                              |
| ---------------------------------------------- | ---------------------------------------------------- |
| `int`, `float`, `bool`, `str`, `tuple`, `None` | `list`, `dict`, `set`, instances of your own classes |

### Immutable object: behaves like pass by value

```python run
def increment(x):
    x = x + 1        # a new int object is created, x now refers to it
    print("inside:", x)

a = 5
increment(a)
print("outside:", a)   # 5 – the original didn't change
```

### Mutable object: the change is visible outside

```python run
def add(items):
    items.append(99)   # we modify the SHARED list in place

numbers = [1, 2, 3]
add(numbers)
print(numbers)          # [1, 2, 3, 99] – the caller's list changed too!
```

### But assigning a new value isn't visible outside

```python run
def replace(items):
    items = [0, 0, 0]  # the local name now refers to a NEW list, the original is untouched
    print("inside:", items)

numbers = [1, 2, 3]
replace(numbers)
print("outside:", numbers)   # [1, 2, 3]
```

> **Rule of thumb:** a function can **modify** the object it receives (if it's mutable), but it cannot make the caller's **variable** refer to a different object.

## How to avoid unwanted modification

1. **Make a copy** inside the function if you don't want to modify the input:

```python run
def sorted_copy(items):
    copy_ = items.copy()   # or: list(items), items[:]
    copy_.sort()
    return copy_

original = [3, 1, 2]
print(sorted_copy(original), original)   # [1, 2, 3] [3, 1, 2]
```

2. **Return a new value** instead of modifying (functional style): `sorted(items)` instead of `items.sort()`.

3. Document it when a function modifies its parameter **on purpose** (e.g. `list.sort()` sorts in place and returns `None`).

## Shallow and deep copy

`copy()` only copies the **outer** list; if the list contains lists, the inner lists stay shared.

```python run
import copy

matrix = [[1, 2], [3, 4]]
shallow = matrix.copy()
deep = copy.deepcopy(matrix)

matrix[0].append(99)
print(shallow)   # [[1, 2, 99], [3, 4]] – the inner list is shared!
print(deep)      # [[1, 2], [3, 4]]     – completely independent
```

## Summary

- **Pass by value**: a copy; **by reference**: the original can be modified.
- Python: **pass by sharing** – the parameter refers to the same object.
- For immutable objects this acts like pass by value; for mutable ones in-place changes are visible outside.
- Against unwanted side effects: copy (`copy()`, `deepcopy()`) or return a new value.

## Lesson exercise: Adding a grade without modifying the gradebook

The `gradebook` is a dictionary: name → list of grades. Write an `add_grade(gradebook, name, grade)` function that returns a **new** gradebook in which the new grade has been added to the student's grades (if the student is not in the gradebook yet, a new entry is created).

It **must not change the given gradebook in any way** – not even the lists inside it! (In Python parameters are passed by sharing: if you appended to the old list, the original gradebook would change too.)

```python starter required
def add_grade(gradebook, name, grade):
    new = gradebook        # careful: this is not a copy, it is the same object!
    new[name].append(grade)
    return new


original = {"Anna": [5, 4]}
new = add_grade(original, "Anna", 3)
print(original, new)
```

<details>
<summary>Solution</summary>

```python solution
def add_grade(gradebook, name, grade):
    new = {key: list(grades) for key, grades in gradebook.items()}
    new[name] = new.get(name, []) + [grade]
    return new


original = {"Anna": [5, 4]}
new = add_grade(original, "Anna", 3)
print(original, new)
```

</details>

```python test
original = {"Anna": [5, 4], "Bob": [2]}
new = add_grade(original, "Anna", 3)
assert new == {"Anna": [5, 4, 3], "Bob": [2]}, "In the new gradebook Anna's grades are [5, 4, 3]."
assert original == {"Anna": [5, 4], "Bob": [2]}, "The original gradebook (and the list inside it) must not change!"
assert new is not original, "Return a new dictionary."
new["Bob"].append(5)
assert original["Bob"] == [2], "The lists of the new gradebook must not be shared with the original either."
assert add_grade({}, "Cecil", 5) == {"Cecil": [5]}, "A new student gets a new entry."
```

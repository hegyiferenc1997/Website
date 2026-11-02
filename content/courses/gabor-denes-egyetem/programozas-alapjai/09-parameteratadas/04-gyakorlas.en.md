---
title: Practice – Parameters
summary: Review questions and exercises on parameter kinds, passing and evaluation.
minutes: 25
kind: practice
---

## Review questions

**1. What does it print?**

```python
def f(items):
    items.append(4)
    items = [9]
    items.append(5)

a = [1, 2, 3]
f(a)
print(a)
```

<details>
<summary>Answer</summary>

`[1, 2, 3, 4]`. `append(4)` modifies the shared list; after `items = [9]` the local name refers to a new list, so `append(5)` doesn't touch the original.

</details>

**2. Why doesn't `x` change? `def f(n): n += 1` → `x = 5; f(x)`**

<details>
<summary>Answer</summary>

`int` is immutable: `n += 1` creates a new object and only the local `n` refers to it. `x` still refers to the original 5.

</details>

**3. What is wrong with `def log(message, items=[]):`?**

<details>
<summary>Answer</summary>

The default list is created once, at definition time, and every call shares it, so messages pile up. Correctly: `items=None`, then inside `if items is None: items = []`.

</details>

**4. What types are `*args` and `**kwargs` inside the function?**

<details>
<summary>Answer</summary>

`args` is a tuple, `kwargs` is a dictionary.

</details>

**5. What is the difference between eager and lazy evaluation?**

<details>
<summary>Answer</summary>

With eager evaluation arguments are evaluated before the call; with lazy evaluation only when their value is actually needed.

</details>

## Exercises

### Exercise 1: Average of any number of values

Write a function `average(*numbers)` returning the average of any number of arguments; with no arguments it returns `None`.

```python starter
def average(*numbers):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def average(*numbers):
    if not numbers:
        return None
    return sum(numbers) / len(numbers)
```

</details>

```python test
assert average(2, 4, 6) == 4
assert average(5) == 5
assert average() is None
print("All checks passed!")
```

### Exercise 2: HTML tag

Write a function `tag(name, content, **attributes)` that builds an HTML tag: `tag("a", "Link", href="/x")` → `'<a href="/x">Link</a>'`. Several attributes should follow in the given order, separated by spaces.

```python starter
def tag(name, content, **attributes):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def tag(name, content, **attributes):
    attrs = "".join(f' {k}="{v}"' for k, v in attributes.items())
    return f"<{name}{attrs}>{content}</{name}>"
```

</details>

```python test
assert tag("a", "Link", href="/x") == '<a href="/x">Link</a>'
assert tag("p", "Hi") == "<p>Hi</p>"
assert tag("img", "", src="k.png", alt="pic") == '<img src="k.png" alt="pic"></img>'
print("All checks passed!")
```

### Exercise 3: Without side effects

The function below modifies the list it receives. Rewrite it so that the original list **stays unchanged** and a new list is returned!

```python starter
def double(items):
    for i in range(len(items)):
        items[i] *= 2
    return items
```

<details>
<summary>Solution</summary>

```python solution
def double(items):
    return [x * 2 for x in items]
```

</details>

```python test
original = [1, 2, 3]
new = double(original)
assert new == [2, 4, 6]
assert original == [1, 2, 3], "The original list must not change!"
print("All checks passed!")
```

### Exercise 4: Fix the bug

The function `add_to_cart` already contains the previous products on the second call. Fix it!

```python starter
def add_to_cart(product, cart=[]):
    cart.append(product)
    return cart
```

<details>
<summary>Solution</summary>

```python solution
def add_to_cart(product, cart=None):
    if cart is None:
        cart = []
    cart.append(product)
    return cart
```

</details>

```python test
assert add_to_cart("milk") == ["milk"]
assert add_to_cart("bread") == ["bread"]
c = ["apple"]
assert add_to_cart("pear", c) == ["apple", "pear"]
print("All checks passed!")
```

### Exercise 5: Even number generator

Write a generator function `evens(n)` (`yield`) producing the even numbers from 0 to n in order (including n if it's even).

```python starter
def evens(n):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def evens(n):
    for i in range(0, n + 1, 2):
        yield i
```

</details>

```python test
assert list(evens(7)) == [0, 2, 4, 6]
assert list(evens(8)) == [0, 2, 4, 6, 8]
import types
assert isinstance(evens(3), types.GeneratorType), "A generator function is required (yield)!"
print("All checks passed!")
```

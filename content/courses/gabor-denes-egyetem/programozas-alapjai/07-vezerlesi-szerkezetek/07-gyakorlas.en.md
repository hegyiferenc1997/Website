---
title: Practice – Control Structures
summary: Review questions and exercises on branching, loops and the basic algorithm patterns.
minutes: 35
kind: practice
---

## Review questions

**1. How many times does the loop body run? `for i in range(2, 11, 3):`**

<details>
<summary>Answer</summary>

3 times: i = 2, 5, 8 (11 is excluded).

</details>

**2. What is the difference between a pre-test and a post-test loop?**

<details>
<summary>Answer</summary>

A pre-test loop checks the condition before each iteration (it may run zero times), a post-test loop at the end (it runs at least once). In Python the latter is written with `while True` + `break`.

</details>

**3. What does it print?**

```python
for i in range(5):
    if i == 3:
        break
    if i == 1:
        continue
    print(i)
```

<details>
<summary>Answer</summary>

`0` and `2`. At 1 `continue` skips the print, at 3 `break` ends the loop.

</details>

**4. How many times does `print` run if the outer loop runs 4 times and the inner 5 times?**

<details>
<summary>Answer</summary>

4 · 5 = 20 times.

</details>

**5. Which pattern is needed: "Is there a negative number in the list?"**

<details>
<summary>Answer</summary>

Decision (in Python: `any(x < 0 for x in values)`).

</details>

## Exercises

### Exercise 1: FizzBuzz

Write a function `fizzbuzz(n)` returning a list from 1 to n: numbers divisible by 3 are replaced by `"Fizz"`, by 5 with `"Buzz"`, by both with `"FizzBuzz"`, and other numbers stay numbers.

```python starter
def fizzbuzz(n):
    result = []
    # Write the loop here!
    return result
```

<details>
<summary>Solution</summary>

```python solution
def fizzbuzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:          # the stricter condition first!
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(i)
    return result
```

</details>

```python test
assert fizzbuzz(5) == [1, 2, "Fizz", 4, "Buzz"]
assert fizzbuzz(15)[-1] == "FizzBuzz"
assert fizzbuzz(0) == []
print("All checks passed!")
```

### Exercise 2: Prime number

Write a function `is_prime(n)` deciding whether `n` is prime! (Prime: greater than 1 and divisible only by 1 and itself.) It's enough to check divisors up to the square root.

```python starter
def is_prime(n):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def is_prime(n):
    if n < 2:
        return False
    divisor = 2
    while divisor * divisor <= n:
        if n % divisor == 0:
            return False
        divisor += 1
    return True
```

</details>

```python test
assert [x for x in range(20) if is_prime(x)] == [2, 3, 5, 7, 11, 13, 17, 19]
assert is_prime(97) is True
assert is_prime(1) is False
print("All checks passed!")
```

### Exercise 3: Grade from score

Write a function `grade(score)` using the course's scale: 0–49 → 1, 50–62 → 2, 63–75 → 3, 76–88 → 4, 89–100 → 5. For an invalid score (below 0 or above 100) return `None`!

```python starter
def grade(score):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def grade(score):
    if score < 0 or score > 100:
        return None
    if score >= 89:
        return 5
    elif score >= 76:
        return 4
    elif score >= 63:
        return 3
    elif score >= 50:
        return 2
    return 1
```

</details>

```python test
assert [grade(s) for s in [0, 49, 50, 62, 63, 75, 76, 88, 89, 100]] == [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
assert grade(-1) is None and grade(101) is None
print("All checks passed!")
```

### Exercise 4: Longest word

Write a function `longest(words)` that returns the longest word using the maximum selection pattern (**without** the built-in `max()`). For equal lengths return the first one.

```python starter
def longest(words):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def longest(words):
    best = words[0]
    for word in words[1:]:
        if len(word) > len(best):
            best = word
    return best
```

</details>

```python test
assert longest(["apple", "banana", "kiwi"]) == "banana"
assert longest(["ab", "cd", "e"]) == "ab"
print("All checks passed!")
```

### Exercise 5: Collatz sequence

Start from a positive integer `n`: if even, halve it; if odd, make it `3n + 1`. Repeat until you reach 1. Write a function `collatz_steps(n)` returning how many steps it takes to reach 1!

```python starter
def collatz_steps(n):
    steps = 0
    # A while loop is needed – we don't know in advance how many steps there will be!
    return steps
```

<details>
<summary>Solution</summary>

```python solution
def collatz_steps(n):
    steps = 0
    while n != 1:
        if n % 2 == 0:
            n //= 2
        else:
            n = 3 * n + 1
        steps += 1
    return steps
```

</details>

```python test
assert collatz_steps(1) == 0
assert collatz_steps(6) == 8
assert collatz_steps(27) == 111
print("All checks passed!")
```

### Exercise 6: Filtering and sorting

Students' scores are given in a dictionary. Write a function `passed(scores)` returning the names of students with at least 50 points **in alphabetical order**.

```python starter
def passed(scores):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def passed(scores):
    return sorted(name for name, score in scores.items() if score >= 50)
```

</details>

```python test
assert passed({"Csilla": 92, "Anna": 50, "Bela": 49}) == ["Anna", "Csilla"]
assert passed({}) == []
print("All checks passed!")
```

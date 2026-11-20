---
title: Practice – Programming Languages and Environments
summary: Review questions and a summary worksheet on languages, compilation and developer tools.
minutes: 43
kind: practice
---

## Review questions

<details>
<summary>1. Why are operating systems written in C and not in Python?</summary>

Because C is a compiled, close-to-the-machine language: fast, handles memory and hardware directly, and needs no interpreter. Python is interpreted and slower, and running it already needs a working system.

</details>

<details>
<summary>2. Give an example of each of the three kinds of errors!</summary>

Syntax: `if x > 3` without a colon in Python. Runtime: `int("apple")`. Logic: computing a circle's area as `2 * r * pi` instead of `r * r * pi`.

</details>

<details>
<summary>3. Why is it worth developing a new feature on a separate git branch?</summary>

Because the main branch (`main`) stays working in the meantime; the branch can be reviewed (pull request) and is only merged once it is finished and tested.

</details>

```python run
# A logic error and its fix
numbers = [4, 8, 6]
wrong_average = sum(numbers) / 2             # wrong: always divides by 2
right_average = sum(numbers) / len(numbers)  # correct
print(wrong_average, right_average)
```

## Summary worksheet

```quiz required
? What does the example above print as its second value (the correct average)?
= 6.0
= 6
! (4 + 8 + 6) / 3 = 6.0.

? Which language is **interpreted**?
- C
- Rust
+ Python
- Go
! The Python interpreter executes the code while running.

? Which paradigm is built on classes and inheritance?
+ object-oriented
- functional
- declarative
- machine code
! E.g. Java, C#.

? Which git command uploads local commits to GitHub?
- git pull
+ git push
- git init
- git log
! pull downloads, push uploads.

? What is one of the most popular online services for git repositories (owned by Microsoft) called?
= GitHub
! GitLab and Bitbucket are its main rivals.

? What does a JIT compiler do?
+ compiles bytecode to machine code while running
- compiles the whole program to an exe in advance
- fixes logic errors
- formats the code
! Just-in-time.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Tokenising.** Write the `tokens(expression)` function, which splits an arithmetic expression into numbers (integers, as strings) and the `+ - * / ( )` symbols, skipping spaces!

```python starter
def tokens(expression):
    return expression.split()
```

<details>
<summary>Solution</summary>

```python solution
def tokens(expression):
    result, number = [], ""
    for c in expression:
        if c.isdigit():
            number += c                       # collect the number's digits
        else:
            if number:
                result.append(number)
                number = ""
            if c in "+-*/()":
                result.append(c)
    if number:
        result.append(number)
    return result
```

</details>

```python test
assert tokens("2 + 3*4") == ["2", "+", "3", "*", "4"]
assert tokens("(12+3)/5") == ["(", "12", "+", "3", ")", "/", "5"]
assert tokens("42") == ["42"]
print("All checks passed!")
```

**2.** **When compiling pays off.** Write the `compile_pays_off(compile_time, run_time, factor)` function, which gives the smallest number of runs `n` for which the compiled version's total time (`compile_time + n · run_time`) is less than the interpreted one's (`n · factor · run_time`)! If the factor is at most 1, return `None`.

```python starter
def compile_pays_off(compile_time, run_time, factor):
    return round(compile_time / run_time)
```

<details>
<summary>Solution</summary>

```python solution
def compile_pays_off(compile_time, run_time, factor):
    if factor <= 1:
        return None                           # the interpreted one is never slower
    n = 1
    while compile_time + n * run_time >= n * factor * run_time:
        n += 1
    return n
```

</details>

```python test
assert compile_pays_off(30, 1, 4) == 11
assert compile_pays_off(20, 0.5, 10) == 5
assert compile_pays_off(10, 1, 1) is None
print("All checks passed!")
```

**3.** **Checking a hash chain.** A "commit list" consists of `(previous id, message, own id)` triples, where the own id is the first 7 characters of `sha1(f"{previous}|{message}")`. Write the `first_broken(chain)` function, which returns the index of the first element whose id doesn't match, or whose "previous" field doesn't equal the own id of the element before it (`None` if all is well)!

```python starter
def first_broken(chain):
    return None
```

<details>
<summary>Solution</summary>

```python solution
import hashlib

def first_broken(chain):
    for i, (previous, message, own) in enumerate(chain):
        expected = hashlib.sha1(f"{previous}|{message}".encode()).hexdigest()[:7]
        if own != expected:
            return i                          # the content was modified
        if i > 0 and previous != chain[i - 1][2]:
            return i                          # the chain is broken
    return None
```

</details>

```python test
import hashlib
def cid(p, m):
    return hashlib.sha1(f"{p}|{m}".encode()).hexdigest()[:7]
a = cid("root", "start"); b = cid(a, "login"); c = cid(b, "README")
good = [("root", "start", a), (a, "login", b), (b, "README", c)]
assert first_broken(good) is None
assert first_broken([("root", "start", a), (a, "login (modified)", b), (b, "README", c)]) == 1
assert first_broken([("root", "start", a), ("xxx", "login", cid("xxx", "login"))]) == 1
print("All checks passed!")
```

### Quick check questions

```quiz
? Which programming language is typically compiled (to machine code)?
- Python
- JavaScript
+ C
- Bash
! C is compiled to machine code by a compiler.

? What is the value of the expression `(2 + 3) * 4 - 10 / 5`?
= 18
! $20 - 2 = 18$.

? What's the difference between `git commit` and `git push`?
+ commit records a version on your own machine, push uploads the commits to the remote repository
- there's no difference
- push saves locally, commit uploads
- commit deletes the changes
! Without a push the others don't see your commits.

? Which error does the interpreter report before the program even starts?
+ a syntax error (e.g. a missing bracket)
- division by zero
- a formula giving a wrong result
- running out of memory
! A syntax error is found during parsing.
```

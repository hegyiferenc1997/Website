---
title: Deeper – Languages and Tools from the Inside
summary: The same task in three paradigms, a tiny interpreter that evaluates expressions, catching the three kinds of errors with a program, when compiling pays off compared to interpreting, and how git protects history with a hash chain – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- what **the same task** looks like in imperative, functional and declarative style,
- what an **interpreter** does inside – through a mini-interpreter of our own,
- how to **catch** syntax, runtime and logic errors,
- why **git** history can't be rewritten "unnoticed".

## 1. One task, three paradigms

In the basic lesson you met the paradigms. The difference really shows when we solve **the same** task in several ways. The task: from a list of grades, give the average of the passing (at least 2) grades.

```python run
# The same task in three styles: the average of passing grades
grades = [5, 1, 4, 2, 1, 3, 5]

# 1) imperative: step by step, modifying variables
total, count = 0, 0
for g in grades:
    if g >= 2:
        total += g
        count += 1
print("imperative: ", total / count)

# 2) functional: functions nested inside each other, without modification
from functools import reduce
passing = list(filter(lambda g: g >= 2, grades))
print("functional: ", reduce(lambda a, b: a + b, passing) / len(passing))

# 3) declarative: we say WHAT we want, not how
from statistics import mean
print("declarative:", mean(g for g in grades if g >= 2))
```

In SQL (a purely declarative language) the same would be: `SELECT AVG(grade) FROM grades WHERE grade >= 2;` – here the database decides **how** to find and add up the values. **Viewpoints**: the imperative style is easiest for a beginner to follow, the functional one involves fewer hidden state changes (easier to test), the declarative one is the shortest, but you have to accept that the "how" stays hidden.

## 2. A tiny interpreter

How does Python understand the line `2 + 3 * 4`? An interpreter (and the front of a compiler too) works in two steps:

1. **lexical analysis**: it splits the text into **tokens** (`2`, `+`, `3`, `*`, `4`),
2. **parsing and evaluation**: it builds the structure according to the grammar (multiplication binds tighter than addition), and computes it.

Let's write a mini-interpreter for the four basic operations and brackets:

```python run
# Mini-interpreter: tokenising + recursive evaluation (with operator precedence)
import re

def tokens(text):
    return re.findall(r"\d+\.?\d*|[-+*/()]", text)

def evaluate(text):
    t = tokens(text)
    pos = 0

    def peek():
        return t[pos] if pos < len(t) else None

    def factor():                           # a number or a bracketed expression
        nonlocal pos
        tok = peek()
        pos += 1
        if tok == "(":
            value = expression()
            pos += 1                        # step over the ")"
            return value
        return float(tok)

    def term():                             # multiplication, division: stronger
        nonlocal pos
        value = factor()
        while peek() in ("*", "/"):
            op = peek(); pos += 1
            value = value * factor() if op == "*" else value / factor()
        return value

    def expression():                       # addition, subtraction: weaker
        nonlocal pos
        value = term()
        while peek() in ("+", "-"):
            op = peek(); pos += 1
            value = value + term() if op == "+" else value - term()
        return value

    return expression()

for e in ["2 + 3 * 4", "(2 + 3) * 4", "10 / 4 - 1", "2 * (3 + 4) * 5"]:
    print(f"{e:<16} tokens: {tokens(e)} → {evaluate(e)}")
```

Real Python does the same, just with many more rules – and with an intermediate step: from the structure it produces **bytecode**, which a virtual machine runs. You can look at it with the `dis` module: `import dis; dis.dis("2 + x * 4")`.

## 3. The three kinds of errors – with a program

In the basic lesson we distinguished three kinds of errors. We can catch all three – but in different places and ways:

```python run
# Syntax, runtime and logic errors – where and how do they show up?
# 1) syntax: found BEFORE running (during compiling/parsing)
try:
    compile("print('missing bracket'", "<code>", "exec")
except SyntaxError as e:
    print("syntax error:", e.msg)

# 2) runtime: only shows up when that line runs, with given data
def average(items):
    return sum(items) / len(items)

try:
    average([])
except ZeroDivisionError as e:
    print("runtime error:", e)

# 3) logic: the program runs but gives a wrong result – only a test catches it
def average_buggy(items):
    return sum(items) / (len(items) + 1)      # typo: +1

try:
    assert average_buggy([2, 4]) == 3, "the average should be 3"
except AssertionError as e:
    print("logic error (caught by the test):", e)
```

The lesson: a syntax error is caught by the **compiler/interpreter**, a runtime error by a **trial run** or error handling (`try`), a logic error only by a **test**. That's why developers write automated tests.

## 4. Compiling or interpreting – when does which pay off?

A compiled program (C, C++, Rust) is compiled once before running, then runs fast. An interpreted one (Python) starts immediately but runs slower. If compiling takes $F$ seconds, one run of the compiled program $c$ and of the interpreted one $k \cdot c$ seconds, the total time for $n$ runs is:

```plot
title: Total time (s) as a function of the number of runs
x: 0, 50
y: 0, 120
param: k = 10, 2, 50, 1
f: 20 + 0.5*x # compiled: 20 s compiling + 0.5 s per run
f: 0.5*k*x # interpreted: k times slower runs, no compiling
```

With few runs (quick experiments, a one-off script) the interpreted one wins; with many runs or heavy computation the compiled one does. With the slider you set the speed difference ($k$). Practice mixes the two worlds: Java and C# compile to intermediate code that a **JIT** (just-in-time) compiler speeds up while running; Python's popular libraries (e.g. NumPy) use compiled code written in C internally.

## 5. Why can't git history be rewritten "quietly"?

In the basic lesson we saw that git consists of commits. Every commit's ID is a **hash** computed from its content **and the previous commit's ID**. So modifying an old commit changes the IDs of all the commits after it:

```python run
# Hash chain, as in git: every commit also contains the previous one's ID
import hashlib

def commit_id(previous, message):
    return hashlib.sha1(f"{previous}|{message}".encode()).hexdigest()[:7]

def history(messages):
    ids, previous = [], "root"
    for m in messages:
        previous = commit_id(previous, m)
        ids.append(previous)
    return ids

original = ["start project", "login", "password change", "README"]
forged = ["start project", "login (modified)", "password change", "README"]
print("original:", history(original))
print("forged:  ", history(forged))
```

After modifying the second commit, the IDs of the third and fourth change too – anyone with the original history notices immediately. That's why people say **don't rewrite history on a shared branch** (e.g. `git push --force`): the history on your teammates' machines will no longer match yours.

## Summary

- The same task can be solved imperatively (steps, variables), functionally (functions, no modification) and declaratively (what we want).
- An interpreter splits the program into tokens, parses it according to the grammar, then evaluates it (or compiles it to bytecode).
- A syntax error is caught by the compiler, a runtime error by running, a logic error only by a test.
- Compiling pays off with many runs; git commits form a hash chain, so modifying history always shows.

## Lesson exercise

```quiz required
? What is the value of `2 + 3 * 4 - 6 / 2` with the usual order of operations?
= 11
! $2 + 12 - 3 = 11$.

? Which error is only reliably caught by a test (or careful checking)?
- syntax error
- runtime error
+ logic error
- none can get into a program
! The program runs, it just gives a wrong result.

? Compiling takes 30 s, one run of the compiled program 1 s, of the interpreted version 4 s. From how many runs is the compiled version faster in total? (the first whole number with less total time)
= 11
! $30 + n < 4n$, i.e. $n > 10$: from the 11th run.

? Which is an example of the declarative style?
- a `for` loop that increases a sum
+ `SELECT AVG(grade) FROM grades WHERE grade >= 2;`
- a `while` loop with a counter
- modifying a variable's value
! We describe what we want, not how.

? Why do later commits' IDs change if you modify an old commit?
- because git assigns IDs randomly
+ because every commit's ID is also computed from the previous commit's ID
- because GitHub renames them
- they don't change
! Commits form a hash chain.
```

---
title: Practice – Programming Languages and Environments
summary: Review questions and a summary worksheet on languages, compilation and developer tools.
minutes: 18
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

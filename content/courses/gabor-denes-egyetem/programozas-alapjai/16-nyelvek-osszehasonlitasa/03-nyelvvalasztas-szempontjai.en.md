---
title: Pros, Cons and How to Choose a Language
summary: Performance, development speed, safety, ecosystem – how to pick a language for a task.
minutes: 12
---

## What you will learn

- the **criteria** for comparing languages,
- the **trade-offs** involved (speed ↔ development time),
- how to choose a language for a **specific task**.

## Criteria for comparison

| Criterion                     | Question                                                | Example                                                |
| ----------------------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| **Performance**               | How fast does it run, how much memory does it use?      | C, C++, Rust ≫ Java, C#, Go > Python, Ruby             |
| **Development speed**         | How quickly is a working program finished?              | Python, Ruby ≫ C, C++                                  |
| **Safety, reliability**       | How many errors does the compiler catch before running? | Rust, statically typed languages                       |
| **Readability, learnability** | How easy is it to understand and learn?                 | Python stands out                                      |
| **Ecosystem**                 | Are there ready-made libraries, frameworks, tools?      | Python (data, AI), JavaScript (web), Java (enterprise) |
| **Portability**               | Which platforms does it run on?                         | Java/JVM, Python, JavaScript (browser)                 |
| **Community, job market**     | Is there help, documentation, jobs?                     | Python, JavaScript, Java, C#                           |

## The big trade-off: run time vs. development time

Machine time is cheap, programmer time is expensive. So it often pays to choose a slower but faster-to-write language – **unless** speed is critical (e.g. game engine, real-time control, high-load server).

A common solution is a **combination**: the fast parts of Python libraries (e.g. NumPy) are written in C, and Python is just the "glue". That way you get both convenience and speed.

```python run
# The same calculation in pure Python and with the built-in sum() written in C.
import time

numbers = list(range(1_000_000))

start = time.perf_counter()
total = 0
for number in numbers:   # Python loop: the interpreter executes every step
    total += number
python_time = time.perf_counter() - start

start = time.perf_counter()
total2 = sum(numbers)    # sum() runs in C internally
c_time = time.perf_counter() - start

print(total == total2)
print(f"Python loop: {python_time:.4f} s, built-in sum(): {c_time:.4f} s")
```

## Static vs. dynamic typing in practice

- **Static** (Java, C#, C++, Rust, Go, TypeScript): some errors are caught at compile time, and the IDE helps more (autocomplete, renaming). An advantage in large projects with many contributors.
- **Dynamic** (Python, Ruby, JavaScript): less typing, more flexible, faster prototyping. Tests and type hints make up for the missing checks.

## Which language for what?

| Task                             | Good choice                            | Why                                              |
| -------------------------------- | -------------------------------------- | ------------------------------------------------ |
| data analysis, machine learning  | **Python**                             | NumPy, pandas, scikit-learn, PyTorch             |
| website (client side)            | **JavaScript / TypeScript**            | the only thing that runs natively in the browser |
| web backend                      | Python, Java, C#, JavaScript, Go, Ruby | all have mature frameworks                       |
| Android app                      | Kotlin, Java                           | the platform's official languages                |
| iOS app                          | Swift                                  | Apple's official language                        |
| game                             | C# (Unity), C++ (Unreal)               | the game engines' languages                      |
| microcontroller, embedded system | **C**, C++, (MicroPython)              | little memory, direct hardware access            |
| operating system, driver         | C, C++, Rust                           | performance, closeness to hardware               |
| automation, sysadmin scripts     | Python, Bash, PowerShell               | quick to write                                   |
| enterprise system                | Java, C#                               | stability, type safety, support                  |

## Decision steps

1. **What is the platform?** Browser → JavaScript; microcontroller → C; Android → Kotlin.
2. **How critical is speed?** If very, a compiled language (C++, Rust, Go).
3. **Are there ready-made libraries?** Don't rewrite what already exists.
4. **What does the team know?** A familiar language is often worth more than a theoretically better but unknown one.
5. **Who will maintain it?** A readable, widespread language is cheaper in the long run.

## Why Python as a first language?

- simple, readable syntax – you can focus on **thinking**, not boilerplate,
- runs immediately (interactive mode), fast feedback,
- useful in later courses too (databases, AI, data analysis, robotics),
- the core concepts you learn carry over to any language.

## Summary

- Languages are compared by **performance, development speed, safety, ecosystem and portability**.
- The key trade-off: **fast execution ↔ fast development**.
- Choose a language **for the task and the platform**, not because it is trendy.

## Lesson exercise: Weighted language choice

We are choosing a language for a project. Every language was scored 1–5 per criterion, and the criteria have weights. Write the `ranking(scores, weights)` function:

- `scores`: a `{language: {criterion: score}}` dictionary, `weights`: a `{criterion: weight}` dictionary,
- a language's total is the **weighted average** `Σ(score · weight) / Σ weight`, rounded to 2 decimals; a criterion missing for a language counts as 0 points,
- the result is a list of `(language, total)` pairs in **descending** order of total, alphabetical on ties,
- if the weights sum to 0 (or there are no weights), raise `ValueError`.

```python starter required
def ranking(scores, weights):
    result = []
    for lang, points in scores.items():
        result.append((lang, sum(points.values())))
    return result


scores = {
    "Python": {"learnability": 5, "speed": 2, "libraries": 5},
    "C++": {"learnability": 2, "speed": 5, "libraries": 4},
}
print(ranking(scores, {"learnability": 2, "speed": 1, "libraries": 1}))
```

<details>
<summary>Solution</summary>

```python solution
def ranking(scores, weights):
    total_weight = sum(weights.values())
    if total_weight == 0:
        raise ValueError("The weights cannot sum to 0.")
    result = []
    for lang, points in scores.items():
        # A missing criterion is worth 0 points
        total = sum(points.get(criterion, 0) * weight for criterion, weight in weights.items())
        result.append((lang, round(total / total_weight, 2)))
    # Descending total, alphabetical on ties
    return sorted(result, key=lambda pair: (-pair[1], pair[0]))


scores = {
    "Python": {"learnability": 5, "speed": 2, "libraries": 5},
    "C++": {"learnability": 2, "speed": 5, "libraries": 4},
}
print(ranking(scores, {"learnability": 2, "speed": 1, "libraries": 1}))
```

</details>

```python test
scores = {
    "Python": {"learnability": 5, "speed": 2, "libraries": 5},
    "C++": {"learnability": 2, "speed": 5, "libraries": 4},
}
assert ranking(scores, {"learnability": 2, "speed": 1, "libraries": 1}) == [("Python", 4.25), ("C++", 3.25)], "The weighted average or the order is wrong."
assert ranking(scores, {"speed": 1}) == [("C++", 5.0), ("Python", 2.0)], "Only weighted criteria count."
r = ranking({"Go": {"a": 3}, "C": {"a": 3}, "Rust": {}}, {"a": 1})
assert r == [("C", 3.0), ("Go", 3.0), ("Rust", 0.0)], "Alphabetical on ties; a missing criterion is 0 points."
assert ranking({"X": {"a": 1, "b": 2}}, {"a": 1, "b": 2}) == [("X", 1.67)], "Round to 2 decimals."
for bad in ({}, {"a": 0}):
    try:
        ranking(scores, bad)
        assert False, "A total weight of 0 should raise ValueError."
    except ValueError:
        pass
```

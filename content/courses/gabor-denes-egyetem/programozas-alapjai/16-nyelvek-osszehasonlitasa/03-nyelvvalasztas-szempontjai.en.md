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

| Criterion | Question | Example |
| --- | --- | --- |
| **Performance** | How fast does it run, how much memory does it use? | C, C++, Rust ≫ Java, C#, Go > Python, Ruby |
| **Development speed** | How quickly is a working program finished? | Python, Ruby ≫ C, C++ |
| **Safety, reliability** | How many errors does the compiler catch before running? | Rust, statically typed languages |
| **Readability, learnability** | How easy is it to understand and learn? | Python stands out |
| **Ecosystem** | Are there ready-made libraries, frameworks, tools? | Python (data, AI), JavaScript (web), Java (enterprise) |
| **Portability** | Which platforms does it run on? | Java/JVM, Python, JavaScript (browser) |
| **Community, job market** | Is there help, documentation, jobs? | Python, JavaScript, Java, C# |

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

| Task | Good choice | Why |
| --- | --- | --- |
| data analysis, machine learning | **Python** | NumPy, pandas, scikit-learn, PyTorch |
| website (client side) | **JavaScript / TypeScript** | the only thing that runs natively in the browser |
| web backend | Python, Java, C#, JavaScript, Go, Ruby | all have mature frameworks |
| Android app | Kotlin, Java | the platform's official languages |
| iOS app | Swift | Apple's official language |
| game | C# (Unity), C++ (Unreal) | the game engines' languages |
| microcontroller, embedded system | **C**, C++, (MicroPython) | little memory, direct hardware access |
| operating system, driver | C, C++, Rust | performance, closeness to hardware |
| automation, sysadmin scripts | Python, Bash, PowerShell | quick to write |
| enterprise system | Java, C# | stability, type safety, support |

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

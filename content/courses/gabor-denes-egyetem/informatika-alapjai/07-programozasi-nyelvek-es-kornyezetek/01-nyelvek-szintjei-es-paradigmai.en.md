---
title: Language Levels and Paradigms
summary: Machine code, assembly, high-level languages; imperative, object-oriented, functional and declarative programming.
minutes: 16
---

## What you will learn

- what **machine code**, **assembly** and a **high-level** language are,
- what the big **paradigms** are,
- what well-known languages are used for.

## Levels of languages

The processor only understands **machine code**: binary instructions, e.g. `10110000 01100001`. Writing that by hand is almost impossible for a human.

```text
 high level (Python)      total = a + b
        │  compiler / interpreter
        ▼
 assembly (x86)           mov eax, [a]
                          add eax, [b]
                          mov [total], eax
        │  assembler
        ▼
 machine code             8B 05 … 03 05 … 89 05 …
```

- **Low-level** language (assembly): one instruction ≈ one machine instruction; processor-specific, fast but long-winded.
- **High-level** language (Python, Java, C#…): closer to human thinking, **portable** (runs on several processors), one line means many machine instructions.

## Paradigms

A **paradigm** is a “way of thinking” about programming: how we break a task into parts.

| Paradigm                    | Core idea                                                       | Example languages                           |
| --------------------------- | --------------------------------------------------------------- | ------------------------------------------- |
| **imperative / procedural** | we say step by step _how_; split into procedures                | C, Pascal, Python                           |
| **object-oriented**         | data and operations wrapped in **objects** (class, inheritance) | Java, C#, C++, Python                       |
| **functional**              | composing functions, without mutable state                      | Haskell, F#, Elixir (and partly JS, Python) |
| **declarative**             | we say _what_ we want, not how                                  | SQL, HTML, Prolog                           |

The same task in two styles – the sum of the even numbers:

```python run
# Imperative: step by step
total = 0
for x in [1, 2, 3, 4, 5, 6]:
    if x % 2 == 0:
        total += x
print(total)

# Functional style: filter + sum in one expression
print(sum(filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5, 6])))
```

```sql
-- Declarative (SQL): we only say WHAT we want
SELECT SUM(value) FROM numbers WHERE value % 2 = 0;
```

## Which language for what?

| Language                | Typical area                                              |
| ----------------------- | --------------------------------------------------------- |
| Python                  | getting started, data analysis, AI, scripts, web back-end |
| JavaScript / TypeScript | websites, web apps (browser and server)                   |
| Java, Kotlin            | enterprise systems, Android                               |
| C#                      | Windows, enterprise systems, Unity games                  |
| C, C++                  | operating systems, embedded systems, game engines         |
| Rust, Go                | safe systems programming, cloud services                  |
| SQL                     | database queries                                          |

## Summary

- Machine code → assembly → high-level language; high-level languages are portable and readable.
- Paradigms: imperative, object-oriented, functional, declarative.
- We choose the language to fit the task.

## Exercise

```quiz required
? Which language does the processor understand directly?
- Python
- assembly
+ machine code
- SQL
! Assembly must also be translated to machine code (by an assembler).

? Which paradigm does SQL belong to?
- imperative
- object-oriented
+ declarative
- functional
! We say what we want, not how.

? What does the lesson's first Python example print?
= 12
! 2 + 4 + 6 = 12.

? Which is the programming language of web pages running in the browser?
- C
+ JavaScript
- Kotlin
- SQL
! The browser runs JavaScript (TypeScript also becomes JS).
```

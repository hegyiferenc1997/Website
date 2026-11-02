---
title: What Is a Programming Language?
summary: Machine code, assembly and high-level languages; syntax and semantics.
minutes: 12
---

## What you will learn

- the **levels** of programming languages,
- the difference between **syntax** and **semantics**,
- why almost everything is written in high-level languages today.

## Language levels

A processor only understands **machine code**: binary instruction codes. This is nearly impossible for people to read, so ever "higher" level languages were created.

| Level | Example | Characteristics |
| --- | --- | --- |
| machine code | `10110000 01100001` | executed directly by the processor, processor-specific |
| assembly | `MOV AL, 61h` | readable abbreviations of machine instructions, still processor-specific |
| low-level high-level language | C | portable but close to the hardware (manual memory management) |
| high-level language | Python, Java, C# | easy for people to read, hides machine details |

The higher the level, the less code it takes to express an idea and the easier it is to move to another machine. In exchange, execution is usually somewhat slower and you have less direct control over the hardware.

## The same at different levels

Task: add two numbers.

```c
/* In C: types must be given and the program must be compiled. */
#include <stdio.h>
int main(void) {
    int a = 2, b = 3;
    printf("%d\n", a + b);
    return 0;
}
```

```python run
# In Python: no type declarations, no main function, runs immediately.
a, b = 2, 3
print(a + b)
```

## Syntax and semantics

- **Syntax** is the *grammar* of the language: the form statements must take (where a colon, parenthesis or indentation goes). The computer reports syntax errors before running (`SyntaxError`).
- **Semantics** is the *meaning*: what a syntactically correct statement does. With a semantic error the program runs, it just doesn't do what you wanted.

```python run
# Syntactically correct but semantically wrong: a bad formula for the average.
a, b = 4, 6
average = a + b / 2      # because of operator precedence this is 4 + 3 = 7.0
print(average)
average = (a + b) / 2    # correct: 5.0
print(average)
```

## General-purpose and domain-specific languages

- **General-purpose languages (GPL):** usable for anything – Python, Java, C, C#.
- **Domain-specific languages (DSL):** made for one area – SQL (database queries), HTML (page structure), CSS (appearance), regex (text patterns).

## Summary

- Languages range from machine code to high-level languages; the higher the level, the more readable and portable the code.
- **Syntax** = form, **semantics** = meaning.
- There are general-purpose and domain-specific languages.

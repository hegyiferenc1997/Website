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

| Level                         | Example             | Characteristics                                                          |
| ----------------------------- | ------------------- | ------------------------------------------------------------------------ |
| machine code                  | `10110000 01100001` | executed directly by the processor, processor-specific                   |
| assembly                      | `MOV AL, 61h`       | readable abbreviations of machine instructions, still processor-specific |
| low-level high-level language | C                   | portable but close to the hardware (manual memory management)            |
| high-level language           | Python, Java, C#    | easy for people to read, hides machine details                           |

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

- **Syntax** is the _grammar_ of the language: the form statements must take (where a colon, parenthesis or indentation goes). The computer reports syntax errors before running (`SyntaxError`).
- **Semantics** is the _meaning_: what a syntactically correct statement does. With a semantic error the program runs, it just doesn't do what you wanted.

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

## Lesson exercise: Syntactically right, semantically wrong

The two functions below are **syntactically correct** (they run) but **semantically wrong**: they don't compute what their names promise. Fix both!

- `rectangle_perimeter(a, b)` – the perimeter of a rectangle: 2 · (a + b);
- `average(a, b, c)` – the average of three numbers.

```python starter required
def rectangle_perimeter(a, b):
    return a * b


def average(a, b, c):
    return a + b + c / 3


print(rectangle_perimeter(3, 4))   # should be 14
print(average(2, 4, 6))            # should be 4.0
```

<details>
<summary>Solution</summary>

```python solution
def rectangle_perimeter(a, b):
    return 2 * (a + b)


def average(a, b, c):
    return (a + b + c) / 3


print(rectangle_perimeter(3, 4))   # 14
print(average(2, 4, 6))            # 4.0
```

</details>

```python test
assert rectangle_perimeter(3, 4) == 14, "The perimeter of a 3×4 rectangle is 14."
assert rectangle_perimeter(1, 1) == 4, "The perimeter of a 1×1 square is 4."
assert average(2, 4, 6) == 4, "The average of 2, 4 and 6 is 4 (mind the parentheses!)."
assert average(1, 2, 3) == 2, "The average of 1, 2 and 3 is 2."
```

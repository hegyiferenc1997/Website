---
title: Compiler and Interpreter
summary: Compilation, interpretation, intermediate code and virtual machines; syntax, runtime and logic errors.
minutes: 14
---

## What you will learn

- how source code becomes a running program: **compiler** and **interpreter**,
- what **intermediate code** and a **virtual machine** are (Java, C#),
- what **kinds of errors** exist.

## Source code

The text written by the programmer is the **source code** (e.g. `program.py`, `main.c`). It must somehow be turned into machine code.

## Compiler

A **compiler** translates the whole source code **in advance** into a standalone machine-code program (`.exe` on Windows).

- **Pro**: fast execution, the user doesn't need the compiler.
- **Con**: must be recompiled after every change; the compiled program runs on one platform only.
- Examples: **C**, **C++**, **Rust**, **Go**.

## Interpreter

An **interpreter** reads and executes the source code **while running**, statement by statement.

- **Pro**: can be tried immediately, runs on any machine that has the interpreter.
- **Con**: usually slower; some errors only show up at run time.
- Examples: **Python**, **JavaScript**, **PHP**, **Ruby**.

## In between: bytecode and virtual machine

**Java** and **C#** compile the source code into an **intermediate code** (bytecode), which a **virtual machine** (the JVM or the .NET CLR) runs and compiles to machine code during execution (**JIT**, just-in-time). So the program is portable (“write once, run anywhere”) and still fast. (Python also compiles to bytecode internally, into `.pyc` files.)

```text
 C:      source ──compiler──► machine code ──► CPU
 Python: source ──interpreter (bytecode + run)──► CPU
 Java:   source ──javac──► bytecode ──JVM (JIT)──► CPU
```

## Kinds of errors

| Error       | When is it found?        | Example                                    |
| ----------- | ------------------------ | ------------------------------------------ |
| **syntax**  | at compile / start time  | missing parenthesis: `print("hi"`          |
| **runtime** | while running            | division by zero, opening a missing file   |
| **logic**   | only from a wrong result | `average = total / 2` instead of the count |

A logic error is the sneakiest: the program runs, it just computes the wrong thing. **Testing** protects against it.

```python run
# Catching a runtime error
try:
    print(10 / 0)
except ZeroDivisionError:
    print("You can't divide by zero!")
```

## Summary

- Compiler: translates in advance, all at once → fast, platform-specific program (C, Rust).
- Interpreter: executes while running → flexible, slower (Python, JS).
- Java/C#: bytecode + virtual machine (JIT). Errors: syntax, runtime, logic.

## Exercise

```quiz required
? Which language is usually turned into a standalone machine-code program by a **compiler**?
+ C
- Python
- JavaScript
- PHP
! C, C++, Rust and Go are compiled languages.

? What is the virtual machine that runs Java's intermediate code called (abbreviation)?
= JVM
! Java Virtual Machine.

? What kind of error is it when the program runs but gives a wrong result?
- syntax
- runtime
+ logic
! Testing catches logic errors.

? What error does the line `print("hi"` cause (missing parenthesis)?
+ syntax
- runtime
- logic
! The program doesn't even start.
```

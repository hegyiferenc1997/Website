---
title: Compilers versus Interpreters
summary: Compiled, interpreted and bytecode languages, JIT – and how a Python program really runs.
minutes: 15
---

## What you will learn

- how a **compiler** differs from an **interpreter**,
- what **bytecode** and a **virtual machine** are,
- what **JIT** compilation is,
- how Python code runs (CPython).

## Compiler

A compiler translates the **whole** source code into machine code in advance. The result is a standalone executable.

- ✅ fast execution, some errors are found at compile time
- ✅ the compiler isn't needed to run the program
- ❌ must be compiled separately for every platform (Windows, Linux, ARM)
- ❌ must be recompiled after every change

Examples: C, C++, Rust, Go.

## Interpreter

An interpreter reads and executes the source code **while running**, statement by statement.

- ✅ runs immediately, quick experiments (interactive mode)
- ✅ portable: it runs wherever there is an interpreter
- ❌ slower execution
- ❌ some errors only appear when execution reaches that line

Examples: classic BASIC, shell scripts, JavaScript (originally).

## In practice: bytecode and virtual machines

Most modern languages mix the two: the source is compiled into an intermediate, machine-independent **bytecode**, which a **virtual machine (VM)** runs.

| Language | Bytecode | Virtual machine            |
| -------- | -------- | -------------------------- |
| Java     | `.class` | JVM (Java Virtual Machine) |
| C#       | CIL      | .NET CLR                   |
| Python   | `.pyc`   | CPython virtual machine    |

## JIT – compiling at run time

A **JIT (Just-In-Time)** compiler watches which code runs often during execution and compiles it to machine code. This way an interpreted language can approach the speed of a compiled one. JIT is used by the JVM, .NET, browsers' JavaScript engines and PyPy (a fast Python implementation).

## How does Python run?

Standard Python (CPython) first **compiles to bytecode**, then interprets it. You can look at the bytecode with the `dis` module:

```python run
import dis

def add(a, b):
    return a + b

# The function's bytecode: these are the instructions the Python VM executes.
dis.dis(add)
```

The bytecode of imported modules is saved in the `__pycache__` folder (`.pyc` files), so the next start is faster.

> **Important:** "compiled" or "interpreted" is a property of the **implementation**, not the language. Python has a JIT implementation (PyPy), and C has interpreters too.

## Summary

| Aspect             | Compiler                | Interpreter                      |
| ------------------ | ----------------------- | -------------------------------- |
| when it translates | in advance, all at once | while running, line by line      |
| execution speed    | fast                    | slower                           |
| finding errors     | many at compile time    | at run time                      |
| portability        | recompile per platform  | wherever there is an interpreter |

Python compiles to bytecode, which a virtual machine runs.

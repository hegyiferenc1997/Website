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

## Lesson exercise: Write a stack machine interpreter

Bytecode is **interpreted** by a virtual machine instruction by instruction. Write a tiny stack machine: the `run(program)` function receives a list of instructions and returns the value on top of the stack at the end.

| Instruction | Meaning                                                  |
| ----------- | -------------------------------------------------------- |
| `PUSH n`    | puts the integer `n` on top of the stack                 |
| `ADD`       | pops the top two values and pushes their sum             |
| `SUB`       | pops `b`, then `a`, and pushes `a - b`                   |
| `MUL`       | pops the top two values and pushes their product         |

For an unknown instruction raise `ValueError`. For example `["PUSH 2", "PUSH 3", "ADD", "PUSH 4", "MUL"]` gives 20.

```python starter required
def run(program):
    stack = []
    for instruction in program:
        parts = instruction.split()     # e.g. ["PUSH", "2"]
        op = parts[0]
        # PUSH: stack.append(int(parts[1]))
        # ADD / SUB / MUL: b = stack.pop(), a = stack.pop(), then push the result
        # otherwise: ValueError
    return stack[-1]


print(run(["PUSH 2", "PUSH 3", "ADD", "PUSH 4", "MUL"]))   # 20
```

<details>
<summary>Solution</summary>

```python solution
def run(program):
    stack = []
    for instruction in program:
        parts = instruction.split()
        op = parts[0]
        if op == "PUSH":
            stack.append(int(parts[1]))
        elif op in ("ADD", "SUB", "MUL"):
            b = stack.pop()
            a = stack.pop()
            if op == "ADD":
                stack.append(a + b)
            elif op == "SUB":
                stack.append(a - b)
            else:
                stack.append(a * b)
        else:
            raise ValueError(f"Unknown instruction: {instruction}")
    return stack[-1]


print(run(["PUSH 2", "PUSH 3", "ADD", "PUSH 4", "MUL"]))   # 20
```

</details>

```python test
assert run(["PUSH 2", "PUSH 3", "ADD", "PUSH 4", "MUL"]) == 20, "(2 + 3) * 4 = 20"
assert run(["PUSH 10", "PUSH 4", "SUB"]) == 6, "10 - 4 = 6 (order matters!)"
assert run(["PUSH 7"]) == 7, "After a single PUSH the number is on top of the stack."
assert run(["PUSH 1", "PUSH 2", "PUSH 3", "MUL", "ADD"]) == 7, "1 + 2 * 3 = 7"
try:
    run(["PUSH 1", "JUMP"])
    assert False, "An unknown instruction must raise ValueError."
except ValueError:
    pass
```

---
title: Deeper – Compilation from the Inside
summary: We look at what Python does with your code before running it – a syntax tree with the ast module, bytecode with the dis module, constant folding as an optimisation, your own stack machine, and a "recompile only what changed" build simulation.
minutes: 50
---

## What you will learn in this lesson

- the stages source code goes through: **tokens → syntax tree → bytecode → execution**,
- how to look into these with Python's own tools (`ast`, `dis`),
- what a compiler does when it **optimises**,
- how a **stack machine** works, and why an **incremental build** speeds things up.

## 1. From source code to syntax tree

In the basic lesson we saw that both a compiler and an interpreter first **parse** the code. Python shows this right away: the `ast` module builds an **abstract syntax tree** (AST) from the code, in which you can already see what connects to what – for example, that because of the brackets the addition happens first:

```python run
# The expression's syntax tree: because of the brackets the addition sits "lower", so it runs first
import ast

tree = ast.parse("price = net * (1 + vat)")
print(ast.dump(tree.body[0].value, indent=2))
```

In the output the root is the multiplication (`Mult`), and its right branch is the addition (`Add`). The tree is evaluated **bottom up**: first `1 + vat`, then the multiplication. If there's a syntax error in the code (e.g. a missing bracket), it gets stuck right here – that's why Python reports a syntax error **before** a single line runs.

## 2. Bytecode: what the Python machine really executes

CPython turns the syntax tree into **bytecode**: simple instructions for a virtual machine. That's compilation – just not to machine code, but to an intermediate language. The `dis` module shows it:

```python run
# Printing the bytecode: Python's virtual machine is a stack machine
import dis

def gross(net, vat):
    return net * (1 + vat)

dis.dis(gross)
```

The exact instruction names differ a little between Python versions, but the pattern is always the same: it **loads** (`LOAD_…`) values onto a stack, an **operation** (`BINARY_OP`) takes the two values off the top of the stack and puts the result back. That's a **stack machine**. Java (JVM) and C# (.NET) work this way too: the source becomes bytecode run by a virtual machine – and the frequently run parts are even compiled to machine code on the fly by the **JIT**.

## 3. Optimisation: what the compiler calculates for you

A compiler doesn't just translate, it also **improves** the code where it can do so safely. The simplest example is **constant folding**: if an expression consists only of constants, it computes the result at compile time:

```python run
# Constant folding: the multiplication 24 * 60 * 60 doesn't happen at run time
import dis

code = compile("seconds_per_day = 24 * 60 * 60", "<example>", "exec")
constants = [c for c in code.co_consts if isinstance(c, int)]
print("integer constants stored in the compiled code:", constants)
dis.dis(code)
```

The bytecode only contains the finished `86400`, with no multiplication at all. So you can happily write the readable form `24 * 60 * 60` – it won't make the program slower. C and C++ compilers can do much more (removing unnecessary code, reordering loops, "inlining" functions), which is why optimisation can be switched on and off (`-O0`, `-O2`): for debugging, unoptimised code is easier to follow.

## 4. Incremental build: compile only what changed

Fully compiling a big C++ project can take an hour. Build tools (make, CMake, Gradle) therefore remember which file was made from what, and only recompile what **changed** – or whose dependency changed:

```python run
# Incremental build simulation: we decide about recompiling based on the content's hash
import hashlib

def hash_(text):
    return hashlib.sha256(text.encode()).hexdigest()[:8]

sources = {"main.c": "int main() {...}", "math.c": "int add() {...}", "io.c": "void log() {...}"}
dependencies = {"main.c": ["math.c", "io.c"], "math.c": [], "io.c": []}   # main.c uses the other two
last_build = {f: hash_(t) for f, t in sources.items()}                    # the state of the previous build

sources["math.c"] = "int add() { /* faster */ }"                          # we modify one file

changed = {f for f, t in sources.items() if hash_(t) != last_build[f]}
rebuild = sorted(f for f in sources if f in changed or changed & set(dependencies[f]))
print("changed:", sorted(changed))
print("to recompile:", rebuild, f"({len(rebuild)} / {len(sources)} files)")
```

`math.c` changed, so it has to be recompiled; `main.c` is recompiled too, because it depends on it; but `io.c` stays. In a project with thousands of files, that's the difference between an hour and half a minute.

| Viewpoint     | What does compilation mean to them?                                                     |
| ------------- | --------------------------------------------------------------------------------------- |
| **developer** | quick feedback: errors should show up early, and recompiling should be fast             |
| **user**      | a fast, small program; how it was made doesn't interest them                            |
| **operator**  | a reproducible build: the same source should always produce the same program            |
| **security**  | a lot can be reverse-engineered from a compiled program too – don't put secrets in code |

## Summary

- Source code becomes tokens, then a syntax tree (AST); a syntax error shows up right here.
- CPython compiles to bytecode, which a stack machine runs; the `dis` module shows it.
- The compiler optimises, e.g. it precomputes an expression made only of constants.
- An incremental build only recompiles the changed files and those that depend on them.

## Lesson exercise: your own stack machine

Imitating the bytecode stack machine, write the `stack_machine(tokens)` function, which evaluates an expression in **reverse Polish** (postfix) notation! The list of tokens contains numbers (as strings) and the symbols `+`, `-`, `*`, `/`. For a number, push its value (`float`) onto the stack; for an operation, pop the top two elements (the right-hand one comes off first!) and push the result. At the end the stack's single element is the result. For example `["3", "4", "+", "2", "*"]` means `(3 + 4) * 2`, i.e. `14.0`.

```python starter required
def stack_machine(tokens):
    stack = []
    for t in tokens:
        if t in "+-*/":
            pass  # pop the top two elements, compute, push back
        else:
            stack.append(float(t))
    return stack[-1]


print(stack_machine(["3", "4", "+", "2", "*"]))
```

<details>
<summary>Solution</summary>

```python solution
def stack_machine(tokens):
    stack = []
    for t in tokens:
        if t in "+-*/":
            right = stack.pop()
            left = stack.pop()
            if t == "+":
                stack.append(left + right)
            elif t == "-":
                stack.append(left - right)
            elif t == "*":
                stack.append(left * right)
            else:
                stack.append(left / right)
        else:
            stack.append(float(t))
    return stack[-1]


print(stack_machine(["3", "4", "+", "2", "*"]))
```

</details>

```python test
assert stack_machine(["3", "4", "+", "2", "*"]) == 14.0, "(3 + 4) * 2 = 14"
assert stack_machine(["10", "4", "-"]) == 6.0, "order matters for subtraction: 10 - 4 = 6"
assert stack_machine(["8", "2", "/", "3", "+"]) == 7.0, "8 / 2 + 3 = 7"
assert stack_machine(["5"]) == 5.0, "a single number is itself"
```

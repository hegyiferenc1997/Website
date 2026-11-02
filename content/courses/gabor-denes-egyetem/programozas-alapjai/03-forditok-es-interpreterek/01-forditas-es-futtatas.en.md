---
title: The Compilation and Execution Process
summary: From source code to a running program – lexical, syntactic and semantic analysis, code generation, linking.
minutes: 15
---

## What you will learn

- the stages source code goes through before the processor can execute it,
- what the **compiler**, the **linker** and the **loader** do,
- what **compile-time** and **run-time** errors are.

## The big picture

The processor only understands machine code, but we write in a high-level language. A **compiler** bridges the two.

```text
source (.c)  →  [compiler]  →  object code (.o)  →  [linker]  →  executable (.exe)  →  [loader]  →  running
```

## Inside the compiler

1. **Lexical analysis (tokenising):** splits the text into "words" (tokens): keywords, names, numbers, operators. The line `x = 3 + y` becomes `NAME(x)`, `=`, `NUMBER(3)`, `+`, `NAME(y)`.
2. **Syntax analysis (parsing):** checks the grammar and builds a **syntax tree** (AST) from the tokens. Syntax errors (missing parenthesis, colon) are found here.
3. **Semantic analysis:** interprets the meaning – does the variable exist, do the types match.
4. **Intermediate code and optimisation:** the tree is turned into a simpler, machine-independent form and sped up.
5. **Code generation:** machine code (or bytecode) is produced.

Python can show you its own tokens and syntax tree:

```python run
import ast
import io
import tokenize

code = "x = 3 + y"

# Step 1: tokens
for tok in tokenize.generate_tokens(io.StringIO(code).readline):
    if tok.string.strip():
        print(tokenize.tok_name[tok.type], repr(tok.string))

# Step 2: syntax tree (AST)
print(ast.dump(ast.parse(code).body[0]))
```

## Linking and loading

- The **linker** joins your program's object code with the **libraries** it uses (e.g. the code of `printf`) and produces the executable.
  - **Static linking:** the library code is copied into the executable.
  - **Dynamic linking:** the library lives in a separate file (`.dll`, `.so`) and is loaded at run time.
- The **loader** is part of the operating system: it loads the program into memory and starts it.

## Compile time and run time

|               | Compile time                                   | Run time                                  |
| ------------- | ---------------------------------------------- | ----------------------------------------- |
| when?         | before the program starts                      | while the program runs                    |
| typical error | syntax error, type error (in static languages) | division by zero, missing file, bad index |
| example       | missing semicolon in C                         | `ZeroDivisionError` in Python             |

```python
# This is a run-time error: syntactically fine, the problem only shows when it runs.
divisor = 0
print(10 / divisor)   # ZeroDivisionError
```

## Summary

- Compiler stages: **lexical → syntactic → semantic analysis → optimisation → code generation**.
- The **linker** joins parts and libraries, the **loader** starts the program.
- Distinguish **compile-time** and **run-time** errors.

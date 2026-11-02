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

## Lesson exercise: A lexical analyser (tokenizer)

The first step of a compiler is **lexical analysis**: it turns the characters of the source code into tokens. Write a `tokenize(expression)` function that splits a simple arithmetic expression into tokens:

- numbers with several digits form **one** token (`"12"`),
- the `+ - * / ( )` symbols are separate tokens,
- spaces are skipped.

For example, `tokenize("12 + 3*(4-1)")` returns `["12", "+", "3", "*", "(", "4", "-", "1", ")"]`. For an unknown character raise `ValueError`.

```python starter required
def tokenize(expression):
    result = []
    number = ""        # the digits of the number being read
    for char in expression:
        # digit → append it to number
        # operator or parenthesis → first close the number (if any), then add the symbol
        # space → closes the number
        # anything else → ValueError
        pass
    # don't forget the number left at the end!
    return result


print(tokenize("12 + 3*(4-1)"))
```

<details>
<summary>Solution</summary>

```python solution
def tokenize(expression):
    result = []
    number = ""
    for char in expression:
        if char.isdigit():
            number += char
            continue
        if number:
            result.append(number)
            number = ""
        if char in "+-*/()":
            result.append(char)
        elif char != " ":
            raise ValueError(f"Unknown character: {char!r}")
    if number:
        result.append(number)
    return result


print(tokenize("12 + 3*(4-1)"))
```

</details>

```python test
assert tokenize("12 + 3*(4-1)") == ["12", "+", "3", "*", "(", "4", "-", "1", ")"], "The example from the task is not right."
assert tokenize("7") == ["7"], "A single number is one token."
assert tokenize("  100/25 ") == ["100", "/", "25"], "Spaces must be skipped and a multi-digit number is one token."
assert tokenize("") == [], "An empty expression has no tokens."
try:
    tokenize("2 $ 3")
    assert False, "An unknown character must raise ValueError."
except ValueError:
    pass
```

---
title: Practice – Compilers and Interpreters
summary: Review questions on the compilation process, and experiments with Python bytecode.
minutes: 15
kind: practice
---

## Review questions

**1. List the main stages of a compiler in order.**

<details>
<summary>Answer</summary>

Lexical analysis → syntax analysis → semantic analysis → (intermediate code and) optimisation → code generation.

</details>

**2. What does the linker do? What is the difference between static and dynamic linking?**

<details>
<summary>Answer</summary>

The linker joins object code and libraries into an executable. With static linking the library code is copied into the executable; with dynamic linking it stays in a separate file (`.dll`, `.so`) loaded at run time.

</details>

**3. Is Python compiled or interpreted?**

<details>
<summary>Answer</summary>

CPython is both: it compiles the source to bytecode, and a virtual machine interprets the bytecode. "Compiled/interpreted" is really a property of the implementation.

</details>

**4. What is JIT and why does it make programs faster?**

<details>
<summary>Answer</summary>

Just-In-Time compilation: during execution it compiles frequently run code to machine code, so that code no longer has to be interpreted again and again.

</details>

**5. What is a build system good for? Name two.**

<details>
<summary>Answer</summary>

It automates downloading dependencies, compiling, testing and packaging, and recompiles only what changed. Examples: Make, CMake, Maven, Gradle, pip, npm.

</details>

**6. Compile-time or run-time error? a) missing closing parenthesis, b) division by zero, c) opening a missing file.**

<details>
<summary>Answer</summary>

a) compile time (syntax), b) run time, c) run time.

</details>

## Exercises

### Exercise 1: Counting tokens

Using the `tokenize` module, count how many non-empty tokens are in the text `code`! Store the result in `count`.

```python starter
import io
import tokenize

code = "area = a * b + 2"
count = 0
# Write the counting here!
print(count)
```

<details>
<summary>Solution</summary>

```python solution
import io
import tokenize

code = "area = a * b + 2"
count = 0
for tok in tokenize.generate_tokens(io.StringIO(code).readline):
    if tok.string.strip():
        count += 1
print(count)
```

</details>

```python test
assert count == 7, "area, =, a, *, b, +, 2 – that is 7 tokens"
print("All checks passed!")
```

### Exercise 2: Catching a syntax error

The built-in `compile()` function compiles text to bytecode and raises `SyntaxError` if it is invalid. Write a function `is_valid(code)` that returns `True` if the code is syntactically correct and `False` otherwise!

```python starter
def is_valid(code):
    pass   # use compile(code, "<test>", "exec")!
```

<details>
<summary>Solution</summary>

```python solution
def is_valid(code):
    try:
        compile(code, "<test>", "exec")
        return True
    except SyntaxError:
        return False
```

</details>

```python test
assert is_valid("print('hi')") is True
assert is_valid("print('hi'") is False
assert is_valid("if x > 3\n    pass") is False
assert is_valid("x = 1 / 0") is True, "That would be a run-time error, but the syntax is fine!"
print("All checks passed!")
```

## Summary exercise: Mini compiler: evaluating an expression

The summary exercise of the topic: build a mini "compiler" that **tokenizes** an expression and then **evaluates** it – with the `+`, `-` and `*` operators and the usual precedence (multiplication first). There are no parentheses or division, only non-negative integers.

Write a `calculate(expression)` function! Using `eval()` is forbidden – it would skip the whole point. For example `calculate("2 + 3*4")` → 14, `calculate("10 - 2*3 - 1")` → 3.

Tip: work in two steps. First compute products from the tokens (multiply the numbers joined by `*`) and remember the sign in front of each; then add up the products with their signs.

```python starter required
def tokenize(expression):
    # the tokenizer from the lesson (numbers and operators)
    pass


def calculate(expression):
    # 1. tokens
    # 2. terms: [+product, -product, ...]
    # 3. the sum of the terms
    pass


print(calculate("2 + 3*4"))       # 14
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
        if char in "+-*":
            result.append(char)
        elif char != " ":
            raise ValueError(f"Unknown character: {char!r}")
    if number:
        result.append(number)
    return result


def calculate(expression):
    tokens = tokenize(expression)
    total = 0
    sign = 1
    product = int(tokens[0])
    i = 1
    while i < len(tokens):
        op, number = tokens[i], int(tokens[i + 1])
        if op == "*":
            product *= number
        else:
            total += sign * product      # close the previous term
            sign = 1 if op == "+" else -1
            product = number
        i += 2
    return total + sign * product


print(calculate("2 + 3*4"))       # 14
```

</details>

```python test
assert calculate("2 + 3*4") == 14, "2 + 3*4 = 14 (multiplication first!)"
assert calculate("10 - 2*3 - 1") == 3, "10 - 2*3 - 1 = 3"
assert calculate("7") == 7, "A single number is itself."
assert calculate("2*3*4 - 4*5 + 1") == 5, "2*3*4 - 4*5 + 1 = 5"
assert calculate("100-1-1") == 98, "Subtraction goes left to right: 100-1-1 = 98"
```

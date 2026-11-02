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

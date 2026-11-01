---
title: Errors and error messages
summary: Syntax errors, runtime errors, and how to read an error message.
---

Every programmer makes mistakes; what matters is finding them quickly. There are two main kinds:

- **Syntax error** (`SyntaxError`): the code breaks the rules of the language, so it never starts.
- **Runtime error** (e.g. `ZeroDivisionError`, `NameError`): the program starts but fails at some point.

```python
print("Hi"       # missing parenthesis → SyntaxError
x = 10 / 0       # division by zero → ZeroDivisionError
print(name)      # undefined variable → NameError
```

Read the error message (_traceback_) from the bottom up: the last line names the error type, and above it you see the file and line number.

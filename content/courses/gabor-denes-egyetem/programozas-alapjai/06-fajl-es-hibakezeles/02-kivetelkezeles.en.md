---
title: Exceptions: try and except
summary: Catching and handling runtime errors.
---

```python
while True:
    try:
        n = int(input("Whole number: "))
        break
    except ValueError:
        print("That's not a whole number, try again!")
print("OK:", n)
```

An error raised inside `try` is caught by the `except` branch, so the program doesn't crash. Always catch the specific error type (`ValueError`, `FileNotFoundError`), not everything.

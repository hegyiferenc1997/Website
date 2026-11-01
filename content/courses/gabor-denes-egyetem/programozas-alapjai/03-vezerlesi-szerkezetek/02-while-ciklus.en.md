---
title: The while loop
summary: Repeating while a condition holds.
---

A `while` loop repeats its body as long as the condition is true:

```python
n = int(input("Enter a positive number: "))
while n <= 0:
    n = int(input("It must be positive! Again: "))
print("Thanks:", n)
```

Careful: if the condition never becomes false, you get an **infinite loop**. Press `Ctrl+C` in the terminal to stop the program.

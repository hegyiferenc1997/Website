---
title: Reading and writing files
summary: open() and the with statement.
---

```python
# writing
with open("grades.txt", "w", encoding="utf-8") as f:
    f.write("5\n4\n3\n")

# reading line by line
with open("grades.txt", encoding="utf-8") as f:
    grades = [int(line) for line in f]
print(grades)  # [5, 4, 3]
```

The file is closed automatically at the end of the `with` block. Modes: `"r"` read, `"w"` write (overwrites), `"a"` append.

---
title: Practice – File Handling
summary: Review questions and exercises on text, CSV and JSON files, and on handling file errors.
minutes: 30
kind: practice
---

## Review questions

**1. What is the difference between modes `"w"` and `"a"`?**

<details>
<summary>Answer</summary>

`"w"` empties (overwrites) an existing file, `"a"` appends to the end and keeps the previous content. Both create the file if it doesn't exist.

</details>

**2. Why do we use the `with` statement for files?**

<details>
<summary>Answer</summary>

Because it closes the file automatically at the end of the block, even if an exception happened – so no file stays open and no buffered data is lost.

</details>

**3. What is `stderr` for if there is `stdout`?**

<details>
<summary>Answer</summary>

Error messages go on a separate channel, so when output is redirected to a file, errors don't mix with the data and still show on screen.

</details>

**4. Why always pass `encoding="utf-8"`?**

<details>
<summary>Answer</summary>

Otherwise the operating system's default encoding applies (often not UTF-8 on Windows), and accented characters may display wrongly on another machine or cause `UnicodeDecodeError`.

</details>

**5. Which exception occurs when opening a missing file for reading?**

<details>
<summary>Answer</summary>

`FileNotFoundError` (a subclass of `OSError`).

</details>

## Exercises

### Exercise 1: Lines, words, characters

Write a function `stats(filename)` returning a `(lines, words, characters)` tuple for a text file (like the Unix `wc` command). Line breaks count as characters.

```python starter
def stats(filename):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def stats(filename):
    lines = words = chars = 0
    with open(filename, encoding="utf-8") as f:
        for line in f:
            lines += 1
            words += len(line.split())
            chars += len(line)
    return lines, words, chars
```

</details>

```python test
with open("sample.txt", "w", encoding="utf-8") as f:
    f.write("Hello world\nThis is a test\n")
assert stats("sample.txt") == (2, 6, 27)
print("All checks passed!")
```

### Exercise 2: Missing file

Write a function `line_count(filename)` returning the number of lines in the file, or `-1` for a missing file!

```python starter
def line_count(filename):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def line_count(filename):
    try:
        with open(filename, encoding="utf-8") as f:
            return sum(1 for _ in f)
    except FileNotFoundError:
        return -1
```

</details>

```python test
with open("three.txt", "w", encoding="utf-8") as f:
    f.write("a\nb\nc\n")
assert line_count("three.txt") == 3
assert line_count("no_such_file.txt") == -1
print("All checks passed!")
```

### Exercise 3: Scores from CSV

A CSV file has `name,score` columns (with a header). Write a function `best(filename)` returning the name of the student with the highest score!

```python starter
import csv

def best(filename):
    pass
```

<details>
<summary>Solution</summary>

```python solution
import csv

def best(filename):
    with open(filename, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    return max(rows, key=lambda r: int(r["score"]))["name"]
```

</details>

```python test
with open("scores.csv", "w", newline="", encoding="utf-8") as f:
    f.write("name,score\nAnna,87\nBela,92\nCsilla,64\n")
assert best("scores.csv") == "Bela"
print("All checks passed!")
```

### Exercise 4: Settings in JSON

Write functions `save(settings, filename)` and `load(filename, default)`! `load` returns the dictionary read from the file; if the file doesn't exist **or** contains invalid JSON, it returns `default`.

```python starter
import json

def save(settings, filename):
    pass

def load(filename, default):
    pass
```

<details>
<summary>Solution</summary>

```python solution
import json

def save(settings, filename):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(settings, f, ensure_ascii=False, indent=2)

def load(filename, default):
    try:
        with open(filename, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return default
```

</details>

```python test
save({"theme": "dark", "language": "en"}, "settings.json")
assert load("settings.json", {}) == {"theme": "dark", "language": "en"}
assert load("missing.json", {"theme": "light"}) == {"theme": "light"}
with open("bad.json", "w", encoding="utf-8") as f:
    f.write("{not json")
assert load("bad.json", {"x": 1}) == {"x": 1}
print("All checks passed!")
```

### Exercise 5: Appending to a log

Write a function `log(filename, message)` that appends the message as a new line to the **end** of the file and returns how many lines the file now has!

```python starter
def log(filename, message):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def log(filename, message):
    with open(filename, "a", encoding="utf-8") as f:
        f.write(message + "\n")
    with open(filename, encoding="utf-8") as f:
        return sum(1 for _ in f)
```

</details>

```python test
import os
if os.path.exists("app.log"):
    os.remove("app.log")
assert log("app.log", "start") == 1
assert log("app.log", "login") == 2
with open("app.log", encoding="utf-8") as f:
    assert f.read() == "start\nlogin\n"
print("All checks passed!")
```

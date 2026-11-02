---
title: File Errors and Handling Them
summary: FileNotFoundError, PermissionError, encoding errors, invalid content – and handling paths safely with pathlib.
minutes: 15
---

## What you will learn

- what **errors** can happen when working with files,
- how to **handle** them with exceptions,
- how to handle **paths** in a platform-independent way (`pathlib`),
- how to write a file **safely**.

## Typical file errors

| Exception              | When                                                                   |
| ---------------------- | ---------------------------------------------------------------------- |
| `FileNotFoundError`    | the file opened for reading doesn't exist, or the folder doesn't exist |
| `PermissionError`      | no permission (read-only, system file, locked by another program)      |
| `IsADirectoryError`    | trying to open a folder instead of a file                              |
| `FileExistsError`      | opening an existing file with mode `"x"`                               |
| `UnicodeDecodeError`   | the file isn't in the given encoding                                   |
| `ValueError`           | the content is invalid (e.g. text instead of a number on a line)       |
| `json.JSONDecodeError` | invalid JSON (a subclass of `ValueError`)                              |

All of them (except content errors) are subclasses of **`OSError`**.

## Handling a missing file

```python run
def read(filename):
    try:
        with open(filename, encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        print(f"Not found: {filename}")
        return None
    except PermissionError:
        print(f"No permission: {filename}")
        return None

print(read("does_not_exist.txt"))
```

## Handling invalid content

A file can exist and be readable but have invalid **content**. It's worth handling line by line, so one bad line doesn't ruin everything.

```python run
with open("measurements.txt", "w", encoding="utf-8") as f:
    f.write("21.5\n22.0\nerror\n\n23.4\n")

values = []
with open("measurements.txt", encoding="utf-8") as f:
    for number, line in enumerate(f, start=1):
        line = line.strip()
        if not line:
            continue                     # skip empty lines
        try:
            values.append(float(line))
        except ValueError:
            print(f"Line {number} is invalid, skipped: {line!r}")

print("Average:", sum(values) / len(values))
```

## Encoding errors

```python run
# Write with Latin-2 (ISO-8859-2) encoding, then try to read it as UTF-8.
with open("old.txt", "w", encoding="iso-8859-2") as f:
    f.write("Árvíztűrő")

try:
    with open("old.txt", encoding="utf-8") as f:
        print(f.read())
except UnicodeDecodeError as error:
    print("Encoding error:", error.reason)
    with open("old.txt", encoding="iso-8859-2") as f:   # with the right encoding it works
        print(f.read())
```

## Paths: pathlib

Don't build file paths by joining strings (`"folder" + "/" + "file.txt"`), because the separator is `\` on Windows and `/` on Linux and macOS. The `pathlib` module handles this automatically.

```python run
from pathlib import Path

folder = Path("data")
folder.mkdir(exist_ok=True)                 # creates it if it doesn't exist yet
file = folder / "result.txt"                # the / operator joins the path

file.write_text("42\n", encoding="utf-8")   # quick write
print(file.read_text(encoding="utf-8"))     # quick read
print(file.exists(), file.name, file.suffix, file.stem)
print([p.name for p in folder.glob("*.txt")])   # listing files by pattern
```

| Operation            | `pathlib`                                 |
| -------------------- | ----------------------------------------- |
| does it exist        | `p.exists()`, `p.is_file()`, `p.is_dir()` |
| create a folder      | `p.mkdir(parents=True, exist_ok=True)`    |
| file name, extension | `p.name`, `p.suffix`, `p.stem`            |
| parent folder        | `p.parent`                                |
| delete               | `p.unlink(missing_ok=True)`               |
| listing              | `p.iterdir()`, `p.glob("*.csv")`          |

## Safe writing

If an error happens while writing (power cut, full disk), a half-written file can destroy the previous data. A proven pattern: write to a **temporary file**, and if it succeeded, **replace** the original with it.

```python run
from pathlib import Path

def safe_save(path, content):
    path = Path(path)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(content, encoding="utf-8")
    temporary.replace(path)              # replaces the original in one step

safe_save("state.json", '{"level": 3}')
print(Path("state.json").read_text(encoding="utf-8"))
```

## Summary

- Common errors: `FileNotFoundError`, `PermissionError`, `UnicodeDecodeError`, invalid content (`ValueError`).
- Catch specific exceptions and handle invalid content line by line.
- Use `pathlib` for paths: `Path("folder") / "file.txt"`.
- Save important data via a temporary file.

## Lesson exercise: Reading numbers fault-tolerantly

Write a `read_numbers(filename)` function that reads a file containing one integer per line and returns a `(numbers, bad_lines)` pair:

- `numbers`: the list of integers from the correct lines,
- `bad_lines`: the line numbers (from 1) of the lines that don't contain an integer (empty lines are not bad, they are simply skipped).

If the file doesn't exist (`FileNotFoundError`), the function must not stop with an error but return `([], [])`. Handle the file with the `pathlib` module's `Path` class (`Path(filename).read_text(encoding="utf-8")`).

```python starter required
from pathlib import Path


def read_numbers(filename):
    numbers, bad_lines = [], []
    # try: Path(...).read_text(...)  except FileNotFoundError: ...
    return numbers, bad_lines


Path("data.txt").write_text("4\nseven\n\n10\n", encoding="utf-8")
print(read_numbers("data.txt"))   # ([4, 10], [2])
```

<details>
<summary>Solution</summary>

```python solution
from pathlib import Path


def read_numbers(filename):
    numbers, bad_lines = [], []
    try:
        text = Path(filename).read_text(encoding="utf-8")
    except FileNotFoundError:
        return [], []
    for line_no, line in enumerate(text.splitlines(), start=1):
        line = line.strip()
        if not line:
            continue
        try:
            numbers.append(int(line))
        except ValueError:
            bad_lines.append(line_no)
    return numbers, bad_lines


Path("data.txt").write_text("4\nseven\n\n10\n", encoding="utf-8")
print(read_numbers("data.txt"))   # ([4, 10], [2])
```

</details>

```python test
from pathlib import Path
Path("c1.txt").write_text("4\nseven\n\n10\n2.5\n-3\n", encoding="utf-8")
assert read_numbers("c1.txt") == ([4, 10, -3], [2, 5]), "Numbers: [4, 10, -3]; bad lines: 2 (text) and 5 (not an integer)."
assert read_numbers("no_such_file.txt") == ([], []), "A missing file gives ([], [])."
Path("c2.txt").write_text("", encoding="utf-8")
assert read_numbers("c2.txt") == ([], []), "An empty file gives ([], [])."
```

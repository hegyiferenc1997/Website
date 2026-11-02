---
title: File Operations
summary: Opening, reading, writing, closing – open modes, character encoding and the with statement.
minutes: 18
---

## What you will learn

- the steps of file handling: **open, read/write, close**,
- the **open modes** (`r`, `w`, `a`, `x`, `b`),
- why **character encoding** (`utf-8`) matters,
- why we use the `with` statement.

## Why files?

Variables live in **memory** and are lost when the program ends. To keep data (settings, results, logs) it must be written to a **file**, which stays on storage (SSD, hard disk).

## The steps

```python run
# 1. open for writing
f = open("notes.txt", "w", encoding="utf-8")
# 2. write
f.write("First line\n")
f.write("Second line\n")
# 3. close – without this, part of the data may stay in the buffer!
f.close()

# 1. open for reading, 2. read, 3. close
f = open("notes.txt", "r", encoding="utf-8")
content = f.read()
f.close()
print(content)
```

## The with statement

At the end of a `with` block the file is **closed automatically** – even if an exception happened. Always use it!

```python run
with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("apple\npear\nplum\n")
# the file is already closed here

with open("notes.txt", encoding="utf-8") as f:
    print(f.read())
```

## Open modes

| Mode                        | Meaning                   | If it doesn't exist | If it exists                 |
| --------------------------- | ------------------------- | ------------------- | ---------------------------- |
| `"r"`                       | read (default)            | `FileNotFoundError` | reads it                     |
| `"w"`                       | write                     | creates it          | **empties** it (overwrites)! |
| `"a"`                       | append to the end         | creates it          | writes at the end            |
| `"x"`                       | exclusive creation        | creates it          | `FileExistsError`            |
| `"r+"`                      | read and write            | `FileNotFoundError` | reads/writes it              |
| `"b"` (e.g. `"rb"`, `"wb"`) | binary mode (images, zip) |                     |                              |

```python run
with open("log.txt", "w", encoding="utf-8") as f:
    f.write("entry 1\n")

with open("log.txt", "a", encoding="utf-8") as f:   # append: the old content stays
    f.write("entry 2\n")

with open("log.txt", encoding="utf-8") as f:
    print(f.read())
```

## Ways of reading

```python run
with open("fruit.txt", "w", encoding="utf-8") as f:
    f.write("apple\npear\nplum\n")

with open("fruit.txt", encoding="utf-8") as f:
    print(repr(f.read()))           # the whole file as one string

with open("fruit.txt", encoding="utf-8") as f:
    print(f.readline().strip())     # one line
    print(f.readlines())            # the remaining lines as a list

# The best way: iterate line by line – it doesn't load a big file into memory.
with open("fruit.txt", encoding="utf-8") as f:
    for number, line in enumerate(f, start=1):
        print(number, line.rstrip("\n"))
```

> Lines read from a file end with a `\n` line break. `strip()` or `rstrip("\n")` removes it.

## Ways of writing

```python run
lines = ["first", "second", "third"]
with open("out.txt", "w", encoding="utf-8") as f:
    for s in lines:
        f.write(s + "\n")               # write doesn't add a line break by itself!
    f.writelines(["fourth\n", "fifth\n"])
    print("sixth", file=f)              # print can write to a file too

with open("out.txt", encoding="utf-8") as f:
    print(f.read())
```

## Character encoding

A file stores bytes; the **encoding** says which byte sequence is which character. Because of accented letters **always pass** `encoding="utf-8"`! Without it, on Windows an old local encoding (e.g. cp1250) may be the default, and characters like "ő" or "ű" can break on another machine.

```python run
text = "Árvíztűrő tükörfúrógép"
print(text.encode("utf-8"))         # bytes in UTF-8
print(len(text), len(text.encode("utf-8")))   # 22 characters, but more bytes
```

## Binary files

Images, audio and compressed files are handled in **binary mode**; we read and write `bytes` data, without encoding.

```python run
with open("data.bin", "wb") as f:
    f.write(bytes([0, 1, 2, 255]))

with open("data.bin", "rb") as f:
    data = f.read()
print(data, list(data))
```

## Summary

- Steps: **open → read/write → close**; `with` closes automatically.
- Modes: `r` read, `w` overwrite, `a` append, `x` new file, `b` binary.
- Read line by line: `for line in f:`; write: `write()` (add line breaks yourself), `print(..., file=f)`.
- For text files always use `encoding="utf-8"`.

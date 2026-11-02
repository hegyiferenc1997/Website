---
title: Input and Output Streams
summary: The concept of streams, stdin, stdout, stderr, redirection, buffering and command-line arguments.
minutes: 15
---

## What you will learn

- what a **stream** is,
- the three standard streams: **stdin**, **stdout**, **stderr**,
- how to **redirect** input and output,
- what **buffering** is and how to get **command-line arguments**.

## What is a stream?

A **stream** is a sequence of data read or written in order – we don't need to know where it comes from or goes to. An open file, the keyboard, the screen or a network connection can all be handled the same way: they have `read()` and `write()` operations.

## The three standard streams

Every program gets three streams from the operating system:

| Stream          | Python       | By default | Purpose                  |
| --------------- | ------------ | ---------- | ------------------------ |
| standard input  | `sys.stdin`  | keyboard   | reading data (`input()`) |
| standard output | `sys.stdout` | screen     | results (`print()`)      |
| standard error  | `sys.stderr` | screen     | error messages, warnings |

```python run
import sys

sys.stdout.write("This goes to standard output.\n")
print("print writes here too.", file=sys.stdout)
```

```python
import sys
print("Error: missing file!", file=sys.stderr)   # error message on a separate channel
```

Why a separate error output? If the program's results are redirected to a file, error messages still appear on screen and don't get mixed into the data.

## Redirection in the terminal

```bash
python program.py > result.txt          # stdout goes to a file
python program.py >> result.txt         # append
python program.py < input.txt           # stdin comes from a file
python program.py 2> errors.txt         # stderr goes to a file
python generate.py | python compute.py  # "pipe": one's output is the other's input
```

The **pipe** is the basis of the Unix philosophy: small programs processing each other's output.

## Reading from standard input

`input()` reads one line. With lots of data (e.g. in programming contests) `sys.stdin` can be iterated directly:

```python
import sys

total = 0
for line in sys.stdin:         # reads until the input ends (end of file / Ctrl+D, Ctrl+Z on Windows)
    total += int(line)
print(total)
```

## A text stream in memory

`io.StringIO` is a "file" in memory: it can be written and read just like a real file. Very useful for testing.

```python run
import io

buffer = io.StringIO()
print("first line", file=buffer)
print("second line", file=buffer)
print(repr(buffer.getvalue()))

data = io.StringIO("3\n4\n5\n")
print(sum(int(line) for line in data))   # 12
```

## Buffering

Writes don't go to disk or screen immediately: the system collects them in a **buffer** and writes them out in bigger chunks, because that's much faster. The buffer is flushed when it fills up, when the file is closed, or when we ask:

```python run
import time

for i in range(3):
    print(i, end=" ", flush=True)   # flush=True: show it immediately
    time.sleep(0.1)
print()
```

That's why closing a file (or `with`) matters: without it the buffer's content may be lost.

## Command-line arguments

Words given when starting the program end up in the `sys.argv` list. Element 0 is the program's name.

```python
# filestat.py – usage: python filestat.py data.txt
import sys

if len(sys.argv) < 2:
    print("Usage: python filestat.py FILENAME", file=sys.stderr)
    sys.exit(1)                     # non-zero exit code = error

with open(sys.argv[1], encoding="utf-8") as f:
    print("Number of lines:", sum(1 for _ in f))
```

For more complex options use the `argparse` module (flags, help, defaults).

## Summary

- A stream is data read/written in order; files, keyboard and screen are handled alike.
- `stdin` – input, `stdout` – results, `stderr` – errors; they can be redirected in the terminal (`>`, `<`, `2>`, `|`).
- Writing is buffered: close or `flush` is needed.
- Command-line arguments: `sys.argv`; exit code: `sys.exit(code)`.

## Lesson exercise: Summing numbers from a stream

Write a `total(stream)` function that receives a **text stream** (anything you can iterate line by line: an open file, `sys.stdin` or `io.StringIO`) and returns the sum of the numbers in it.

- There is one number per line; skip empty lines and comment lines starting with `#`.
- Trim the spaces at the start and end of each line.

This way the same function works with a file and with data coming from the keyboard – that's the point of the stream concept.

```python starter required
import io


def total(stream):
    result = 0
    for line in stream:
        pass
    return result


print(total(io.StringIO("10\n# comment\n\n2.5\n")))   # 12.5
```

<details>
<summary>Solution</summary>

```python solution
import io


def total(stream):
    result = 0
    for line in stream:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        result += float(line)
    return result


print(total(io.StringIO("10\n# comment\n\n2.5\n")))   # 12.5
```

</details>

```python test
import io
assert total(io.StringIO("10\n# comment\n\n2.5\n")) == 12.5, "10 + 2.5 = 12.5 (the comment and the empty line are skipped)"
assert total(io.StringIO("")) == 0, "An empty stream gives 0."
assert total(io.StringIO("  -1 \n  3\n")) == 2, "Spaces must be trimmed."
with open("numbers.txt", "w", encoding="utf-8") as f:
    f.write("1\n2\n3\n")
with open("numbers.txt", encoding="utf-8") as f:
    assert total(f) == 6, "It must work with an open file too."
```

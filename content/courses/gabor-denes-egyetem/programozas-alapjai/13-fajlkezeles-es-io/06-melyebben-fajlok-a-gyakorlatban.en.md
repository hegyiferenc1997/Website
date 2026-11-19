---
title: Deeper – Files in Practice
summary: Text and binary files, encoding and byte size, why split(",") isn't right for CSV and what the csv module can do, saving nested data to JSON, processing big files line by line, and safe (atomic) saving – with runnable programs and a programming exercise.
minutes: 50
---

## What you will learn in this lesson

- the difference between a **text** and a **binary** file, and why the **encoding** matters,
- why `split(",")` gives wrong results on a real CSV file, and how the `csv` module handles it,
- how to save and load **nested** data in JSON,
- how to process **big** files with little memory, and how to save **safely**.

## 1. Text, bytes, encoding

In the basic lesson we saw how to open, read and write a file. Underneath, a file is always a sequence of **bytes**; in text mode (`"r"`, `"w"`) Python converts the bytes to characters with the given **encoding**:

```python run
# Writing and reading in text and binary mode, and the effect of encoding on file size
import os

text = "Árvíztűrő tükörfúrógép\n"
for encoding in ["utf-8", "utf-16", "cp1250"]:
    with open(f"sample_{encoding}.txt", "w", encoding=encoding) as f:
        f.write(text)
    print(f"{encoding:>7}: {os.path.getsize(f'sample_{encoding}.txt'):>3} bytes")

with open("sample_utf-8.txt", "rb") as f:          # binary mode: we get the raw bytes
    print("first 8 bytes:", f.read(8))

# read with the wrong encoding:
with open("sample_cp1250.txt", encoding="utf-8", errors="replace") as f:
    print("cp1250 read as utf-8:", f.read().strip())
```

The same 23-character text (including the line break) becomes a file of three different sizes with three encodings. The old Windows Central European encoding (cp1250) uses one byte per letter, but only knows Central European letters; UTF-8 can handle every letter of every language. If we read with the wrong encoding, "�" replacement characters signal the trouble. **Always specify** the `encoding="utf-8"` parameter – otherwise the machine's default decides, which can differ between Windows and Linux.

## 2. CSV: why isn't split enough?

CSV (comma-separated values) looks simple, but a field can contain a comma too – then the field is put between quotes. `split(",")` doesn't understand this, the `csv` module does:

```python run
# Reading CSV: split(",") breaks the quoted field, the csv module doesn't
import csv

with open("products.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "price", "description"])
    writer.writerow(["pen", 250, "blue"])
    writer.writerow(["notebook", 690, "A4, squared, 80 pages"])   # commas in the field!

with open("products.csv", encoding="utf-8") as f:
    print("the file's contents:")
    print(f.read())

with open("products.csv", encoding="utf-8") as f:
    for line in f:
        print("split:  ", line.strip().split(","))

with open("products.csv", encoding="utf-8", newline="") as f:
    for record in csv.DictReader(f):               # every row a dictionary based on the header
        print("csv:    ", record)
```

`csv.writer` automatically quoted the field with commas, and `DictReader` correctly split it into three fields – and straight away gave a dictionary based on the header. `split` cut the line into five pieces. The `newline=""` parameter is the `csv` module's request: this way it handles line breaks itself, and no empty rows appear on Windows.

## 3. JSON: nested data

CSV is good for tabular data; if the data is **nested** (lists in a dictionary, dictionaries in a list), JSON is the usual format. Most web APIs and settings files are JSON too:

```python run
# Saving nested data to JSON and loading it back
import json

timetable = {
    "student": "Anna Kiss",
    "semester": 1,
    "courses": [
        {"name": "Mathematics", "credits": 6, "days": ["Monday", "Wednesday"]},
        {"name": "Programming Basics", "credits": 8, "days": ["Tuesday"]},
    ],
}

with open("timetable.json", "w", encoding="utf-8") as f:
    json.dump(timetable, f, ensure_ascii=False, indent=2)   # readable output, keeps accents

with open("timetable.json", encoding="utf-8") as f:
    loaded = json.load(f)

print(open("timetable.json", encoding="utf-8").read()[:120], "...")
print("loaded back the same?", loaded == timetable)
print("total credits:", sum(c["credits"] for c in loaded["courses"]))
print("with ensure_ascii=True:", json.dumps("Árvíztűrő"))
```

`ensure_ascii=False` keeps accented letters (by default it escapes them as `Á`), and `indent=2` writes it out readably with indentation. Careful: JSON doesn't know every Python type – a tuple becomes a list, and a set or a date you have to convert to a string or list yourself.

## 4. Big files and safe saving

It's not worth reading a multi-gigabyte log file in one go (`f.read()`): memory may run out. A file object can also be iterated **line by line**, so only one line is in memory at a time. When saving, the danger is that the program is interrupted while writing, and the old file is lost too – so we first write to a temporary file, and only **replace** the original at the end:

```python run
# Processing a big file line by line with a generator, and atomic saving with os.replace
import os

with open("log.txt", "w", encoding="utf-8") as f:             # creating a "big" log file
    for i in range(10_000):
        level = "ERROR" if i % 97 == 0 else "INFO"
        f.write(f"{i} {level} request processed\n")

def error_lines(filename):
    with open(filename, encoding="utf-8") as f:
        for line in f:                                        # only one line in memory at a time
            if " ERROR " in line:
                yield line.split()[0]

errors = list(error_lines("log.txt"))
print(f"{len(errors)} error lines, the first five: {errors[:5]}")

def safe_save(filename, content):
    temp = filename + ".tmp"
    with open(temp, "w", encoding="utf-8") as f:
        f.write(content)
        f.flush()
        os.fsync(f.fileno())                                  # make sure it really reaches the disk
    os.replace(temp, filename)                                # replaces it in a single step

safe_save("summary.txt", f"number of errors: {len(errors)}\n")
print(open("summary.txt", encoding="utf-8").read().strip())
```

`os.replace` is **atomic** at the operating system level: either the old or the new file is there, never a half-written one. Text editors and databases protect data against power cuts or crashes with this trick too.

| Viewpoint      | What do they watch for in file handling?                                                           |
| -------------- | -------------------------------------------------------------------------------------------------- |
| **programmer** | always `with` and `encoding`; the `csv` module for CSV, `json` for nested data                     |
| **user**       | the saved file shouldn't get corrupted, and should open well in other programs (Excel, editor) too |
| **operator**   | big files line by line; the disk shouldn't fill up with temporary files                            |
| **security**   | a filename received from the user mustn't let anyone escape the folder (`../../etc`)               |

## Summary

- A file is a sequence of bytes; in text mode always specify the encoding (`encoding="utf-8"`).
- Use the `csv` module for CSV: it handles quoted fields with commas too.
- JSON is the usual format for nested data; `ensure_ascii=False` and `indent` for readability.
- Process a big file line by line; when saving, a temporary file + `os.replace` protects the data.

## Lesson exercise: totals per category from a CSV

Write the `category_totals(filename)` function, which reads a UTF-8 encoded CSV file whose header is `category,amount`, and returns a dictionary: category → the sum of its amounts (integer)! Use `csv.DictReader` – a category name may contain a comma too (between quotes).

```python starter required
import csv


def category_totals(filename):
    result = {}
    # open the file (encoding="utf-8", newline=""), and read it with DictReader
    return result


with open("expenses.csv", "w", encoding="utf-8", newline="") as f:
    f.write("category,amount\nfood,3000\ntravel,1500\nfood,2500\n")
print(category_totals("expenses.csv"))
```

<details>
<summary>Solution</summary>

```python solution
import csv


def category_totals(filename):
    result = {}
    with open(filename, encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            cat = row["category"]
            result[cat] = result.get(cat, 0) + int(row["amount"])
    return result


with open("expenses.csv", "w", encoding="utf-8", newline="") as f:
    f.write("category,amount\nfood,3000\ntravel,1500\nfood,2500\n")
print(category_totals("expenses.csv"))
```

</details>

```python test
with open("test1.csv", "w", encoding="utf-8", newline="") as f:
    f.write("category,amount\nfood,3000\ntravel,1500\nfood,2500\n")
assert category_totals("test1.csv") == {"food": 5500, "travel": 1500}, "added up per category"
with open("test2.csv", "w", encoding="utf-8", newline="") as f:
    f.write('category,amount\n"books, notes",4000\ncinema,2000\n"books, notes",1000\n')
assert category_totals("test2.csv") == {"books, notes": 5000, "cinema": 2000}, "the quoted category with a comma is one field"
with open("test3.csv", "w", encoding="utf-8", newline="") as f:
    f.write("category,amount\n")
assert category_totals("test3.csv") == {}, "an empty dictionary when there's only a header"
```

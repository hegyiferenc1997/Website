---
title: CSV and JSON Files
summary: Reading and writing tabular data (CSV) and structured data (JSON) with the built-in modules.
minutes: 15
---

## What you will learn

- what the **CSV** and **JSON** formats are,
- how to read and write them with the `csv` and `json` modules,
- when to use which.

## CSV – comma-separated values

**CSV** (_Comma-Separated Values_) is a simple text table: one record per line, with fields separated by a delimiter (comma or semicolon). Excel can open it.

```text
name,student_id,score
Anna Kiss,ABC123,92
Bela Nagy,XYZ789,61
```

### Writing CSV

```python run
import csv

students = [
    ["name", "student_id", "score"],
    ["Anna Kiss", "ABC123", 92],
    ["Bela Nagy", "XYZ789", 61],
    ["Szabo, Csilla", "QWE456", 78],     # comma in the name: the csv module adds quotes
]
with open("students.csv", "w", newline="", encoding="utf-8") as f:
    csv.writer(f).writerows(students)

print(open("students.csv", encoding="utf-8").read())
```

> When writing CSV pass `newline=""`, otherwise empty lines may appear between rows on Windows.

### Reading CSV

```python run
import csv

# A small sample file so the example runs on its own.
with open("students.csv", "w", newline="", encoding="utf-8") as f:
    f.write('name,student_id,score\nAnna Kiss,ABC123,92\n"Szabo, Csilla",QWE456,78\n')

with open("students.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)          # the first row is the header → each row becomes a dict
    for row in reader:
        print(row["name"], int(row["score"]))   # every value comes as text!
```

Why not `split(",")`? Because fields can contain commas or quotes (e.g. `"Szabo, Csilla"`), which the `csv` module handles correctly.

## JSON – structured data

**JSON** (_JavaScript Object Notation_) describes nested data (objects, lists) as readable text. It is the standard format of web APIs and configuration files.

| JSON            | Python          |
| --------------- | --------------- |
| object `{}`     | `dict`          |
| array `[]`      | `list`          |
| string `"..."`  | `str`           |
| number          | `int`, `float`  |
| `true`, `false` | `True`, `False` |
| `null`          | `None`          |

### Writing and reading JSON

```python run
import json

course = {
    "name": "Programming Fundamentals",
    "credits": 8,
    "active": True,
    "students": [{"name": "Anna", "score": 92}, {"name": "Bela", "score": 61}],
}

with open("course.json", "w", encoding="utf-8") as f:
    json.dump(course, f, ensure_ascii=False, indent=2)   # keep accents, pretty indentation

with open("course.json", encoding="utf-8") as f:
    loaded = json.load(f)

print(loaded["students"][0]["name"])
print(loaded == course)   # True – the same data
```

### Text ↔ JSON

```python run
import json

text = '{"temperature": 21.5, "sunny": true, "city": null}'
data = json.loads(text)        # Python object from text
print(data, type(data))
print(json.dumps(data))        # text from a Python object
```

## CSV or JSON?

| Aspect      | CSV                       | JSON                                |
| ----------- | ------------------------- | ----------------------------------- |
| structure   | flat table                | nested                              |
| types       | everything is text        | number, boolean, null, list, object |
| opened with | Excel, spreadsheets       | text editor, browser                |
| typical use | data export, measurements | APIs, settings, saved state         |

## Summary

- **CSV**: a table, one row per line; `csv.writer` / `csv.DictReader`, `newline=""`.
- **JSON**: nested data; `json.dump` / `json.load` for files, `dumps` / `loads` for text.
- Don't split by hand with `split(",")` – use the modules.

## Lesson exercise: From CSV to JSON

Write a `csv_to_json(csv_file, json_file)` function that reads a CSV file with a `name,score` header (with the `csv` module's `DictReader`) and writes a JSON file (with the `json` module) containing the list of students in **descending order of score**, like this:

```json
[{"name": "Cecil", "score": 92}, {"name": "Anna", "score": 87}]
```

- The score must be an integer in the JSON (not text).
- Accented letters must stay readable (`ensure_ascii=False`); handle the files with UTF-8 encoding.
- The function returns how many students it wrote.

```python starter required
import csv
import json


def csv_to_json(csv_file, json_file):
    with open(csv_file, encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    # convert, sort, json.dump(...)
    pass


with open("scores.csv", "w", encoding="utf-8") as f:
    f.write("name,score\nAnna,87\nCecil,92\n")
print(csv_to_json("scores.csv", "scores.json"))
print(open("scores.json", encoding="utf-8").read())
```

<details>
<summary>Solution</summary>

```python solution
import csv
import json


def csv_to_json(csv_file, json_file):
    with open(csv_file, encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    students = [{"name": r["name"], "score": int(r["score"])} for r in rows]
    students.sort(key=lambda s: s["score"], reverse=True)
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(students, f, ensure_ascii=False)
    return len(students)


with open("scores.csv", "w", encoding="utf-8") as f:
    f.write("name,score\nAnna,87\nCecil,92\n")
print(csv_to_json("scores.csv", "scores.json"))
print(open("scores.json", encoding="utf-8").read())
```

</details>

```python test
import json
with open("in.csv", "w", encoding="utf-8") as f:
    f.write("name,score\nAnna,87\nBéla,64\nCecil,92\n")
assert csv_to_json("in.csv", "out.json") == 3, "Three students must be written (and that is returned)."
with open("out.json", encoding="utf-8") as f:
    text = f.read()
data = json.loads(text)
assert data == [{"name": "Cecil", "score": 92}, {"name": "Anna", "score": 87}, {"name": "Béla", "score": 64}], "The JSON content is not right (descending order, integer scores)."
assert "Béla" in text, "Accented letters must stay readable (ensure_ascii=False)."
```

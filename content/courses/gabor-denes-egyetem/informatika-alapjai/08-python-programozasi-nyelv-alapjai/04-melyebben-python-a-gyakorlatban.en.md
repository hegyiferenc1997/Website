---
title: Deeper – Python in Practice
summary: Dictionaries and word frequency, text processing with string methods, safe input handling with try–except, list comprehensions and a small grade-analysis program – with several solutions, the steps of debugging and a required programming exercise.
minutes: 50
---

## What you will learn in this lesson

- what a **dictionary** (`dict`) is for, and how to count frequencies with it,
- how to process **text** with the built-in methods,
- how to handle a user's invalid input **safely**,
- how to write the same thing shorter with a **list comprehension**, and how to find bugs.

## 1. Dictionaries: key → value

A list stores by position (`items[0]`), a **dictionary** by key: `grades["Anna"]`. That's useful when we assign values to names, codes or words. The most common task: **counting** how many of each there are.

```python run
# Dictionary: word frequency in two ways
text = "python is a language python is easy and python is popular"

# 1) by hand: if the key isn't there yet, start from 0
freq = {}
for word in text.split():
    freq[word] = freq.get(word, 0) + 1
print(freq)

# 2) the built-in Counter does the same, and can sort too
from collections import Counter
print(Counter(text.split()).most_common(3))

# iterating over a dictionary: key and value together
prices = {"coffee": 450, "tea": 380, "cocoa": 520}
for drink, price in prices.items():
    print(f"{drink}: {price} Ft")
print("is there tea?", "tea" in prices)
```

`get(key, default)` doesn't raise an error if the key is missing – but `dictionary[key]` raises a `KeyError`. Looking up in a dictionary (`in`) is **fast**, however big the dictionary is (a hash table, see topic 2).

## 2. Text processing

Users' data is rarely "clean": extra spaces, mixed upper and lower case, different separators. String methods tidy these up:

```python run
# Cleaning and processing text with string methods
raw = "   Kiss ANNA ;  kiss.anna@example.com ;  Computer Engineering  "
parts = [p.strip() for p in raw.split(";")]          # splitting + trimming spaces
name, email, major = parts
print(name.title())                                  # Kiss Anna
print(email.lower(), "– looks valid" if "@" in email and "." in email.split("@")[-1] else "– invalid")
print(major.upper(), len(major), "characters")
print(major.startswith("Computer"), major.replace("Engineering", "Science"))

# f-string formatting: alignment and decimals
for product, price in [("pendrive", 3490), ("mouse", 5990.5)]:
    print(f"{product:<10}|{price:>10.2f} Ft")
```

## 3. Handling invalid input: try–except

If your program asks the user for a number and they type "five", `int("five")` raises an error and the program stops. A `try–except` block catches it, and we ask again politely. The in-browser runner can't ask interactively, so here we "read" the inputs from a list:

```python run
# Safe number input: catch invalid input and ask again
inputs = iter(["five", "", "-3", "4"])             # as if the user typed these

def ask_grade():
    while True:
        text = next(inputs)
        try:
            grade = int(text)
        except ValueError:
            print(f"  '{text}' isn't a whole number, try again")
            continue
        if 1 <= grade <= 5:
            return grade
        print(f"  {grade} isn't between 1 and 5, try again")

print("the grade read:", ask_grade())
```

Two **viewpoints**: for the user, friendly re-asking matters; for **security**, what matters is that the program never trusts input – every piece of data must be checked (type, range) before use. This rule holds just the same for a web form or an API.

## 4. List comprehensions and a small analysis program

A list comprehension is a short way to build one list from another: `[expression for item in items if condition]`. The same task in two versions:

```python run
# The same with a loop and with a list comprehension
numbers = [3, 8, 1, 6, 10, 5]

even_squares = []
for x in numbers:
    if x % 2 == 0:
        even_squares.append(x * x)
print("with a loop:              ", even_squares)
print("with a list comprehension:", [x * x for x in numbers if x % 2 == 0])
```

Now let's put together what we've learned: a small program that makes statistics from a group's grades – with a dictionary, functions and comprehensions:

```python run
# Small grade analyser: dictionary + functions + comprehensions
grades = {"Anna": [5, 4, 5], "Bence": [2, 3, 1], "Csilla": [4, 4, 3], "Dani": [1, 2, 2]}

def average(items):
    return sum(items) / len(items) if items else 0

averages = {name: round(average(g), 2) for name, g in grades.items()}   # dict comprehension
print("averages:", averages)
print("best:", max(averages, key=averages.get))
print("below 3.0:", sorted(name for name, a in averages.items() if a < 3))
all_grades = [g for items in grades.values() for g in items]           # "flattened" list
print("grade distribution:", {g: all_grades.count(g) for g in range(1, 6)})
```

## 5. Debugging step by step

If the program gives a wrong result, don't guess – follow these steps:

1. **Read the error message from the bottom up**: the last line tells the error type (`TypeError`, `KeyError`…), above it the line number where it happened.
2. **Narrow it down**: what's the smallest input that's still wrong?
3. **Print** intermediate values (`print(f"{x=}")` – the `=` prints the variable's name too), or use the VS Code debugger with breakpoints.
4. **Write a test** (`assert`) that shows the bug, and only then fix it – that way you can be sure the fix really helped.

```python run
# The {x=} print for debugging: the variable's name and value together
items = [4, 8, 15]
total = sum(items)
print(f"{items=} {total=} {len(items)=}")
```

## Summary

- A dictionary stores by key; `get(key, 0)` and `Counter` are for counting frequencies, and lookup in it is fast.
- `strip`, `split`, `lower`, `title`, `replace` and f-strings are the basic tools of text processing.
- Always check user input; `try–except` catches the error and you can ask again.
- A list comprehension is a shorter notation; when debugging, read the error message, narrow down, print, and write a test.

## Exercise: letter frequency

Write the function `letter_frequency(text)`, which returns in a dictionary how many times each **letter** occurs in the text! Upper and lower case shouldn't matter (convert to lowercase), and only count letters (spaces, punctuation and digits stay out – `c.isalpha()` helps with this).

```python starter required
def letter_frequency(text):
    freq = {}
    # go through the characters of the text (lowercased),
    # and if the character is a letter, increase its counter
    return freq


print(letter_frequency("Alma, alma!"))
```

<details>
<summary>Solution</summary>

```python solution
def letter_frequency(text):
    freq = {}
    for c in text.lower():
        if c.isalpha():
            freq[c] = freq.get(c, 0) + 1
    return freq


print(letter_frequency("Alma, alma!"))
```

</details>

```python test
assert letter_frequency("Alma, alma!") == {"a": 4, "l": 2, "m": 2}, "case shouldn't matter, punctuation stays out"
assert letter_frequency("") == {}, "an empty text gives an empty dictionary"
assert letter_frequency("Év 2026") == {"é": 1, "v": 1}, "digits and spaces aren't letters"
```

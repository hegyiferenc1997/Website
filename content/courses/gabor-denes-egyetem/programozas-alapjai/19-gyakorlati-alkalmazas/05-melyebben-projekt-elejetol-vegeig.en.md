---
title: Deeper – A Project from Start to Finish
summary: Building a small library lending system step by step – from requirements to a data model with dataclasses, business rules and validation with exceptions, date handling and late fees, saving and loading with JSON, and finally a report and automatic checks. Almost every topic of the course in a single program.
minutes: 60
---

## What you will learn in this lesson

- how **requirements** become a data model (classes, fields),
- how to write **business rules** so that a bad operation can't corrupt the data,
- how to compute with **dates** (due date, lateness),
- how to **save** and load the state, and how to **check** automatically that everything works.

## 1. From requirements to a data model

In the basic lessons we saw the steps of problem solving and two mini projects. Now we build a slightly bigger one, and almost every topic of the course comes up along the way. The client's (a university library's) requests:

1. Books are recorded by ID, title and author.
2. A student can borrow at most 3 books at a time, for 14 days.
3. For a late return there's a fee of 100 HUF a day, at most 3000 HUF per book.
4. A report is needed on the books out and the books overdue.

Its nouns become **classes** (book, loan), its properties **fields**. A `dataclass` writes the constructor and the printout for us:

```python run
# Data model with dataclasses: the nouns of the requirements become classes, the properties fields
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Optional

LOAN_DAYS = 14
MAX_BOOKS = 3

@dataclass
class Book:
    book_id: str
    title: str
    author: str

@dataclass
class Loan:
    book_id: str
    student: str
    issued: date
    returned: Optional[date] = None             # None: still out

    @property
    def due(self) -> date:
        return self.issued + timedelta(days=LOAN_DAYS)

b = Book("K1", "The Paul Street Boys", "Ferenc Molnár")
loan = Loan("K1", "anna", date(2026, 9, 1))
print(b)
print(loan, "→ due:", loan.due)
```

The constants (`LOAN_DAYS`, `MAX_BOOKS`) are in one place: if the library changes the loan period to 21 days tomorrow, a single number has to be changed. `due` is a **computed** property: we don't store it, we always compute it from the issue date, so it can't contradict it.

## 2. Business rules and validation

The system's "brain" is a class that guards the rules. Every operation **checks first**, and only modifies if everything is fine – so a bad request doesn't leave the data half-changed:

```python run
# The library class: every operation checks first, and only modifies afterwards
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Optional

LOAN_DAYS, MAX_BOOKS, DAILY_FEE, MAX_FEE = 14, 3, 100, 3000

@dataclass
class Loan:
    book_id: str
    student: str
    issued: date
    returned: Optional[date] = None

    @property
    def due(self):
        return self.issued + timedelta(days=LOAN_DAYS)

class LibraryError(Exception):
    pass

class Library:
    def __init__(self, books):
        self.books = dict(books)                  # ID → title
        self.loans = []

    def is_out(self, book_id):
        return any(l.book_id == book_id and l.returned is None for l in self.loans)

    def lend(self, student, book_id, day):
        if book_id not in self.books:
            raise LibraryError(f"no such book: {book_id}")
        if self.is_out(book_id):
            raise LibraryError(f"{book_id} is already lent out")
        has = sum(1 for l in self.loans if l.student == student and l.returned is None)
        if has >= MAX_BOOKS:
            raise LibraryError(f"{student} already has {MAX_BOOKS} books")
        self.loans.append(Loan(book_id, student, day))   # only after the checks

    def give_back(self, book_id, day):
        for l in self.loans:
            if l.book_id == book_id and l.returned is None:
                l.returned = day
                late = max(0, (day - l.due).days)
                return min(late * DAILY_FEE, MAX_FEE)
        raise LibraryError(f"{book_id} isn't lent out")

lib = Library({"K1": "The Paul Street Boys", "K2": "Eclipse of the Crescent Moon", "K3": "The Tragedy of Man", "K4": "Abigail"})
sept = lambda d: date(2026, 9, d)

operations = [
    ("lend", "anna", "K1", sept(1)), ("lend", "ben", "K1", sept(2)),
    ("lend", "anna", "K2", sept(2)), ("lend", "anna", "K3", sept(3)),
    ("lend", "anna", "K4", sept(3)), ("lend", "anna", "K9", sept(4)),
]
for name, student, book, day in operations:
    try:
        lib.lend(student, book, day)
        print(f"OK:    {student} borrowed: {book}")
    except LibraryError as e:
        print(f"ERROR: {e}")

print("K1 returned on time, fee:", lib.give_back("K1", sept(10)), "HUF")
print("K2 returned 5 days late, fee:", lib.give_back("K2", sept(21)), "HUF")
```

Notice the order in the `lend` method: three checks, and the `append` only at the very end. If any check fails, the exception means the modification never even starts. This is the **"check first, then act"** principle – database transactions guarantee the same on a larger scale.

## 3. Saving and loading

When the program closes, the state mustn't be lost. JSON doesn't know the `date` type, so when saving we convert it to text (ISO format: `2026-09-01`), and back to a date when loading:

```python run
# Saving the state to JSON and loading it back: dates are stored as ISO text
import json
from dataclasses import dataclass, asdict
from datetime import date
from typing import Optional

@dataclass
class Loan:
    book_id: str
    student: str
    issued: date
    returned: Optional[date] = None

def save(loans, filename):
    data = []
    for l in loans:
        row = asdict(l)
        row["issued"] = l.issued.isoformat()
        row["returned"] = l.returned.isoformat() if l.returned else None
        data.append(row)
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load(filename):
    with open(filename, encoding="utf-8") as f:
        data = json.load(f)
    return [Loan(r["book_id"], r["student"], date.fromisoformat(r["issued"]),
                 date.fromisoformat(r["returned"]) if r["returned"] else None) for r in data]

original = [Loan("K1", "anna", date(2026, 9, 1), date(2026, 9, 10)), Loan("K3", "ben", date(2026, 9, 3))]
save(original, "loans.json")
print(open("loans.json", encoding="utf-8").read())
print("loaded back the same?", load("loans.json") == original)
```

The last line is the most important: after the **save–load round trip** we must get the same thing. Dataclasses compare field by field with `==`, so this can be checked in a single line. It's a typical **property** worth capturing in a test.

## 4. Report and automatic checks

Finally, the report the client asked for, and a small test suite that shows after every change that the rules still hold:

```python run
# Report on the books out and overdue, plus automatic checks
from datetime import date, timedelta

LOAN_DAYS, DAILY_FEE, MAX_FEE = 14, 100, 3000
loans = [   # (book, student, issued, returned)
    ("K1", "anna", date(2026, 9, 1), date(2026, 9, 10)),
    ("K2", "anna", date(2026, 9, 2), None),
    ("K3", "ben", date(2026, 9, 20), None),
    ("K4", "cecily", date(2026, 8, 1), None),
]
today = date(2026, 10, 1)

def fee(issued, day):
    late = max(0, (day - (issued + timedelta(days=LOAN_DAYS))).days)
    return min(late * DAILY_FEE, MAX_FEE)

print(f"Report – {today}")
print(f"{'book':<6}{'student':<9}{'due':<12}{'status':<22}{'fee':>7}")
for book, student, issued, returned in loans:
    if returned is not None:
        continue                                            # only the ones out
    due = issued + timedelta(days=LOAN_DAYS)
    late = (today - due).days
    status = f"OVERDUE ({late} days)" if late > 0 else "ok"
    print(f"{book:<6}{student:<9}{due.isoformat():<12}{status:<22}{fee(issued, today):>5} HUF")

# automatic checks of the rules
assert fee(date(2026, 9, 1), date(2026, 9, 15)) == 0, "no fee yet on the due date"
assert fee(date(2026, 9, 1), date(2026, 9, 16)) == 100, "one day late is 100 HUF"
assert fee(date(2026, 1, 1), date(2026, 12, 31)) == MAX_FEE, "the fee can't exceed the maximum"
print("all checks passed ✓")
```

The report shows two books overdue – for K4 the fee has reached the 3000 HUF cap. The checks capture exactly the **edge cases** of the requirements (the due date, one day late, the cap): if someone later breaks the fee calculation, it shows up immediately.

| Viewpoint           | What do they expect from this system?                                           |
| ------------------- | ------------------------------------------------------------------------------- |
| **student**         | to see what they have and when it's due; the fee should be predictable and fair |
| **librarian**       | the program should enforce the rules, so they don't have to keep them in mind   |
| **developer**       | constants in one place, small methods, tests – the rules are easy to change     |
| **data protection** | students' loan data is personal data: stored only as long as needed, protected  |

## Summary

- The nouns of the requirements become classes, their properties fields; constants belong in one place.
- Every operation checks first and only modifies afterwards; errors are signalled with your own exception.
- The `datetime` module computes with dates; we save them to JSON as ISO text.
- The save–load round trip and the edge cases of the rules belong in automatic checks.

## Lesson exercise: late fee

Write the `late_fee(issued, returned)` function, which computes the late fee from two `date` objects according to the lesson's rules: the due date is 14 days after issue; if the book comes back on or before the due date, the fee is 0; after that every late day is 100 HUF, but at most 3000 HUF. (The difference of two dates is a `timedelta`, whose `.days` field is the number of days.)

```python starter required
from datetime import date, timedelta


def late_fee(issued, returned):
    due = issued + timedelta(days=14)
    return 0


print(late_fee(date(2026, 9, 1), date(2026, 9, 21)))
```

<details>
<summary>Solution</summary>

```python solution
from datetime import date, timedelta


def late_fee(issued, returned):
    due = issued + timedelta(days=14)
    late = max(0, (returned - due).days)
    return min(late * 100, 3000)


print(late_fee(date(2026, 9, 1), date(2026, 9, 21)))
```

</details>

```python test
from datetime import date
assert late_fee(date(2026, 9, 1), date(2026, 9, 10)) == 0, "no fee before the due date"
assert late_fee(date(2026, 9, 1), date(2026, 9, 15)) == 0, "no fee on the due date either"
assert late_fee(date(2026, 9, 1), date(2026, 9, 21)) == 600, "6 days late is 600 HUF"
assert late_fee(date(2026, 1, 1), date(2026, 6, 1)) == 3000, "at most 3000 HUF"
assert late_fee(date(2026, 12, 25), date(2027, 1, 10)) == 200, "it computes correctly across a year change"
```

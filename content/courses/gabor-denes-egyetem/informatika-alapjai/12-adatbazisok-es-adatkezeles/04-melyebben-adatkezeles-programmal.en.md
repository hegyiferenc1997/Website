---
title: Deeper – Data Management with Programs
summary: What goes wrong in a non-normalised table (update anomaly), how a JOIN works and why an index speeds it up, what an atomic transaction means for a bank transfer, and how to check a dataset's quality – with Python simulations and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- what **errors** arise when the same data is in several places (and why we normalise),
- what the database does in a **JOIN**, and why an **index** speeds things up so much,
- why a bank transfer must be **atomic**,
- how to **check** a dataset's quality before analysing it.

## 1. Why normalise? Anomalies

In the basic lesson we saw that in a good database a piece of data appears **in one place**. Let's see what happens if it doesn't! In an orders table, every row contains the customer's name and address:

```python run
# Non-normalised table: the customer's address repeats with every order
orders = [
    {"id": 1, "customer": "Kiss Anna", "address": "Győr, Fő u. 1.", "product": "mouse"},
    {"id": 2, "customer": "Kiss Anna", "address": "Győr, Fő u. 1.", "product": "keyboard"},
    {"id": 3, "customer": "Nagy Béla", "address": "Pécs, Tó u. 5.", "product": "monitor"},
]

# Anna moves – but someone only fixes one of her rows (update anomaly)
orders[0]["address"] = "Budapest, Új u. 9."
addresses = {o["address"] for o in orders if o["customer"] == "Kiss Anna"}
print("Anna's addresses:", addresses, "← which one is real?")

# delete anomaly: if we delete Béla's only order, his address is lost too
orders = [o for o in orders if o["id"] != 3]
print("do we still know Béla's address?", any(o["customer"] == "Nagy Béla" for o in orders))

# normalised: customer data in one place, the order only refers to it
customers = {1: {"name": "Kiss Anna", "address": "Budapest, Új u. 9."}, 2: {"name": "Nagy Béla", "address": "Pécs, Tó u. 5."}}
orders_n = [{"id": 1, "customer_id": 1, "product": "mouse"}, {"id": 2, "customer_id": 1, "product": "keyboard"}]
customers[1]["address"] = "Szeged, Kert u. 3."          # only one place to change
print([(o["product"], customers[o["customer_id"]]["address"]) for o in orders_n])
```

In the normalised version the address is in **one** place, so it can't contradict itself, and the customer's data survives even with no orders. The price: queries have to combine tables (**JOIN**).

## 2. What happens in a JOIN? And what does an index do?

The simplest JOIN searches through all customers for every order (**nested loop**). If the customers table has an **index** (a structure sorted by key and quick to search, like a book's index), the lookup is fast:

```python run
# JOIN with a nested loop vs. with an index (dictionary) – number of comparisons
import random

random.seed(5)
customers = [{"id": i, "name": f"customer{i}"} for i in range(1, 2001)]
orders = [{"id": j, "customer_id": random.randint(1, 2000)} for j in range(1, 501)]

# 1) nested loop: for every order we search through the customers
steps, result1 = 0, []
for o in orders:
    for c in customers:
        steps += 1
        if c["id"] == o["customer_id"]:
            result1.append((o["id"], c["name"]))
            break
print(f"without an index: {steps:,} comparisons")

# 2) index: built once (id → customer), then every lookup is one step
index = {c["id"]: c for c in customers}
result2 = [(o["id"], index[o["customer_id"]]["name"]) for o in orders]
print(f"with an index:    {len(customers)} steps to build + {len(orders)} lookups")
print("same result:", result1 == result2)
```

A lookup without an index looks through half the table on average; with a B-tree index (used by relational databases) about $\log_2 n$ steps:

```plot
title: Steps needed to find a record depending on the number of rows in the table
x: 1, 100
y: 0, 60
f: x/2 # without an index: n/2 steps on average
f: log2(x) # with an index: about log2(n) steps
```

Even at a hundred rows it's 50 steps against about 7; at a hundred thousand rows, 50,000 steps on average without an index and about 17 with one. **But** an index has a price too: it takes space, and it must be updated at every insert and modification. That's why we don't index every column – only those we often search or join by (e.g. foreign keys, the email address for login).

## 3. Transactions: all or nothing

A bank transfer has two steps: deduct 10,000 Ft from Anna, add it to Béla. What happens if the server stops between the two? Without a transaction, the money **disappears**. A transaction guarantees that either both steps happen, or neither (**atomicity**, the "A" in ACID):

```python run
# Transfer with and without a transaction: a failure between the two steps
import copy

def transfer(accounts, source, target, amount, fail_midway=False, transaction=True):
    backup = copy.deepcopy(accounts) if transaction else None   # restore point
    try:
        if accounts[source] < amount:
            raise ValueError("insufficient funds")
        accounts[source] -= amount
        if fail_midway:
            raise RuntimeError("the server stopped")
        accounts[target] += amount
    except Exception as e:
        if transaction:
            accounts.clear(); accounts.update(backup)            # ROLLBACK: as if it never happened
        print(f"  error: {e} → {'rolled back' if transaction else 'NO rollback'}")
    return accounts

for tx in (False, True):
    accounts = {"Anna": 50_000, "Béla": 20_000}
    print(f"transaction: {tx}")
    transfer(accounts, "Anna", "Béla", 10_000, fail_midway=True, transaction=tx)
    print(f"  balances: {accounts}, total {sum(accounts.values())} Ft (originally 70000)")
```

Without a transaction, 10,000 Ft vanished from the system; with one, everything was restored. Real databases do this with `BEGIN` … `COMMIT` (or `ROLLBACK` on error) – and they guarantee the other ACID properties too (consistency, isolation, durability).

## 4. Data quality: before you analyse

"Garbage in, garbage out" – an analysis is only as good as its data. A few quick checks are worth it for every dataset:

```python run
# Data quality check: missing values, duplicates, invalid format, outliers
import re
from collections import Counter

students = [
    {"code": "ABC123", "email": "anna@example.com", "age": 20},
    {"code": "XYZ789", "email": "bela@example", "age": 21},
    {"code": "ABC123", "email": "anna@example.com", "age": 20},
    {"code": "QWE456", "email": None, "age": 19},
    {"code": "RTZ111", "email": "dora@example.com", "age": 210},
]

missing = [s["code"] for s in students if not s["email"]]
duplicates = [k for k, n in Counter(s["code"] for s in students).items() if n > 1]
bad_email = [s["email"] for s in students if s["email"] and not re.fullmatch(r"[^@\s]+@[^@\s]+\.[a-z]{2,}", s["email"])]
odd_age = [(s["code"], s["age"]) for s in students if not 16 <= s["age"] <= 99]
print("missing email: ", missing)
print("duplicate code:", duplicates)
print("invalid email: ", bad_email)
print("suspicious age:", odd_age, "← probably a typo (21?)")
```

After checking, you have to decide what to do with the errors – and that's a question of **viewpoint**: the analyst can drop the faulty rows, while the system's owner would fix them at the source (e.g. the form shouldn't accept an age of 210). And don't forget **GDPR**: only collect the data you really need, and only keep it as long as necessary.

| Viewpoint                   | What do they watch out for in a database?                          |
| --------------------------- | ------------------------------------------------------------------ |
| **developer**               | normalised structure, indexes, transactions, parameterised queries |
| **analyst**                 | data quality, missing values, reliable aggregates                  |
| **operator**                | backup, recovery, performance, storage                             |
| **data protection officer** | what personal data there is, who can access it, how long it's kept |

## Summary

- In a non-normalised table repeated data can become contradictory (update anomaly) and be lost on deletion (delete anomaly).
- Without an index a JOIN needs many comparisons; an index ($\approx \log_2 n$ steps) speeds it up but takes space and slows writes.
- A transaction is atomic: a transfer either happens completely or not at all (ROLLBACK).
- Before analysing, check for missing, duplicate, badly formatted and outlying values.

## Lesson exercise

```quiz required
? In an orders table the customer's address repeats in 50 rows. How many rows must be changed if the customer moves?
= 50
! In a normalised structure only 1 row would need changing.

? Roughly how many steps does finding a record take in an indexed table of about 1,000,000 rows? ($\log_2$, rounded to a whole number)
= 20
! $\log_2 10^6 \approx 19.9$.

? What is atomicity in a transaction?
- the transaction is very fast
+ the transaction's steps either all happen or none do
- the transaction can only modify one row
- the transaction can't be undone
! On error, ROLLBACK restores the original state.

? Why isn't it worth putting an index on every column?
- because an index slows down lookups
+ because every index takes space and must be updated at every write
- because SQL doesn't allow it
- because an index deletes data
! Only for frequently searched and joined columns.

? In a dataset one student's age is 210. What's the right step?
- leave it in, because that's the data
+ flag it as suspicious, check the source, and restrict the range on the form too
- delete the whole dataset
- change it to 21 without checking
! Data quality is best ensured at the source.
```

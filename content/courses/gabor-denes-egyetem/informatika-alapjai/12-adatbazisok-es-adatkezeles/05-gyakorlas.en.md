---
title: Practice – Databases and Data Management
summary: Review questions and a summary worksheet on the relational model, SQL, NoSQL and the GDPR.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. Design tables for a library: books, readers, loans. What are the keys?</summary>

`books(isbn PK, title, author, year)`, `readers(card_no PK, name, email)`, `loans(id PK, isbn FK, card_no FK, issued, returned)`. The loan links the book and the reader (an N : M relationship with a junction table).

</details>

<details>
<summary>2. Write an SQL query that lists the names of students with a GPA above 4.0 in alphabetical order!</summary>

```sql
SELECT name FROM students WHERE gpa > 4.0 ORDER BY name;
```

</details>

<details>
<summary>3. A web shop requires the customer's date of birth and mother's name for an order. Which GDPR principle does it violate?</summary>

Data minimisation (and purpose limitation): this data isn't needed to fulfil an order.

</details>

```python run
# GROUP BY in Python: head count and average per major
students = [
    ("Anna Kiss", "comp.eng", 4.5),
    ("Béla Nagy", "comp.eng", 3.8),
    ("Cili Tóth", "bus.info", 4.1),
    ("Dénes Kovács", "comp.eng", 3.2),
]
groups = {}
for name, major, gpa in students:
    groups.setdefault(major, []).append(gpa)
for major, gpas in groups.items():
    print(major, len(gpas), round(sum(gpas) / len(gpas), 2))
```

## Summary worksheet

```quiz required
? What are the two main properties of a primary key?
+ unique and never empty
- always text and short
- always the first column and a number
- anyone may modify it
! It uniquely identifies a record.

? Which SQL statement **modifies** existing rows?
- INSERT
+ UPDATE
- SELECT
- JOIN
! UPDATE … SET … WHERE …

? What is the average of the comp.eng major in the Python example above (two decimals)?
= 3.83
! (4.5 + 3.8 + 3.2) / 3 = 3.83.

? Which SQL clause groups rows by the values of a column?
= GROUP BY
! E.g. GROUP BY major.

? Which database is typically an **in-memory** key–value store used as a cache?
- PostgreSQL
- Neo4j
+ Redis
- MongoDB
! Very fast, often used as a cache.

? Which right does the data subject **not** have under the GDPR?
- access to their own data
- rectification of the data
- erasure of the data
+ requesting other people's data
! Their rights concern their own data only.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **JOIN with a dictionary.** Write the `join(orders, customers)` function, which, from `(order id, customer id)` pairs and a `{customer id: name}` dictionary, returns a list of `(order id, name)` pairs! An order referring to a non-existent customer is left out (like with an INNER JOIN).

```python starter
def join(orders, customers):
    return [(o, customers[c]) for o, c in orders]
```

<details>
<summary>Solution</summary>

```python solution
def join(orders, customers):
    return [(o, customers[c]) for o, c in orders if c in customers]   # only the matchable ones
```

</details>

```python test
c = {1: "Anna", 2: "Ben"}
assert join([(10, 1), (11, 2), (12, 1)], c) == [(10, "Anna"), (11, "Ben"), (12, "Anna")]
assert join([(13, 9), (14, 2)], c) == [(14, "Ben")]
print("All checks passed!")
```

**2.** **Grouping (GROUP BY).** Write the `sum_by_group(rows)` function, which makes a `{category: amount}` dictionary from `(category, amount)` pairs, like a `SELECT category, SUM(amount) … GROUP BY category` query!

```python starter
def sum_by_group(rows):
    return dict(rows)
```

<details>
<summary>Solution</summary>

```python solution
def sum_by_group(rows):
    result = {}
    for cat, amount in rows:
        result[cat] = result.get(cat, 0) + amount     # add up per category
    return result
```

</details>

```python test
r = [("food", 3000), ("travel", 1500), ("food", 2500), ("fun", 4000)]
assert sum_by_group(r) == {"food": 5500, "travel": 1500, "fun": 4000}
assert sum_by_group([]) == {}
print("All checks passed!")
```

**3.** **Duplicates.** Write the `duplicates(records, key)` function, which, from a list of dictionaries, returns in alphabetical order those values of `key` that occur more than once!

```python starter
def duplicates(records, key):
    return []
```

<details>
<summary>Solution</summary>

```python solution
from collections import Counter

def duplicates(records, key):
    counts = Counter(r[key] for r in records)
    return sorted(k for k, n in counts.items() if n > 1)
```

</details>

```python test
r = [{"id": "ABC123"}, {"id": "XYZ789"}, {"id": "ABC123"}, {"id": "QWE456"}, {"id": "XYZ789"}]
assert duplicates(r, "id") == ["ABC123", "XYZ789"]
assert duplicates([{"a": 1}], "a") == []
print("All checks passed!")
```

### Quick check questions

```quiz
? What is a primary key?
+ a column (or columns) that uniquely identifies every row
- the table's first column
- a reference pointing to another table
- the encryption key of the password
! The reference pointing to another table is the foreign key.

? A `products` table has 120 rows, of which 45 cost more than 5000 HUF. How many rows does `SELECT * FROM products WHERE price <= 5000;` return?
= 75
! $120 - 45 = 75$.

? What relationship is there between students and courses if a student can take several courses, and several students attend a course?
- 1:1
- 1:N
+ N:M (with a junction table)
- no relationship
! An N:M relationship is implemented with a third table.

? Why should you use a parameterised query when putting user data into an SQL query?
- because it's faster to type
+ so the input can't be interpreted as an SQL statement (against SQL injection)
- because SQL doesn't work otherwise
- to make the code prettier
! A query built by string concatenation is attackable.
```

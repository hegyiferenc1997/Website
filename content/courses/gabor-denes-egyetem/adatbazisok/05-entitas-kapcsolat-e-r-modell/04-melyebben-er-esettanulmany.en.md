---
title: Deeper – E-R Case Study and Special Relationships
summary: A complete E-R model of a web shop from description to tables; recursive relationships (prerequisite, manager–employee), ternary relationships, specialisation (inheritance) with three mapping strategies, multivalued and derived attributes – with runnable SQL examples.
minutes: 40
---

## What you will learn in this lesson

- how to build a **complete E-R model** from a realistic description (a web shop),
- what a **recursive** relationship is (an entity set with itself), and how it becomes a table,
- when you need a **ternary** relationship, and why it can't always be split into two,
- how to model **inheritance** (specialisation), and which of the three mappings is right,
- what to do with **multivalued** and **derived** attributes.

## Case study: a small web shop

> _"Our customers register (name, e-mail, possibly several shipping addresses). We sell products grouped into categories; a category may have subcategories (Computers → Peripherals → Mice). An order may contain several products in different quantities. A product's price may change, but the order uses the price at the time of purchase. Customers can review products they bought (1–5 stars, text)."_

### Entities and attributes

| Entity      | Attributes                                         | Note                                           |
| ----------- | -------------------------------------------------- | ---------------------------------------------- |
| Customer    | **customer_id**, name, email                       | "several shipping addresses" is multivalued!   |
| Address     | **address_id**, zip, city, street                  | the multivalued attribute became an entity     |
| Category    | **category_id**, name                              | related to itself (subcategory)                |
| Product     | **product_id**, name, current_price                |                                                |
| Order       | **order_id**, order_date, status                   | the total is **derived** (from the items)      |
| Review      | **customer + product**, stars, text                | a relationship with its own attributes         |

### Relationships

```text
  CUSTOMER ──1:N── ADDRESS
  CUSTOMER ──1:N── ORDER ──N:M── PRODUCT ──N:1── CATEGORY ─┐
                   (item: qty, unit_price)          ▲      │ parent (1:N, recursive)
  CUSTOMER ──N:M── PRODUCT  (review: stars, text)   └──────┘
```

Three lessons are visible right away:

1. The **order–product** relationship has its own attributes (`qty`, `unit_price`) – they go into the junction table.
2. The **unit price** is in the item, even though the product has a price too. This is **not** redundancy: the item keeps the price at purchase time (historical data), the product the current one.
3. The **total** can be computed from the items (`SUM(qty * unit_price)`), so we don't store it.

## Recursive relationship: an entity set with itself

A recursive (self-referencing) relationship exists when two elements of the same entity set relate to each other. Examples:

- **category → parent category** (1:N): every category has at most one parent;
- **employee → manager** (1:N): every employee has at most one direct manager;
- **course → prerequisite** (N:M): a course may have several prerequisites, and a course can be a prerequisite of several courses.

Always name the two "roles" in the relationship (parent–child, manager–employee), or you'll mix up the direction.

### 1:N recursion: a foreign key to the same table

```sql run
CREATE TABLE categories (
  category_id INT PRIMARY KEY,
  name        VARCHAR(40) NOT NULL,
  parent_id   INT REFERENCES categories (category_id)  -- points to itself; NULL = top level
);
INSERT INTO categories VALUES
  (1, 'Computers', NULL),
  (2, 'Peripherals', 1),
  (3, 'Mice', 2),
  (4, 'Keyboards', 2),
  (5, 'Household', NULL);

-- Self-join: every category with its parent's name
SELECT ch.name AS category, p.name AS parent
FROM categories ch
LEFT JOIN categories p ON p.category_id = ch.parent_id
ORDER BY ch.category_id;
```

The trick: we take the same table **twice**, with two different aliases (`ch` = child, `p` = parent), as if they were two separate tables. `LEFT JOIN` is needed so top-level categories without a parent appear too. (Traversal of arbitrary depth – e.g. "all ancestors of Mice" – is solved by the recursive queries of topic 12.)

### N:M recursion: a junction table with two foreign keys to the same table

A course may have several prerequisites, so we need a junction table whose **both** foreign keys point to the `courses` table. You'll write this in the lesson's exercise.

## Ternary relationship

Sometimes a fact connects **three** entities at once. Example: _"Which lecturer teaches which course in which room?"_

```text
        LECTURER
            │
       (teaching) ── ROOM
            │
         COURSE
```

Why aren't three binary relationships (lecturer–course, course–room, lecturer–room) enough? Because the original fact **can't be reconstructed** from them. If Kovács teaches ADB and DIG, ADB is held in rooms 101 and 102, and Kovács teaches in both 101 and 102, we don't know whether Kovács teaches ADB in 101 or 102 – or both. A ternary relationship becomes a junction table with three foreign keys:

```sql
CREATE TABLE teaching (
  lecturer_id INT REFERENCES lecturers,
  code        VARCHAR(6) REFERENCES courses,
  room        VARCHAR(10) REFERENCES rooms,
  PRIMARY KEY (lecturer_id, code, room)
);
```

## Specialisation (inheritance)

An entity set can have **subtypes** that have their own attributes beyond the common ones. At a university, for example, every **person** has a name and e-mail, but a **student** has a major and semester, and a **lecturer** has a department and position.

```text
              PERSON (id, name, email)
                  │
            ┌─────┴─────┐  ("is-a")
         STUDENT     LECTURER
   (major, semester) (department, position)
```

Two questions must be answered:

- **Total or partial?** Is every person a student or a lecturer (total), or can they be something else, e.g. an administrator (partial)?
- **Disjoint or overlapping?** Can someone be both a student and a lecturer (e.g. a PhD student)? If yes, overlapping.

### Three mapping strategies

| Strategy                         | Tables                                          | Pro                                          | Con                                             |
| -------------------------------- | ----------------------------------------------- | -------------------------------------------- | ----------------------------------------------- |
| **1. One common table**          | `persons(id, name, email, type, major, semester, department, position)` | simple, no JOIN | many NULLs; hard to enforce that a student has a major |
| **2. One table per subtype**     | `students(id, name, email, major, semester)`, `lecturers(id, name, email, department, position)` | no NULLs | common columns repeat; "all persons" needs UNION; duplication with overlap |
| **3. Parent + child tables**     | `persons(id, name, email)`, `students(id → persons, major, semester)`, `lecturers(id → persons, department, position)` | clean, no repetition, overlap works | subtype data needs a JOIN |

Which is right? **It depends** – and that's not a cop-out:

- few subtype-specific columns, many common queries → **1**;
- subtypes are almost always queried separately, no overlap → **2**;
- many own columns, overlap possible, cleanliness matters → **3** (the most common "textbook" choice).

```sql run
-- Strategy 3: parent and child tables, the child's key is also a foreign key
CREATE TABLE persons (id INT PRIMARY KEY, name VARCHAR(60) NOT NULL);
CREATE TABLE stud (id INT PRIMARY KEY REFERENCES persons, major VARCHAR(30));
CREATE TABLE lect (id INT PRIMARY KEY REFERENCES persons, department VARCHAR(30));
INSERT INTO persons VALUES (1, 'Anna Kiss'), (2, 'Dr. Peter Kovacs'), (3, 'Greg Toth');
INSERT INTO stud VALUES (1, 'computer engineering'), (3, 'computer engineering');
INSERT INTO lect VALUES (2, 'Informatics'), (3, 'Informatics');   -- Greg is a PhD student: both!

SELECT p.name,
       s.major, l.department,
       CASE WHEN s.id IS NOT NULL AND l.id IS NOT NULL THEN 'both'
            WHEN s.id IS NOT NULL THEN 'student' ELSE 'lecturer' END AS role
FROM persons p
LEFT JOIN stud s ON s.id = p.id
LEFT JOIN lect l ON l.id = p.id
ORDER BY p.id;
```

## Multivalued and derived attributes

- **Multivalued** (e.g. a customer's several shipping addresses, a student's several phone numbers): **never** put them in one field separated by commas (`'0630…, 0620…'`)! You need a separate table with a foreign key. Reason: a comma-separated list can't be searched, indexed or validated – and it violates first normal form (topic 6).
- **Derived** (e.g. age from birth date, total from items): usually **not stored**, but computed at query time. Exception: a historical "frozen" value, or when the computation is very expensive (topic 16: materialised view).

## Common modelling mistakes

- **Attribute instead of relationship:** `product1`, `product2`, `product3` columns in the `orders` table. What if someone orders 4 products? → junction table.
- **Foreign key on the wrong side in 1:N:** the key always goes to the **"N" side** (the order refers to the customer, not the other way round).
- **Relationship attribute in the wrong place:** `qty` isn't a product attribute (a product can have different quantities in different orders), it belongs to the order–product relationship.
- **Forgetting time:** "current price" and "price at purchase" are two different pieces of data.

## Summary

- Complete modelling: entities → attributes (multivalued? derived?) → relationships (cardinality, own attributes) → tables.
- **Recursive relationship:** for 1:N a foreign key to the same table; for N:M a junction table with two keys pointing to the same table; queried with a **self-join** (two aliases).
- **Ternary relationship:** can't always be split into three binary ones; junction table with three keys.
- **Specialisation:** one table / table per subtype / parent + child tables – queries and overlap decide.

## Exercise

Extend the university database with **prerequisites** (a recursive N:M relationship): the starter code creates the `prerequisites` junction table (both its columns point to the `courses` table) and fills it with two rows (ADB requires PROG, DIG requires MAT).

Write the query that lists, for each prerequisite pair, the **course name** (`course`) and the **prerequisite name** (`prerequisite`), ordered by course name! You'll need to join the `courses` table **twice**, with two different aliases.

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql starter required
CREATE TABLE prerequisites (
  code     VARCHAR(6) REFERENCES courses (code),
  pre_code VARCHAR(6) REFERENCES courses (code),
  PRIMARY KEY (code, pre_code),
  CHECK (code <> pre_code)          -- a course can't be its own prerequisite
);
INSERT INTO prerequisites VALUES ('ADB', 'PROG'), ('DIG', 'MAT');

-- Write the query!
SELECT ...
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE prerequisites (
  code     VARCHAR(6) REFERENCES courses (code),
  pre_code VARCHAR(6) REFERENCES courses (code),
  PRIMARY KEY (code, pre_code),
  CHECK (code <> pre_code)
);
INSERT INTO prerequisites VALUES ('ADB', 'PROG'), ('DIG', 'MAT');

SELECT c.name AS course, p.name AS prerequisite
FROM prerequisites pr
JOIN courses c ON c.code = pr.code
JOIN courses p ON p.code = pr.pre_code
ORDER BY c.name;
```

</details>

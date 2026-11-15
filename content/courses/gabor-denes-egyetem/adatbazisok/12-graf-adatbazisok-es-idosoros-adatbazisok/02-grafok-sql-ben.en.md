---
title: Graphs in SQL – Recursive Queries
summary: How to store a graph in relational tables (a node table and an edge table), and how to traverse it to any depth with a WITH RECURSIVE query – tried out on a curriculum's chain of prerequisites, in your browser.
minutes: 30
---

## What you will learn

- how to store a **graph** in two tables,
- how a **recursive query** (`WITH RECURSIVE`) works,
- how to count the **depth**, and how to avoid an infinite loop.

## A graph in two tables

You don't always need a separate graph database: in a relational database a graph can be described with two tables:

- a **node table**: the things themselves (here: the courses),
- an **edge table**: the relationships, as "from → to" pairs (here: which course has which prerequisite).

Our example contains the courses and prerequisites of a made-up curriculum:

```text
  MAT ──► DIMAT ──┬──► ADSZ ◄── PROG2 ◄── PROG
                  │                │        │
                  └──► ADB ◄───────┼────────┘
                        │          │
                        └──► WEB ◄─┘
                              │
                              └──► SZT

  (the arrow means: "is a prerequisite of")
```

<details>
<summary>Creating the curriculum (SQL)</summary>

```sql setup
-- Nodes: the courses.
CREATE TABLE courses (
  code VARCHAR(6) PRIMARY KEY,
  name VARCHAR(40) NOT NULL
);
-- Edges: taking course requires completing prerequisite.
CREATE TABLE prerequisites (
  course       VARCHAR(6) REFERENCES courses (code),
  prerequisite VARCHAR(6) REFERENCES courses (code),
  PRIMARY KEY (course, prerequisite)
);
INSERT INTO courses VALUES
  ('MAT', 'Mathematics'), ('DIMAT', 'Discrete Mathematics'),
  ('PROG', 'Programming Basics'), ('PROG2', 'Programming II'),
  ('ADSZ', 'Algorithms and Data Structures'), ('ADB', 'Databases'),
  ('WEB', 'Web Development'), ('SZT', 'Software Engineering');
INSERT INTO prerequisites VALUES
  ('DIMAT', 'MAT'), ('PROG2', 'PROG'), ('ADSZ', 'PROG2'), ('ADSZ', 'DIMAT'),
  ('ADB', 'PROG'), ('ADB', 'DIMAT'), ('WEB', 'ADB'), ('WEB', 'PROG2'), ('SZT', 'WEB');
```

</details>

A simple query gives the **direct** prerequisites:

```sql run
SELECT prerequisite FROM prerequisites WHERE course = 'WEB' ORDER BY prerequisite;
```

But WEB needs ADB, which needs PROG and DIMAT, which needs MAT… How many JOINs would we need? We don't know in advance how deep the chain is! This is what a recursive query is for.

## WITH RECURSIVE

A recursive CTE has two parts joined by `UNION`:

```sql
WITH RECURSIVE name AS (
  -- 1. the starting part (anchor): where we start from
  SELECT …
  UNION
  -- 2. the recursive part: goes one step further and refers to itself (name)
  SELECT … FROM … JOIN name ON …
)
SELECT * FROM name;
```

The DBMS executes it like this:

1. runs the anchor → this is the first "wave",
2. runs the recursive part on the rows of the **previous wave** → a new wave,
3. repeats until **no new rows** arrive.

> Analogy: like throwing a stone into a pond. The first ring is the direct neighbours, the next ring is their neighbours, and so on, until the waves die out.

**All** (direct and indirect) prerequisites of WEB, with the number of steps:

```sql run
WITH RECURSIVE history AS (
  SELECT prerequisite AS code, 1 AS depth
  FROM prerequisites
  WHERE course = 'WEB'
  UNION
  SELECT p.prerequisite, h.depth + 1
  FROM prerequisites p
  JOIN history h ON p.course = h.code
)
SELECT code, MIN(depth) AS shortest_path
FROM history
GROUP BY code
ORDER BY shortest_path, code;
```

Follow it through: the first wave is ADB and PROG2 (depth 1). The second wave is their prerequisites: PROG, DIMAT (depth 2). The third is MAT (depth 3). After that no new rows arrive, and the recursion stops.

PROG can be reached in two ways (WEB → ADB → PROG and WEB → PROG2 → PROG), so `MIN(depth)` picks the shortest path.

## Printing the path, and cycles

We can also collect the path in a string – which at the same time lets us notice if we've already visited a node (a cycle):

```sql run
WITH RECURSIVE paths AS (
  SELECT prerequisite AS code, 'SZT → ' || prerequisite AS path
  FROM prerequisites
  WHERE course = 'SZT'
  UNION ALL
  SELECT p.prerequisite, x.path || ' → ' || p.prerequisite
  FROM prerequisites p
  JOIN paths x ON p.course = x.code
  WHERE x.path NOT LIKE '%' || p.prerequisite || '%'   -- don't go round in circles
)
SELECT path FROM paths
WHERE code NOT IN (SELECT course FROM prerequisites)    -- only complete chains
ORDER BY path;
```

If the graph can contain a cycle (e.g. with acquaintances: Anna knows Bela, Bela knows Anna), recursion without a condition would **never stop**. Defences:

- `UNION` (without duplicates) instead of `UNION ALL` – if the same row comes up again, it isn't added again,
- keeping track of the path and filtering on it, as above,
- a depth limit (`WHERE depth < 10`).

## Summary

- A graph relationally: node table + edge table.
- `WITH RECURSIVE`: anchor `UNION` recursive part; proceeds in waves while there are new rows.
- Counting depth: 1 in the anchor, +1 in the recursive part.
- Against cycles: `UNION`, path checking or a depth limit.

## The lesson's exercise

Reverse the direction! Which courses need **Programming Basics** (`PROG`) **directly or indirectly**? Return the courses' **codes**, without duplicates, sorted **by code**.

The starter code only returns the direct "successors" – extend it into a recursion.

```sql starter required
SELECT course AS code
FROM prerequisites
WHERE prerequisite = 'PROG'
ORDER BY code;
```

<details>
<summary>Solution</summary>

```sql solution
WITH RECURSIVE successors AS (
  SELECT course AS code
  FROM prerequisites
  WHERE prerequisite = 'PROG'
  UNION
  SELECT p.course
  FROM prerequisites p
  JOIN successors s ON p.prerequisite = s.code
)
SELECT code FROM successors
ORDER BY code;
```

</details>

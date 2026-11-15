---
title: Practice – Graph and Time Series Databases
summary: Review questions about the graph model, recursive queries and time series data, then writing a friend suggester in SQL, with the number of mutual friends.
minutes: 30
kind: practice
---

## Review questions

<details>
<summary>1. What's the difference between how a relational and a graph database store a relationship?</summary>

Relationally, a relationship is described by foreign keys (or a junction table), and at query time it's produced with a JOIN, using index lookups. In a graph database the edge is a stored element: every node refers directly to its neighbours, so traversal means following pointers.

</details>

<details>
<summary>2. What does a recursive CTE consist of, and when does it stop?</summary>

An anchor (the starting rows) and a recursive part that produces new rows from the previous step's rows; the two are joined by `UNION`. It stops when a step returns no new rows.

</details>

<details>
<summary>3. Why is a cycle dangerous in a recursive query, and how do you defend against it?</summary>

If the graph contains a cycle and the query keeps adding rows again with `UNION ALL`, new rows never run out, so the query loops forever. Defences: `UNION` (without duplicates), keeping track of the visited path, or a depth limit.

</details>

<details>
<summary>4. What characterises time series data?</summary>

Timestamped measurements that arrive continuously, in time order, almost only as inserts, in huge volumes. We query time ranges, and the detail of old data becomes less important over time.

</details>

<details>
<summary>5. What are downsampling and a retention policy, and why are they needed?</summary>

Downsampling: we build an aggregate (e.g. a daily average) from detailed old data. Retention policy: detailed data is kept only for a while, then deleted automatically. Without them the database would grow without limit, while nobody needs the old details anymore.

</details>

## The practice exercise: friend suggestions

We store the friendships of a small social site. Every friendship appears **in both directions** in the table (if Anna knows Bela, Bela also knows Anna).

<details>
<summary>Creating the social network (SQL)</summary>

```sql setup
-- Nodes: the people.
CREATE TABLE people (
  id   INT PRIMARY KEY,
  name VARCHAR(20) NOT NULL
);
-- Edges: who knows whom (stored in both directions).
CREATE TABLE friendships (
  person INT REFERENCES people (id),
  friend INT REFERENCES people (id),
  PRIMARY KEY (person, friend)
);
INSERT INTO people VALUES
  (1, 'Anna'), (2, 'Bela'), (3, 'Cili'), (4, 'Dani'),
  (5, 'Emma'), (6, 'Feri'), (7, 'Gabi'), (8, 'Hanna');
INSERT INTO friendships
SELECT a, b FROM (VALUES (1, 2), (1, 3), (2, 3), (2, 4), (3, 4), (3, 5), (4, 6), (5, 7), (8, 6)) AS p (a, b)
UNION
SELECT b, a FROM (VALUES (1, 2), (1, 3), (2, 3), (2, 4), (3, 4), (3, 5), (4, 6), (5, 7), (8, 6)) AS p (a, b);
```

</details>

```sql run
SELECT p1.name AS person, p2.name AS friend
FROM friendships f
JOIN people p1 ON p1.id = f.person
JOIN people p2 ON p2.id = f.friend
WHERE f.person < f.friend
ORDER BY person, friend;
```

Write a **friend suggester for Anna**! Find the people who are friends of Anna's friends, but are **not Anna**, and whom Anna **doesn't know yet**. For each candidate, give **how many mutual friends** they have with Anna. Columns: name, number of mutual friends; sorted by the **number of mutual friends descending**, then **by name**.

Hint: two steps on the edge table (`friendships f1 JOIN friendships f2 ON f2.person = f1.friend`), then filtering and grouping.

```sql starter required
-- Anna's direct friends
SELECT p.name
FROM friendships f
JOIN people p ON p.id = f.friend
WHERE f.person = 1
ORDER BY p.name;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT p.name, COUNT(*) AS mutual_friends
FROM friendships f1                                 -- Anna → friend
JOIN friendships f2 ON f2.person = f1.friend        -- friend → their friend
JOIN people p ON p.id = f2.friend
WHERE f1.person = 1
  AND f2.friend <> 1                                -- not Anna
  AND f2.friend NOT IN (SELECT friend FROM friendships WHERE person = 1)   -- not known yet
GROUP BY p.name
ORDER BY mutual_friends DESC, p.name;
```

</details>

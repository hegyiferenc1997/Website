---
title: Practice – Graph and Time Series Databases
summary: Review questions about the graph model, recursive queries and time series data, then writing a friend suggester in SQL, with the number of mutual friends.
minutes: 55
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

The first three exercises work on the social network above, the last two on a small sensor time series.

**1.** **Degree.** How many friends does each person have? (Name, number of friends; by number of friends descending, then by name.) In graph terms this is the **degree** of the nodes.

```sql starter
SELECT person, friend
FROM friendships;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT p.name, COUNT(*) AS friends
FROM friendships f
JOIN people p ON p.id = f.person
GROUP BY p.name
ORDER BY friends DESC, p.name;
```

</details>

**2.** **Mutual friends.** How many **mutual friends** do Anna (1) and Dani (4) have? Who are they? (Names, alphabetically.)

```sql starter
SELECT friend FROM friendships WHERE person = 1;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT p.name
FROM friendships a
JOIN friendships d ON d.friend = a.friend   -- the same friend for both of them
JOIN people p ON p.id = a.friend
WHERE a.person = 1 AND d.person = 4
ORDER BY p.name;
```

</details>

**3.** **Distance with a recursive query.** How many steps away from Anna (1) is everyone else in the network? (Name, distance; by distance, then by name.) Hint: a recursive CTE that grows step by step, and at the end we take the **smallest** distance per person. Limit the depth (e.g. 6 steps) so cycles don't make it run forever!

```sql starter
WITH RECURSIVE path (id, dist) AS (
  SELECT 1, 0                    -- start: Anna, 0 steps
  -- UNION ALL ...
)
SELECT * FROM path;
```

<details>
<summary>Solution</summary>

```sql solution
WITH RECURSIVE path (id, dist) AS (
  SELECT 1, 0
  UNION ALL
  SELECT f.friend, p.dist + 1
  FROM path p
  JOIN friendships f ON f.person = p.id
  WHERE p.dist < 6               -- depth limit because of cycles
)
SELECT pe.name, MIN(p.dist) AS distance
FROM path p
JOIN people pe ON pe.id = p.id
WHERE p.id <> 1
GROUP BY pe.name
ORDER BY distance, pe.name;
```

</details>

**4.** **Time series: hourly average.** A thermometer measures every 20 minutes. Compute the average temperature **per hour** to one decimal (hour, average; in time order)! `date_trunc('hour', ts)` "cuts" the timestamp to the start of the hour.

```sql starter
CREATE TABLE readings (ts TIMESTAMP, temperature NUMERIC(4, 1));
INSERT INTO readings
SELECT TIMESTAMP '2026-01-10 08:00' + n * INTERVAL '20 minutes', 18 + n * 0.5
FROM generate_series(0, 8) AS n;

SELECT * FROM readings ORDER BY ts;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE readings (ts TIMESTAMP, temperature NUMERIC(4, 1));
INSERT INTO readings
SELECT TIMESTAMP '2026-01-10 08:00' + n * INTERVAL '20 minutes', 18 + n * 0.5
FROM generate_series(0, 8) AS n;

SELECT date_trunc('hour', ts) AS hour, ROUND(AVG(temperature), 1) AS average
FROM readings
GROUP BY hour
ORDER BY hour;
```

</details>

**5.** **Time series: moving average.** On the same kind of readings, compute for every point in time **the average of the last 3 readings** (including the current one), to two decimals – this smooths out the noise. (Time, temperature, moving average; in time order.)

```sql starter
CREATE TABLE readings (ts TIMESTAMP, temperature NUMERIC(4, 1));
INSERT INTO readings VALUES
  ('2026-01-10 08:00', 18.0), ('2026-01-10 08:20', 21.0), ('2026-01-10 08:40', 18.5),
  ('2026-01-10 09:00', 19.0), ('2026-01-10 09:20', 25.0), ('2026-01-10 09:40', 19.5);

SELECT ts, temperature FROM readings ORDER BY ts;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE readings (ts TIMESTAMP, temperature NUMERIC(4, 1));
INSERT INTO readings VALUES
  ('2026-01-10 08:00', 18.0), ('2026-01-10 08:20', 21.0), ('2026-01-10 08:40', 18.5),
  ('2026-01-10 09:00', 19.0), ('2026-01-10 09:20', 25.0), ('2026-01-10 09:40', 19.5);

SELECT ts, temperature,
       ROUND(AVG(temperature) OVER (ORDER BY ts ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg
FROM readings
ORDER BY ts;
```

</details>

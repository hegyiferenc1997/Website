---
title: Deeper – Graph and Time-Series Analysis in Practice
summary: Shortest paths by breadth-first traversal with a recursive query, degree and "mutual friends", recommendations from a graph; for time series, filling missing periods with generate_series, detecting outages with LAG, finding outliers against a moving average, and downsampling – all in SQL, on runnable examples.
minutes: 40
---

## What you will learn in this lesson

- how to compute the **shortest path** in a graph (how many steps someone is from someone else),
- how to compute **degree** and **mutual friends**, and how a simple **recommendation** works,
- for time series, how to fill in **missing periods**,
- how to find **outages** (when no data arrived),
- how to filter out **outliers**,
- and all this **in a relational database**, with SQL.

## Part 1 – Graphs

### The data: a small social network

```text
   Anna ── Bela ── Cili ── Dani
     │       │              │
   Emma ─────┘            Feri ── Gabi
```

Acquaintances are two-way, so we store **both directions** in the edge table (then queries don't need to deal with it separately).

```sql run
CREATE TABLE knows (a TEXT, b TEXT);
INSERT INTO knows VALUES
  ('Anna','Bela'), ('Anna','Emma'), ('Bela','Cili'), ('Bela','Emma'),
  ('Cili','Dani'), ('Dani','Feri'), ('Feri','Gabi');
-- Make it two-way: every edge in reverse too
INSERT INTO knows SELECT b, a FROM knows;

-- Degree: how many acquaintances does each person have?
SELECT a AS person, COUNT(*) AS degree
FROM knows
GROUP BY a
ORDER BY degree DESC, person;
```

**Degree** is the simplest "importance" measure: whoever is connected to many people is at the centre of the network (here Bela).

### Mutual friends and recommendation

"People you may know" – the classic social network feature: recommend people you share **many mutual friends** with but aren't friends with yet.

```sql run
CREATE TABLE knows (a TEXT, b TEXT);
INSERT INTO knows VALUES
  ('Anna','Bela'), ('Anna','Emma'), ('Bela','Cili'), ('Bela','Emma'),
  ('Cili','Dani'), ('Dani','Feri'), ('Feri','Gabi');
INSERT INTO knows SELECT b, a FROM knows;

-- Recommendations for Anna: friends of friends who aren't her friends yet, and not herself
SELECT k2.b AS recommended, COUNT(*) AS mutual_friends
FROM knows k1
JOIN knows k2 ON k2.a = k1.b          -- friends of Anna's friends
WHERE k1.a = 'Anna'
  AND k2.b <> 'Anna'
  AND NOT EXISTS (SELECT 1 FROM knows x WHERE x.a = 'Anna' AND x.b = k2.b)
GROUP BY k2.b
ORDER BY mutual_friends DESC, recommended;
```

This is a two-step traversal with a self-join. In a graph database (Cypher) the same is: `MATCH (a:Person {name:'Anna'})-[:KNOWS]-()-[:KNOWS]-(rec) WHERE NOT (a)-[:KNOWS]-(rec) …`.

### Shortest path: breadth-first traversal

_"How many handshakes is Anna from Gabi?"_ **Breadth-first search** (BFS) proceeds layer by layer: first Anna's direct friends (1 step), then their friends (2 steps), and so on. Whoever we reach first, we reached by a shortest path.

**Analogy:** the ripples of a stone thrown into a pond. The first ring reaches those 1 step away, the second those 2 steps away… The distance of whoever the ripple reaches first is the ring's number.

In SQL we traverse the graph with `WITH RECURSIVE`, recording in a **path array** where we've been, so we don't fall into an infinite loop:

```sql run
CREATE TABLE knows (a TEXT, b TEXT);
INSERT INTO knows VALUES
  ('Anna','Bela'), ('Anna','Emma'), ('Bela','Cili'), ('Bela','Emma'),
  ('Cili','Dani'), ('Dani','Feri'), ('Feri','Gabi');
INSERT INTO knows SELECT b, a FROM knows;

WITH RECURSIVE walk (person, steps, path) AS (
  SELECT 'Anna', 0, ARRAY['Anna']                       -- start
  UNION ALL
  SELECT k.b, w.steps + 1, w.path || k.b                -- one step further
  FROM walk w
  JOIN knows k ON k.a = w.person
  WHERE NOT k.b = ANY(w.path)                           -- don't go where we've been
)
SELECT DISTINCT ON (person) person, steps, array_to_string(path, ' → ') AS shortest_path
FROM walk
ORDER BY person, steps;
```

`DISTINCT ON (person)` keeps only the **first** row of each person according to the ordering – that is, the one with the fewest steps. Gabi is 5 steps from Anna: Anna → Bela → Cili → Dani → Feri → Gabi.

**Caution:** this method is fine on small graphs, but in a large network the number of possible paths explodes. Graph databases use algorithms optimised for this (e.g. bidirectional BFS) – that's why they're faster for such questions.

## Part 2 – Time series

### The data: a thermometer's per-minute readings

```sql run
-- A thermometer's readings (a few minutes are missing, and there's an outlier)
CREATE TABLE reading (ts TIMESTAMP, temperature NUMERIC(4, 1));
INSERT INTO reading VALUES
  ('2025-03-01 10:00', 21.0), ('2025-03-01 10:01', 21.2), ('2025-03-01 10:02', 21.1),
  ('2025-03-01 10:03', 21.3), ('2025-03-01 10:07', 21.4), ('2025-03-01 10:08', 35.9),
  ('2025-03-01 10:09', 21.6), ('2025-03-01 10:10', 21.5), ('2025-03-01 10:11', 21.7);

SELECT * FROM reading ORDER BY ts;
```

### Detecting outages with LAG

The `LAG(column)` window function returns the **previous row's** value. If more than 1 minute passed between two consecutive readings, there was an outage (power cut, network failure…):

```sql run
CREATE TABLE reading (ts TIMESTAMP, temperature NUMERIC(4, 1));
INSERT INTO reading VALUES
  ('2025-03-01 10:00', 21.0), ('2025-03-01 10:01', 21.2), ('2025-03-01 10:02', 21.1),
  ('2025-03-01 10:03', 21.3), ('2025-03-01 10:07', 21.4), ('2025-03-01 10:08', 35.9),
  ('2025-03-01 10:09', 21.6), ('2025-03-01 10:10', 21.5), ('2025-03-01 10:11', 21.7);

SELECT prev AS outage_start, ts AS outage_end, ts - prev AS duration
FROM (SELECT ts, LAG(ts) OVER (ORDER BY ts) AS prev FROM reading) x
WHERE ts - prev > INTERVAL '1 minute';
```

### Filling missing periods

On a chart an outage easily goes unnoticed if the points are simply connected. It's better if **every minute** has a row, with `NULL` for the missing ones. `generate_series` produces the complete time scale, to which we LEFT JOIN the readings:

```sql run
CREATE TABLE reading (ts TIMESTAMP, temperature NUMERIC(4, 1));
INSERT INTO reading VALUES
  ('2025-03-01 10:00', 21.0), ('2025-03-01 10:01', 21.2), ('2025-03-01 10:02', 21.1),
  ('2025-03-01 10:03', 21.3), ('2025-03-01 10:07', 21.4), ('2025-03-01 10:08', 35.9),
  ('2025-03-01 10:09', 21.6), ('2025-03-01 10:10', 21.5), ('2025-03-01 10:11', 21.7);

SELECT minute, r.temperature,
       CASE WHEN r.ts IS NULL THEN 'missing' ELSE 'ok' END AS status
FROM generate_series(TIMESTAMP '2025-03-01 10:00', TIMESTAMP '2025-03-01 10:11', INTERVAL '1 minute') AS minute
LEFT JOIN reading r ON r.ts = minute
ORDER BY minute;
```

The same pattern works for **daily reports**: if there were no sales on a day, it should still appear with 0 rather than disappear from the series.

### Outliers: deviation from the surroundings

The 35.9 °C at 10:08 is obviously a measurement error. How does a program notice it? We compare every reading with the **average of the surrounding readings** (moving average), and flag it if the deviation is too large:

```sql run
CREATE TABLE reading (ts TIMESTAMP, temperature NUMERIC(4, 1));
INSERT INTO reading VALUES
  ('2025-03-01 10:00', 21.0), ('2025-03-01 10:01', 21.2), ('2025-03-01 10:02', 21.1),
  ('2025-03-01 10:03', 21.3), ('2025-03-01 10:07', 21.4), ('2025-03-01 10:08', 35.9),
  ('2025-03-01 10:09', 21.6), ('2025-03-01 10:10', 21.5), ('2025-03-01 10:11', 21.7);

SELECT ts, temperature,
       ROUND(surroundings, 2) AS surrounding_avg,
       CASE WHEN ABS(temperature - surroundings) > 3 THEN 'SUSPICIOUS' ELSE '' END AS flag
FROM (
  SELECT ts, temperature,
         -- average of the previous 2 and next 2 readings (excluding itself)
         (SUM(temperature) OVER w - temperature) / (COUNT(*) OVER w - 1) AS surroundings
  FROM reading
  WINDOW w AS (ORDER BY ts ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING)
) x
ORDER BY ts;
```

Why exclude the reading itself from the average? Otherwise the outlier would pull up its own average and stand out less. Real systems often measure the deviation against a multiple of the **standard deviation** (e.g. the "3 sigma" rule), but the principle is the same.

### Downsampling

A year of per-minute readings is 525,600 rows per sensor. For old data, an hourly or daily average is enough. `date_trunc` rounds the time down, and we can group by it:

```sql run
CREATE TABLE reading (ts TIMESTAMP, temperature NUMERIC(4, 1));
INSERT INTO reading VALUES
  ('2025-03-01 10:00', 21.0), ('2025-03-01 10:01', 21.2), ('2025-03-01 10:02', 21.1),
  ('2025-03-01 10:03', 21.3), ('2025-03-01 10:07', 21.4), ('2025-03-01 10:08', 35.9),
  ('2025-03-01 10:09', 21.6), ('2025-03-01 10:10', 21.5), ('2025-03-01 10:11', 21.7);

-- Five-minute summary: average, minimum, maximum, number of readings
SELECT date_bin(INTERVAL '5 minutes', ts, TIMESTAMP '2025-03-01') AS time_window,
       ROUND(AVG(temperature), 2) AS avg, MIN(temperature) AS min, MAX(temperature) AS max,
       COUNT(*) AS readings
FROM reading
GROUP BY time_window
ORDER BY time_window;
```

(`date_bin` rounds to windows of any length; `date_trunc` only to whole units: hour, day, month.) Notice: in the 10:05 window the outlier pulls up the average and the maximum – that's why it's worth **filtering out** bad readings **first**, and only then downsampling.

## Summary

- **Graphs in SQL:** an edge table (both directions for two-way relationships), degree with `GROUP BY`, mutual friends with a self-join.
- **Shortest path:** `WITH RECURSIVE` breadth-first traversal with a path array against cycles, `DISTINCT ON` for the fewest steps.
- **Time series:** `LAG` to detect outages, `generate_series` + `LEFT JOIN` to fill missing periods, a moving window for outliers, `date_trunc` / `date_bin` for downsampling.

## Exercise

A server sends a "heartbeat" every minute. The starter code creates the `heartbeat` table. List the **outages** where **more than 2 minutes** passed between two consecutive heartbeats! The result's columns: the time of the last heartbeat before the outage (`last_beat`), the time of recovery (`next_beat`) and the outage's duration (`duration`), in chronological order.

```sql starter required
CREATE TABLE heartbeat (ts TIMESTAMP);
INSERT INTO heartbeat VALUES
  ('2025-03-01 08:00'), ('2025-03-01 08:01'), ('2025-03-01 08:02'), ('2025-03-01 08:06'),
  ('2025-03-01 08:07'), ('2025-03-01 08:09'), ('2025-03-01 08:15'), ('2025-03-01 08:16');

-- Write the query with the LAG window function!
SELECT ts FROM heartbeat ORDER BY ts;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE heartbeat (ts TIMESTAMP);
INSERT INTO heartbeat VALUES
  ('2025-03-01 08:00'), ('2025-03-01 08:01'), ('2025-03-01 08:02'), ('2025-03-01 08:06'),
  ('2025-03-01 08:07'), ('2025-03-01 08:09'), ('2025-03-01 08:15'), ('2025-03-01 08:16');

SELECT prev AS last_beat, ts AS next_beat, ts - prev AS duration
FROM (SELECT ts, LAG(ts) OVER (ORDER BY ts) AS prev FROM heartbeat) x
WHERE ts - prev > INTERVAL '2 minutes'
ORDER BY ts;
```

</details>

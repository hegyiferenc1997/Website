---
title: How to Choose a DBMS?
summary: The criteria for choosing a DBMS (data model, workload, consistency, scaling, cost, team, ecosystem), the weighted decision matrix method and sensitivity analysis – with the matrix calculated in SQL, in your browser.
minutes: 28
---

## What you will learn

- which **criteria** to use when choosing a database,
- how a **weighted decision matrix** works,
- how to check the decision with **sensitivity analysis** – all in SQL.

## Don't let fashion decide!

"Everyone uses MongoDB, so we'll choose it too" – decisions like that get expensive later. A good choice starts from **the job**. Some questions worth asking:

| Criterion            | Question                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| **Data model**       | Tabular, interrelated data? Flexible documents? A web of relationships? Time series?            |
| **Workload**         | Many small transactions (OLTP) or big analytical queries (OLAP)? More writes or reads?          |
| **Consistency**      | Is strict ACID needed (money, stock), or is eventual consistency enough?                        |
| **Size and scaling** | Gigabytes or petabytes? Is one server enough, or are several data centres needed?               |
| **Cost**             | Licence, operations, experts – the total cost (TCO).                                            |
| **Team**             | What does the team already know? How long will learning take?                                   |
| **Ecosystem**        | Is there a good driver for our programming language, ORM support, a cloud service, a community? |
| **Legal aspects**    | Where may the data be stored (e.g. within the EU)? Which certifications are needed?             |

> A good rule of thumb: unless you have a special reason to choose something else, a **well-known relational database** (e.g. PostgreSQL) is a safe starting point for most new projects. For special needs (huge write loads, graph traversal, caching) you can add a specialised system alongside it.

## The weighted decision matrix

When there are several candidates, it's worth backing the decision with **numbers**:

1. Collect the **criteria**, and give each a **weight** (e.g. 100% in total).
2. **Score** every candidate on every criterion (e.g. 1–5).
3. For each candidate calculate the **weighted sum**: Σ (score × weight).
4. The one with the most points wins – but at the end always look at it with **common sense** too!

A made-up team is choosing the database for a university student records system:

<details>
<summary>Creating the decision matrix (SQL)</summary>

```sql setup
-- The criteria and their weight (in percent, 100 in total).
CREATE TABLE criteria (
  criterion VARCHAR(20) PRIMARY KEY,
  weight    INT NOT NULL CHECK (weight > 0)
);
-- Each DBMS's score per criterion (1–5).
CREATE TABLE ratings (
  dbms      VARCHAR(20),
  criterion VARCHAR(20) REFERENCES criteria (criterion),
  score     INT NOT NULL CHECK (score BETWEEN 1 AND 5),
  PRIMARY KEY (dbms, criterion)
);
INSERT INTO criteria VALUES
  ('performance', 30), ('cost', 25), ('scalability', 20),
  ('community', 15), ('learnability', 10);
INSERT INTO ratings VALUES
  ('PostgreSQL', 'performance', 4), ('PostgreSQL', 'cost', 5), ('PostgreSQL', 'scalability', 4),
  ('PostgreSQL', 'community', 5),   ('PostgreSQL', 'learnability', 4),
  ('MySQL', 'performance', 4),      ('MySQL', 'cost', 5),      ('MySQL', 'scalability', 3),
  ('MySQL', 'community', 5),        ('MySQL', 'learnability', 5),
  ('Oracle', 'performance', 5),     ('Oracle', 'cost', 1),     ('Oracle', 'scalability', 5),
  ('Oracle', 'community', 3),       ('Oracle', 'learnability', 2),
  ('MongoDB', 'performance', 4),    ('MongoDB', 'cost', 4),    ('MongoDB', 'scalability', 5),
  ('MongoDB', 'community', 4),      ('MongoDB', 'learnability', 4);
```

</details>

First let's look at the matrix in "human" form. With the `FILTER` clause each criterion becomes a separate column (this is called a **pivot**):

```sql run
SELECT dbms,
       SUM(score) FILTER (WHERE criterion = 'performance')  AS performance,
       SUM(score) FILTER (WHERE criterion = 'cost')         AS cost,
       SUM(score) FILTER (WHERE criterion = 'scalability')  AS scalability,
       SUM(score) FILTER (WHERE criterion = 'community')    AS community,
       SUM(score) FILTER (WHERE criterion = 'learnability') AS learnability
FROM ratings
GROUP BY dbms
ORDER BY dbms;
```

The **simple** (unweighted) average can be misleading, because it treats every criterion as equally important:

```sql run
SELECT dbms, ROUND(AVG(score), 2) AS simple_avg
FROM ratings
GROUP BY dbms
ORDER BY simple_avg DESC, dbms;
```

## Sensitivity analysis

What if we estimated the weights badly? **Sensitivity analysis** shows how stable the decision is. Suppose that **scalability** matters most to the team after all: let's raise its weight and lower the weight of cost. (It's worth trying this with your own query too, after solving the lesson's exercise!)

```sql run
UPDATE criteria SET weight = 40 WHERE criterion = 'scalability';
UPDATE criteria SET weight = 5  WHERE criterion = 'cost';

SELECT criterion, weight FROM criteria ORDER BY weight DESC;
```

If a small change in the weights flips the order, the decision is **not stable** – then it's worth examining the close competitors more closely (e.g. with a small trial project, a _proof of concept_).

## Summary

- The choice starts from the job: data model, workload, consistency, size, cost, team, ecosystem, legal aspects.
- Weighted decision matrix: criteria + weights, scoring, Σ (score × weight).
- Sensitivity analysis: is the decision stable if the weights change a little?
- A pivot in SQL: `SUM(…) FILTER (WHERE …)`.

## The lesson's exercise

Calculate every DBMS's **weighted score**: for each criterion multiply the score by the weight, add them up, and divide by **100**, giving a value between 1 and 5 (rounded to **2 decimals**). Columns: dbms, score; sorted **from best to worst**.

Hint: join the `ratings` and `criteria` tables on the `criterion` column.

```sql starter required
SELECT r.dbms, r.criterion, r.score
FROM ratings r
ORDER BY r.dbms, r.criterion;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT r.dbms,
       ROUND(SUM(r.score * c.weight) / 100.0, 2) AS weighted_score
FROM ratings r
JOIN criteria c ON c.criterion = r.criterion
GROUP BY r.dbms
ORDER BY weighted_score DESC;
```

</details>

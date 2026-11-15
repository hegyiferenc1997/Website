---
title: Final Practice – the Whole Course in One
summary: Review questions on the course's key ideas from design to performance, then a final SQL exercise that ties several topics together: joins, LEFT JOIN, grouping, filtered aggregation, NULL handling and ordering.
minutes: 30
kind: practice
---

## Review questions

Try to answer in your head first, and only then open the answer!

<details>
<summary>1. Why turn requirements into constraints (NOT NULL, UNIQUE, CHECK, foreign key) if the application checks anyway?</summary>

Because over time many programs write to a database: the web interface, an import script, a colleague by hand. The application's check protects only that one path; a constraint protects all of them. Besides, the program can have bugs – the database is the last line of defense.

</details>

<details>
<summary>2. How do you notice double counting in a report?</summary>

When you join a "1"-side table (e.g. orders) with an "N"-side one (items), the "1"-side rows repeat. A warning sign is when `COUNT(*)` gives more than `COUNT(DISTINCT key)`, or when the subtotals don't add up to the total. Fix: `COUNT(DISTINCT …)`, or aggregate first in a CTE and join afterwards.

</details>

<details>
<summary>3. What is the difference between pessimistic and optimistic locking?</summary>

Pessimistic locking (`SELECT … FOR UPDATE`) locks the row when reading, and others wait. Optimistic locking doesn't lock; on save it checks with a version number whether the row changed in the meantime; if it did, 0 rows change and the application retries. With rare conflicts and long edits, optimistic is better.

</details>

<details>
<summary>4. Why do you need LEFT JOIN to see every student, including those with no enrollments?</summary>

INNER JOIN keeps only rows that have a match on both sides – a student without enrollments would drop out. LEFT JOIN keeps every row of the left side and puts NULL in place of the missing right-side values.

</details>

<details>
<summary>5. What do AVG, SUM and COUNT return when every value is NULL or there are no rows?</summary>

`COUNT(column)` returns 0 (it doesn't count NULLs), but `SUM` and `AVG` return NULL. If you want to see 0 in the report, use `COALESCE(SUM(...), 0)`. For the average, NULL is often the right answer: someone with no grades has no average – 0 would be misleading.

</details>

## The final exercise: student summary

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

The student records system asks for a summary of **every student** – including those who haven't enrolled in anything yet. Columns:

1. `name`: the student's name,
2. `courses`: how many courses they enrolled in,
3. `credits`: the sum of credits of **completed** courses (grade at least 2); if there are none, **0** (not NULL),
4. `average`: the average of the grades rounded to **2 decimals** (an enrollment without a grade yet doesn't count; for someone with no grades it stays NULL).

Order: by credits descending, then by name ascending for equal credits.

A reminder of the useful tools: `LEFT JOIN` (topic 4), `FILTER (WHERE …)` after the aggregate function (this topic), `COALESCE` (a default instead of NULL), `ROUND`. `AVG` and `COUNT(column)` skip NULL values by themselves.

The starter code is almost right, but one student is missing from it, and it also counts the credits of failed courses.

```sql starter required
SELECT s.name,
       COUNT(e.code) AS courses,
       SUM(c.credits) AS credits,
       ROUND(AVG(e.grade), 2) AS average
FROM students s
JOIN enrollments e ON e.neptun = s.neptun
JOIN courses c ON c.code = e.code
GROUP BY s.neptun, s.name
ORDER BY credits DESC, s.name;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.name,
       COUNT(e.code) AS courses,
       COALESCE(SUM(c.credits) FILTER (WHERE e.grade >= 2), 0) AS credits,
       ROUND(AVG(e.grade), 2) AS average
FROM students s
LEFT JOIN enrollments e ON e.neptun = s.neptun
LEFT JOIN courses c ON c.code = e.code
GROUP BY s.neptun, s.name
ORDER BY credits DESC, s.name;
```

Why each part is there:

- **both** JOINs are `LEFT`, otherwise the second JOIN would "cut back" Emma Varga (her `e.code` is NULL, so there's no matching course);
- `COUNT(e.code)` and not `COUNT(*)`: for Emma the LEFT JOIN produces one row full of NULLs, which `COUNT(*)` would count as 1;
- `FILTER (WHERE e.grade >= 2)` sums only the credits of completed courses – an enrollment without a grade (NULL) doesn't count either, because `NULL >= 2` is not true;
- `COALESCE` turns Emma's NULL sum into 0, while her average stays NULL;
- `GROUP BY s.neptun, s.name`: we group by the key, so two students with the same name wouldn't merge.

Congratulations, you've made it through the Databases course! This single query needs your knowledge of design, SQL, NULL logic and reporting all at once.

</details>

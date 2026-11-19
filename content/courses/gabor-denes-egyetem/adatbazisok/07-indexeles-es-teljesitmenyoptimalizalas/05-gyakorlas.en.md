---
title: Practice – Indexing
summary: Review questions and an indexing case study: which query needs which index, and which condition can't use an index.
minutes: 25
kind: practice
---

## Review questions

<details>
<summary>1. Why don't we index every column?</summary>

Because every index takes storage and **slows down writes**: every `INSERT`, `UPDATE` and `DELETE` also updates all affected indexes. An unused index is just a burden.

</details>

<details>
<summary>2. Why can't the date index be used for <code>WHERE EXTRACT(YEAR FROM order_date) = 2026</code>?</summary>

Because the index is sorted by the values of `order_date`, while the condition searches a value **computed** from it (the year). Rewrite it as a range: `WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'` – the index can serve that.

</details>

<details>
<summary>3. There is a composite index on <code>(city, registered)</code>. Which query can use it: the one filtering only by city, or only by registration date?</summary>

The one filtering only by **city**. A composite index is usable by its leftmost prefix (like a phone book by surname), not by the second column alone.

</details>

<details>
<summary>4. Why might the DBMS choose a full table scan even if an index exists?</summary>

Because if the condition returns most rows (poor selectivity), or the table is small, reading everything at once is cheaper than jumping around through the index. The optimiser decides by cost estimation.

</details>

<details>
<summary>5. Why index foreign keys?</summary>

Because joins typically connect tables along foreign keys, and when a parent row is deleted the DBMS must find the child rows referring to it. Without an index both are full table scans.

</details>

## Case study: the web shop's slow pages

The web shop's developers collected the following queries. The `orders` table currently has only the primary key index.

```text
 A) SELECT * FROM orders WHERE customer_id = ? ORDER BY order_date DESC;
 B) SELECT * FROM orders WHERE status = 'shipping' AND order_date < ?;
 C) SELECT * FROM customers WHERE email LIKE '%@example.com';
 D) SELECT * FROM orders WHERE order_date >= '2026-01-01' AND order_date < '2026-02-01';
```

```quiz required
? Which index serves query A) best (filtering and sorting)?
- (order_date)
- (order_date, customer_id)
+ (customer_id, order_date)
- (status)
! First the equality-filtered column, then the sort column.

? Query B) always targets only "shipping" orders. Which index fits it best?
- a unique index on status
+ a partial index: (order_date) WHERE status = 'shipping'
- an expression index: LOWER(status)
- no index needed
! Small, and contains exactly the rows needed.

? Can a plain B-tree index on `email` help query C)?
- yes, always
+ no, because the pattern starts with %
! A B-tree is sorted by the start of the text.

? Query D) filters on a range. Which index helps it?
+ (order_date)
- (customer_id)
- (status, customer_id)
! B-trees are good for ranges too.

? In a table of 2,000,000 rows, about how many steps does binary search need to find a value (log₂, rounded up)?
= 21
! 2^21 = 2,097,152.

? The table has 30 rows. What will the optimiser most likely choose even if an index exists?
+ Seq Scan
- Index Scan
! For a small table a full scan is cheaper.
```

---
title: Practice – Storage and Internals
summary: Review questions about pages, indexes, the log and MVCC, a small "size estimation" case study on the web shop database, and a calculation worksheet.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Why does a DBMS read in pages (blocks) rather than row by row?</summary>

Because touching the disk is expensive, and most of it is "getting there" time. Once we're there, reading a whole page (8 KB in PostgreSQL) is cheap – and the neighbouring rows will quite likely be needed too.

</details>

<details>
<summary>2. Why are 3–4 levels in a B+ tree enough even for a hundred million rows?</summary>

Because a node is a whole page, so hundreds of keys and pointers fit into it. The powers of the fan-out (e.g. 200) grow very quickly: 200⁴ = 1.6 billion.

</details>

<details>
<summary>3. Why is COMMIT fast if the modified pages aren't written out immediately?</summary>

Because `COMMIT` only needs the WAL to be on disk, and we write that sequentially, to the end of the log. The scattered pages go out later, in one batch. After a crash, everything can be recovered from the log.

</details>

<details>
<summary>4. How can a long report see consistent data while others keep modifying it?</summary>

Thanks to MVCC: the report sees a snapshot, the row versions that were already final when it started. Changes create new versions, and the old ones stay as long as someone may see them.

</details>

<details>
<summary>5. When would you choose column storage?</summary>

For analytical (OLAP) workloads: many millions of rows, but only a few columns per query (sums, averages). Then only the needed columns have to be read, and they compress well.

</details>

## Case study: how big is the web shop?

Let's see how many pages the web shop's tables take up! `pg_relation_size` gives the size in bytes, which we divide by the page size (8192).

<details>
<summary>Creating the web shop sample database (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

```sql run
SELECT 'orders' AS table_name, COUNT(*) AS row_count,
       pg_relation_size('orders') / 8192 AS pages
FROM orders
UNION ALL
SELECT 'order_items', COUNT(*), pg_relation_size('order_items') / 8192 FROM order_items;
```

You can see: **more than a hundred** orders fit on a page. Looking up a single order without an index means reading every page; with the primary key's B-tree index, only a few. Compare the two plans:

```sql run
EXPLAIN SELECT * FROM orders WHERE order_id = 777;
```

```sql run
EXPLAIN SELECT * FROM orders WHERE order_date = '2025-05-05';
```

The first is an `Index Scan` (B-tree on the primary key), the second a `Seq Scan` – there's no index on the `order_date` column.

## The practice exercise

```quiz required
? A table has 2,000,000 rows, and on average 100 rows fit on a page. How many pages does it have?
= 20000
= 20,000
! 2,000,000 / 100.

? A B+ tree has a fan-out of 50. At least how many levels are needed for 100,000 keys?
= 3
! 50² = 2500 is too few, 50³ = 125,000 is enough.

? A query requests 400 pages, and 380 of them are hits in the buffer. How many pages have to be read from disk?
= 20
! The misses: 400 − 380.

? Which statement about the WAL is true?
- because of the WAL, every modified page must be written immediately
- the WAL only logs SELECT queries
+ after a crash, committed transactions can be recovered from the WAL
- the WAL can't be used for replication
! The log is the key to durability (D).

? A table has been growing for weeks although the number of live rows has barely changed, and lots of UPDATEs run on it. What is the most likely cause?
- TOAST compresses the data
+ VACUUM isn't cleaning up the dead row versions
- the B+ tree is too short
- the hash index scrambles the order
! This is called bloat.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

In these exercises we "look inside" PostgreSQL's storage: pages, row identifiers, sizes. The exercises run on the webshop database above.

**1.** **How many pages does it take?** The `relpages` column of the `pg_class` catalog table shows how many 8 KB **pages** a table takes. Query the name and page count of the four webshop tables, by name!

```sql starter
SELECT relname, relpages
FROM pg_class;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT relname, relpages
FROM pg_class
WHERE relname IN ('customers', 'products', 'orders', 'order_items')
ORDER BY relname;
```

</details>

**2.** **Rows per page.** Per table, compute **how many rows fit on a page** on average (`reltuples / relpages`, rounded to an integer)! Only look at tables taking at least 2 pages, sorted by name.

```sql starter
SELECT relname, reltuples, relpages
FROM pg_class
WHERE relname IN ('customers', 'products', 'orders', 'order_items');
```

<details>
<summary>Solution</summary>

```sql solution
SELECT relname, ROUND(reltuples / relpages) AS rows_per_page
FROM pg_class
WHERE relname IN ('customers', 'products', 'orders', 'order_items')
  AND relpages >= 2
ORDER BY relname;
```

</details>

**3.** **A row's physical address.** Every row has a hidden `ctid` column: **(page number, row number on the page)**. Query the `ctid` and name of the first 3 products by ID! Do you see that they're all on page 0?

```sql starter
SELECT name
FROM products
ORDER BY product_id
LIMIT 3;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT ctid, name
FROM products
ORDER BY product_id
LIMIT 3;
```

</details>

**4.** **How big is a row?** `pg_column_size(t.*)` gives the stored size of a row in bytes. What is the **average** size of a product row (rounded to an integer)?

```sql starter
SELECT pg_column_size(t.*) FROM products t;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT ROUND(AVG(pg_column_size(t.*))) AS average_bytes
FROM products t;
```

</details>

**5.** **Table versus index.** Compare the size in pages of the `orders` table and its primary key index (`orders_pkey`)! Which is smaller, and why? (Columns: name, pages, by name.)

```sql starter
SELECT relname, relpages
FROM pg_class
WHERE relname = 'orders';
```

<details>
<summary>Solution</summary>

```sql solution
SELECT relname, relpages
FROM pg_class
WHERE relname IN ('orders', 'orders_pkey')   -- the index only stores the key and the row's address
ORDER BY relname;
```

</details>

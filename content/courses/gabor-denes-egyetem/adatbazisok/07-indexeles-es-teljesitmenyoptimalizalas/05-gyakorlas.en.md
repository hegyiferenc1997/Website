---
title: Practice – Indexing
summary: Review questions and an indexing case study: which query needs which index, and which condition can't use an index.
minutes: 50
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

The exercises run on the webshop sample database (5,000 customers, 20,000 orders, 40,000 items), so indexes really matter here. You can put `EXPLAIN` in front of any query to see what the planner chooses.

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

**1.** **A simple index.** On the product page we often filter by category. Create an index on the `products.category` column, then query the products of the `peripheral` category (name, price) by price!

```sql starter
SELECT name, price
FROM products
WHERE category = 'peripheral'
ORDER BY price;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE INDEX idx_products_category ON products (category);

SELECT name, price
FROM products
WHERE category = 'peripheral'
ORDER BY price;
```

</details>

```sql test
SELECT (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'products' AND indexdef LIKE '%(category)%') AS has_index,
       (SELECT string_agg(name, ', ' ORDER BY price) FROM products WHERE category = 'peripheral') AS products;
```

**2.** **A partial index.** The warehouse only looks up orders that are **being shipped**, by date; done and cancelled orders aren't needed in the index. Create a **partial index** on `orders (order_date)` with the condition `WHERE status = 'shipping'`!

```sql starter
CREATE INDEX idx_shipping ON orders (order_date);
```

<details>
<summary>Solution</summary>

```sql solution
CREATE INDEX idx_shipping ON orders (order_date)
WHERE status = 'shipping';              -- only these rows go into the index → smaller, faster
```

</details>

```sql test
SELECT COUNT(*) AS partial_index
FROM pg_indexes
WHERE tablename = 'orders' AND indexdef LIKE '%(order_date) WHERE%shipping%';
```

**3.** **An expression index.** At login the user may type their e-mail address any way (lower or upper case), so the search has the form `LOWER(email) = ...`. A plain `email` index can't serve that. Create an index on the **expression** `LOWER(email)`, then find the ID and name of the customer with the address `Customer42@Example.com`!

```sql starter
SELECT customer_id, name
FROM customers
WHERE LOWER(email) = LOWER('Customer42@Example.com');
```

<details>
<summary>Solution</summary>

```sql solution
CREATE INDEX idx_customers_email_lower ON customers (LOWER(email));   -- exactly the searched expression

SELECT customer_id, name
FROM customers
WHERE LOWER(email) = LOWER('Customer42@Example.com');
```

</details>

```sql test
SELECT (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'customers' AND indexdef LIKE '%lower%') AS expression_index,
       (SELECT name FROM customers WHERE LOWER(email) = 'customer42@example.com') AS name;
```

**4.** **The "latest 5" query.** The "My orders" page shows the **5 newest** orders of customer 42 (ID, date, status), newest first; for the same date the larger ID comes first. (A composite `(customer_id, order_date)` index would serve exactly this, without sorting.)

```sql starter
SELECT order_id, order_date, status
FROM orders
WHERE customer_id = 42;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT order_id, order_date, status
FROM orders
WHERE customer_id = 42
ORDER BY order_date DESC, order_id DESC
LIMIT 5;
```

</details>

**5.** **Choosing an index with numbers.** What is the **selectivity**? Compute what percentage (rounded to 1 decimal) of orders are `cancelled`, `shipping` and `done`! (The smaller the percentage, the more an index search pays off.) Sorted by status.

```sql starter
SELECT status, COUNT(*)
FROM orders
GROUP BY status;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT status,
       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM orders), 1) AS percent
FROM orders
GROUP BY status
ORDER BY status;
```

</details>

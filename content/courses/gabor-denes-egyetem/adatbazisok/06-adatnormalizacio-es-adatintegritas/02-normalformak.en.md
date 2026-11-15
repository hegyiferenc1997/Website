---
title: The Normal Forms Step by Step
summary: The rules of 1NF, 2NF, 3NF and BCNF on a worked example (an orders table), 4NF in brief, and when it's worth denormalising on purpose.
minutes: 28
---

## What you will learn

- what the **1st, 2nd and 3rd normal forms** and **BCNF** require,
- how to **decompose** a bad table step by step,
- when it's worth **departing** from normalisation.

## A good memory aid

Many people remember 3NF as an oath: _"Every non-key attribute depends on the key, the whole key, and nothing but the key."_ It contains 1NF (there is a key), 2NF (the whole key) and 3NF (nothing else).

## The starting table

A web shop stores orders like this (unnormalised):

| order | date       | customer_id | cust_name | cust_city | products                              |
| ----- | ---------- | ----------- | --------- | --------- | ------------------------------------- |
| 1001  | 2026-11-02 | 7           | Anna Kiss | Budapest  | mouse ×2 (4990), keyboard ×1 (12990)  |
| 1002  | 2026-11-03 | 9           | Bela Nagy | Debrecen  | mouse ×1 (4990)                       |
| 1003  | 2026-11-03 | 7           | Anna Kiss | Budapest  | monitor ×1 (59990)                    |

## First normal form (1NF): atomic values

**Rule:** every cell holds **a single, indivisible** value; no repeating groups (a list in a cell, `product1`, `product2`… columns), and there is a primary key.

The `products` column holds a list – this breaks 1NF. Split it so every item is a separate row:

| order | item_product | date       | customer_id | cust_name | cust_city | product_name | unit_price | qty |
| ----- | ------------ | ---------- | ----------- | --------- | --------- | ------------ | ---------- | --- |
| 1001  | T1           | 2026-11-02 | 7           | Anna Kiss | Budapest  | mouse        | 4990       | 2   |
| 1001  | T2           | 2026-11-02 | 7           | Anna Kiss | Budapest  | keyboard     | 12990      | 1   |
| 1002  | T1           | 2026-11-03 | 9           | Bela Nagy | Debrecen  | mouse        | 4990       | 1   |
| 1003  | T3           | 2026-11-03 | 7           | Anna Kiss | Budapest  | monitor      | 59990      | 1   |

Key: `(order, item_product)`. Now it's 1NF, but there's a lot of duplication.

## Second normal form (2NF): no partial dependency

**Rule:** 1NF, and every non-key attribute depends on the **whole** key (not just part of it). It can only be broken with a composite key!

Partial dependencies:

- `order → date, customer_id, cust_name, cust_city` (depend only on the order),
- `item_product → product_name, unit_price` (depend only on the product),
- `(order, item_product) → qty` – the only full dependency.

Solution: whatever is determined by **part** of the key goes into a separate table, keyed by that part:

```text
 orders(order PK, date, customer_id, cust_name, cust_city)
 products(product PK, product_name, unit_price)
 order_items(order FK, product FK, qty, PK(order, product))
```

## Third normal form (3NF): no transitive dependency

**Rule:** 2NF, and no non-key attribute depends on **another non-key** attribute.

In the `orders` table: `order → customer_id → cust_name, cust_city`. The customer's name depends on the customer, not on the order – if Anna changes her name, every order of hers would need updating.

Solution: transitively dependent attributes get their own table:

```text
 customers(customer_id PK, cust_name, cust_city)
 orders(order PK, date, customer_id FK → customers)
 products(product PK, product_name, unit_price)
 order_items(order FK, product FK, qty, PK(order, product))
```

Done: every piece of data appears **once**. The anomalies are gone: you can add a new product any time, fix the customer's address in one place, and deleting an order doesn't take the customer with it.

## BCNF (Boyce–Codd normal form)

A slightly stricter version of 3NF: the left side of **every** non-trivial dependency must be a superkey. Most 3NF tables are BCNF too; they differ only in rare cases with several overlapping candidate keys.

Example: `booking(room, time, lecturer)` – a lecturer always teaches in the same room (`lecturer → room`), but `lecturer` isn't a key. This can be 3NF but not BCNF; the fix is again decomposition.

## 4NF in brief

4NF handles **multivalued dependencies**: if a lecturer teaches several courses **and** speaks several languages, and the two are independent, don't store them in one table as `(lecturer, course, language)` (every combination would be a separate row), but in two tables: `(lecturer, course)` and `(lecturer, language)`.

## When not to normalise?

A normalised schema is responsible for **correct** data, but queries need many joins. In analytical systems (data warehouses, topic 18) or for very frequently read data we sometimes **denormalise on purpose** – e.g. we also store the order total. But always **deliberately**, knowing the consequences (updates!), never by accident.

Rule of thumb for OLTP systems: **normalise to 3NF**, and denormalise only after measuring.

## Summary

- 1NF: atomic values, no repeating groups.
- 2NF: no partial dependency (depends on the whole key).
- 3NF: no transitive dependency (depends only on the key).
- BCNF: every determinant is a superkey. 4NF: independent multivalued facts separately.
- Denormalise only deliberately.

## Lesson exercise

```quiz required
? In a `pupils` table the `phone_numbers` column looks like "06301234567, 06209876543". Which normal form does it break?
+ 1NF
- 2NF
- 3NF
- BCNF
! Not an atomic value: a list in a cell.

? Which normal form **can't** be broken by a table whose key is a single column (and which is 1NF)?
- 1NF
+ 2NF
- 3NF
! Partial dependency is only possible with a composite key.

? `employees(employee_id PK, name, dept_id, dept_name)`. Which normal form does it break?
- 1NF
- 2NF
+ 3NF
! dept_name depends transitively: employee_id → dept_id → dept_name.

? In the lesson's example, how many tables did we end up with in 3NF?
= 4
! customers, orders, products, order_items.

? In `order_items(order, product, qty)`, what does `qty` depend on?
- only the order
- only the product
+ the whole key (order + product)
! It's a full dependency, so it can stay in this table.

? What do we call storing duplicated data on purpose for performance?
= denormalisation
= denormalization
= denormalizálás
! Only deliberately, backed by measurement.
```

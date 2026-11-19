---
title: Deeper – Design Patterns and Pitfalls in Real Systems
summary: Proven patterns (soft delete with a partial unique index, created/updated timestamps with a trigger, history table, status via CHECK or a lookup table, time-zone-aware timestamps) and typical anti-patterns (EAV, polymorphic references, comma-separated lists, the "everything" table) – each with a better solution, tried out in SQL.
minutes: 45
---

## What you will learn in this lesson

- the **proven patterns** that come up again and again in real systems – and when to use them,
- the most common **anti-patterns** (bad solutions that are tempting at first),
- and a **better alternative** for each, tried out with SQL.

This lesson ties together the whole course: modelling, normalisation, constraints, indexes, triggers and views working together.

## Pattern 1 – soft delete

In many systems deletion is really **hiding**: the row stays (it can be restored, old invoices refer to it, it's traceable), and a column just marks it as deleted.

```sql run
CREATE TABLE products (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        VARCHAR(40) NOT NULL,
  deleted_at  TIMESTAMP              -- NULL = active, filled = deleted
);
INSERT INTO products (name) VALUES ('Mouse'), ('Keyboard'), ('Monitor');

-- "Delete": just mark it
UPDATE products SET deleted_at = TIMESTAMP '2025-03-01 10:00' WHERE name = 'Monitor';

-- A view for the application: active products only
CREATE VIEW active_products AS
SELECT id, name FROM products WHERE deleted_at IS NULL;

SELECT * FROM active_products ORDER BY id;
```

Two pitfalls and their solutions:

1. **Forgotten filter.** If a programmer queries the table instead of the view, deleted rows show up too. → Grant the application rights only on the **view** (topic 10).
2. **Uniqueness.** Product names should be unique – but after deleting a "Monitor", it should be possible to add one with the same name again. A plain `UNIQUE (name)` would prevent that. → A **partial unique index**: valid only for active rows.

```sql
CREATE UNIQUE INDEX uq_product_name_active ON products (name) WHERE deleted_at IS NULL;
```

You'll write this yourself in the lesson's exercise. Caution: for a GDPR **erasure request**, soft delete isn't enough – personal data must actually be deleted or anonymised there (topic 15).

## Pattern 2 – created and updated timestamps

For almost every table it's useful to know **when** a row was created and last modified. A `DEFAULT` maintains the creation time, a **trigger** the modification time – so it doesn't depend on the program not forgetting it.

```sql run
CREATE TABLE articles (
  id          INT PRIMARY KEY,
  title       TEXT NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT TIMESTAMP '2025-03-01 09:00',  -- in a real system: now()
  updated_at  TIMESTAMP
);

CREATE FUNCTION set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := TIMESTAMP '2025-03-02 15:30';   -- in a real system: now()
  RETURN NEW;
END $$;

CREATE TRIGGER article_updated BEFORE UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO articles (id, title) VALUES (1, 'First article'), (2, 'Second article');
UPDATE articles SET title = 'First article (fixed)' WHERE id = 1;

SELECT * FROM articles ORDER BY id;
```

(The example uses a fixed time so the result is always the same; in production it's `now()` or `CURRENT_TIMESTAMP`.) A `BEFORE UPDATE` trigger can modify the `NEW` row **before it's saved**.

## Pattern 3 – history table

If you need to know not only *when* something changed but also **what it was before** (e.g. "what was the product's price last March?"), you need a **history table** with validity periods:

```sql run
CREATE TABLE price_history (
  product_id  INT,
  price       NUMERIC(10, 2),
  valid_from  DATE NOT NULL,
  valid_to    DATE                     -- NULL = currently valid
);
INSERT INTO price_history VALUES
  (1, 4490, '2024-01-01', '2024-09-30'),
  (1, 4990, '2024-10-01', '2025-05-31'),
  (1, 5490, '2025-06-01', NULL);

-- What was the price on 15 March 2025?
SELECT price FROM price_history
WHERE product_id = 1
  AND valid_from <= DATE '2025-03-15'
  AND (valid_to IS NULL OR valid_to >= DATE '2025-03-15');
```

This is the **"slowly changing dimension" (type 2)** pattern from data warehouses (topic 18), but it's common in everyday systems too: prices, addresses, positions, contract terms.

## Pattern 4 – status: CHECK or lookup table?

An order's status can only take a few values. Two good solutions:

| Solution                                     | Advantage                                      | When?                                         |
| -------------------------------------------- | ---------------------------------------------- | --------------------------------------------- |
| `status TEXT CHECK (status IN ('new', 'paid', 'shipped'))` | simple, no JOIN                    | few, rarely changing values                   |
| `status_id INT REFERENCES statuses`          | adding a value is a data change, not a schema change; extra data can be stored (name in two languages, order, colour) | many values, user-extensible list |

The **bad** solution: free text without a constraint – sooner or later there'll be `'Paid'`, `'payed'` and `'PAID'` too.

## Pattern 5 – time-zone-aware timestamps

In an international system `TIMESTAMP` (without time zone) is dangerous: "2025-03-30 02:30" – but in which country? (In Hungary that time doesn't even exist on that day: clocks jump from 2:00 to 3:00.) In PostgreSQL `TIMESTAMPTZ` (`TIMESTAMP WITH TIME ZONE`) stores the moment in UTC and converts it to the requested time zone on display:

```sql run
SELECT TIMESTAMPTZ '2025-07-01 12:00:00+00' AT TIME ZONE 'Europe/Budapest' AS budapest_time,
       TIMESTAMPTZ '2025-07-01 12:00:00+00' AT TIME ZONE 'America/New_York' AS new_york_time,
       TIMESTAMPTZ '2025-07-01 12:00:00+00' AT TIME ZONE 'Asia/Tokyo' AS tokyo_time;
```

**Rule of thumb:** `TIMESTAMPTZ` for **events** (login, order); `DATE` for **calendar dates** (birthday, holiday).

## Anti-patterns – what to avoid

### The EAV (entity–attribute–value) table

"It should be flexible, any attribute may come!" – and a table with three columns is born: `(entity_id, attribute, value)`.

```sql run
CREATE TABLE eav (product_id INT, attribute TEXT, value TEXT);
INSERT INTO eav VALUES
  (1, 'name', 'Monitor'), (1, 'price', '69990'), (1, 'size_inch', '27'),
  (2, 'name', 'Mouse'),   (2, 'price', 'cheap');            -- oops: the price is text!

-- Even a simple "name + price" query is cumbersome:
SELECT n.product_id, n.value AS name, p.value AS price
FROM eav n JOIN eav p ON p.product_id = n.product_id AND p.attribute = 'price'
WHERE n.attribute = 'name';
```

Problems: **no type checking** ("cheap" got in as a price), **no mandatory fields**, every query is a chain of self-joins, indexing is hard. **Better:** common, known attributes in proper columns, the truly variable, product-specific extras in a **JSONB** column (topic 11), with `CHECK` where needed.

### Polymorphic reference

A `comments` table that refers sometimes to a product, sometimes to an order, sometimes to a customer: `(target_type TEXT, target_id INT, body)`. **No foreign key can be put** on `target_id`, because it points to one table or another – so the DBMS can't guarantee that the referenced row exists. **Better:** separate junction tables (`product_comments`, `order_comments`), or several individually optional foreign key columns plus a `CHECK` that exactly one is filled.

### A comma-separated list in one field

`tags = 'sale,new,featured'` – it can't be searched properly (`LIKE '%new%'` also finds "renewed"), indexed, or validated against existing tags. **Better:** a junction table (N:M), or in PostgreSQL an array / JSONB column with a GIN index if the tags are simple strings.

### The "everything" table

A single `data` table with 120 columns, of which 10 are filled per row, because "everything is in one place". This is really several entities stacked on top of each other – the many `NULL`s and missing constraints are the telltale signs. **Better:** normalisation (topic 6), with specialisation where needed (topic 5).

## Summary table

| Situation                                        | Pattern                                            |
| ------------------------------------------------ | -------------------------------------------------- |
| delete, but keep                                 | soft delete + view + partial unique index          |
| when was it created / modified?                  | `DEFAULT` + `BEFORE UPDATE` trigger                |
| what was it like before?                         | history table with validity periods                |
| few fixed values                                 | `CHECK (… IN (…))`                                 |
| extensible value list                            | lookup table with a foreign key                    |
| time of an event                                 | `TIMESTAMPTZ`                                      |
| variable extra attributes                        | proper columns + JSONB (not EAV)                   |
| data attached to several kinds of "parent"       | separate junction tables (not a polymorphic reference) |

## Summary

- The proven patterns are built from the course's building blocks: views, partial indexes, triggers, constraints, history tables.
- What anti-patterns have in common is that they **throw away the DBMS's guarantees** (type, mandatory fields, foreign keys, uniqueness) in the name of "flexibility".
- Always ask: **what can the database guarantee**, and what must I leave to the program?

## Exercise

Implement the **soft delete** pattern on the `products` table in the starter code:

1. create the `active_products` **view**, showing the `id` and `name` columns of non-deleted (`deleted_at IS NULL`) products only;
2. create a **partial unique index** that ensures **active** products have unique names – while a deleted product's name can be added again.

The check tries a few inserts and queries the view.

```sql starter required
CREATE TABLE products (
  id         INT PRIMARY KEY,
  name       VARCHAR(40) NOT NULL,
  deleted_at TIMESTAMP
);
INSERT INTO products VALUES
  (1, 'Mouse', NULL), (2, 'Keyboard', NULL), (3, 'Monitor', '2025-03-01 10:00');

-- 1. the view
-- 2. the partial unique index
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE products (
  id         INT PRIMARY KEY,
  name       VARCHAR(40) NOT NULL,
  deleted_at TIMESTAMP
);
INSERT INTO products VALUES
  (1, 'Mouse', NULL), (2, 'Keyboard', NULL), (3, 'Monitor', '2025-03-01 10:00');

CREATE VIEW active_products AS
SELECT id, name FROM products WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX uq_product_name_active ON products (name) WHERE deleted_at IS NULL;
```

</details>

```sql test
CREATE FUNCTION try_it(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'succeeded';
EXCEPTION WHEN others THEN
  RETURN 'rejected';
END $$ LANGUAGE plpgsql;

CREATE TABLE results (seq INT, test TEXT, result TEXT);
INSERT INTO results VALUES
  (1, 'deleted name again (Monitor)', try_it($q$INSERT INTO products VALUES (4, 'Monitor', NULL)$q$)),
  (2, 'active name once more (Mouse)', try_it($q$INSERT INTO products VALUES (5, 'Mouse', NULL)$q$)),
  (3, 'adding a deleted Mouse', try_it($q$INSERT INTO products VALUES (6, 'Mouse', '2025-01-01')$q$));

SELECT seq::TEXT, test, result FROM results
UNION ALL
SELECT 'view', id::TEXT, name FROM active_products
ORDER BY 1, 2;
```

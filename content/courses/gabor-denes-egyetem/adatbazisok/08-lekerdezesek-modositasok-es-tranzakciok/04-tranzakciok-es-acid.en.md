---
title: Transactions and the ACID Principles
summary: What a transaction is, BEGIN, COMMIT, ROLLBACK and SAVEPOINT, the ACID properties, concurrency problems (dirty read, non-repeatable read, phantom, lost update), isolation levels, locking and deadlock.
minutes: 30
---

## What you will learn

- what a **transaction** is and why it's indispensable,
- how to use `BEGIN`, `COMMIT`, `ROLLBACK` and `SAVEPOINT`,
- what **ACID** means,
- what goes wrong when **many people work at once**, and what the DBMS does about it.

## The bank transfer problem

Anna transfers 5000 to Bela. That's **two** steps:

1. Deduct 5000 from Anna's balance.
2. Add 5000 to Bela's balance.

What happens if the power goes out after step 1? Anna's money is gone, Bela didn't get it. The two steps must happen **together** or **not at all**. That's what a **transaction** is for: a group of statements the DBMS treats as **a single, indivisible unit**.

## Bank accounts to try

```sql setup
CREATE TABLE accounts (
  account_id INT PRIMARY KEY,
  owner      VARCHAR(40) NOT NULL,
  balance    NUMERIC(12, 2) NOT NULL CHECK (balance >= 0)
);
INSERT INTO accounts VALUES (1, 'Anna', 50000), (2, 'Bela', 20000), (3, 'Cili', 10000);
```

## BEGIN, COMMIT, ROLLBACK

```sql run
BEGIN;
UPDATE accounts SET balance = balance - 5000 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 5000 WHERE account_id = 2;
COMMIT;
SELECT * FROM accounts ORDER BY account_id;
```

- `BEGIN` – starts the transaction.
- `COMMIT` – **makes it permanent**: from now on the change is durable and visible to other users.
- `ROLLBACK` – **undoes** all changes of the transaction, as if they had never happened.

```sql run
BEGIN;
UPDATE accounts SET balance = 0 WHERE account_id = 3;   -- oops, wrong statement!
SELECT * FROM accounts WHERE account_id = 3;            -- inside the transaction it's already 0
ROLLBACK;
SELECT * FROM accounts WHERE account_id = 3;            -- back to 10000
```

If a statement in a transaction **fails** (e.g. because of `CHECK (balance >= 0)`), PostgreSQL marks the whole transaction as "broken" and accepts only `ROLLBACK`. So it can't happen that the deduction succeeds but the credit doesn't.

### SAVEPOINT – partial undo

In a longer transaction you can set a **savepoint** and undo only back to it:

```sql run
BEGIN;
UPDATE accounts SET balance = balance - 1000 WHERE account_id = 1;
SAVEPOINT first_step;
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 3;   -- wrong account after all!
ROLLBACK TO SAVEPOINT first_step;                                     -- undo only this
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 2;   -- the right account
COMMIT;
SELECT * FROM accounts ORDER BY account_id;
```

## The ACID properties

| Letter | Property        | Meaning                                                                    |
| ------ | --------------- | -------------------------------------------------------------------------- |
| **A**  | _Atomicity_     | all or nothing: the transaction either runs completely or leaves no trace  |
| **C**  | _Consistency_   | a transaction takes the database from one valid state to another (all constraints hold) |
| **I**  | _Isolation_     | concurrent transactions don't interfere, as if they ran one after another  |
| **D**  | _Durability_    | a committed change survives a power cut (thanks to the log, topic 9)       |

## When many work at once

Thousands shop in a web shop at the same time. Without isolating transactions, these errors would occur:

- **Dirty read**: T2 reads data that T1 hasn't committed yet – and T1 later rolls back. T2 worked with a value that never existed.
- **Non-repeatable read**: T1 reads the same row twice, but T2 modified and committed it in between – the two reads differ.
- **Phantom read**: T1 runs the same query twice, but T2 inserted a **new row** in between, so more rows come back the second time.
- **Lost update**: T1 and T2 both read the stock (10), both sell one, and both write back 9 – though it should be 8.

## Isolation levels

The stricter the level, the fewer the errors – but the more waiting for each other.

| Level              | Dirty read  | Non-repeatable | Phantom    |
| ------------------ | ----------- | -------------- | ---------- |
| READ UNCOMMITTED   | possible*   | possible       | possible   |
| **READ COMMITTED** (PostgreSQL default) | no | possible | possible |
| REPEATABLE READ    | no          | no             | possible*  |
| SERIALIZABLE       | no          | no             | no         |

\* PostgreSQL is stricter: it never allows dirty reads, and its REPEATABLE READ excludes phantoms too.

Setting it: `BEGIN ISOLATION LEVEL SERIALIZABLE;`

## Locking and deadlock

The DBMS implements isolation with **locks** and **multi-version** technology (MVCC – each transaction sees its own "snapshot", topic 9). When a transaction modifies a row, it locks it, and anyone wanting to modify the same row **waits**.

Against lost updates, for example: `SELECT stock FROM products WHERE id = 7 FOR UPDATE;` – this locks the row at read time.

**Deadlock**: T1 locked row A and waits for B, T2 locked B and waits for A – they would wait for each other forever. The DBMS detects this and aborts one transaction with an error (it must be retried). Prevention: always lock rows **in the same order** (e.g. smaller id first) and keep transactions **short**.

## Summary

- Transaction = an indivisible unit: `BEGIN` … `COMMIT` / `ROLLBACK`; `SAVEPOINT` for partial undo.
- ACID: atomicity, consistency, isolation, durability.
- Concurrency errors: dirty, non-repeatable, phantom read, lost update.
- Isolation levels; locking, `FOR UPDATE`; deadlock → same locking order, short transactions.

## Lesson exercise

Using the accounts above (Anna 50,000, Bela 20,000, Cili 10,000):

1. In **one transaction**, transfer **5000** from Anna (1) to Bela (2), and commit it.
2. Start a **second transaction** in which Bela would transfer **8000** to Cili (3) – but Bela changes his mind, so **roll back** the transaction.

At the end the checker queries the balances.

```sql starter required
BEGIN;
UPDATE accounts SET balance = balance - 5000 WHERE account_id = 1;
COMMIT;
```

<details>
<summary>Solution</summary>

```sql solution
BEGIN;
UPDATE accounts SET balance = balance - 5000 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 5000 WHERE account_id = 2;
COMMIT;

BEGIN;
UPDATE accounts SET balance = balance - 8000 WHERE account_id = 2;
UPDATE accounts SET balance = balance + 8000 WHERE account_id = 3;
ROLLBACK;
```

</details>

```sql test
SELECT account_id, owner, balance FROM accounts ORDER BY account_id;
```

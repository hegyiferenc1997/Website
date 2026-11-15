---
title: SQL Injection
summary: How an innocent search box turns into data theft: how SQL injection works, tried out in a safe sandbox, and the defence: parameterised queries, least privilege and input validation.
minutes: 28
---

## What you will learn

- what **SQL injection** is, and why it's one of the most dangerous bugs,
- what an attack looks like – tried out in a **safe sandbox**,
- how to defend against it: **parameterised queries**, least privilege, input validation.

> This lesson teaches **defence**. The database running in your browser is on your own machine, with made-up data only – you can experiment freely here. Trying it on a real system without permission is a crime.

## What's the problem?

On a website, the user types a Neptun code into a search box, and the program builds the query by **string concatenation**:

```text
query = "SELECT * FROM students WHERE neptun = '" + input + "'"
```

If the input is `ABC123`, everything's fine:

```sql
SELECT * FROM students WHERE neptun = 'ABC123'
```

But what if someone types this: `x' OR '1'='1`?

```sql
SELECT * FROM students WHERE neptun = 'x' OR '1'='1'
```

The apostrophe in the input **closed** the string, and the rest ran **as SQL code**. `'1'='1'` is always true, so the query returns **every** student. The attacker "injected" data into the code – hence the name.

> Analogy: on a form, someone writes in the "Name" field: "John Smith. Also, the cashier should hand over the till." If the clerk reads out and carries out whatever is on the paper without thinking, there's trouble. The solution: text written in a field is **always just data**, never an instruction.

## Try it in the sandbox

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

The function below works exactly like the vulnerable program above: it builds the query by string concatenation, and `EXECUTE` runs it.

```sql run
CREATE FUNCTION find_student(p_neptun TEXT) RETURNS SETOF students AS $$
BEGIN
  RETURN QUERY EXECUTE
    'SELECT * FROM students WHERE neptun = ''' || p_neptun || '''';   -- VULNERABLE!
END $$ LANGUAGE plpgsql;

SELECT 'normal search' AS test, COUNT(*) AS matches FROM find_student('ABC123')
UNION ALL
SELECT 'attack', COUNT(*) FROM find_student($q$x' OR '1'='1$q$);
```

The normal search returns 1 row – the "attack" all 6. (`$q$…$q$` is just another way to write a string containing apostrophes in SQL.)

A real attacker would go much further: using `UNION SELECT` to read other tables (e.g. password hashes), or – if the account's privileges allow – modifying or deleting data.

## Why is it so dangerous?

- **Easy to exploit**: a browser and an apostrophe are enough.
- **Big damage**: entire databases have leaked this way, with the data of millions of users.
- **Common**: for years it has been among the top ten risks of OWASP (a web security organisation), in the "injection" category.

## The defence: parameterised queries

The solution is to send the **structure** of the query and the **data** to the database separately. The query only contains a **placeholder** (in PostgreSQL `$1`, `$2`, …; in other languages `?` or `:name`), and the value is passed separately. The database **always** treats the value as data, never interprets it as SQL code – whatever apostrophes it contains.

```sql run
CREATE FUNCTION find_student_safe(p_neptun TEXT) RETURNS SETOF students AS $$
BEGIN
  RETURN QUERY EXECUTE
    'SELECT * FROM students WHERE neptun = $1'    -- placeholder
    USING p_neptun;                               -- the value goes separately
END $$ LANGUAGE plpgsql;

SELECT 'normal search' AS test, COUNT(*) AS matches FROM find_student_safe('ABC123')
UNION ALL
SELECT 'attack', COUNT(*) FROM find_student_safe($q$x' OR '1'='1$q$);
```

The attack now returns 0 matches: the database looked for a Neptun code called `x' OR '1'='1`, and there's no such code.

In programming languages the same looks like this:

```text
Python (psycopg):   cur.execute("SELECT * FROM students WHERE neptun = %s", (user_input,))
Node.js (pg):       client.query("SELECT * FROM students WHERE neptun = $1", [userInput])
Java (JDBC):        PreparedStatement ps = conn.prepareStatement("… WHERE neptun = ?");
                    ps.setString(1, userInput);
```

**ORMs** (topic 17) also generate parameterised queries – as long as you don't start concatenating strings by hand in them.

## More layers of defence

Parameterisation is the basis, but good protection has **several layers** (_defence in depth_):

| Layer                          | What does it do?                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Parameterised queries**      | data never becomes code – this is the most important                                                                                       |
| **Least privilege**            | the application's account may only do what's needed (topic 10) – if someone gets in anyway, the damage is smaller                          |
| **Input validation**           | a Neptun code is exactly 6 letters or digits – anything else doesn't even reach the database                                               |
| **Allow-list for identifiers** | if the user sorts by a column, they may only choose from predefined column names (a table or column name can't be passed as a placeholder) |
| **Hiding error messages**      | the user shouldn't see the raw database error – it gives away the structure                                                                |
| **Logging and monitoring**     | suspicious queries (e.g. a sudden burst of errors) should raise an alarm                                                                   |

> "Sanitising" input (e.g. replacing apostrophes) is **not** reliable protection – there's always some encoding trick that gets through. Parameterise!

## Summary

- SQL injection: because of string concatenation, the input runs as SQL code.
- Defence: parameterised queries (placeholder + value passed separately).
- Extra layers: least privilege, input validation, allow-lists, hidden error messages, logging.
- "Sanitising" isn't enough.

## The lesson's exercise

The starter code contains a **vulnerable** function: `find_course(p_code)` searches the `courses` table by course code, but with string concatenation. Rewrite it to be **safe** so that it still uses `EXECUTE`, but the value is passed with a **placeholder** (`$1` and `USING`). (Keep the function's name and parameter!)

The checker runs a normal search and an attack: the normal search must return 1 match, the attack 0.

```sql starter required
CREATE FUNCTION find_course(p_code TEXT) RETURNS SETOF courses AS $$
BEGIN
  RETURN QUERY EXECUTE
    'SELECT * FROM courses WHERE code = ''' || p_code || '''';
END $$ LANGUAGE plpgsql;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE FUNCTION find_course(p_code TEXT) RETURNS SETOF courses AS $$
BEGIN
  RETURN QUERY EXECUTE
    'SELECT * FROM courses WHERE code = $1'
    USING p_code;
END $$ LANGUAGE plpgsql;
```

</details>

```sql test
SELECT 'normal search' AS test, COUNT(*) AS matches FROM find_course('ADB')
UNION ALL
SELECT 'attack', COUNT(*) FROM find_course($q$x' OR '1'='1$q$);
```

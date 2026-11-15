---
title: Authentication and Privileges
summary: The three goals of security (confidentiality, integrity, availability), the difference between authentication and authorization, the principle of least privilege, users and roles, access control models (DAC, RBAC, MAC) and auditing.
minutes: 20
---

## What you will learn

- what it means for a database to be **secure** (the CIA triad),
- the difference between **authentication** and **authorization**,
- what the **principle of least privilege** is, and why it's the golden rule,
- what **roles** are, and which access control models exist.

## Why does this matter?

The database holds a company's "assets": customers, password hashes, orders, payments, health or academic records. One badly set privilege is enough for an intern to accidentally drop a table, or for an intruder to download everything. The good news: most trouble can be prevented with a few simple principles.

## The three goals of security: the CIA triad

| Goal                  | Meaning                                         | Example of a violation                          |
| --------------------- | ----------------------------------------------- | ----------------------------------------------- |
| **Confidentiality**   | only those allowed should see the data          | the customers' email list leaks                 |
| **Integrity**         | data shouldn't change without authorization     | someone changes their own grade from 2 to 5     |
| **Availability**      | data should be accessible when needed           | the server goes down on exam registration day   |

Every security measure protects at least one of these three.

## Authentication and authorization

Two different questions that are often mixed up:

- **Authentication**: **Who are you?** – the system verifies your identity (password, certificate, two-factor authentication).
- **Authorization**: **What may you do?** – the system decides what an already identified user may see and change.

> Analogy: in an office building you show your access card at the reception (authentication). But your card only lets you onto certain floors (authorization).

A DBMS has both: PostgreSQL, for example, authenticates with a password or a certificate, and authorizes based on the privileges given with the `GRANT` statement (next lesson).

## The principle of least privilege

> Everyone gets **exactly as many** privileges as their job requires – and no more.

- The web shop's application may read and write orders, but it **may not drop a table** or create a new user.
- The analyst making reports may only **read**.
- Daily work does **not** run under the administrator (superuser) account.

Why? Because if an account is compromised (its password is stolen, or the code has a bug), the damage can only be as large as what that account can do.

## Users and roles

If 200 lecturers had to be given privileges one by one, and the rule changed tomorrow, you'd have to edit it in 200 places. Instead, we assign privileges to **roles** and put users into roles:

```text
   users                  roles                   privileges
   ─────                  ─────                   ──────────
   anna.kovacs ──┐
                 ├──►  lecturer    ──►  SELECT on every table, UPDATE on the grade
   peter.szabo ──┘
   eva.nagy    ────►  registrar   ──►  SELECT, INSERT, UPDATE on enrollments
   report_app  ────►  analyst     ──►  SELECT only
```

When a new lecturer arrives, you just put them into the role. In PostgreSQL, a user and a group are the same concept: a **role**; at most one can log in (`LOGIN`) and the other can't.

## Access control models

| Model                         | Who decides about privileges?                                  | Where do you meet it?                    |
| ----------------------------- | -------------------------------------------------------------- | ---------------------------------------- |
| **DAC** – Discretionary       | the object's **owner** may grant privileges to others          | SQL `GRANT`, file systems                |
| **RBAC** – Role-Based         | privileges belong to **roles**                                 | almost every business system, DBMSs      |
| **MAC** – Mandatory           | a central rule, **security labels** (e.g. secret, top secret)  | military, government systems             |

Relational DBMSs combine DAC and RBAC: the owner of a table may grant privileges, and privileges are handed out through roles. With row-level rules (lesson 3), MAC-like fine-tuning is possible too.

## Auditing

Besides prevention, it's important to **find out afterwards** who did what: who logged in, who changed grades, who queried an unusually large amount of data. This is called **auditing**. The audit log has to be stored so that the person being logged **can't modify it** – otherwise an intruder could erase their tracks.

## Summary

- CIA: confidentiality, integrity, availability.
- Authentication = who you are; authorization = what you may do.
- Least privilege: only as many privileges as the job requires.
- Privileges are assigned to roles, users are put into roles (RBAC).
- Auditing lets you find out afterwards who did what.

## The lesson's exercise

```quiz required
? A student logs in to the university system with their password. Which step is this?
+ authentication
- authorization
- auditing
! The system checks who you are.

? Someone changes their own grade without authorization. Which goal of the CIA triad was violated?
- confidentiality
+ integrity
- availability
! The data changed without authorization.

? A reporting application only needs to read data. According to the principle of least privilege, what should it get?
- superuser privileges, to be sure it works
- read and delete privileges
+ read-only (SELECT) privileges
- nothing at all
! Exactly as much as the job requires.

? In which model do privileges belong to roles, with users getting them through roles?
- DAC
+ RBAC
- MAC
! Role-Based Access Control.

? Why is it important that the person being logged can't modify the audit log?
- because otherwise the database would be slower
+ because an intruder could erase their tracks
- because the log is encrypted
- because the log is part of the WAL
! A log is only worth something if it's trustworthy.
```

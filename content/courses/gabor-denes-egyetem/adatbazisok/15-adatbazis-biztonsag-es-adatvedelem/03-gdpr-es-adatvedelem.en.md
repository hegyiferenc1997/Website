---
title: Data Protection and the GDPR
summary: What counts as personal data, the principles of the GDPR (purpose limitation, data minimisation, storage limitation), data subjects' rights (access, rectification, erasure, portability), reporting a personal data breach, and pseudonymisation and anonymisation – tried out in SQL.
minutes: 28
---

## What you will learn

- what counts as **personal data**,
- the most important **principles** of the **GDPR** and the **rights** of data subjects,
- how all this shows up in **database design**,
- the difference between **pseudonymisation** and **anonymisation**.

> This lesson presents data protection from a database developer's point of view, in plain terms. For a specific legal question, always ask a data protection expert (in a company: the data protection officer).

## What is personal data?

According to the **GDPR** (the European Union's General Data Protection Regulation, applicable since 2018), personal data is **any information by which a living person can be identified directly or indirectly**.

- directly: name, email address, phone number, ID card number, photo,
- indirectly: Neptun code, IP address, cookie ID, location data, or several pieces of data together (e.g. date of birth + postcode + sex – this trio is unique for many people!).

There are also **special** categories with even stricter rules: health data, biometric data, religious or political beliefs, sexual orientation, etc.

## The principles of the GDPR – through a developer's eyes

| Principle                        | Meaning                                                    | What it means in the database                                   |
| -------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| **Lawfulness, transparency**     | a legal basis is needed (e.g. contract, consent), and people must be informed | consent (when, for what) must be stored too       |
| **Purpose limitation**           | may only be used for the stated purpose                    | don't use the delivery address for advertising without a legal basis |
| **Data minimisation**            | collect only the strictly necessary data                   | no "might come in handy" columns (e.g. mother's name in a web shop) |
| **Accuracy**                     | data should be accurate and up to date                     | there should be a way to correct it                             |
| **Storage limitation**           | keep it only as long as necessary                          | retention periods, automatic deletion or anonymisation          |
| **Integrity, confidentiality**   | appropriate security                                       | privileges, encryption, auditing (topics 10, 15)                |
| **Accountability**               | you must be able to prove you comply                       | documentation, logs of who saw or changed what                  |

The GDPR explicitly expects **data protection by design and by default**: it has to be considered at design time, not stuck on afterwards.

## Data subjects' rights

People (the "data subjects") have rights regarding their data. The system has to be designed so these can be fulfilled:

| Right                              | What can the data subject ask?                           | What does it mean technically?                             |
| ---------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| **Access**                         | "What data do you store about me?"                       | a person's data must be collectable from every table       |
| **Rectification**                  | "Correct my address."                                    | modifiable data, in one place (normalisation!)             |
| **Erasure** ("to be forgotten")    | "Delete my data."                                        | deletion or anonymisation in every table – backups must be considered too |
| **Data portability**               | "Give me my data in a machine-readable format."          | export e.g. as JSON or CSV                                 |
| **Objection, restriction**         | "Don't use my data for marketing."                       | flags (e.g. `marketing_consent`) and honouring them        |

If a person's data is scattered across twenty tables under five different identifiers, fulfilling these is a nightmare. A good data model helps a lot here too.

## Personal data breach

If personal data falls into unauthorised hands (e.g. a database leaks), that's a **personal data breach**. Under the GDPR it must, as a rule, be reported to the supervisory authority **within 72 hours** (in Hungary, the NAIH), and if the risk is high, the data subjects must be notified too. That's why **logging** matters: without it, you can't even find out what leaked.

## Pseudonymisation and anonymisation

For analyses (e.g. "in which major and which semester do the most students drop out?") we often don't need to know **who** the person is.

- **Pseudonymisation**: we replace the identifier with a pseudonym, and store the link between the two **separately, protected**. This is **still personal data** (the link can be restored), but the risk is much smaller.
- **Anonymisation**: we transform the data so the person can no longer be identified **by any reasonable means**. Truly anonymous data is no longer covered by the GDPR – but real anonymisation is harder than you'd think!

Common techniques:

| Technique             | Example                                                    |
| --------------------- | ---------------------------------------------------------- |
| **Omission**          | the name and Neptun code are left out                      |
| **Generalisation**    | only the year instead of the date of birth; only the county instead of the exact address |
| **Masking**           | `anna.kiss@example.com` → `a***@example.com`               |
| **Aggregation**       | only group averages instead of individual rows, hiding small groups |

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

Masking and generalisation in SQL:

```sql run
SELECT LEFT(name, 1) || '***' AS name_masked,
       major,
       EXTRACT(YEAR FROM born) AS birth_year,
       city
FROM students
ORDER BY major, name;
```

Careful: small groups can be **re-identified**! If there's only one student in a major who was born in 2004 and lives in Budapest, their "anonymous" row still reveals who they are. That's why small groups are usually hidden in aggregations:

```sql run
SELECT major, semester, COUNT(*) AS headcount
FROM students
GROUP BY major, semester
HAVING COUNT(*) >= 2          -- groups of 1 don't appear
ORDER BY major, semester;
```

## Summary

- Personal data: anything by which a living person can be identified – indirectly too.
- Principles: purpose limitation, data minimisation, accuracy, storage limitation, security, accountability; data protection by design.
- Rights: access, rectification, erasure, portability, objection – a good data model helps fulfil them.
- Breach: as a rule, must be reported within 72 hours.
- Pseudonymisation (still personal data) vs. anonymisation (no longer); watch out for small groups.

## The lesson's exercise

The analytics team asks for a **view** called `students_anonymous`. The starter code currently passes every column – this violates the principle of **data minimisation**. Rewrite it so the view contains **only** these three columns, in this order:

1. `major`,
2. `semester`,
3. `birth_year` – **only the year** of the date of birth (`EXTRACT(YEAR FROM born)`).

The name, the Neptun code, the city and the exact date of birth must **not** be in it.

```sql starter required
CREATE VIEW students_anonymous AS
  SELECT * FROM students;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE VIEW students_anonymous AS
  SELECT major,
         semester,
         EXTRACT(YEAR FROM born) AS birth_year
  FROM students;
```

</details>

```sql test
SELECT * FROM students_anonymous ORDER BY 1, 2, 3;
```

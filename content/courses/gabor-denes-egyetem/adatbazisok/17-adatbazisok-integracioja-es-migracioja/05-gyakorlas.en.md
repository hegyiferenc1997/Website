---
title: Practice – Integration and Migration
summary: Review questions about ORMs, the API layer, ETL, schema migrations and data migration, then a migration case study with decision questions.
minutes: 25
kind: practice
---

## Review questions

<details>
<summary>1. Why is it important that the application doesn't connect as a superuser, and that the password isn't in the code?</summary>

Because of the principle of least privilege: if the application has a bug or the password leaks, the attacker can only do as much as the restricted account allows. And a password written into the code reaches everyone who sees the code through version control, and it doesn't disappear from the git history either.

</details>

<details>
<summary>2. What do we gain if the other systems reach the database through an API?</summary>

The rules and authorization checks are in one place, the internal schema can change freely as long as the API stays the same, and access can be logged and limited. Systems don't break each other by renaming a column.

</details>

<details>
<summary>3. Why must a migration file that has already run not be modified?</summary>

Because the migration tool has already marked it as run, and would never run the change again in the other environments (where it has already run) – so the environments' schemas would diverge. The mistake has to be fixed with a new migration.

</details>

<details>
<summary>4. How would you safely rename a column in a live system?</summary>

With the "expand, then contract" pattern: create the new column, the application writes to both, copy the old data over, switch reading to the new column, and finally – when nothing uses it anymore – drop the old column. An immediate `RENAME` would break the old code still running.

</details>

<details>
<summary>5. What checks would you do after a data migration?</summary>

Matching counts between source and target, comparing important totals (e.g. invoice totals), a checksum over the key fields, spot checks, reviewing the error table of rejected rows, and finally testing the application on the new data.

</details>

## Case study: migrating a student records system

A university is replacing its twenty-year-old, in-house student records program (with an old database) with a new, PostgreSQL-based system. 30,000 students, 2 million grade entries. The system can't stop for long during the semester.

```quiz required
? What should the first step of the migration be?
+ an inventory: what data there is, where, in what quality, and who uses it
- copy every table into the new system right away
- delete the old system's data so there's no confusion
- buy the most powerful server
! Without a thorough survey, mapping and cleaning are flying blind.

? In the old system dates are text in the format "2005.03.14". What's the right solution in the new system?
- take them over as text, as they are
+ a `DATE` column, converted with `to_date(…, 'YYYY.MM.DD')` while loading
- three separate number columns (year, month, day)
! The date type checks validity and sorts properly.

? After loading, the source has 2,000,000 grade entries and the target 1,999,412. What should be done?
- nothing, it's a negligible difference
+ find and analyse the missing 588 rows (e.g. from the error table), and fix the script
- delete 588 rows from the source too
- restart the server
! Silently lost data in a student records system is unacceptable.

? Which cutover strategy fits best if the system can't stop for long during the semester?
- all at once (big bang), on a weekday morning
+ dual writes or change data capture (CDC), then switching over in a short window
- first switch off the old one, then start the migration
! That way the two systems run in sync for a while, and the switch is short.

? A week after the new system goes live, a serious bug is discovered. What's needed to survive this?
+ a rollback plan worked out in advance, and keeping the old system's data until the new one has proven itself
- deleting the old system immediately on cutover day
- nothing, bugs can't happen
! Always have a plan B.
```

---
title: Practice – Planning and the Critical Path
summary: Review questions and a complete critical path calculation as a summary worksheet.
minutes: 30
kind: practice
---

## Review questions

<details>
<summary>1. Why does a WBS consist of nouns rather than verbs?</summary>

Because the WBS breaks down deliverables (what must be produced), not the steps of the work. Activities (verbs) appear below the work packages, in the activity list.

</details>

<details>
<summary>2. Draw up a WBS for a university conference website (2 levels are enough)!</summary>

1. Conference website: 1.1 Project management; 1.2 Content (programme, speakers, venue); 1.3 Branding and UI; 1.4 Registration module; 1.5 Testing; 1.6 Launch (domain, hosting, publishing).

</details>

<details>
<summary>3. Why is the critical path the longest path through the network?</summary>

Because the project ends only when every path has been completed. The longest path determines the shortest possible duration, and there is no float on it.

</details>

<details>
<summary>4. What is the difference between an assumption and a constraint?</summary>

A constraint is a fixed, known condition (e.g. a fixed budget, a mandatory deadline). An assumption is uncertain but taken as true for planning – if it turns out to be false, it becomes a risk.

</details>

## Summary worksheet

Activities of a mobile app development project (durations in days):

| Act. | Description          | Duration | Predecessor |
| ---- | -------------------- | -------- | ----------- |
| A    | requirements         | 4        | –           |
| B    | UI design            | 3        | A           |
| C    | back-end development | 5        | A           |
| D    | UI development       | 2        | B           |
| E    | database and API     | 4        | C           |
| F    | testing and release  | 3        | D, E        |

```text
          ┌───► B (3) ───► D (2) ───┐
 A (4) ───┤                         ├───► F (3)
          └───► C (5) ───► E (4) ───┘
```

```quiz required
? What is the early start (ES) of activity F?
= 13
= 13 days
! ES(F) = max(EF(D), EF(E)) = max(9, 13).

? What is the shortest duration of the project, in days?
= 16
= 16 days
! EF(F) = 13 + 3.

? What is the float of activity B, in days?
= 4
= 4 days
! LS(B) = 8, ES(B) = 4.

? Which is the critical path?
- A → B → D → F
+ A → C → E → F
- A → B → C → F
- C → E → F
! 4 + 5 + 4 + 3 = 16 days, every activity has zero float.

? If activity D slips 3 days, how many days will the project take?
= 16
= 16 days
! D has 4 days of float, so a 3-day slip does not push the project end.

? Which document examines the TELOS criteria?
- project charter
+ feasibility study
- WBS dictionary
- Gantt chart
! Technical, economic, legal, operational, scheduling feasibility.
```

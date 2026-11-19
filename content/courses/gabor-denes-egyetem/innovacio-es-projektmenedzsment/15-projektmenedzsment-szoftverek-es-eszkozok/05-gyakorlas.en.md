---
title: Practice – PM Software and Summary
summary: Review questions and a summary worksheet for the fifteenth topic, with calculation exercises covering the whole course.
minutes: 25
kind: practice
---

## Review questions

<details>
<summary>1. A team of 4 students is working on a semester assignment. Which tool would you suggest, and why?</summary>

A simple Kanban board, e.g. Trello or GitHub Projects: free, quick to learn, and with GitHub Projects the tasks are linked directly to the code. MS Project or an over-configured Jira would be an unnecessary burden for a team this size.

</details>

<details>
<summary>2. Why is over-configuration dangerous when introducing a PM tool?</summary>

Because with too many states and mandatory fields the team stops updating the issues, so the tool shows an outdated picture of the project and management decides on bad data. Start simple and extend only when there is a real need.

</details>

<details>
<summary>3. After the new tool is introduced, management still asks for Excel reports. Which ADKAR step suffers, and what should be done?</summary>

Reinforcement: if the report is made the old way, it is not worth it for the team to keep the new tool up to date. Management should get its information from the tool's dashboard, and the old spreadsheets should be closed.

</details>

<details>
<summary>4. In the capstone project CPI = 0.8. Name two possible project manager decisions!</summary>

Reducing scope (postponing a feature to the next version) or requesting extra budget from the sponsor – both through the change control process. It is also worth investigating the cause of the overrun (e.g. underestimation, missing expertise).

</details>

## Summary worksheet

```quiz required
? Weights: features 0.6, cost 0.4. Tool "X" scores 3 and 5. What is its weighted score?
= 3.8
! 0.6 · 3 + 0.4 · 5 = 1.8 + 2.0.

? A tool costs 10 euros per user per month. What is the yearly licence cost for an organisation of 25, in euros?
= 3000
! 10 · 25 · 12.

? Which tool is rather the home of the project's **documentation** ("memory")?
- Trello
- MS Project
+ Confluence
- Jira
! A knowledge base: minutes, decision log, charter.

? How can the Definition of Done be automated in a Jira-like tool?
- with more mandatory fields on every issue
+ with a workflow rule: "Done" only after green tests and an approved code review
- by deleting issues at the end of the sprint
- by hiding the burndown chart
! A transition condition in the workflow.

? Activities: A 2 days; B 5 days (after A); C 3 days (after A); D 2 days (after B and C). How many days does the project take?
= 9
= 9 days
! A–B–D: 2 + 5 + 2.

? EV = 30, PV = 40. What is the SPI?
= 0.75
! EV / PV.
```

---
title: Practice – Software Development
summary: Review questions and a summary worksheet on the life cycle, development models and testing.
minutes: 20
kind: practice
---

## Review questions

<details>
<summary>1. Write two functional and two non-functional requirements for a university canteen ordering app!</summary>

Functional: “A student can pre-order their lunches for the week.” “A canteen worker can see the list of the day's orders.” Non-functional: “It serves 2,000 simultaneous users at noon.” “It works on mobile and desktop and is accessible.”

</details>

<details>
<summary>2. Why is the waterfall model a poor fit for a new mobile app whose market is still uncertain?</summary>

Because user needs are discovered and change along the way; with waterfall they would only see the product at the end. With an agile method a testable version is made every two weeks, and the direction can change based on feedback.

</details>

<details>
<summary>3. What edge cases would you test for an `average(items)` function?</summary>

Empty list, one-element list, negative numbers, decimals, a very long list, and whether it modifies the input list.

</details>

```python run
# Let's test a function that finds the largest element, with edge cases too
def largest(items):
    if not items:
        return None
    m = items[0]
    for x in items:
        if x > m:
            m = x
    return m

assert largest([3, 9, 2]) == 9
assert largest([-5, -2, -8]) == -2   # only negatives
assert largest([7]) == 7             # one element
assert largest([]) is None           # empty list
print("All tests passed.")
```

## Summary worksheet

```quiz required
? What is the second phase of the SDLC after requirements?
- testing
+ design
- maintenance
- deployment
! Requirements → design → implementation → testing → deployment → maintenance.

? What is a 1–4 week development cycle in Scrum called?
= sprint
! At its end there is a testable product version.

? Which test level does the client perform?
- unit test
- integration test
- system test
+ acceptance test
! It checks whether they got what they asked for.

? What does the `largest` function above return for the list `[-5, -2, -8]`?
= -2
! Among the negative numbers, −2 is the largest.

? Which user story has the correct form?
+ As a student I want to download the notes so that I can study offline.
- The database should be PostgreSQL.
- The button should be blue.
- Let's write lots of code.
! Role – need – goal.

? What is the CD in CI/CD?
+ Continuous Delivery/Deployment
- compact disc
- code review
- central documentation
! The tested version can be released automatically.
```

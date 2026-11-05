---
title: Data Collection and Basic Analysis
summary: Designing questionnaires and interviews, sampling and biases, the Likert scale, and the mean, median and standard deviation – with a runnable Python example.
minutes: 20
---

## What you will learn

- how to design a good **questionnaire** and **interview**,
- what **sampling** means and what **biases** can occur,
- what a **Likert scale** is,
- how to calculate the **mean**, **median** and **standard deviation**.

## Questionnaires

**A good questionnaire:**

- is **short** – every question has a purpose (5–10 minutes to fill in),
- has **unambiguous** questions, each about one thing,
- uses **neutral** wording (not leading: "You're satisfied with our fast site, aren't you?"),
- has answer options that **cover** all cases without overlapping,
- is **tested** on a few people first (pilot).

Avoid **double-barrelled questions**: "How fast and easy to use is the app?" – what if it's fast but hard to use? Split it into two questions.

## The Likert scale

A **Likert scale** measures the degree of agreement with a statement, typically on 5 levels:

```text
"The app is easy to use."
1 – strongly disagree
2 – disagree
3 – neutral
4 – agree
5 – strongly agree
```

## Interviews

- **Structured** (pre-written, same questions) – easy to compare.
- **Semi-structured** (a question list + flexible probing) – the most common.
- Open questions, active listening, questioning techniques (see topic 3).
- Ask for **consent** to record, and handle data confidentially (GDPR, see topic 8).

## Sampling and biases

We can rarely ask everyone (the **population**), so we choose a **sample**.

- **Random sample**: everyone has an equal chance of being included – best for generalising.
- **Convenience sample**: whoever is easy to reach (e.g. your own year group) – fast, but can be biased.

Common biases:

| Bias                                     | Example                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| **sampling bias**                        | you only ask active members of a Discord server – they are more committed |
| **self-selection**                       | only people with strong opinions answer                                   |
| **survivorship bias**                    | you only study successful startups, not the failed ones                   |
| **social desirability**                  | respondents say what is "expected" ("I study every day")                  |
| **confirmation bias** (the researcher's) | you only notice what confirms your hypothesis                             |

## Basic descriptive statistics

- **Mean**: the sum of the values divided by their count.
- **Median**: the middle value of the sorted values (for an even count, the mean of the two middle ones). Less sensitive to outliers.
- **Mode**: the most frequent value.
- **Standard deviation**: how spread out the values are around the mean.

```python run
# Descriptive statistics of answers to a Likert question (1–5).
import statistics

answers = [4, 5, 3, 4, 2, 5, 4, 4, 3, 5]

print("Number of answers:", len(answers))
print("Mean:", statistics.mean(answers))
print("Median:", statistics.median(answers))
print("Mode:", statistics.mode(answers))
print("Standard deviation (sample):", round(statistics.stdev(answers), 2))
```

Try it: add a few 1s to the list and watch how the mean and the median change!

> An outlier example: four developers earn 600, 650, 700 and 750 thousand HUF a month, and a manager 3 million HUF. The mean is 1.14 million – nobody earns that. The median, 700 thousand, better shows the typical salary.

## Summary

- Questionnaire: short, unambiguous, neutral, no double-barrelled questions, piloted.
- Likert scale: degree of agreement on 5 levels.
- Sampling: a random sample is best; watch out for biases.
- Mean, median, mode, standard deviation – with outliers the median is more reliable.

## Exercise

```quiz required
? "How fast and easy to use is the app?" What's wrong with this survey question?
- it's too short
+ it's double-barrelled: it asks two things at once
- it's an open question
- it's too neutral
! Split it into two questions.

? What is the **median** of the answers 2, 3, 3, 4, 5?
= 3
! The middle value of the sorted values.

? What is the **mean** of the answers 2, 3, 4, 5, 6?
= 4
! (2 + 3 + 4 + 5 + 6) / 5 = 4.

? You only ask people who successfully completed your course how useful it was. Which bias is a danger here?
- social desirability
+ survivorship bias
- confirmation bias
- none
! The dropouts' opinions are missing.
```

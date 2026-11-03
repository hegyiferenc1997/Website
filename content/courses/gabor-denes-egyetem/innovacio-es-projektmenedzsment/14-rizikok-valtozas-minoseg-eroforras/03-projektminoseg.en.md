---
title: Project Quality
summary: What quality is, quality planning, quality assurance (QA) and quality control (QC), the cost of quality and the 1:10:100 rule, ISO 9001, the seven basic quality tools and quality in software projects.
minutes: 25
---

## What you will learn

- what **quality** means in a project,
- the difference between **quality assurance** (QA) and **quality control** (QC),
- what the **cost of quality** is and why prevention pays off,
- the basic **quality tools**.

## What is quality?

- **Philip Crosby**: quality is **conformance to requirements**.
- **Joseph Juran**: quality is **fitness for use**.
- **ISO 9000**: the degree to which a set of inherent characteristics **fulfils requirements**.

> Quality is not the same as **grade**: a cheap app with few features (low grade) can be of excellent quality (bug-free), and an expensive, feature-rich system can be of poor quality (buggy).

## The three processes of quality management

| Process                    | Question                                            | Example                                               |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------------- |
| **quality planning**       | Which standards must be met, and how do we measure? | coding rules, test coverage ≥ 80%, Definition of Done |
| **quality assurance** (QA) | Are we **doing it** right? (the **process**)        | code review, process audit, automated tests in CI     |
| **quality control** (QC)   | Is the **result** right? (the **product**)          | testing, inspection, measurement before handover      |

> In short: **QA prevents** (watches the process), **QC detects** (examines the product).

## The cost of quality

| Group                       | Cost type            | Example                                                        |
| --------------------------- | -------------------- | -------------------------------------------------------------- |
| **cost of conformance**     | **prevention**       | training, standards, design reviews                            |
|                             | **appraisal**        | testing, inspection, measuring tools                           |
| **cost of non-conformance** | **internal failure** | fixing a defect found before handover, scrap                   |
|                             | **external failure** | a defect showing up at the customer, warranty, lost reputation |

The **1:10:100 rule**: what costs 1 unit to prevent costs about 10 to fix internally and about 100 when it shows up at the customer. Fixing a requirements error during design takes minutes; in production it can take days and cost customers.

## ISO 9001 and TQM

- **ISO 9001** is the international standard for quality management systems; an organisation can be certified to it. Its principles include customer focus, the process approach, **PDCA** and evidence-based decision making.
- **TQM** (Total Quality Management) holds that quality is **everyone's** responsibility and is achieved through continuous improvement (Kaizen, topic 5). **Deming**'s 14 points underlie it.

## The seven basic quality tools (Ishikawa)

1. **Cause-and-effect (fishbone) diagram** – organising the possible causes of a problem (e.g. people, method, machine, material, measurement, environment).
2. **Pareto chart** – causes by frequency, in descending order (80/20).
3. **Check sheet** – collecting data with tally marks.
4. **Histogram** – the distribution of a quantity.
5. **Scatter diagram** – the relationship between two variables.
6. **Control chart** – is the process stable? Do values stay between the upper and lower control limits?
7. **Flowchart** (or stratification).

```text
 Fishbone:     people ──┐  method ──┐
                        ├───────────┼────────► PROBLEM: slow page
               tools ───┘  measure ─┘
```

## Quality in software projects

- **Definition of Done**: e.g. the code is reviewed, tests are green, documentation is updated,
- **code review**, **pair programming**,
- **automated tests** (unit, integration, end-to-end) and **continuous integration** (CI),
- **static code analysis**, a code formatter,
- measuring **non-functional** requirements (performance, security – ISO 25010, topic 8).

## Summary

- Quality = conformance to requirements / fitness for use; not the same as grade.
- Quality planning, QA (process, prevention), QC (product, detection).
- Cost of quality: prevention, appraisal, internal failure, external failure; the 1:10:100 rule.
- ISO 9001, TQM, Deming.
- Seven tools: fishbone, Pareto, check sheet, histogram, scatter diagram, control chart, flowchart.

## Lesson exercise

```quiz required
? Which is a characteristic of **quality assurance** (QA)?
+ it watches the process; its goal is preventing defects
- it tests the finished product before handover
- it only fixes defects that appear at the customer
- it checks the budget
! QA = prevention, QC = detection.

? Which is an **external failure** cost?
- training the developers
- running automated tests
- fixing a defect found before handover
+ warranty repairs and lost reputation due to a defect at the customer
! External failure: the customer finds the defect.

? By the 1:10:100 rule, if preventing a defect costs 2 units, about how many units does it cost when it shows up at the customer?
= 200
! 2 · 100.

? Which tool organises the **possible causes** of a problem by category?
+ cause-and-effect (fishbone) diagram
- histogram
- control chart
- Gantt chart
! The Ishikawa diagram.

? A cheap app with few features but no bugs is:
- of low quality
+ of low grade but high quality
- of high grade and low quality
- impossible to assess
! Quality and grade are two separate things.
```

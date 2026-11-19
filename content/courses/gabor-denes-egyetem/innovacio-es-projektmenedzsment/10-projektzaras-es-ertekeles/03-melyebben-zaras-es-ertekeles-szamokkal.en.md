---
title: Deeper – Closing and Evaluation in Numbers
summary: The handover decision from acceptance test results (a go / no-go rule with a program), the plan–actual comparison of the success criteria, the post-project evaluation of benefits with payback and an interactive chart, and the evaluation of a retrospective vote.
minutes: 35
---

## What you will learn in this lesson

- how to make a **transparent** handover decision from acceptance test results,
- how to evaluate the project's **success criteria** in numbers (plan vs. actual),
- how to measure the project's **benefits** after closing (payback, ROI),
- how to quickly summarise the result of a **retrospective**.

## 1. Handover: go or no-go?

After the acceptance test we decide by a **rule** agreed with the customer in advance. For example: a pass rate of at least 95%, no open critical bugs, and at most 3 open major bugs.

```python run
# Handover decision: based on acceptance test results and open bugs
tests = {"passed": 188, "failed": 7, "not run": 5}
open_bugs = {"critical": 0, "major": 2, "medium": 6, "cosmetic": 11}

def decision(tests, bugs, min_rate=0.95, max_major=3):
    rate = tests["passed"] / sum(tests.values())         # a test that wasn't run doesn't count as passed
    reasons = []
    if rate < min_rate:
        reasons.append(f"pass rate {rate:.1%} < {min_rate:.0%}")
    if bugs["critical"] > 0:
        reasons.append(f"{bugs['critical']} open critical bugs")
    if bugs["major"] > max_major:
        reasons.append(f"{bugs['major']} open major bugs > {max_major}")
    return ("GO" if not reasons else "NO-GO"), rate, reasons

result, rate, reasons = decision(tests, open_bugs)
print(f"pass rate: {rate:.1%} → {result}", *reasons, sep="\n  ")

# If the 5 tests that weren't run are run too, and all pass:
tests.update({"passed": 193, "not run": 0})
print("\nafter a new run:", decision(tests, open_bugs)[0])
```

The first run is **NO-GO**: the pass rate is 94%, because tests that weren't run can't be counted as passed. Once they're run, the decision is GO – the two major and the other minor bugs can be fixed during the warranty period. The point: the rule must be fixed **in advance**, before the test, otherwise at handover there'll be an endless argument about what's "good enough".

## 2. Success criteria: plan and actual

One of the central tables of the final report is the plan–actual comparison of the project triangle (and quality):

```python run
# Evaluating success criteria: plan vs. actual, percentage deviation and a weighted success score
criteria = [  # (name, plan, actual, weight, "less is better"?)
    ("deadline (weeks)", 20, 23, 0.25, True),
    ("cost (million Ft)", 50, 54, 0.25, True),
    ("requirements delivered (count)", 40, 38, 0.30, False),
    ("user satisfaction (1–5)", 4.0, 4.3, 0.20, False),
]
total = 0
for name, plan, actual, weight, less in criteria:
    deviation = (actual - plan) / plan
    achievement = min(1.2, plan / actual if less else actual / plan)   # 1 = exactly the plan, max 120%
    total += weight * achievement
    print(f"{name:<33} plan {plan:>5}  actual {actual:>5}  deviation {deviation:+6.1%}  achievement {achievement:5.0%}")
print(f"\nweighted success score: {total:.0%}")
```

The project slipped by 15% and became 8% more expensive, but it delivered 95% of the requirements, and users are more satisfied than expected. The weighted score (about 95%) sums this up – but in the final report the **details** matter: why did the project slip? Those become the lessons learned.

## 3. Post-project evaluation of benefits

The project's goal isn't the software but the **benefit** it brings – and that can often be measured only months after closing. An internal administration system cost 60 million forints; after closing we measure the monthly saving (less paperwork, faster processing), which grows gradually during the rollout:

```python run
# Post-project benefit evaluation: cumulative saving vs. investment, payback month and 3-year ROI
investment = 60.0                                  # million Ft
savings = [0.5, 1.0, 1.5, 2.0, 2.5] + [3.0] * 31   # million Ft/month: gradual ramp-up, then stable
cumulative, paid_back = 0.0, None
for month, s in enumerate(savings, 1):
    cumulative += s
    if paid_back is None and cumulative >= investment:
        paid_back = month
print(f"payback: in month {paid_back}")
roi = (cumulative - investment) / investment
print(f"over 3 years: cumulative saving {cumulative:.1f} M Ft, ROI {roi:.0%}")
```

The system pays back in month 23, and yields about 68% over 3 years. If the saving were only 2 million a month, payback would take more than two and a half years – that's why **benefits realisation** must continue after the project too, and be compared with the figures promised in the business case.

```plot
title: Cumulative net result (million Ft) as a function of months, 60 million Ft investment
x: 0, 36
y: -60, 60
param: b = 3, 1, 5, 0.1
f: -60 + b*x # cumulative saving − investment
dash: 0 # payback
```

In the simplified model (without ramp-up) the payback point is $60 / b$ months. Set the monthly saving ($b$) to 2 and to 4, and watch how the payback point moves!

## 4. Retrospective: evaluating the votes

At the retrospective the team writes sticky notes ("what went well", "what didn't"), then everyone votes on the most important ones with 3 dots. The evaluation is simple counting:

```python run
# Retrospective dot voting: which topics should we deal with in the next project?
from collections import Counter

votes = ["late requirement changes", "good team spirit", "slow test environment",
         "late requirement changes", "slow test environment", "late requirement changes",
         "too many meetings", "good team spirit", "slow test environment",
         "late requirement changes", "too many meetings", "good code review"]
for topic, count in Counter(votes).most_common(3):
    print(f"{count} dots – {topic}")
```

The two problems with the most votes (late requirement changes, slow test environment) become the lessons learned, each with a **concrete action** and an owner (e.g. "we'll set up the change request process at the start of the next project"). Lessons learned are only worth something if they get into the organisation's knowledge base, and someone actually takes them out when the next project starts.

## Summary

- The handover decision should follow a measurable rule fixed in advance (pass rate, open bugs by severity).
- Success criteria are evaluated by plan–actual comparison; for "less is better" indicators the plan/actual ratio is the achievement.
- Benefits are often realised only after closing: payback month, ROI; these must be compared with the business case.
- Retrospective voting is simple counting; lessons learned need an action and an owner.

## Lesson exercise

```quiz required
? Of 200 acceptance tests 186 passed, 10 failed, 4 weren't run. What is the pass rate (%)?
= 93
! $186 / 200 = 0.93$ – a test that wasn't run doesn't count as passed.

? The planned cost is 40 million Ft, the actual is 46 million Ft. What is the overrun in %?
= 15
! $(46 - 40) / 40 = 0.15$.

? A 30 million forint system brings a saving of 2.5 million Ft a month (no ramp-up). In which month does it pay back?
= 12
! $30 / 2.5 = 12$.

? A project cost 50 million and brought 80 million Ft of benefit over 3 years. What is the ROI (%)?
= 60
! $(80 - 50) / 50 = 0.6$.

? Why must the handover conditions be fixed before the test?
- because bugs can't be fixed after the test
+ because this avoids an argument afterwards about what counts as "good enough"
- because the customer can decide only before the test
- because the rule depends on the test result
! A measurable acceptance rule fixed in advance makes an objective decision possible.
```

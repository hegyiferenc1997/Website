---
title: Practice – Closure and Evaluation
summary: Review questions and a summary worksheet for the tenth topic.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. Why is it not enough for the team to declare the system "done"?</summary>

Because the project is closed by the client's acceptance. Without the acceptance test and a signed handover record there can be disputes about what was delivered and who is responsible for later defects.

</details>

<details>
<summary>2. What would you do if the acceptance test reveals 2 critical and 15 minor defects?</summary>

Critical defects must be fixed before handover and retested. Minor defects can go on a punch list with deadlines, agreed with the client, and handover can take place with them if the client accepts.

</details>

<details>
<summary>3. Why is it worth collecting lessons learned not only at the end of the project?</summary>

Because by the end we forget a lot, and the lessons could already be used during the project. Regular retrospectives improve the project itself.

</details>

<details>
<summary>4. What is the difference between the final report and the post-implementation review (PIR)?</summary>

The final report is written at closure and mainly evaluates project management success (schedule, cost, scope). The PIR is done months later and examines whether the result really brings the business benefits.

</details>

## Summary worksheet

```quiz required
? What is the correct order of the closure steps?
+ acceptance test → handover → transfer to operations → administrative closure
- administrative closure → acceptance test → handover → operations
- transfer to operations → acceptance test → administrative closure → handover
- kick-off → acceptance test → handover → operations
! Acceptance first, then handover, finally the paperwork.

? At the end of a project BAC = 60 million, actual cost AC = 50 million, and all the work is done. What is the final CPI?
= 1.2
! 100% of the work is done → EV = BAC = 60; CPI = 60 / 50.

? The planned finish was 20 weeks, the actual 25 weeks. What was the delay in percent?
= 25
= 25%
! (25 − 20) / 20 · 100.

? Which reason does **not** justify terminating a project early?
- the business case has disappeared
- the technology does not work
- a hopeless cost overrun
+ we have already spent a lot of money on it, so it must be finished
! Sunk cost is no argument.

? Which "L" of the 4L retrospective asks what was missing?
- Liked
- Learned
+ Lacked
- Longed for
! Lacked = what was missing.

? The business case promised 30 million in benefits over 3 years; 8 million was realised in the first year. If the pace continues, how many millions will it be over the 3 years?
= 24
= 24 million
! 3 · 8.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Go or no-go?** Write the function `decision(passed, failed, not_run, critical, major, min_rate=0.95, max_major=3)`! It returns `"GO"` if the pass rate (a test that wasn't run doesn't count as passed) is at least `min_rate`, there are no open critical bugs, and the number of major bugs is at most `max_major`; otherwise `"NO-GO"`.

```python starter
def decision(passed, failed, not_run, critical, major, min_rate=0.95, max_major=3):
    rate = passed / (passed + failed)
    return "GO" if rate >= min_rate else "NO-GO"
```

<details>
<summary>Solution</summary>

```python solution
def decision(passed, failed, not_run, critical, major, min_rate=0.95, max_major=3):
    rate = passed / (passed + failed + not_run)    # a test not run isn't a pass either
    ok = rate >= min_rate and critical == 0 and major <= max_major
    return "GO" if ok else "NO-GO"
```

</details>

```python test
assert decision(188, 7, 5, 0, 2) == "NO-GO"
assert decision(193, 7, 0, 0, 2) == "GO"
assert decision(195, 5, 0, 1, 0) == "NO-GO"
assert decision(196, 4, 0, 0, 4) == "NO-GO"
print("All checks passed!")
```

**2.** **Benefits afterwards.** Write the function `payback(investment, savings)`, which tells in which month the cumulative saving reaches the investment (if never, `None`), and the function `roi(investment, savings)` (the ROI of the whole period in %, rounded to a whole number)!

```python starter
def payback(investment, savings):
    return round(investment / (sum(savings) / len(savings)))

def roi(investment, savings):
    return round(100 * sum(savings) / investment)
```

<details>
<summary>Solution</summary>

```python solution
def payback(investment, savings):
    cumulative = 0
    for month, s in enumerate(savings, 1):
        cumulative += s
        if cumulative >= investment:
            return month                   # it paid back here
    return None

def roi(investment, savings):
    return round(100 * (sum(savings) - investment) / investment)   # profit / investment
```

</details>

```python test
assert payback(30, [10, 10, 5, 10]) == 4
assert payback(100, [10] * 5) is None
assert payback(60, [0.5, 1.0, 1.5, 2.0, 2.5] + [3.0] * 31) == 23
assert roi(50, [20, 20, 20]) == 20
print("All checks passed!")
```

**3.** **Success score.** Write the function `success_score(criteria)`, which from a list of `(plan, actual, weight, less_is_better)` quadruples computes the weighted success score in % (rounded to a whole number)! The achievement is plan/actual if less is better, actual/plan otherwise, but at most 1.2.

```python starter
def success_score(criteria):
    return round(100 * sum(w * min(1.2, actual / plan) for plan, actual, w, _ in criteria))
```

<details>
<summary>Solution</summary>

```python solution
def success_score(criteria):
    total = 0
    for plan, actual, weight, less in criteria:
        a = plan / actual if less else actual / plan   # the direction matters
        total += weight * min(1.2, a)
    return round(100 * total)
```

</details>

```python test
assert success_score([(20, 23, 0.25, True), (50, 54, 0.25, True), (40, 38, 0.30, False), (4.0, 4.3, 0.20, False)]) == 95
assert success_score([(20, 20, 1, True)]) == 100
assert success_score([(10, 20, 0.5, True), (10, 20, 0.5, False)]) == 85
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the purpose of a retrospective?
- finding the culprit
+ learning together: what went well, what didn't, and what we'll do differently next time
- calculating the project's cost
- closing the contract
! A retrospective is a blame-free, forward-looking discussion.

? What should be done if a project has to be stopped early?
- simply stop working
+ an orderly closure: recording results and lessons, closing contracts, releasing the team
- secretly carry on
- restart it as a new project
! A stopped project needs a closure too.

? Of 300 acceptance tests 282 passed. What is the pass rate (%)?
= 94
! $282 / 300 = 0.94$.

? A system cost 40 million and saves 2 million Ft a month. In which month does it pay back?
= 20
! $40 / 2 = 20$.
```

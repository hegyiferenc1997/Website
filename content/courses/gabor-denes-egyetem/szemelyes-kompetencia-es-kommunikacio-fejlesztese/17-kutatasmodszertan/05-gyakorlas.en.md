---
title: Practice – Research Methodology
summary: Review questions and a summary worksheet on the research process, data collection and analysis, and sources and citation; designing a mini study.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Design a mini study: how much do first-year computer engineering students sleep during the exam period?</summary>

Research question: "How many hours per night do first-year computer engineering students sleep on average during the exam period compared with the teaching period?" Method: a quantitative questionnaire (two questions: sleep time in the teaching and exam periods), ideally on a random sample of the year group; anonymous (reducing social desirability). Analysis: mean, median, standard deviation for both periods. Limitations: self-report; bias if a convenience sample is used.

</details>

<details>
<summary>2. Rewrite neutrally: "You also think the new interface is much better, don't you?"</summary>

"How would you rate the new interface compared with the old one?" – or with a Likert scale: "The new interface is easier to use than the old one. (1 – strongly disagree … 5 – strongly agree)".

</details>

<details>
<summary>3. Why is the median better than the mean for describing salaries?</summary>

Because salary distributions are usually skewed: a few very high values pull the mean up, so it doesn't show the typical salary. The median is the middle value, so it is less sensitive to outliers.

</details>

<details>
<summary>4. An AI chatbot recommends three papers for your thesis, with authors and years. What do you do?</summary>

I look up all three in a reliable database (Google Scholar, IEEE Xplore, university library). If one doesn't exist, I don't use it. If it exists, I read the original and cite from it, not from the chatbot's summary.

</details>

## Summary worksheet

> A development team studies whether a new, shorter login flow reduces the time needed to log in. The login times of 10 test users (seconds): 8, 9, 10, 10, 11, 12, 12, 12, 14, 42.

```quiz required
? What is the **dependent variable** in this study?
- the version of the login flow
+ the time needed to log in
- the test users' names
- the size of the development team
! What is measured.

? What is the **mean** of the times in seconds?
= 14
! 140 / 10 = 14.

? What is the **median** of the times in seconds?
= 11.5
= 11,5
! The mean of the two middle values (11 and 12).

? Why do the mean and the median differ so much?
- because of a calculation error
+ the 42-second outlier pulls the mean up
- because there are few users
- because the median is always smaller
! The median is less sensitive to outliers.

? The team chose the test users from among their own colleagues. What is the main risk?
+ sampling bias: colleagues know the system better than real users do
- survivorship bias
- plagiarism
- too large a sample
! A convenience sample, not representative.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Margin of error.** Write the function `margin(p, n)`, which gives the 95% margin of error of a proportion: $1.96 \cdot \sqrt{p(1-p)/n}$ (to 3 decimals)!

```python starter
def margin(p, n):
    return round(1.96 * p * (1 - p) / n, 3)
```

<details>
<summary>Solution</summary>

```python solution
from math import sqrt

def margin(p, n):
    return round(1.96 * sqrt(p * (1 - p) / n), 3)   # 95% confidence
```

</details>

```python test
assert margin(0.5, 100) == 0.098
assert margin(0.6, 400) == 0.048
assert margin(0.5, 1000) == 0.031
print("All checks passed!")
```

**2.** **Required sample size.** Write the function `required_n(error, p=0.5)`, which gives at least how many respondents are needed for the given margin of error: $(1.96 / \text{error})^2 \cdot p(1-p)$, rounded up!

```python starter
def required_n(error, p=0.5):
    return round((1.96 / error) ** 2 * p * (1 - p))
```

<details>
<summary>Solution</summary>

```python solution
from math import ceil

def required_n(error, p=0.5):
    return ceil((1.96 / error) ** 2 * p * (1 - p))   # always up: "at least"
```

</details>

```python test
assert required_n(0.05) == 385
assert required_n(0.03) == 1068
assert required_n(0.1) == 97
assert required_n(0.05, 0.1) == 139
print("All checks passed!")
```

**3.** **A/B test z-value.** Write the function `z_test(a_reg, a_vis, b_reg, b_vis)`, which gives the z-value of the difference of two proportions based on the pooled proportion: $z = (p_B - p_A) / \sqrt{p(1-p)(1/n_A + 1/n_B)}$ (to 2 decimals)!

```python starter
def z_test(a_reg, a_vis, b_reg, b_vis):
    return round(b_reg / b_vis - a_reg / a_vis, 2)
```

<details>
<summary>Solution</summary>

```python solution
from math import sqrt

def z_test(a_reg, a_vis, b_reg, b_vis):
    pa, pb = a_reg / a_vis, b_reg / b_vis
    p = (a_reg + b_reg) / (a_vis + b_vis)            # pooled proportion under the null hypothesis
    return round((pb - pa) / sqrt(p * (1 - p) * (1 / a_vis + 1 / b_vis)), 2)
```

</details>

```python test
assert z_test(30, 400, 48, 400) == 2.15
assert z_test(50, 500, 50, 500) == 0.0
assert z_test(48, 400, 30, 400) == -2.15
print("All checks passed!")
```

### Quick check questions

```quiz
? What does the $|z| > 1.96$ rule mean in an A/B test?
+ the difference is statistically significant at the 5% threshold
- B is at least 1.96% better
- the test ran for 1.96 days
- the sample is too small
! This is the limit of the two-sided 5% threshold.

? How many times larger a sample do you need to cut the margin of error to a third?
= 9
! The margin of error shrinks as $1/\sqrt{n}$: $3^2 = 9$.

? Your questionnaire got 2000 responses on a Discord server. What's the biggest problem?
- too many responses
+ the sample isn't random (self-selection), so even a large number doesn't make it representative
- the margin of error is too small
- there's no problem
! The margin-of-error formula only holds for a random sample.

? What is the strongest method for establishing a causal relationship?
- a correlation measured on a large sample
+ an experiment with random assignment (e.g. an A/B test)
- an expert's opinion
- a blog post
! Random assignment balances out hidden variables.
```

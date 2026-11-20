---
title: Practice – Intercultural Communication and Ethics
summary: Review questions and a summary worksheet on cultural dimensions, context, views of time and communication ethics.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Why isn't knowing the language enough in an international team?</summary>

Because most of culture is hidden: attitudes to power, time and feedback. The same sentence (e.g. "we'll consider it") can mean yes in one culture and a polite no in another.

</details>

<details>
<summary>2. How can you avoid stereotyping if you know Hofstede's dimensions?</summary>

Treat them as hypotheses, not verdicts: if a reaction surprises you, consider a cultural cause, but ask, and get to know the individual. Within one country the spread is large.

</details>

<details>
<summary>3. A Japanese partner says about your proposal: "This is interesting, we need to examine it." What should you do?</summary>

Don't automatically take it as a yes. Tactfully ask about next steps and possible concerns, perhaps one-on-one or through an intermediary, and give time for their group to consult.

</details>

<details>
<summary>4. Why is it an ethical question what you paste into a public AI chatbot?</summary>

Because the pasted text (company code, customer data, personal data) goes to the provider and, depending on the settings, may be used or stored. This can breach confidentiality (NDA) and data protection rules (GDPR).

</details>

## Summary worksheet

> You work in a Hungarian–Indian–Dutch team, the client is in the USA.

```quiz required
? The American client writes: "Deadline: 03/04/2027". What should you do?
- take it as 4 March and not ask
- take it as 3 April and not ask
+ ask back, and use an unambiguous format in your reply (e.g. 2027-03-04)
- ignore it
! The USA uses month/day, Europe day/month.

? The Dutch colleague openly criticises the Indian colleague's plan in front of the team, who then goes quiet. As team lead, what is the best step?
- nothing, openness is always good
+ discuss with the team how we give feedback, and ask for negative criticism one-on-one
- forbid criticism
- exclude the Indian colleague from meetings
! A shared way of working, avoiding loss of face.

? The team works in Budapest (CET), Bangalore (CET + 4.5 hours) and San Francisco (CET − 9 hours). How many hours is the time difference between Bangalore and San Francisco?
= 13.5
= 13,5
! 4.5 − (−9) = 13.5 hours.

? You want to analyse the client's customer database quickly with a public AI chatbot. What should you do?
- paste it in, it's faster
+ first check whether it's allowed, and only use anonymised data
- send it to the team chat
- print it
! Data protection and confidentiality.

? Which phrase follows inclusive language?
- "Even my grandma understands this."
- "This isn't a task for girls."
+ "I'll explain this part step by step so everyone can follow easily."
- "A real programmer knows this by themselves."
! Respectful, not condescending.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Shared working hours.** Write the function `shared_hours(o1, o2)`, which gives the shared working time in hours of people in two cities offset `o1` and `o2` hours from UTC, if both work from 9 to 17 local time! (You can assume neither working day crosses midnight in UTC.)

```python starter
def shared_hours(o1, o2):
    return 8 - abs(o1 - o2) / 2
```

<details>
<summary>Solution</summary>

```python solution
def shared_hours(o1, o2):
    s1, e1 = 9 - o1, 17 - o1                  # working hours in UTC
    s2, e2 = 9 - o2, 17 - o2
    return max(0, min(e1, e2) - max(s1, s2))  # intersection of the two intervals
```

</details>

```python test
assert shared_hours(1, -5) == 2
assert shared_hours(1, 5.5) == 3.5
assert shared_hours(1, 1) == 8
assert shared_hours(9, 0) == 0
print("All checks passed!")
```

**2.** **Expected value.** Write the function `expected(effects)`, which computes the expected value from a list of `(probability, effect)` pairs (to 2 decimals)!

```python starter
def expected(effects):
    return round(sum(e for _, e in effects) / len(effects), 2)
```

<details>
<summary>Solution</summary>

```python solution
def expected(effects):
    return round(sum(p * e for p, e in effects), 2)   # probability-weighted sum
```

</details>

```python test
assert expected([(0.9, 10), (0.1, -200)]) == -11.0
assert expected([(1.0, -5), (1.0, 15)]) == 10.0
assert expected([(0.5, 4), (0.5, 0)]) == 2.0
print("All checks passed!")
```

**3.** **Overlap of distributions.** A trait of members of two cultures is normally distributed, and their means are `d` standard deviations apart. Write the function `overlap(d)`, which gives the share of the area shared under the two curves (to 2 decimals): $2 \cdot \Phi(-|d|/2)$, where $\Phi(z) = \frac12\left(1 + \mathrm{erf}(z/\sqrt2)\right)$!

```python starter
def overlap(d):
    return round(1 - d / 4, 2)
```

<details>
<summary>Solution</summary>

```python solution
from math import erf, sqrt

def phi(z):
    return 0.5 * (1 + erf(z / sqrt(2)))       # standard normal distribution function

def overlap(d):
    return round(2 * phi(-abs(d) / 2), 2)
```

</details>

```python test
assert overlap(0) == 1.0
assert overlap(1) == 0.62
assert overlap(2) == 0.32
assert overlap(-1) == 0.62
print("All checks passed!")
```

### Quick check questions

```quiz
? What does high-context communication mean?
+ much is conveyed by the situation, the relationship and unspoken signals
- everything is said precisely and literally
- people only communicate in writing
- lots of jargon is used
! E.g. Japan; low-context cultures (e.g. Germany) rely on the spoken word.

? Budapest is UTC+1, Bengaluru UTC+5.5. Both work 9–17. How many hours of shared working time are there? (as a decimal)
= 3,5
= 3.5
! In UTC Budapest works 8–16, Bengaluru 3.5–11.5: the overlap is 8–11.5, i.e. 3.5 hours.

? Which is an example of inclusive language?
- "the guys will do it"
+ "the team will do it"
- "even my grandma would get this"
- "that's an insane idea"
! It doesn't exclude or label anyone.

? What does the ACM Code of Ethics advise about a known bug that endangers users?
- keep quiet until you fix it
+ be honest and avoid harm: tell those affected
- tell only your boss, never anyone else
- it's the users' job to notice
! Avoiding harm and honesty are core principles.
```

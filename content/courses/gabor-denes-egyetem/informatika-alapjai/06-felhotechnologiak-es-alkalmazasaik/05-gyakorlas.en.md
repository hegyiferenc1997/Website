---
title: Practice – Cloud Technologies
summary: Review questions and a summary worksheet on the cloud, organising work and visualisation.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. A startup builds a web application but doesn't want to operate servers. Which model should it choose, and why?</summary>

PaaS (e.g. Vercel, Heroku, Google App Engine): they only upload the code; the provider handles the operating system, updates and scaling.

</details>

<details>
<summary>2. A team of four writes an assignment. How would you organise the work with cloud tools?</summary>

One shared document (Google Docs or Word online) with comments and suggestion mode; a Kanban board (Trello, Planner) with tasks, owners and deadlines; a chat channel (Teams, Discord) for quick questions; a shared calendar for meetings.

</details>

<details>
<summary>3. Which chart would you choose to show how study time relates to test scores?</summary>

A scatter plot: every student is a point, study time on the x axis, the score on the y axis.

</details>

**Mini project:** make a one-page infographic in Canva or a chart in Google Sheets about how many hours you study each day for a week! Give it a title that states its message, and mark the source (your own measurement).

## Summary worksheet

```quiz required
? Which service model is Microsoft 365?
- IaaS
- PaaS
+ SaaS
! Ready software by subscription.

? Which one is among the three largest public cloud providers?
+ Microsoft Azure
- Canva
- Trello
- Discord
! AWS, Azure, Google Cloud.

? Which cloud property means you get more machines within minutes under load?
= scalability
= scalable
! Scalability.

? Which chart is for comparing categories (e.g. the student numbers of five universities)?
- line chart
+ column chart
- scatter plot
- histogram
! Categories → column or bar.

? In which column of a Kanban board is the task you are working on right now?
= In progress
! To do → In progress → Done.

? What must a good infographic include besides the data?
+ the source
- as many fonts as possible
- 3D charts
- at least ten different colours
! The source makes it verifiable.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Redundancy.** Write the `availability(a, n)` function, which gives the availability of a service with `n` independent servers, each working a fraction `a` of the time, if one of them is enough (to 5 decimals)!

```python starter
def availability(a, n):
    return round(a * n, 5)
```

<details>
<summary>Solution</summary>

```python solution
def availability(a, n):
    return round(1 - (1 - a) ** n, 5)       # it's down only if all fail at once
```

</details>

```python test
assert availability(0.9, 1) == 0.9
assert availability(0.9, 2) == 0.99
assert availability(0.99, 2) == 0.9999
assert availability(0.95, 3) == 0.99987
print("All checks passed!")
```

**2.** **Cloud or own?** Write the `cheaper(hourly_rate, utilisation, own_monthly)` function, which returns `"cloud"` if the cloud's monthly cost (hourly rate × 720 hours × utilisation) is less than the own server's monthly cost, otherwise `"own"`!

```python starter
def cheaper(hourly_rate, utilisation, own_monthly):
    return "cloud"
```

<details>
<summary>Solution</summary>

```python solution
def cheaper(hourly_rate, utilisation, own_monthly):
    cloud_monthly = hourly_rate * 720 * utilisation   # we pay only for running time
    return "cloud" if cloud_monthly < own_monthly else "own"
```

</details>

```python test
assert cheaper(120, 0.25, 58000) == "cloud"
assert cheaper(120, 1.0, 58000) == "own"
assert cheaper(100, 0.5, 36000) == "own"
print("All checks passed!")
```

**3.** **Little's law.** Write the `lead_time(cards)` function, which, from a list of `(start day, finish day)` pairs, computes the average lead time in days (to 1 decimal)! Cards not yet finished (finish: `None`) don't count.

```python starter
def lead_time(cards):
    return round(sum(f - s for s, f in cards) / len(cards), 1)
```

<details>
<summary>Solution</summary>

```python solution
def lead_time(cards):
    done = [f - s for s, f in cards if f is not None]   # finished ones only
    return round(sum(done) / len(done), 1)
```

</details>

```python test
assert lead_time([(1, 4), (1, 9), (2, 5)]) == 4.7
assert lead_time([(1, 4), (2, None), (3, 5)]) == 2.5
assert lead_time([(0, 10)]) == 10.0
print("All checks passed!")
```

### Quick check questions

```quiz
? Which is an example of SaaS?
- a rented virtual machine on which you install everything
- a platform to which you upload your own code
+ an email system or office suite used in the browser
- your own server room
! Software as a Service: you use the finished application.

? A team has 12 cards in progress and finishes 3 a week. How many weeks is the average lead time?
= 4
! $12 / 3 = 4$.

? Which chart suits the proportions of a whole's parts (e.g. how spending splits up) with few categories?
- line chart
+ pie chart (or stacked bar)
- scatter plot
- histogram
! With many categories a bar chart is more readable.

? Why is a bar chart with an axis starting at 90 misleading for the values 92 and 96?
+ because the small difference looks many times larger
- because it has too many colours
- because there's no legend
- it isn't misleading
! A bar chart's axis should start from zero.
```

---
title: Practice – Future IT Trends
summary: Review questions and a summary worksheet on AI, IoT, Industry 4.0, blockchain and green IT.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. A colleague pastes a client's entire contract into a free, public AI chatbot to summarise it. What is the problem, and what would be better?</summary>

Confidential data went to an unvetted external provider (trade secrets, personal data, GDPR). Better: a company-approved AI tool under an enterprise contract that doesn't train on the data – and the summary must be checked too.

</details>

<details>
<summary>2. Why isn't it worth using a blockchain for a company's internal stock records?</summary>

Because one party (the company) runs it and participants trust it – a traditional database is faster, cheaper and simpler. Blockchain is useful where several parties who don't trust each other share one ledger.

</details>

<details>
<summary>3. How can predictive maintenance help a factory?</summary>

From the machines' vibration, heat and power data a model predicts failures, so parts are replaced at a planned time, the line doesn't stop unexpectedly, and healthy parts aren't replaced needlessly.

</details>

```python run
# Simple “predictive maintenance”: does the moving average of vibration cross the threshold?
vibration = [2.1, 2.0, 2.3, 2.2, 2.6, 3.1, 3.4, 3.9, 4.4]
threshold = 3.5
for i in range(2, len(vibration)):
    avg = sum(vibration[i - 2:i + 1]) / 3
    state = "ALERT – maintenance needed" if avg > threshold else "ok"
    print(f"reading {i}, moving average {avg:.2f}: {state}")
```

## Summary worksheet

```quiz required
? Which is an example of **generative AI**?
- a filter that separates spam
+ a model that creates a new image from a description
- a thermometer
- a spreadsheet's SUM function
! A generative model creates new content.

? Which lightweight messaging protocol is widespread among IoT devices?
= MQTT
! Message Queuing Telemetry Transport.

? At which reading does the simulation above first raise an alert?
= 8
! At reading 7 the moving average (3.1 + 3.4 + 3.9) / 3 ≈ 3.47 is still below the threshold; at reading 8, (3.4 + 3.9 + 4.4) / 3 = 3.9 is above it.

? What does a large enough quantum computer threaten most?
+ today's public-key encryption (e.g. RSA)
- Wi-Fi speed
- hard disk capacity
- monitor resolution
! That is why quantum-safe encryption is needed.

? What does the EU AI Act do with **high-risk** AI systems (e.g. recruitment)?
- leaves them completely free
+ sets strict requirements for them
- only allows them in the USA
- makes them mandatory
! Risk-based regulation.

? Which one helps **green IT**?
+ shutting down idle cloud machines
- replacing every device every year
- slowing the code down
- more copies of all data, everywhere
! Unused resources consume energy too.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Fitting a line.** Write the `fit(xs, ys)` function, which returns the pair `(intercept, slope)` using the least squares method, both rounded to two decimals!

```python starter
def fit(xs, ys):
    return (0, 0)
```

<details>
<summary>Solution</summary>

```python solution
def fit(xs, ys):
    n = len(xs)
    ax, ay = sum(xs) / n, sum(ys) / n
    m = sum((x - ax) * (y - ay) for x, y in zip(xs, ys)) / sum((x - ax) ** 2 for x in xs)
    return (round(ay - m * ax, 2), round(m, 2))   # the line goes through the mean point
```

</details>

```python test
assert fit([1, 2, 3], [2, 4, 6]) == (0.0, 2.0)
assert fit([0, 1, 2, 3], [1, 3, 5, 7]) == (1.0, 2.0)
assert fit([1, 2, 3, 4], [3, 4, 4, 5]) == (2.5, 0.6)
print("All checks passed!")
```

**2.** **Precision and recall.** Write the `metrics(actual, predicted)` function, which, from two equally long lists of `True`/`False` values, returns the pair `(precision, recall)` rounded to two decimals! If there isn't a single positive prediction (or actual positive), that measure is 0.

```python starter
def metrics(actual, predicted):
    right = sum(a == p for a, p in zip(actual, predicted))
    return (round(right / len(actual), 2), round(right / len(actual), 2))
```

<details>
<summary>Solution</summary>

```python solution
def metrics(actual, predicted):
    tp = sum(a and p for a, p in zip(actual, predicted))          # correctly flagged
    fp = sum((not a) and p for a, p in zip(actual, predicted))    # false alarm
    fn = sum(a and (not p) for a, p in zip(actual, predicted))    # missed
    prec = tp / (tp + fp) if tp + fp else 0
    rec = tp / (tp + fn) if tp + fn else 0
    return (round(prec, 2), round(rec, 2))
```

</details>

```python test
a = [True, True, False, False, True, False]
p = [True, False, True, False, True, False]
assert metrics(a, p) == (0.67, 0.67)
assert metrics([True, False], [False, False]) == (0, 0.0)
assert metrics([True, True, False, False], [True, True, True, True]) == (0.5, 1.0)
print("All checks passed!")
```

**3.** **Data centre PUE.** Write the `pue_saving(it_kw, old_pue, new_pue)` function, which tells how many MWh of energy are saved per year (365 days · 24 hours) if the data centre's PUE improves from `old_pue` to `new_pue`! Return it rounded to an integer.

```python starter
def pue_saving(it_kw, old_pue, new_pue):
    return round(it_kw * (old_pue - new_pue))
```

<details>
<summary>Solution</summary>

```python solution
def pue_saving(it_kw, old_pue, new_pue):
    return round(it_kw * (old_pue - new_pue) * 24 * 365 / 1000)   # kW · hours → MWh
```

</details>

```python test
assert pue_saving(500, 2.0, 1.5) == 2190
assert pue_saving(100, 1.2, 1.2) == 0
assert pue_saving(1000, 1.6, 1.1) == 4380
print("All checks passed!")
```

### Quick check questions

```quiz
? Out of 10,000 transactions a model correctly says "not fraud" for 9,900, but finds none of the 100 frauds. What is its accuracy in percent?
= 99
! $9900 / 10000 = 99\%$, yet it's useless: its recall is 0.

? A blockchain's difficulty is 3 hexadecimal zeros. Roughly how many attempts are needed on average for a valid hash?
= 4096
! $16^3 = 4096$.

? What speedup does Grover's algorithm give for searching an unsorted dataset?
- exponential
+ quadratic (about $\sqrt{N}$ steps instead of $N$)
- none
- linear (half as many steps)
! That's why doubling the length of symmetric keys is enough.

? Why is a trained model's prediction unreliable outside the range of data it has seen?
- because the computer is slower there
+ because the model only knows the patterns it has seen, and continues them blindly outside (extrapolates)
- because there are more memory errors there
- because the model gives a random number there
! This is also one cause of "hallucination".
```

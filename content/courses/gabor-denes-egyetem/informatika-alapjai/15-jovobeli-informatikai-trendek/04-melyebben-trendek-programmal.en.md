---
title: Deeper – Trends Tried Out with Programs
summary: Your own "machine learning" by fitting a line, why accuracy misleads when detecting a rare event (precision and recall), a mini blockchain with proof of work, how much a quantum algorithm speeds up search, and a data centre's energy balance – with small programs and an interactive chart.
minutes: 50
---

## What you will learn in this lesson

- what machine learning **really** means – on a simple model that you "train",
- how to evaluate an AI model's results, and why accuracy **cheats** with rare events,
- how a **blockchain** protects against modification,
- how big **quantum speedup** really is, and how much energy computing uses.

## 1. Machine learning with a straight line

In the basic lesson we saw that in machine learning the program learns the rule **from data** instead of us writing it. The simplest example: fitting a straight line. From a few students' data (weekly study hours → score achieved) the program finds the line for which the sum of squared errors is smallest (the **least squares method**):

```python run
# "Training": fitting a line with least squares, then predicting
hours = [1, 2, 3, 4, 5, 6, 8, 10]
scores = [35, 42, 50, 54, 60, 66, 74, 85]

n = len(hours)
ax, ay = sum(hours) / n, sum(scores) / n
slope = sum((x - ax) * (y - ay) for x, y in zip(hours, scores)) / sum((x - ax) ** 2 for x in hours)
intercept = ay - slope * ax
print(f"the learned model: score ≈ {intercept:.1f} + {slope:.2f} · hours")

for new in [7, 12, 40]:
    estimate = intercept + slope * new
    print(f"{new:>2} hours → estimate: {estimate:.0f} points")
```

The model gives a good estimate for 7 hours, but for 40 hours it predicts **about 250 points** – which is impossible if the maximum is 100 (and even 97 for 12 hours is suspiciously high). This is one of AI's most important limits: a model is only reliable within the range it has **seen data** for. A large language model works on a similar principle (just with billions of parameters and texts): it predicts from learned patterns, and if a question falls outside them, it can be confidently **wrong** ("hallucination").

## 2. When does accuracy cheat? Precision and recall

A bank uses an AI model to filter out fraud. Only **1%** of transactions are fraudulent. A "model" that says "not fraud" to everything is **99% accurate** – and completely useless. That's why we look at two other measures too:

- **precision**: of those the model flagged as fraud, how many really are (how many false alarms),
- **recall**: of the real frauds, how many it found.

```python run
# Accuracy, precision, recall for detecting a rare event (1% fraud)
def metrics(tp, fp, fn, tn):
    accuracy = (tp + tn) / (tp + fp + fn + tn)
    precision = tp / (tp + fp) if tp + fp else 0
    recall = tp / (tp + fn) if tp + fn else 0
    return accuracy, precision, recall

# 10,000 transactions, 100 of them fraud
models = {
    "always 'not fraud'": (0, 0, 100, 9900),
    "cautious model": (60, 40, 40, 9860),
    "sensitive model": (95, 500, 5, 9400),
}
for name, (tp, fp, fn, tn) in models.items():
    a, p, r = metrics(tp, fp, fn, tn)
    print(f"{name:<20} accuracy {a:6.1%}, precision {p:6.1%}, recall {r:6.1%}")
```

Which model is better? That's a question of **viewpoint**. For the bank a missed fraud is expensive (high recall is needed), but for the customer it's annoying if every other purchase is blocked (high precision is needed). The same question arises in medical screening: there a missed illness is the worst outcome, so recall is favoured, and a positive result is checked with a second test.

## 3. A mini blockchain with proof of work

In the basic lesson we saw that a blockchain's blocks also contain the previous block's **hash** (like git commits). Public blockchains use one more trick: a block is only valid if its hash starts with a certain number of **zeros**. To get one, a number (the **nonce**) has to be tried again and again until such a hash comes out – this is **proof of work**:

```python run
# Mini blockchain: every block contains the previous hash, and a proof of work must be found
import hashlib

def mine(previous_hash, data, difficulty):
    nonce = 0
    while True:
        h = hashlib.sha256(f"{previous_hash}|{data}|{nonce}".encode()).hexdigest()
        if h.startswith("0" * difficulty):        # does it start with enough zeros?
            return nonce, h
        nonce += 1

chain, previous = [], "0" * 64
for data in ["Anna → Béla: 5", "Béla → Csilla: 2", "Csilla → Anna: 1"]:
    nonce, h = mine(previous, data, 4)
    chain.append((data, nonce, h))
    print(f"{data:<18} nonce = {nonce:>6}, hash = {h[:16]}...")
    previous = h

# every extra zero of difficulty means about 16 times more work
for difficulty in [1, 2, 3, 4]:
    print(f"{difficulty} zeros: about {16 ** difficulty:,} attempts on average")
```

If someone modified an old block, its hash would change, so they'd have to re-"mine" **all** the blocks after it – faster than the rest of the network. That's what gives the protection. The price: proof of work uses **enormous energy** (the Bitcoin network rivals a medium-sized country's yearly electricity use). That's why many blockchains have moved to other methods (e.g. _proof of stake_), and why for every project it's worth asking: does it **really** need a blockchain, or is a shared database enough?

## 4. Quantum speedup and green IT

We often hear that a quantum computer "solves everything exponentially faster". That's not true. For searching an unsorted dataset, for example, **Grover's algorithm** needs about $\sqrt{N}$ steps instead of $N$ – a **quadratic** speedup, not an exponential one:

```plot
title: Number of steps for searching an unsorted dataset of N elements
x: 1, 10000
y: 0, 5000
f: x/2 # classical: N/2 steps on average
f: sqrt(x) # Grover's algorithm: about √N steps
```

That's significant for large $N$, but even so a 128-bit encryption key could only be tried in $2^{64}$ steps – so it's enough to **double** the key length (AES-256). Public-key encryption (RSA) is a different story: **Shor's algorithm** really would break it quickly on a large enough quantum computer, which is why **quantum-safe** algorithms are being introduced already.

From a **green IT** perspective, one of the most important measures of a data centre is its **PUE** (Power Usage Effectiveness): total energy used divided by the computers' energy. The difference goes on cooling, power conversion and so on:

```python run
# Data centre energy balance: PUE and savings
it_power_kw = 500                                # the servers' power
for pue in [2.0, 1.5, 1.2, 1.1]:
    total_kw = it_power_kw * pue
    yearly_mwh = total_kw * 24 * 365 / 1000
    print(f"PUE {pue}: total {total_kw:.0f} kW, {yearly_mwh:,.0f} MWh a year, of which cooling etc. {yearly_mwh * (1 - 1 / pue):,.0f} MWh")
```

An old data centre with PUE = 2.0 uses almost twice as much energy for the same computation as a modern one at 1.1. The **viewpoints**: for the operator it's a cost, for society carbon emissions, and for the developer a task – a more efficient algorithm or a smaller AI model saves energy too.

| Trend                     | Real potential                                      | Common exaggeration                              |
| ------------------------- | --------------------------------------------------- | ------------------------------------------------ |
| **AI / machine learning** | recognising patterns in lots of data, automation    | "knows everything and is never wrong"            |
| **blockchain**            | a shared, tamper-proof log without trust            | "every database must be replaced"                |
| **quantum**               | speeding up certain problems (e.g. RSA, simulation) | "solves everything exponentially faster"         |
| **IoT**                   | real-time data from machines and buildings          | "every device should be smart" – a security risk |

## Summary

- Machine learning learns a rule from data (e.g. fits a line); the model is only reliable within the range it has seen.
- With rare events accuracy misleads; precision measures false alarms, recall missed cases.
- A blockchain's blocks are chained with hashes; proof of work protects against modification but uses a lot of energy.
- Grover search is a quadratic, not exponential, speedup; data centre efficiency is measured by PUE.

## Lesson exercise

```quiz required
? A learned model: score ≈ 30 + 5 · hours. What score does it predict for 8 hours of study?
= 70
! $30 + 5 \cdot 8 = 70$.

? A model finds 80 of 100 frauds, and meanwhile flags 20 legitimate transactions as fraud. What is its precision in percent?
= 80
! $80 / (80 + 20) = 80\%$.

? For the same model (finds 80 of 100 frauds), what is the recall in percent?
= 80
! $80 / 100 = 80\%$.

? Roughly how many steps does Grover's algorithm need in an unsorted dataset of 1,000,000 elements?
= 1000
! $\sqrt{10^6} = 1000$, compared with about 500,000 classical steps.

? A data centre's servers use 400 kW, total consumption is 600 kW. What is the PUE? (as a decimal)
= 1,5
= 1.5
! $600 / 400 = 1.5$.
```

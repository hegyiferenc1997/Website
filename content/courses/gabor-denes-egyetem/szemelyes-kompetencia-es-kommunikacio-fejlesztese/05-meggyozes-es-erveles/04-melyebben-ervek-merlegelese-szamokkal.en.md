---
title: Deeper – Weighing Arguments with Numbers
summary: How much is a piece of evidence worth? Updating a belief with likelihood ratios (Bayes), why an anecdote doesn't convince, survivorship bias in a startup statistic, checking the missing elements of the Toulmin model with a program, and the steelman method: the other side's strongest argument – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how to **update** a belief according to the strength of new evidence,
- why an **anecdote** is a weak argument, and what **survivorship bias** is,
- how to check whether an argument is **missing** a Toulmin element,
- how to argue fairly with the **steelman** method.

## 1. How much is a piece of evidence worth? The likelihood ratio

Your team is debating whether to replace the old, home-made login with a ready-made, proven library. At first you're unsure: you give a 50% chance that it's worth it. Then evidence arrives. The strength of each piece of evidence can be described by a **likelihood ratio**:

$$\text{likelihood ratio} = \frac{P(\text{we'd see this} \mid \text{true})}{P(\text{we'd see this} \mid \text{false})}$$

If a piece of evidence is 3 times more likely when the claim is true, its likelihood ratio is 3. The "odds" form of Bayes' theorem is very simple: **new odds = old odds × likelihood ratio**, where the odds $= p / (1 - p)$.

```python run
# Updating a belief with likelihood ratios (Bayes' theorem in odds form)
def update(p, likelihood_ratio):
    odds = p / (1 - p) * likelihood_ratio
    return odds / (1 + odds)

p = 0.50                                     # initial belief: is the switch worth it?
evidence = [
    ("a colleague says 'libraries are always better'", 1.2),
    ("the library is actively maintained for 3 years, 200 contributors", 2.0),
    ("2 security bugs were found in our own code last year", 3.0),
    ("the library doesn't support one of our custom login methods", 0.4),
]
print(f"start: {p:.0%}")
for desc, lr in evidence:
    p = update(p, lr)
    print(f"{desc:<66} ×{lr:<4} → {p:.0%}")
```

Notice:

- We hardly take the **opinion** ("libraries are always better") into account: we'd hear it even if it weren't true (likelihood ratio ≈ 1).
- The **counter-evidence** (0.4) lowers the belief but doesn't wipe it out – the decision depends on the **totality** of the evidence.
- The result isn't "yes" or "no" but a **degree**: this helps you not to cling stubbornly to your position.

The chart shows how the belief changes after a piece of evidence of a given strength, depending on the starting value:

```plot
title: Belief after the evidence as a function of the initial belief
x: 0, 1
y: 0, 1
param: r = 3, 0.1, 10, 0.1
f: r*x/(1 - x + r*x) # belief after the evidence
f: x # without evidence (unchanged)
```

If $r > 1$, the curve lies above the diagonal (the evidence supports the claim); if $r < 1$, below it. You can also see that with a **strong prior** (near 0.05 or 0.95) a moderate piece of evidence changes little – that's why it's hard to convince someone who's already "sure".

> This doesn't mean you have to calculate before a debate. The way of thinking is what matters: **ask how much more likely this evidence is if the claim is true than if it isn't.** If barely, it's a weak argument – however loudly it's said.

## 2. Anecdotes and survivorship bias

"I know someone who became a senior developer without university, so university is pointless." This is an **anecdote**: a single case that says almost nothing about the general claim. Its relative is **survivorship bias**: we only see the "survivors", not the ones who dropped out.

An article claims that "80% of successful startups used an agile methodology – so agile is the key to success". Let's look at the full picture on an invented but typical data set:

```python run
# Survivorship bias: something is common among the successful – but among the unsuccessful too?
startups = {  # (agile?, successful?): count
    (True, True): 80, (True, False): 720,
    (False, True): 20, (False, False): 180,
}
successful = startups[(True, True)] + startups[(False, True)]
print(f"agile among the successful: {startups[(True, True)] / successful:.0%}")

for agile in (True, False):
    total = startups[(agile, True)] + startups[(agile, False)]
    print(f"{'agile' if agile else 'non-agile':<10} startups' success rate: {startups[(agile, True)] / total:.0%}")
```

80% of the successful ones are indeed agile – but so are 80% of **all** startups, and the success rate is the **same** (10%) in both groups. So the claim proves nothing. The lesson: if someone argues with a common trait of the successful, ask: **"And how many of the unsuccessful had it?"**

## 3. Is something missing from the argument? A Toulmin check

The elements of the Toulmin model from the basic lesson: **claim**, **data** (evidence), **warrant** (why the claim follows from the data), **backing** (why the warrant holds), **qualifier** ("probably", "in most cases") and **rebuttal** (when it's not true). Everyday arguments often lack the warrant, the qualifier or the rebuttal:

```python run
# Toulmin check: which element is missing from an argument?
elements = ["claim", "data", "warrant", "backing", "qualifier", "rebuttal"]
essential = {"claim", "data", "warrant"}        # without these there's no argument

arguments = {
    "Mandatory code review": {
        "claim": "Let's introduce mandatory code review.",
        "data": "Last quarter 14 bugs reached production, 9 of which a second pair of eyes would have caught.",
        "warrant": "If a review is likely to catch a type of bug, reviews reduce production bugs.",
        "qualifier": "probably by at least half",
        "rebuttal": "except urgent fixes, where a review afterwards is enough",
    },
    "Switching to a new language": {
        "claim": "Let's rewrite everything in Rust.",
        "data": "Rust is fast.",
    },
}
for name, arg in arguments.items():
    missing = [e for e in elements if e not in arg]
    serious = [e for e in missing if e in essential]
    print(f"{name}: missing {missing or 'nothing'}")
    if serious:
        print(f"   ⚠ essential element missing: {serious} – so this isn't an argument yet, just an opinion")
```

The second "argument" lacks the **warrant**: why would it follow from Rust being fast that we need to rewrite everything? Maybe our app's slowness comes from database queries, where switching languages wouldn't help at all. Making the missing warrant explicit ("Why does it follow from this that…?") is the best critical question.

## 4. The steelman: argue against the strongest objection

The **straw man** fallacy is when you refute a weak, distorted version of the other side's position. Its opposite is the **steelman**: before arguing, put the other position **in its strongest possible form** – so well that they themselves say: "Yes, that's exactly it."

An example from a team debate:

| Straw man                                            | Steelman                                                                                                                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "You don't want to write tests because you're lazy." | "If I understand you correctly, you're saying the demo is in two weeks, writing tests now would take time away from features, and the demo will judge features." |

The steelman gives three things:

1. The other person **feels heard**, so they'll be more open to your arguments.
2. **You yourself** understand the situation better – it may turn out they're right, or a third solution is best (e.g. you only write tests for the critical parts).
3. If you can answer even the strongest counter-argument, your reasoning is **genuinely strong**.

## Summary

- The strength of evidence is measured by the likelihood ratio: how much more likely it is if the claim is true; new odds = old odds × likelihood ratio.
- Opinions and anecdotes are weak evidence; a common trait of the successful is only an argument if it's rarer among the unsuccessful (survivorship bias).
- An argument needs a claim, data and a warrant; the qualifier and the rebuttal make it credible.
- The steelman method: put the other position in its strongest form before arguing.

## Lesson exercise

```quiz required
? Initially you estimate a claim at 50% (odds 1:1). A piece of evidence arrives with a likelihood ratio of 3. What will your belief be? (as a decimal)
= 0,75
= 0.75
! New odds $1 \cdot 3 = 3$, so $p = 3 / (1 + 3) = 0.75$.

? Of 1000 startups, 800 are agile, and 80 of these are successful. What is the agile startups' success rate in percent? (number only)
= 10
! $80 / 800 = 10\%$.

? "Rust is fast, so let's rewrite everything in Rust." Which Toulmin element is most obviously missing?
- the claim
- the data
+ the warrant (why the claim follows from the data)
- nothing, it's a complete argument
! It's not clear whether the language's speed would solve our problem.

? Which is the steelman method?
- refuting a weak version of the other side's position
+ putting the other side's position in its strongest possible form before arguing
- winning the debate by criticising the other person
- repeating your own argument ever louder
! The steelman is the opposite of the straw man.

? Which piece of evidence has the smallest likelihood ratio (i.e. the weakest support)?
+ a colleague's general opinion, which we'd hear even if the claim weren't true
- a measured bug statistic from our own project
- the result of an independent security audit
- a pilot team's measurable result
! If we'd see a piece of evidence equally with a true or false claim, its likelihood ratio is ≈ 1.
```

---
title: Practice – Team Communication and Group Dynamics
summary: Review questions and a summary worksheet on group development, the traps of group decisions and team communication in practice.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Why isn't it worth avoiding the storming stage?</summary>

Because disputes reveal different expectations and ways of working, and these become the shared norms. If a team avoids disputes, it gets stuck in false harmony, and problems come up later, at a worse moment.

</details>

<details>
<summary>2. How can a leader prevent groupthink?</summary>

Speak last; appoint a devil's advocate; explicitly ask for dissenting views; involve an outside expert; hold a pre-mortem; collect opinions with brainwriting or anonymous voting.

</details>

<details>
<summary>3. Why doesn't adding four new developers speed up a late project?</summary>

Because newcomers have to be trained (which also takes the existing members' time), and the number of communication channels grows quadratically: with 10 people instead of 6 there are 45 channels instead of 15. This is Brooks's law.

</details>

<details>
<summary>4. Give three rules for a remote team's chat!</summary>

For example: ask in public channels, not privately; reply in threads; the first message should contain the question and the context; mark urgent issues separately (or call); put decisions in the wiki.

</details>

## Summary worksheet

> A team of 6 has been working on a mobile app for two months. The deadline is approaching, and the leader asks for two new developers.

```quiz required
? How many two-person communication channels are there in the 6-person team now?
= 15
! 6 · 5 / 2 = 15.

? How many channels will there be when two new developers arrive?
= 28
! 8 · 7 / 2 = 28.

? After the new members arrive, disputes about working methods start again. Which stage has the team regressed to?
- performing straight away, without forming
+ storming
- adjourning
- performing after norming
! New members → norms have to be renegotiated.

? At planning the leader states their opinion and everyone nods, although the developers think the plan is unrealistic. What would be the best change?
- an even faster decision
+ the leader speaks last, and the team gives estimates at the same time, independently (e.g. planning poker)
- developers shouldn't attend planning
- voting by show of hands, after the leader
! Against groupthink: independent opinions.

? At the retrospective it turns out one member hasn't dared to speak up for weeks when stuck. Which factor is most lacking?
- Brooks's law
+ psychological safety
- social loafing
- the Delphi method
! It must be safe to ask and admit mistakes.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Condorcet's theorem.** Write the function `majority(n, p)`, which gives the probability that the majority of an `n`-person (odd) group decides correctly, if everyone independently decides correctly with probability `p` (to 3 decimals)! Hint: `math.comb(n, k)`.

```python starter
def majority(n, p):
    return round(p, 3)
```

<details>
<summary>Solution</summary>

```python solution
from math import comb

def majority(n, p):
    # at least n//2 + 1 members must decide correctly
    return round(sum(comb(n, k) * p**k * (1 - p)**(n - k) for k in range(n // 2 + 1, n + 1)), 3)
```

</details>

```python test
assert majority(1, 0.7) == 0.7
assert majority(3, 0.8) == 0.896
assert majority(9, 0.7) == 0.901
assert majority(3, 0.5) == 0.5
print("All checks passed!")
```

**2.** **Hidden profile.** A piece of information is known by `k` people, and each of them independently brings it up with probability `q`. Write the function `gets_mentioned(q, k)`, which gives the probability that it's mentioned at the meeting (to 3 decimals)!

```python starter
def gets_mentioned(q, k):
    return round(q * k, 3)
```

<details>
<summary>Solution</summary>

```python solution
def gets_mentioned(q, k):
    return round(1 - (1 - q) ** k, 3)     # 1 − the chance that nobody mentions it
```

</details>

```python test
assert gets_mentioned(0.3, 1) == 0.3
assert gets_mentioned(0.3, 3) == 0.657
assert gets_mentioned(0.5, 4) == 0.938
print("All checks passed!")
```

**3.** **Tuckman stage.** The `symptoms` dictionary holds a set of typical symptoms per stage. Write the function `stage(observed, symptoms)`, which returns the stage with the most symptoms present in the observed set (on a tie, the one earlier in the dictionary wins)!

```python starter
def stage(observed, symptoms):
    return list(symptoms)[0]
```

<details>
<summary>Solution</summary>

```python solution
def stage(observed, symptoms):
    hits = {name: len(signs & observed) for name, signs in symptoms.items()}
    return max(hits, key=hits.get)          # max returns the first largest one
```

</details>

```python test
s = {"forming": {"politeness", "unclear roles"}, "storming": {"arguments", "factions", "delays"},
     "norming": {"shared rules", "open feedback"}, "performing": {"independent decisions", "high performance"}}
assert stage({"arguments", "delays", "politeness"}, s) == "storming"
assert stage({"shared rules"}, s) == "norming"
assert stage({"high performance", "independent decisions", "arguments"}, s) == "performing"
print("All checks passed!")
```

### Quick check questions

```quiz
? What is groupthink?
+ maintaining agreement becomes more important than critical thinking, so nobody objects
- the group always decides better than the individual
- the group members decide individually
- a brainstorming technique
! Suppressing dissent leads to bad decisions.

? How many communication channels are there in an 8-person team ($k(k-1)/2$)?
= 28
! $8 \cdot 7 / 2 = 28$.

? What is social loafing?
- the team's shared break
+ in a group, an individual puts in less effort because their contribution is less visible
- the leader being overloaded
- a team-building event
! The remedy: visible, individual responsibility.

? What does psychological safety in a team mean?
- nobody may be criticised
+ members can ask questions, make mistakes and disagree without risk
- everyone thinks the same
- the leader decides everything
! In this climate, problems come up in time.
```

---
title: Practice – Negotiation and Conflict Management
summary: Review questions and a summary worksheet on BATNA, ZOPA, the Harvard method and conflict-handling styles.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. How can you improve your BATNA before an intern salary negotiation?</summary>

Apply to several places so you have alternative offers; strengthen your portfolio; check market salary data. The better your alternative, the more confidently you negotiate and the easier it is to say no to a bad offer.

</details>

<details>
<summary>2. Why is revealing your reservation point dangerous?</summary>

Because the other party immediately "pulls" the agreement there: if they know you'd accept 400 thousand, they won't offer 450. Share your goal and your reasons, not your minimum.

</details>

<details>
<summary>3. What is the difference between compromise and collaboration?</summary>

In a compromise both parties give something up and meet "halfway" (the orange is cut in half). In collaboration, by uncovering interests they look for a solution that fully satisfies both (one gets the juice, the other the peel).

</details>

<details>
<summary>4. When is the avoiding style good?</summary>

In small, unimportant matters; when the parties first need to calm down; when there isn't enough information yet; or when someone else can handle the conflict better. In the long run, for important issues, it is harmful because the problem grows meanwhile.

</details>

## Summary worksheet

> A small company orders a website from you. You'll do it for at least 450 thousand HUF (for that you could take on another assignment), the company has budgeted at most 600 thousand. The company's representative opens with 300 thousand.

```quiz required
? What is your BATNA in this situation?
- the company's 300 thousand offer
+ taking on the other assignment
- the 600 thousand budget
- the middle of the ZOPA
! That's what you do if no agreement is reached.

? How many thousand HUF wide is the ZOPA?
= 150
! 600 − 450 = 150.

? What phenomenon is the company's opening offer of 300 thousand?
- BATNA
+ anchoring
- objective criterion
- avoidance
! The first number sets the starting point.

? Which reply best follows the Harvard method?
- "300 thousand? Then I want 900 thousand."
- "Fine, let it be 300."
+ "Let's look at exactly what you need and the market price of similar projects – 300 thousand is far from that."
- you don't reply and walk away
! Interests + objective criteria.

? In the end you agree on 520 thousand HUF, and the deadline is extended by two weeks, as you asked. Which Thomas–Kilmann style is this closest to?
- competing
- avoiding
+ collaborating (both parties' important interests are met)
- accommodating
! The company stays within budget, you get a better price and more time.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Package score.** The `table` dictionary lists the options per issue in the form `{issue: {option: (client points, developer points)}}`. Write the function `package_score(choice, table)`, which for an `{issue: option}` choice returns the `(client total, developer total)` pair!

```python starter
def package_score(choice, table):
    return (0, 0)
```

<details>
<summary>Solution</summary>

```python solution
def package_score(choice, table):
    c = sum(table[issue][option][0] for issue, option in choice.items())
    d = sum(table[issue][option][1] for issue, option in choice.items())
    return (c, d)
```

</details>

```python test
table = {"deadline": {"4 weeks": (40, 0), "6 weeks": (20, 15), "8 weeks": (0, 30)},
         "price": {"2.0": (30, 0), "2.5": (15, 25), "3.0": (0, 50)},
         "support": {"3": (0, 20), "6": (10, 10), "12": (30, 0)}}
assert package_score({"deadline": "6 weeks", "price": "2.5", "support": "6"}, table) == (45, 50)
assert package_score({"deadline": "4 weeks", "price": "3.0", "support": "12"}, table) == (70, 50)
print("All checks passed!")
```

**2.** **Pareto-efficient packages.** The `packages` list consists of `(name, a points, b points)` triples. Write the function `pareto(packages)`, which returns in alphabetical order the names of the packages that are **not dominated** by another one (i.e. there's no package giving both parties at least as many points, and one of them more)!

```python starter
def pareto(packages):
    best = max(packages, key=lambda p: p[1] + p[2])
    return [best[0]]
```

<details>
<summary>Solution</summary>

```python solution
def pareto(packages):
    def dominated(p):
        return any(q[1] >= p[1] and q[2] >= p[2] and (q[1], q[2]) != (p[1], p[2]) for q in packages)
    return sorted(p[0] for p in packages if not dominated(p))
```

</details>

```python test
ps = [("K", 45, 50), ("X", 70, 50), ("Y", 50, 65), ("Z", 40, 40), ("W", 100, 0)]
assert pareto(ps) == ["W", "X", "Y"]
assert pareto([("A", 1, 1), ("B", 1, 1)]) == ["A", "B"]
print("All checks passed!")
```

**3.** **Prisoner's dilemma.** Write the function `game(a_moves, b_moves)`, which from two move sequences of equal length (`"C"` = cooperate, `"D"` = defect) computes the two players' total scores! Points: C–C: 3, 3; C–D: 0, 5; D–C: 5, 0; D–D: 1, 1.

```python starter
def game(a_moves, b_moves):
    return (3 * len(a_moves), 3 * len(b_moves))
```

<details>
<summary>Solution</summary>

```python solution
POINTS = {("C", "C"): (3, 3), ("C", "D"): (0, 5), ("D", "C"): (5, 0), ("D", "D"): (1, 1)}

def game(a_moves, b_moves):
    pa = pb = 0
    for a, b in zip(a_moves, b_moves):        # add up the points round by round
        x, y = POINTS[(a, b)]
        pa, pb = pa + x, pb + y
    return (pa, pb)
```

</details>

```python test
assert game("CCC", "CCC") == (9, 9)
assert game("CDD", "DDC") == (6, 6)
assert game("DDDD", "CCCC") == (20, 0)
print("All checks passed!")
```

### Quick check questions

```quiz
? What is a BATNA?
+ the best alternative to a negotiated agreement – what you do if no agreement is reached
- the highest price you can ask
- the agenda of the negotiation
- the other party's first offer
! The better your BATNA, the stronger your negotiating position.

? The seller's minimum is 600, the buyer's maximum 900 thousand Ft. How wide is the ZOPA (thousand Ft)?
= 300
! $900 - 600 = 300$.

? What does "focus on interests, not positions" mean in the Harvard method?
- stick to your first offer
+ look for why the other party wants something, because along interests there may be several solutions
- never give in
- ignore the other party's position
! The position is the "what", the interest is the "why".

? Which conflict-handling style is best when both the issue and the relationship matter a lot?
- avoiding
- competing
+ problem-solving (collaborating)
- accommodating
! It takes both parties' goals into account.
```

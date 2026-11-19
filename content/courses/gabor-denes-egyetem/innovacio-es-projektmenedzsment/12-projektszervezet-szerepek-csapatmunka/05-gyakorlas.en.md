---
title: Practice – Organisation, Roles, Team
summary: Review questions and a summary worksheet for the twelfth topic.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. A developer's department head pulls them onto an urgent operations task in the project's critical week. Which organisational form does this suggest, and what can the PM do?</summary>

A weak or balanced matrix, where the department head is stronger. The PM should talk to the department head, show the impact (critical path, deadline), and if they cannot agree, escalate to the sponsor or the steering committee.

</details>

<details>
<summary>2. Why is it a problem if a RACI row has two "A"s?</summary>

Because it is unclear who is ultimately answerable; they may point at each other when deciding or make contradictory decisions. Every activity must have exactly one accountable owner.

</details>

<details>
<summary>3. In the first two weeks of a new team everyone is polite, but nobody contradicts the PM. Which stage are they in, and what can the PM expect?</summary>

The forming stage. Storming will come soon: arguments will surface. The PM should clarify goals, roles and rules, and prepare to handle conflicts constructively.

</details>

<details>
<summary>4. Two developers argue about which framework to use. The decision is important and there is a week for it. Which conflict style would you suggest?</summary>

Collaborating: gather the criteria together (performance, team knowledge, support), try both on a small prototype, and decide based on the data.

</details>

## Summary worksheet

```quiz required
? In which organisational form do members work on the project full time and the PM has full authority?
- functional
- weak matrix
+ projectised
- balanced matrix
! The company is built around projects.

? Which PMO type provides **templates and best practices** but prescribes nothing?
+ supportive
- controlling
- directive
! Supportive PMO.

? A RACI row reads: PM = A, developer = R, tester = C, client = I. Who **does** the work?
- PM
+ developer
- tester
- client
! R = Responsible.

? A team member always watches the details and does not rest until every defect is fixed. Which Belbin role?
- Plant
- Shaper
+ Completer Finisher
- Resource Investigator
! Completer Finisher.

? During a production outage the PM immediately decides to roll back, without debate. Which conflict style is this, and when is it appropriate?
+ competing – in an emergency, when a quick decision is needed
- avoiding – for trivial issues
- accommodating – when it does not matter to us
- compromising – between equal parties
! Competing.

? Which is **not** one of Daniel Pink's elements of intrinsic motivation?
- autonomy
- mastery
- purpose
+ bonus
! Money is an extrinsic motivator; for creative work Pink says intrinsic ones count.

? How many stages does Tuckman's extended (1977) model have?
= 5
= five
! Forming, storming, norming, performing, adjourning.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **RACI check.** Write the function `raci_errors(raci)`, which from a `{task: {person: role}}` dictionary returns the list of tasks (in the original order) where there isn't exactly one "A", or there's no "R" at all!

```python starter
def raci_errors(raci):
    return [t for t, roles in raci.items() if "R" not in roles.values()]
```

<details>
<summary>Solution</summary>

```python solution
def raci_errors(raci):
    faulty = []
    for task, roles in raci.items():
        values = list(roles.values())
        if values.count("A") != 1 or "R" not in values:   # exactly one A, at least one R
            faulty.append(task)
    return faulty
```

</details>

```python test
raci = {
    "requirements": {"Anna": "A", "Bence": "R", "Csilla": "C"},
    "backend": {"Anna": "A", "Bence": "R", "Dávid": "A"},
    "testing": {"Anna": "I", "Bence": "R"},
    "release": {"Anna": "A", "Bence": "R"},
}
assert raci_errors(raci) == ["backend", "testing"]
assert raci_errors({"x": {"a": "A"}}) == ["x"]
print("All checks passed!")
```

**2.** **Bottleneck.** Write the function `r_workload(raci)`, which counts the "R" roles per person (a dictionary), and the function `bottleneck(raci)`, which gives the name of the person with the most "R"s!

```python starter
def r_workload(raci):
    count = {}
    for roles in raci.values():
        for name in roles:
            count[name] = count.get(name, 0) + 1
    return count

def bottleneck(raci):
    return max(r_workload(raci), key=r_workload(raci).get)
```

<details>
<summary>Solution</summary>

```python solution
def r_workload(raci):
    count = {}
    for roles in raci.values():
        for name, role in roles.items():
            if role == "R":                         # only the responsible role counts
                count[name] = count.get(name, 0) + 1
    return count

def bottleneck(raci):
    load = r_workload(raci)
    return max(load, key=load.get)
```

</details>

```python test
raci = {
    "requirements": {"Anna": "A", "Bence": "R", "Csilla": "C"},
    "UI design": {"Anna": "I", "Csilla": "R", "Dávid": "A"},
    "backend": {"Anna": "A", "Bence": "R"},
    "testing": {"Anna": "C", "Bence": "R"},
}
assert r_workload(raci) == {"Bence": 3, "Csilla": 1}
assert bottleneck(raci) == "Bence"
print("All checks passed!")
```

**3.** **Ringelmann effect.** Write the function `ringelmann(n, c)`, which tells with the strength of how many people an `n`-person group works if every additional member reduces individual performance by the ratio `c` (to 1 decimal, it can't be negative), and the function `best_size(c, max_n)`, which tells what group size (between 1 and `max_n`) achieves the most in total!

```python starter
def ringelmann(n, c):
    return round(n * (1 - c), 1)

def best_size(c, max_n):
    return max_n
```

<details>
<summary>Solution</summary>

```python solution
def ringelmann(n, c):
    return round(n * max(0.0, 1 - c * (n - 1)), 1)

def best_size(c, max_n):
    return max(range(1, max_n + 1), key=lambda n: n * max(0.0, 1 - c * (n - 1)))
```

</details>

```python test
assert ringelmann(8, 0.07) == 4.1
assert ringelmann(4, 0.05) == 3.4
assert best_size(0.07, 20) == 8
assert best_size(0.04, 30) == 13
print("All checks passed!")
```

### Quick check questions

```quiz
? In which organisational form does the project manager have the most authority?
- functional
- weak matrix
+ projectised
- balanced matrix
! In a projectised organisation the project manager controls the resources.

? What is the second stage of the Tuckman model?
- forming
+ storming
- norming
- performing
! Forming, storming, norming, performing (and adjourning).

? How many channels are there if a 9-person team is split into three 3-person sub-teams, and the three leads also keep in touch?
= 12
! $3 \cdot 3 + 3 = 12$ (a 3-person team has 3 channels).

? What does psychological safety mean in a team?
+ members can own up to mistakes, ask questions and disagree without fear of punishment
- nobody may criticise anybody
- team members' salaries are guaranteed
- the project is risk-free
! According to Google's research, this is the most important trait of successful teams.
```

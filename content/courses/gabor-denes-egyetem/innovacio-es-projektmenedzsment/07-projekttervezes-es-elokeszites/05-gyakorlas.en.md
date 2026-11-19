---
title: Practice – Planning and the Critical Path
summary: Review questions and a complete critical path calculation as a summary worksheet.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Why does a WBS consist of nouns rather than verbs?</summary>

Because the WBS breaks down deliverables (what must be produced), not the steps of the work. Activities (verbs) appear below the work packages, in the activity list.

</details>

<details>
<summary>2. Draw up a WBS for a university conference website (2 levels are enough)!</summary>

1. Conference website: 1.1 Project management; 1.2 Content (programme, speakers, venue); 1.3 Branding and UI; 1.4 Registration module; 1.5 Testing; 1.6 Launch (domain, hosting, publishing).

</details>

<details>
<summary>3. Why is the critical path the longest path through the network?</summary>

Because the project ends only when every path has been completed. The longest path determines the shortest possible duration, and there is no float on it.

</details>

<details>
<summary>4. What is the difference between an assumption and a constraint?</summary>

A constraint is a fixed, known condition (e.g. a fixed budget, a mandatory deadline). An assumption is uncertain but taken as true for planning – if it turns out to be false, it becomes a risk.

</details>

## Summary worksheet

Activities of a mobile app development project (durations in days):

| Act. | Description          | Duration | Predecessor |
| ---- | -------------------- | -------- | ----------- |
| A    | requirements         | 4        | –           |
| B    | UI design            | 3        | A           |
| C    | back-end development | 5        | A           |
| D    | UI development       | 2        | B           |
| E    | database and API     | 4        | C           |
| F    | testing and release  | 3        | D, E        |

```text
          ┌───► B (3) ───► D (2) ───┐
 A (4) ───┤                         ├───► F (3)
          └───► C (5) ───► E (4) ───┘
```

```quiz required
? What is the early start (ES) of activity F?
= 13
= 13 days
! ES(F) = max(EF(D), EF(E)) = max(9, 13).

? What is the shortest duration of the project, in days?
= 16
= 16 days
! EF(F) = 13 + 3.

? What is the float of activity B, in days?
= 4
= 4 days
! LS(B) = 8, ES(B) = 4.

? Which is the critical path?
- A → B → D → F
+ A → C → E → F
- A → B → C → F
- C → E → F
! 4 + 5 + 4 + 3 = 16 days, every activity has zero float.

? If activity D slips 3 days, how many days will the project take?
= 16
= 16 days
! D has 4 days of float, so a 3-day slip does not push the project end.

? Which document examines the TELOS criteria?
- project charter
+ feasibility study
- WBS dictionary
- Gantt chart
! Technical, economic, legal, operational, scheduling feasibility.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Critical path.** Write the function `cpm(acts)`, which from a `{name: (duration, [predecessors])}` dictionary (already in a valid order) returns the pair `(project length, list of critical activities)`! The critical list should follow the order of the listing.

```python starter
def cpm(acts):
    return (sum(d for d, _ in acts.values()), list(acts))
```

<details>
<summary>Solution</summary>

```python solution
def cpm(acts):
    ES, EF = {}, {}
    for name, (dur, preds) in acts.items():           # forward pass
        ES[name] = max((EF[p] for p in preds), default=0)
        EF[name] = ES[name] + dur
    length = max(EF.values())
    LS = {}
    for name in reversed(list(acts)):                  # backward pass
        succs = [s for s, (_, pr) in acts.items() if name in pr]
        LS[name] = min((LS[s] for s in succs), default=length) - acts[name][0]
    return (length, [n for n in acts if LS[n] == ES[n]])   # the ones without float
```

</details>

```python test
example = {"A": (3, []), "B": (2, ["A"]), "C": (4, ["A"]), "D": (3, ["B"]), "E": (2, ["C", "D"])}
assert cpm(example) == (10, ["A", "B", "D", "E"])
webshop = {"Req": (4, []), "UI": (3, ["Req"]), "DB": (3, ["Req"]), "Backend": (6, ["DB"]),
           "Frontend": (5, ["UI"]), "Payment": (3, ["Backend"]), "Test": (4, ["Frontend", "Payment"]),
           "Release": (1, ["Test"])}
assert cpm(webshop) == (21, ["Req", "DB", "Backend", "Payment", "Test", "Release"])
print("All checks passed!")
```

**2.** **Topological order.** Write the function `topological(acts)`, which from a `{name: (duration, [predecessors])}` dictionary in any order gives a list in which every activity comes after its predecessors! If there's a cycle in the dependencies, return `None`.

```python starter
def topological(acts):
    return list(acts)
```

<details>
<summary>Solution</summary>

A cycle (A waits for B, B waits for A) is a faulty plan: none of the activities can start, so the program should report it.

```python solution
def topological(acts):
    order = []
    while len(order) < len(acts):
        new = [n for n, (_, pr) in acts.items() if n not in order and all(p in order for p in pr)]
        if not new:
            return None                    # no activity can start: there's a cycle
        order.extend(new)
    return order
```

</details>

```python test
def valid(acts, order):
    return sorted(order) == sorted(acts) and all(
        order.index(p) < order.index(n) for n, (_, pr) in acts.items() for p in pr)

reversed_acts = {"E": (2, ["C", "D"]), "D": (3, ["B"]), "C": (4, ["A"]), "B": (2, ["A"]), "A": (3, [])}
assert valid(reversed_acts, topological(reversed_acts))
assert valid({"B": (1, ["A"]), "A": (1, [])}, topological({"B": (1, ["A"]), "A": (1, [])}))
assert topological({"A": (1, ["B"]), "B": (1, ["A"])}) is None
print("All checks passed!")
```

**3.** **WBS roll-up.** Write the function `wbs_total(element)`, which recursively adds up the estimates in a nested dictionary (the leaves are numbers: the work packages' estimates)!

```python starter
def wbs_total(element):
    return sum(v for v in element.values() if isinstance(v, (int, float)))
```

<details>
<summary>Solution</summary>

```python solution
def wbs_total(element):
    if isinstance(element, (int, float)):
        return element                     # work package
    return sum(wbs_total(child) for child in element.values())   # the sum of the children
```

</details>

```python test
wbs = {"Planning": {"Requirements": 400, "UI design": 300},
       "Development": {"Backend": 1200, "Frontend": 900, "Payment": 500},
       "Rollout": {"Testing": 600, "Release": 100}}
assert wbs_total(wbs) == 4000
assert wbs_total(wbs["Development"]) == 2600
assert wbs_total({"a": {"b": {"c": 5}}, "d": 2}) == 7
print("All checks passed!")
```

### Quick check questions

```quiz
? What does the WBS 100% rule say?
+ the child elements together cover exactly the parent's total work
- every work package is shorter than 100 hours
- the project is 100% done
- 100% of the budget must be spent
! No more and no less work than the parent's.

? What does an FS dependency mean?
- the two activities start at the same time
+ the successor can start only after the predecessor finishes
- the two activities finish at the same time
- the successor's finish is tied to the predecessor's start
! Finish-to-Start: the most common dependency type.

? An activity has ES = 4, LS = 7. What is its float (days)?
= 3
! Float = LS − ES = 3.

? What does the project charter contain?
- the detailed schedule to the day
+ the project's purpose, the main constraints, the sponsor and the appointment of the project manager
- the team members' salaries
- the code
! It's the project's official "birth certificate".
```

---
title: Branching: if, elif, else
summary: Running code depending on a condition.
---

```python
score = int(input("Score: "))
if score >= 85:
    print("excellent")
elif score >= 70:
    print("good")
elif score >= 50:
    print("pass")
else:
    print("fail")
```

In Python, **indentation** (4 spaces) shows which lines belong to the branch; there are no curly braces. Conditions are checked in order, and only the first true branch runs.

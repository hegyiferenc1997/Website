---
title: Rekurzió
summary: Önmagát hívó függvények.
minutes: 15
---

**Rekurzív** az a függvény, amely önmagát hívja. Kell egy **alapeset**, ahol megáll, különben sosem ér véget.

```python
def faktorialis(n):
    if n <= 1:          # alapeset
        return 1
    return n * faktorialis(n - 1)

print(faktorialis(5))   # 120
```

Kiértékelés: `5 * 4 * 3 * 2 * 1`. Sok feladat (pl. fák bejárása) rekurzióval sokkal egyszerűbben írható le.

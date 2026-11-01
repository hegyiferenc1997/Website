---
title: Operátorok és kifejezések
summary: Aritmetikai, összehasonlító és logikai operátorok.
minutes: 15
---

```python
print(7 + 2, 7 - 2, 7 * 2)  # 9 5 14
print(7 / 2)                 # 3.5  – osztás
print(7 // 2)                # 3    – egészosztás
print(7 % 2)                 # 1    – maradék
print(2 ** 10)               # 1024 – hatványozás
```

Összehasonlítás (eredménye `bool`): `==`, `!=`, `<`, `<=`, `>`, `>=`.

Logikai operátorok: `and`, `or`, `not`.

```python
x = 15
print(10 <= x and x < 20)  # True
print(10 <= x < 20)        # ugyanez rövidebben
```

A `%` operátorral könnyen eldönthető, hogy egy szám páros-e: `x % 2 == 0`.

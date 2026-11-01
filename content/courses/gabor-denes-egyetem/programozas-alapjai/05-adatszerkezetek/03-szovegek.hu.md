---
title: Szövegek kezelése
summary: Gyakori szövegműveletek.
minutes: 10
---

```python
s = "  Mérnökinformatikus  "
print(s.strip())          # szóközök levágása
print(s.upper())          # NAGYBETŰS
print("info" in s)        # True
print("a,b,c".split(","))   # ['a', 'b', 'c']
print("-".join(["a", "b"])) # a-b
print(len("alma"))        # 4
print("alma"[::-1])       # amla – megfordítás
```

A szöveg **nem módosítható**: a műveletek új szöveget adnak vissza, az eredetit nem változtatják meg.

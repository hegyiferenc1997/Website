---
title: Keresés és maximum-kiválasztás
summary: Eldöntés, keresés és a legnagyobb elem megtalálása.
minutes: 15
---

```python
szamok = [4, 7, 1, 8, 3]

# lineáris keresés: hol az első 5-nél nagyobb?
i = 0
while i < len(szamok) and not szamok[i] > 5:
    i += 1
if i < len(szamok):
    print("Index:", i)     # Index: 1
else:
    print("Nincs ilyen")

# maximum-kiválasztás
max_i = 0
for j in range(1, len(szamok)):
    if szamok[j] > szamok[max_i]:
        max_i = j
print(szamok[max_i])       # 8
```

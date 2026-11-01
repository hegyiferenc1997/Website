---
title: Kivételkezelés: try és except
summary: Futási hibák elkapása és kezelése.
minutes: 10
---

```python
while True:
    try:
        szam = int(input("Egész szám: "))
        break
    except ValueError:
        print("Ez nem egész szám, próbáld újra!")
print("Rendben:", szam)
```

A `try` blokkban keletkező hibát az `except` ág kapja el, így a program nem áll le. Mindig a konkrét hibatípust kapd el (`ValueError`, `FileNotFoundError`), ne mindent.

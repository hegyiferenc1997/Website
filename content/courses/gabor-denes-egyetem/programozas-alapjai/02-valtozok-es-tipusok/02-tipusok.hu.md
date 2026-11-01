---
title: Számok, szövegek, logikai értékek
summary: Az int, float, str és bool típusok.
minutes: 15
---

Minden értéknek van **típusa**. A leggyakoribbak:

| Típus   | Jelentés      | Példa           |
| ------- | ------------- | --------------- |
| `int`   | egész szám    | `42`            |
| `float` | valós szám    | `3.14`          |
| `str`   | szöveg        | `"alma"`        |
| `bool`  | logikai érték | `True`, `False` |

```python
print(type(42))      # <class 'int'>
print(type("42"))    # <class 'str'>
print(int("42") + 1) # 43 – átalakítás szövegből számmá
print(str(3.5) + "!")# 3.5!
```

Típusátalakítás: `int()`, `float()`, `str()`, `bool()`.

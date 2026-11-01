---
title: Fájlok olvasása és írása
summary: Az open() és a with szerkezet.
minutes: 15
---

```python
# írás
with open("jegyek.txt", "w", encoding="utf-8") as f:
    f.write("5\n4\n3\n")

# olvasás soronként
with open("jegyek.txt", encoding="utf-8") as f:
    jegyek = [int(sor) for sor in f]
print(jegyek)  # [5, 4, 3]
```

A `with` blokk végén a fájl automatikusan bezáródik. Módok: `"r"` olvasás, `"w"` írás (felülír), `"a"` hozzáfűzés.

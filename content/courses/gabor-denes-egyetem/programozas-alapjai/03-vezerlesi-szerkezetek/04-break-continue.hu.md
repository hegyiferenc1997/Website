---
title: break és continue
summary: Kilépés a ciklusból és a következő körre ugrás.
minutes: 10
---

- `break`: azonnal kilép a ciklusból.
- `continue`: a ciklusmag hátralévő részét kihagyja, és a következő körrel folytatja.

```python
for i in range(1, 20):
    if i % 3 == 0:
        continue      # a 3-mal oszthatókat kihagyjuk
    if i > 10:
        break         # 10 fölött megállunk
    print(i)
```

---
title: break and continue
summary: Leaving a loop and skipping to the next round.
---

- `break`: leaves the loop immediately.
- `continue`: skips the rest of the loop body and moves on to the next round.

```python
for i in range(1, 20):
    if i % 3 == 0:
        continue      # skip multiples of 3
    if i > 10:
        break         # stop above 10
    print(i)
```

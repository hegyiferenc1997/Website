---
title: Search and maximum
summary: Deciding, searching and finding the largest item.
---

```python
numbers = [4, 7, 1, 8, 3]

# linear search: where is the first item greater than 5?
i = 0
while i < len(numbers) and not numbers[i] > 5:
    i += 1
if i < len(numbers):
    print("Index:", i)     # Index: 1
else:
    print("None found")

# maximum selection
max_i = 0
for j in range(1, len(numbers)):
    if numbers[j] > numbers[max_i]:
        max_i = j
print(numbers[max_i])      # 8
```

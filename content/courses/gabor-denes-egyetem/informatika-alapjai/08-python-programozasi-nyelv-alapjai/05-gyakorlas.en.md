---
title: Practice – Python Basics
summary: Review questions and a summary programming exercise: word statistics.
minutes: 25
kind: practice
---

## Review questions

<details>
<summary>1. Why is `age + 1` wrong after `age = input("Age: ")`?</summary>

Because `input` returns text, and you can't add a number to text (`TypeError`). Correctly: `age = int(input("Age: "))`.

</details>

<details>
<summary>2. What does `print(17 // 5, 17 % 5, 17 / 5)` print?</summary>

`3 2 3.4`: integer division, remainder and real division.

</details>

<details>
<summary>3. What is the difference between `print` and `return` in a function?</summary>

`print` writes to the screen, but the function's result stays `None`; `return` gives the value back to the caller, who can keep computing with it.

</details>

<details>
<summary>4. What is the value of `[3, 1, 2][-1]`?</summary>

`2`: index `-1` means the last element.

</details>

```python run
# A small recap: list, loop, condition, function
def clothing(temperature):
    if temperature >= 25:
        return "T-shirt"
    if temperature >= 15:
        return "jumper"
    if temperature >= 5:
        return "coat"
    return "winter coat and hat"

for t in [28, 18, 7, -3]:
    print(t, "°C →", clothing(t))
```

## Summary exercise: word statistics

Write the function `stats(text)` that receives a text and returns a **list of three elements**: `[number of words, the longest word, the average word length rounded to two decimals]`. Words are separated by spaces (use the `text.split()` method). If several words are equally longest, return the first. For example `stats("the dog barks")` returns `[3, "barks", 3.67]`.

Tip: `round(x, 2)` rounds to two decimals.

```python starter required
def stats(text):
    words = text.split()
    count = 0
    longest = ""
    average = 0
    return [count, longest, average]


print(stats("the dog barks"))
```

<details>
<summary>Solution</summary>

```python solution
def stats(text):
    words = text.split()
    count = len(words)
    longest = ""
    total = 0
    for word in words:
        total += len(word)
        if len(word) > len(longest):
            longest = word
    average = round(total / count, 2)
    return [count, longest, average]


print(stats("the dog barks"))
```

</details>

```python test
assert stats("the dog barks") == [3, "barks", 3.67], "3 words, longest is barks, average 3.67"
assert stats("Python") == [1, "Python", 6.0], "a single word"
assert stats("it is a big day") == [5, "big", 2.2], "with equally long words, the first one"
```

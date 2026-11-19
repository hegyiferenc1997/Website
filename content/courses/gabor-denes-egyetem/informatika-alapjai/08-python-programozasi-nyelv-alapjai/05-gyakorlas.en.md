---
title: Practice – Python Basics
summary: Review questions and a summary programming exercise: word statistics.
minutes: 50
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Word frequency.** Write the `most_common(text)` function, which returns the most frequent word in the text (lowercased, with the `.,!?` punctuation stripped from the ends of words)! In a tie, the word that appears first wins.

```python starter
def most_common(text):
    return text.split()[0]
```

<details>
<summary>Solution</summary>

```python solution
def most_common(text):
    counts = {}
    for word in text.split():
        word = word.strip(".,!?").lower()
        counts[word] = counts.get(word, 0) + 1   # a dictionary keeps insertion order
    return max(counts, key=counts.get)
```

</details>

```python test
assert most_common("The dog and the cat, and the horse.") == "the"
assert most_common("Python! python? Java.") == "python"
assert most_common("one two") == "one"
print("All checks passed!")
```

**2.** **Safe conversion.** Write the `valid_grades(texts)` function, which returns, as integers, those elements of a list of strings that are valid grades (integers from 1 to 5)! Skip the bad elements (not a number, out of range) – the program must not stop.

```python starter
def valid_grades(texts):
    return [int(s) for s in texts]
```

<details>
<summary>Solution</summary>

```python solution
def valid_grades(texts):
    good = []
    for s in texts:
        try:
            g = int(s.strip())
        except ValueError:
            continue                          # not an integer: skip it
        if 1 <= g <= 5:
            good.append(g)
    return good
```

</details>

```python test
assert valid_grades(["5", "five", "3", "", "7", " 2 ", "-1"]) == [5, 3, 2]
assert valid_grades([]) == []
assert valid_grades(["4.5", "1"]) == [1]
print("All checks passed!")
```

**3.** **Group averages.** Write the `group_averages(grades)` function, which makes a `{name: average}` dictionary from a `{name: [grades]}` dictionary (rounded to 2 decimals)! If someone has no grades, their average is 0.

```python starter
def group_averages(grades):
    return {name: sum(g) / len(g) for name, g in grades.items()}
```

<details>
<summary>Solution</summary>

```python solution
def group_averages(grades):
    return {name: round(sum(g) / len(g), 2) if g else 0 for name, g in grades.items()}   # 0 for an empty list
```

</details>

```python test
assert group_averages({"Anna": [5, 4, 5], "Ben": [2, 3]}) == {"Anna": 4.67, "Ben": 2.5}
assert group_averages({"Dan": []}) == {"Dan": 0}
assert group_averages({}) == {}
print("All checks passed!")
```

### Quick check questions

```quiz
? What does `print(len("Hello"))` print?
= 5
! The string has 5 characters.

? What is the result of `[x * 2 for x in range(4)]`?
+ `[0, 2, 4, 6]`
- `[2, 4, 6, 8]`
- `[0, 1, 2, 3]`
- `[0, 2, 4, 6, 8]`
! `range(4)` gives the numbers 0, 1, 2, 3.

? What happens if you request a key that doesn't exist from a dictionary as `d[key]`?
- you get `None`
+ you get a `KeyError`
- the program creates the key automatically
- you get an empty string
! `get(key, default)` doesn't raise an error.

? What are the values of `17 // 5` and `17 % 5`?
- 3.4 and 2
+ 3 and 2
- 3 and 3
- 2 and 3
! Integer division and remainder.
```

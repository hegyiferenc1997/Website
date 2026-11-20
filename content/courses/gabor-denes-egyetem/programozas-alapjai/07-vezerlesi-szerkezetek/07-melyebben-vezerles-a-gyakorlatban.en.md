---
title: Deeper – Control Flow in Practice
summary: When to use while and when for, a command interpreter with match, the cost of nested loops (with a step-count chart) and the faster set-based solution, searching with for–else, and several programming patterns in a single pass – with runnable programs and a programming exercise.
minutes: 50
---

## What you will learn in this lesson

- when to choose a **while** and when a **for** loop,
- how to write a small **command interpreter** with the `match` statement,
- why a **nested loop** is slow on big data, and how to avoid it,
- how to do **several programming patterns** in a single pass, and what `for–else` is good for.

## 1. While or for?

In the basic lessons we saw both loops. The rule is simple: **for** is right when we know in advance what we're going through (a list's elements, from 1 to 10); **while** is right when we only know the **stopping condition**, not how many times it runs. In how many years does our money double?

```python run
# While: we don't know in advance how many times it runs – only when to stop
def doubling(interest_percent):
    amount, year = 1.0, 0
    while amount < 2:
        amount *= 1 + interest_percent / 100
        year += 1
    return year

for rate in [2, 4, 6, 9, 12]:
    print(f"at {rate:>2}% interest it doubles in {doubling(rate):>2} years (rule of 72: about {72 / rate:.0f})")
```

The "rule of 72" (72 divided by the interest rate) is a good mental estimate, and the loop computes it exactly. The danger of `while` is the **infinite loop**: if the condition never becomes false (e.g. at 0% interest), the program never stops. So always think it through: is the loop surely getting closer to stopping? If you're not sure, add a maximum number of steps too.

## 2. A command interpreter with match

`match` (since Python 3.10) doesn't just compare values, it also recognises **patterns**: it can take the input apart. Commands of a small warehouse manager:

```python run
# Command interpreter: match also recognises the command's structure
stock = {"apple": 10}

def command(line):
    match line.split():
        case ["list"]:
            return ", ".join(f"{k}: {v}" for k, v in stock.items())
        case ["add", name, qty] if qty.isdigit():           # pattern + condition (guard)
            stock[name] = stock.get(name, 0) + int(qty)
            return f"+{qty} {name}"
        case ["take", name, qty] if qty.isdigit() and stock.get(name, 0) >= int(qty):
            stock[name] -= int(qty)
            return f"-{qty} {name}"
        case ["take", name, _]:
            return f"not enough {name}"
        case []:
            return "empty command"
        case _:
            return f"unknown command: {line}"

for line in ["add pear 5", "take apple 3", "take pear 9", "list", "", "delete everything"]:
    print(f"{line!r:20} → {command(line)}")
```

`case ["add", name, qty]` checks at once whether three words arrived, whether the first is `"add"`, and puts the other two into **variables**. The part after `if` (the **guard**) adds a further condition. The same with `if–elif` chains would be much longer and harder to read. Order matters: the first matching `case` wins, so the general `_` (anything) always goes last.

## 3. The cost of nested loops

Task: are there two numbers in the list whose sum is exactly a given value (e.g. two products that together use up the budget exactly)? The obvious solution is two nested loops – we try every pair:

```plot
title: Number of steps for a list of n elements
x: 0, 1000
y: 0, 50000
f: x*(x - 1)/2 # nested loop: every pair
f: x # one pass with a set
```

```python run
# Finding a pair with a given sum: nested loop versus one pass with a set
def pair_slow(numbers, target):
    steps = 0
    for i in range(len(numbers)):
        for j in range(i + 1, len(numbers)):    # try every pair
            steps += 1
            if numbers[i] + numbers[j] == target:
                return (numbers[i], numbers[j]), steps
    return None, steps

def pair_fast(numbers, target):
    seen, steps = set(), 0
    for x in numbers:
        steps += 1
        if target - x in seen:                   # have we already seen its "partner"?
            return (target - x, x), steps
        seen.add(x)
    return None, steps

numbers = list(range(1, 2001))
print("slow:", pair_slow(numbers, 3999))
print("fast:", pair_fast(numbers, 3999))
```

With 2000 elements the nested loop tries almost **two million** pairs, the set-based solution is done in two thousand steps. The trick: in a set the question "is it in there?" is a single step (more on this in the Data Structures topic). Nested loops are of course often needed (e.g. a table's rows and columns), but if it runs on big data, it's always worth asking: do we really need to look at every pair?

## 4. Several patterns in one pass, and for–else

In the basic lesson we saw the programming patterns one by one (sum, count, maximum, decision, selection). With big data – e.g. a file we only want to read through once – we can do them all in a single loop:

```python run
# Five programming patterns in a single pass, and searching with for–else
temperatures = [12.5, 14.0, 9.5, 17.5, 21.0, 19.5, 8.0]

total, warm_count, maximum, max_day, cold_days = 0, 0, None, None, []
for day, t in enumerate(temperatures, start=1):
    total += t                                   # sum
    if t > 15:
        warm_count += 1                          # count
    if maximum is None or t > maximum:
        maximum, max_day = t, day                # maximum
    if t < 10:
        cold_days.append(day)                    # selection
print(f"mean {total / len(temperatures):.1f} °C, {warm_count} warm days, max {maximum} °C on day {max_day}, cold days: {cold_days}")

# searching: the "else" branch of for–else runs if the loop did NOT end with break
for day, t in enumerate(temperatures, start=1):
    if t >= 25:
        print("the first summer day:", day)
        break
else:
    print("there was no day above 25 °C")
```

`for–else` is unfamiliar to many, but it's exactly what a search needs: the `else` branch is the "not found" case, and there's no need for a separate `found = False` flag variable.

| Viewpoint      | What do they watch for with control structures?                                     |
| -------------- | ----------------------------------------------------------------------------------- |
| **programmer** | the structure that fits the task: for a known traversal, while a stopping condition |
| **reader**     | few levels of nesting; deep `if` towers are worth splitting into functions          |
| **tester**     | the edge cases: empty list, a single element, the condition exactly at the boundary |
| **user**       | the program shouldn't freeze (infinite loop), and shouldn't be slow on big data     |

## Summary

- For: when we know what we go through; while: when we only know the stopping condition – watch out for infinite loops.
- `match` recognises and takes apart patterns; the first matching `case` wins, `_` goes last.
- The number of steps of a nested loop grows quadratically; often one pass with a set is enough.
- Several patterns can be done in a single pass; the `else` branch of `for–else` is the "not found" case.

## Lesson exercise: the Collatz sequence

In the Collatz sequence we start from a positive integer: if it's even, divide it by 2; if it's odd, multiply by 3 and add 1. The conjecture says that from every number we sooner or later reach 1 – nobody has proved it to this day, but it holds for every number tried. Write the `collatz_steps(n)` function, which tells how many steps it takes for `n` to reach 1! (From 1 it takes 0 steps.) This is a typical `while` task: we don't know in advance how many times it runs.

```python starter required
def collatz_steps(n):
    steps = 0
    # while n isn't 1: even → n // 2, odd → 3 * n + 1, and count the steps
    return steps


print(collatz_steps(6))
```

<details>
<summary>Solution</summary>

```python solution
def collatz_steps(n):
    steps = 0
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        steps += 1
    return steps


print(collatz_steps(6))
```

</details>

```python test
assert collatz_steps(1) == 0, "0 steps from 1"
assert collatz_steps(6) == 8, "6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1: 8 steps"
assert collatz_steps(7) == 16, "16 steps from 7"
assert collatz_steps(27) == 111, "111 steps from 27"
```

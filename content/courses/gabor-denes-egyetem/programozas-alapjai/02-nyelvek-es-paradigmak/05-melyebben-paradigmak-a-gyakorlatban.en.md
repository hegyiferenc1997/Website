---
title: Deeper – Paradigms in Practice
summary: Sorting imperatively and declaratively, a bank account class with encapsulation, inheritance and polymorphism, pure functions and side effects, the shared-list trap, and the map–filter–reduce trio – with runnable programs and a programming exercise.
minutes: 50
---

## What you will learn in this lesson

- the difference between describing **"how"** (imperative) and **"what"** (declarative) on a real task,
- how a **class** protects data from being corrupted (encapsulation), and what **inheritance** is good for,
- what a **pure function** is, and why **side effects** cause hard-to-find bugs,
- how to work with the **map**, **filter** and **reduce** tools.

## 1. Sorting: "how" or "what"?

In the basic lesson we saw that an imperative program tells the machine step by step what to do, while a declarative one describes the result we want. Let's sort students by score in decreasing order, and by name when equal!

```python run
# The same sort imperatively (by hand) and declaratively (sorted + key)
students = [("Ben", 78), ("Anna", 92), ("Dora", 78), ("Chris", 65)]

# imperative: insertion sort, we write every step
result = []
for s in students:
    i = 0
    while i < len(result) and (result[i][1] > s[1] or (result[i][1] == s[1] and result[i][0] < s[0])):
        i += 1                     # find its place
    result.insert(i, s)
print("imperative: ", result)

# declarative: we only say WHAT to sort by
print("declarative:", sorted(students, key=lambda s: (-s[1], s[0])))
```

The declarative version is one line and harder to get wrong: the "how" of sorting is handled by Python's proven, fast algorithm. SQL (`ORDER BY score DESC, name`) and HTML are declarative too. The imperative version makes sense when you need full control over the steps – or when you're learning sorting itself.

## 2. Object-oriented: encapsulation, inheritance, polymorphism

A bank account's balance mustn't be overwritten directly: it may only change by deposits and withdrawals, and it can't go below zero. A **class** keeps the data and its rules in one place:

```python run
# Bank account class: the balance can only change through the methods
class Account:
    def __init__(self, owner):
        self.owner = owner
        self._balance = 0                     # the _ signals: don't touch it from outside

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("only a positive amount can be deposited")
        self._balance += amount

    def withdraw(self, amount):
        if amount > self._balance:
            raise ValueError("insufficient funds")
        self._balance -= amount

    def month_end(self):
        pass                                  # nothing to do for a basic account

    def __str__(self):
        return f"{self.owner}: {self._balance} HUF"

class Savings(Account):                       # inheritance: it can do everything Account can
    def month_end(self):
        self._balance = round(self._balance * 1.005)   # 0.5% monthly interest

accounts = [Account("Anna"), Savings("Ben")]
for acc in accounts:
    acc.deposit(100_000)
    acc.month_end()                           # polymorphism: each closes the month its own way
    print(acc)

try:
    accounts[0].withdraw(500_000)
except ValueError as e:
    print("Error:", e)
```

Three concepts in one example: thanks to **encapsulation**, the balance only changes by the rules; thanks to **inheritance**, `Savings` didn't have to be written from scratch; thanks to **polymorphism**, the loop doesn't ask what kind of account it is – each one knows what month end means for it.

## 3. Functional: pure functions and side effects

A **pure function**'s result depends only on its parameters, and it changes nothing around it. A **side effect** (modifying a global variable, overwriting the list it received, printing, writing a file) isn't forbidden, but it makes debugging harder. Here's a classic trap:

```python run
# The shared-list trap: the function "quietly" overwrites the list it received
def discounted_impure(prices):
    for i in range(len(prices)):
        prices[i] = round(prices[i] * 0.9)   # SIDE EFFECT: modifies the original list
    return prices

def discounted_pure(prices):
    return [round(p * 0.9) for p in prices]   # returns a new list, the original is untouched

prices = [1000, 2500, 400]
sale = discounted_pure(prices)
print("after pure:   original", prices, "sale", sale)

sale = discounted_impure(prices)
print("after impure: original", prices, "sale", sale, "← the original prices are lost!")
```

After the impure version the "original" prices are discounted too, because Python passes the list **by reference** (more on this in the Parameter Passing topic). A pure function is easy to test (the same input always gives the same output), and it can safely run in parallel.

## 4. Map, filter, reduce

The three basic tools of functional style: **map** transforms every element, **filter** keeps some of them, **reduce** condenses them into a single value:

```python run
# The map–filter–reduce trio on a basket's total
from functools import reduce

basket = [("bread", 650, 2), ("milk", 420, 3), ("chocolate", 890, 1), ("apple", 0, 4)]

items = map(lambda t: (t[0], t[1] * t[2]), basket)          # item price = unit price × quantity
payable = filter(lambda t: t[1] > 0, items)                 # skip the free item
total = reduce(lambda acc, t: acc + t[1], payable, 0)       # add them up
print("total:", total, "HUF")

# the same, Pythonically, with a generator expression – usually the more readable one
print("total:", sum(price * qty for _, price, qty in basket if price > 0), "HUF")
```

In Python a comprehension and `sum` are often more readable than `map`/`filter`/`reduce` – but the way of thinking is the same, and in other languages (JavaScript, Java streams, SQL) you'll meet exactly these names.

| Viewpoint      | Imperative             | Object-oriented                   | Functional                             |
| -------------- | ---------------------- | --------------------------------- | -------------------------------------- |
| **beginner**   | easiest to follow      | more concepts, but models well    | concise, unfamiliar at first           |
| **large team** | easily falls apart     | responsibilities separate well    | little hidden state, few surprises     |
| **tester**     | lots of state to watch | the object's state must be set up | a pure function is the easiest to test |

## Summary

- Imperative code describes the steps, declarative code the result; declarative is shorter and harder to get wrong.
- A class encapsulates data and its rules; inheritance reuses, polymorphism handles different objects uniformly.
- A pure function computes only from its parameters; a side effect (e.g. overwriting the list it received) can cause hidden bugs.
- map transforms, filter selects, reduce aggregates; in Python a comprehension is often the most readable.

## Lesson exercise: your own account class

Write the `Account` class! The `balance` starts at 0. `deposit(amount)` increases the balance, `withdraw(amount)` decreases it – but if there are insufficient funds, it raises a `ValueError` and the balance doesn't change!

```python starter required
class Account:
    def __init__(self):
        self.balance = 0

    def deposit(self, amount):
        pass

    def withdraw(self, amount):
        pass


acc = Account()
acc.deposit(5000)
print(acc.balance)
```

<details>
<summary>Solution</summary>

```python solution
class Account:
    def __init__(self):
        self.balance = 0

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount


acc = Account()
acc.deposit(5000)
print(acc.balance)
```

</details>

```python test
a = Account()
assert a.balance == 0, "the balance starts at 0"
a.deposit(5000)
a.withdraw(1500)
assert a.balance == 3500, "3500 after depositing 5000 and withdrawing 1500"
try:
    a.withdraw(10000)
    assert False, "a withdrawal without funds needs a ValueError"
except ValueError:
    pass
assert a.balance == 3500, "a failed withdrawal mustn't change the balance"
```

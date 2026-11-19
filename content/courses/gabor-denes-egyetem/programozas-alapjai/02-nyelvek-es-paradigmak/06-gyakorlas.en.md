---
title: Practice – Languages and Paradigms
summary: Review questions and exercises: imperative, declarative, object-oriented and functional solutions.
minutes: 25
kind: practice
---

## Review questions

**1. What is the difference between syntax and semantics?**

<details>
<summary>Answer</summary>

Syntax is the set of formal rules of a language (how to write it), semantics is the meaning of the statements (what they do).

</details>

**2. Is the SQL `SELECT` statement imperative or declarative? Why?**

<details>
<summary>Answer</summary>

Declarative: we describe what data we want, and the database engine decides how to execute the query.

</details>

**3. List the four pillars of OOP.**

<details>
<summary>Answer</summary>

Encapsulation, inheritance, polymorphism, abstraction.

</details>

**4. What makes a function "pure"?**

<details>
<summary>Answer</summary>

It always returns the same result for the same input and has no side effects (it doesn't modify outside state, print, or write files).

</details>

## Exercises

### Exercise 1: From imperative to declarative

The code below collects numbers divisible by 3. Rewrite it as a single list comprehension, storing the result in `by_three`!

```python starter
numbers = [3, 7, 9, 12, 14, 18, 20]
by_three = []
for x in numbers:
    if x % 3 == 0:
        by_three.append(x)
print(by_three)
```

<details>
<summary>Solution</summary>

```python solution
numbers = [3, 7, 9, 12, 14, 18, 20]
by_three = [x for x in numbers if x % 3 == 0]
print(by_three)
```

</details>

```python test
assert by_three == [3, 9, 12, 18]
print("All checks passed!")
```

### Exercise 2: Product class

Create a `Product` class with `name`, `price` and `quantity` attributes and a `total_value()` method returning price times quantity.

```python starter
class Product:
    def __init__(self, name, price, quantity):
        pass   # store the data!

    def total_value(self):
        pass   # return the total value!
```

<details>
<summary>Solution</summary>

```python solution
class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.quantity = quantity

    def total_value(self):
        return self.price * self.quantity
```

</details>

```python test
p = Product("pen", 250, 4)
assert p.name == "pen"
assert p.total_value() == 1000
assert Product("notebook", 600, 0).total_value() == 0
print("All checks passed!")
```

### Exercise 3: Polymorphism

Create an `Animal` base class with a `sound()` method returning `"..."`, and two subclasses: `Dog` (`"Woof"`) and `Cat` (`"Meow"`).

```python starter
class Animal:
    def sound(self):
        return "..."

# Write the Dog and Cat classes here!
```

<details>
<summary>Solution</summary>

```python solution
class Animal:
    def sound(self):
        return "..."

class Dog(Animal):
    def sound(self):
        return "Woof"

class Cat(Animal):
    def sound(self):
        return "Meow"
```

</details>

```python test
assert [a.sound() for a in [Dog(), Cat(), Animal()]] == ["Woof", "Meow", "..."]
assert isinstance(Dog(), Animal)
print("All checks passed!")
```

### Exercise 4: Sorting with a key

Sort the students **by average in descending order** using `sorted` and a `lambda`! Store the result in `ranking`.

```python starter
students = [("Anna", 4.2), ("Bela", 3.8), ("Csilla", 4.9)]
ranking = students   # fix this!
print(ranking)
```

<details>
<summary>Solution</summary>

```python solution
students = [("Anna", 4.2), ("Bela", 3.8), ("Csilla", 4.9)]
ranking = sorted(students, key=lambda s: s[1], reverse=True)
print(ranking)
```

</details>

```python test
assert [name for name, _ in ranking] == ["Csilla", "Anna", "Bela"]
print("All checks passed!")
```

## Summary exercise: Student ranking – OOP and functional tools together

The summary exercise of the topic: object-oriented and functional tools together.

1. Create a `Student` class: the constructor receives the `name` and a list of `scores`; the `average()` method returns the average of the scores (0 for an empty list).
2. Write a `top_students(students, n)` function that returns the **names of the best `n` students** by average in descending order. For equal averages, alphabetical order of the names decides. Use `sorted()` with a `key=lambda ...` key!

```python starter required
class Student:
    def __init__(self, name, scores):
        pass

    def average(self):
        pass


def top_students(students, n):
    # sorted(..., key=lambda s: (-s.average(), s.name)) – the minus sign reverses the order of averages
    pass


group = [Student("Bob", [60, 70]), Student("Anna", [90, 80]), Student("Cecil", [85, 85])]
print(top_students(group, 2))   # ['Anna', 'Cecil']
```

<details>
<summary>Solution</summary>

```python solution
class Student:
    def __init__(self, name, scores):
        self.name = name
        self.scores = scores

    def average(self):
        if not self.scores:
            return 0
        return sum(self.scores) / len(self.scores)


def top_students(students, n):
    ordered = sorted(students, key=lambda s: (-s.average(), s.name))
    return [s.name for s in ordered[:n]]


group = [Student("Bob", [60, 70]), Student("Anna", [90, 80]), Student("Cecil", [85, 85])]
print(top_students(group, 2))   # ['Anna', 'Cecil']
```

</details>

```python test
assert Student("X", [50, 100]).average() == 75, "The average of 50 and 100 is 75."
assert Student("Y", []).average() == 0, "Without scores the average is 0."
g = [Student("Bob", [60, 70]), Student("Anna", [90, 80]), Student("Cecil", [85, 85])]
assert top_students(g, 2) == ["Anna", "Cecil"], "The best two: Anna (85), Cecil (85) – ties go alphabetically."
assert top_students(g, 5) == ["Anna", "Cecil", "Bob"], "If n is larger, everyone is included."
assert top_students([], 3) == [], "An empty group gives an empty list."
```

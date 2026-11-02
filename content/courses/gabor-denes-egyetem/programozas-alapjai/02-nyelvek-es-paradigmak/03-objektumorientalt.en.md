---
title: Object-Oriented Programming
summary: Classes and objects, encapsulation, inheritance and polymorphism with Python examples.
minutes: 20
---

## What you will learn

- what a **class** and an **object** are,
- the pillars of OOP: **encapsulation, inheritance, polymorphism, abstraction**,
- how to write a simple class in Python.

## Class and object

In **object-oriented programming (OOP)** data and the operations working on it are organised into one unit, an **object**.

- A **class** is the blueprint (e.g. "Car"): it defines what data (**attributes**) and operations (**methods**) it has.
- An **object** (instance) is a concrete item built from the blueprint (e.g. "my red car").

```python run
class Student:
    """A student's name and grades."""

    def __init__(self, name):
        # The constructor: sets the initial state of the new object.
        self.name = name
        self.grades = []

    def add_grade(self, grade):
        self.grades.append(grade)

    def average(self):
        if not self.grades:
            return 0
        return sum(self.grades) / len(self.grades)


anna = Student("Anna")        # creating an object (instantiation)
anna.add_grade(5)
anna.add_grade(4)
print(anna.name, anna.average())  # Anna 4.5
```

`self` always refers to the current object: when calling `anna.average()`, `self` is `anna` itself.

## The four pillars of OOP

### 1. Encapsulation

Data and its operations belong together, and the internal details are hidden from the outside world. In Python a `_` prefix signals that an attribute is "for internal use".

```python run
class BankAccount:
    def __init__(self):
        self._balance = 0   # internal data: don't modify it directly from outside

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Only a positive amount can be deposited.")
        self._balance += amount

    def balance(self):
        return self._balance


account = BankAccount()
account.deposit(5000)
print(account.balance())   # 5000
```

The check (`amount <= 0`) guarantees that the balance never gets into an invalid state.

### 2. Inheritance

A class can take over the properties of another class and extend them. The ancestor is the **base class**, the new one is the **subclass**.

### 3. Polymorphism

Objects of different classes respond to the same method call in their own way.

```python run
class Shape:
    def area(self):
        return 0


class Rectangle(Shape):           # Rectangle is a subclass of Shape
    def __init__(self, a, b):
        self.a, self.b = a, b

    def area(self):               # overriding the base class method
        return self.a * self.b


class Circle(Shape):
    def __init__(self, r):
        self.r = r

    def area(self):
        return 3.14159 * self.r ** 2


# Polymorphism: the same call, different behaviour.
for shape in [Rectangle(3, 4), Circle(1)]:
    print(type(shape).__name__, shape.area())
```

### 4. Abstraction

The user only needs to know *what* an object does (`area()`), not how it computes it.

## When is OOP a good fit?

- When the task models **real-world things** (students, products, robots).
- When there are many similar but slightly different types (inheritance, polymorphism).
- In large programs that must be split into well-separated parts.

For small scripts, however, it can be unnecessary complexity – a few functions are enough there.

## Summary

- **Class** = blueprint, **object** = instance; data = attribute, operation = method.
- Four pillars: **encapsulation, inheritance, polymorphism, abstraction**.
- In Python the keywords are `class`, `__init__` and `self`.

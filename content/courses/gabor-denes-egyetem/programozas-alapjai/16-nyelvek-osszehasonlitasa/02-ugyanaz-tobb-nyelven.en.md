---
title: The Same Program in Several Languages
summary: Hello World, a loop, a function and a class in Python, Java, C#, Ruby, C and JavaScript.
minutes: 18
---

## What you will learn

- what **the same task** looks like in different languages,
- the **common elements** and the **differences** (types, blocks, semicolons),
- how to "translate" your Python knowledge into another language.

## 1. Hello World

Even the simplest program shows each language's "boilerplate" well.

```python run
print("Hello, world!")
```

```java
// Java: all code lives in a class; the entry point is the main method.
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```

```csharp
// C#: the modern form (top-level statements) can be a single line.
Console.WriteLine("Hello, world!");
```

```ruby
# Ruby: puts prints and adds a newline.
puts "Hello, world!"
```

```c
/* C: stdio.h is needed for printing; main returns an int. */
#include <stdio.h>
int main(void) {
    printf("Hello, world!\n");
    return 0;
}
```

```javascript
// JavaScript (browser or Node.js)
console.log("Hello, world!");
```

**Observation:** Python, Ruby and JavaScript, as scripting languages, run a single line directly; Java and C expect a mandatory structure (class, `main`).

## 2. Loop and branch: sum of even numbers from 1 to 10

```python run
total = 0
for i in range(1, 11):
    if i % 2 == 0:
        total += i
print(total)  # 30
```

```java
int total = 0;
for (int i = 1; i <= 10; i++) {   // the variable's type must be given
    if (i % 2 == 0) {
        total += i;
    }
}
System.out.println(total);
```

```csharp
int total = 0;
for (int i = 1; i <= 10; i++)
{
    if (i % 2 == 0) total += i;
}
Console.WriteLine(total);
```

```ruby
total = 0
(1..10).each do |i|        # range + block
  total += i if i.even?    # trailing if
end
puts total
```

```c
int total = 0;
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) total += i;
}
printf("%d\n", total);
```

```javascript
let total = 0;
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) total += i; // === strict equality
}
console.log(total);
```

|                  | Python                  | Java / C# / C / JS              | Ruby           |
| ---------------- | ----------------------- | ------------------------------- | -------------- |
| block marking    | indentation + `:`       | `{ }`                           | `do … end`     |
| end of statement | end of line             | `;` (optional in JS)            | end of line    |
| counting loop    | `for i in range(1, 11)` | `for (int i = 1; i <= 10; i++)` | `(1..10).each` |

The **functional style** is available everywhere too:

```python run
print(sum(i for i in range(1, 11) if i % 2 == 0))
```

```java
// Java Stream API
int total = java.util.stream.IntStream.rangeClosed(1, 10).filter(i -> i % 2 == 0).sum();
```

```csharp
// C# LINQ
int total = Enumerable.Range(1, 10).Where(i => i % 2 == 0).Sum();
```

```ruby
total = (1..10).select(&:even?).sum
```

```javascript
const total = [...Array(10).keys()]
  .map((i) => i + 1)
  .filter((i) => i % 2 === 0)
  .reduce((a, b) => a + b, 0);
```

## 3. Function: finding the largest element

```python run
def maximum(numbers: list[int]) -> int:
    largest = numbers[0]
    for number in numbers[1:]:
        if number > largest:
            largest = number
    return largest

print(maximum([3, 8, 1, 6]))  # 8
```

```java
static int maximum(int[] numbers) {         // parameter and return types are mandatory
    int largest = numbers[0];
    for (int number : numbers) {            // "for-each" loop
        if (number > largest) largest = number;
    }
    return largest;
}
```

```csharp
static int Maximum(int[] numbers)           // C# method names are capitalised (PascalCase)
{
    int largest = numbers[0];
    foreach (int number in numbers)
        if (number > largest) largest = number;
    return largest;
}
```

```ruby
def maximum(numbers)
  largest = numbers[0]
  numbers.each { |number| largest = number if number > largest }
  largest                                   # the last expression is the return value
end
```

```c
/* In C an array doesn't know its own length, so we pass it as a separate parameter. */
int maximum(const int numbers[], int n) {
    int largest = numbers[0];
    for (int i = 1; i < n; i++)
        if (numbers[i] > largest) largest = numbers[i];
    return largest;
}
```

## 4. Class: a student

```python run
class Student:
    def __init__(self, name: str, credits: int = 0):
        self.name = name
        self.credits = credits

    def complete(self, credit: int) -> None:
        self.credits += credit

    def __str__(self) -> str:
        return f"{self.name} ({self.credits} credits)"

s = Student("Anna")
s.complete(8)
print(s)  # Anna (8 credits)
```

```java
public class Student {
    private final String name;    // private: not accessible from outside (encapsulation)
    private int credits;

    public Student(String name) { // constructor: same name as the class
        this.name = name;
    }

    public void complete(int credit) { credits += credit; }

    @Override
    public String toString() { return name + " (" + credits + " credits)"; }
}
```

```csharp
public class Student
{
    public string Name { get; }              // property
    public int Credits { get; private set; }

    public Student(string name) => Name = name;

    public void Complete(int credit) => Credits += credit;

    public override string ToString() => $"{Name} ({Credits} credits)";
}
```

```ruby
class Student
  attr_reader :name, :credits     # automatic "getter" methods

  def initialize(name, credits = 0)
    @name = name                  # @ = instance variable (self. in Python)
    @credits = credits
  end

  def complete(credit)
    @credits += credit
  end

  def to_s
    "#{@name} (#{@credits} credits)"
  end
end
```

**Observation:** Python's `self.` prefix is `@` in Ruby and `this.` in Java/C# (where it can usually be omitted). Python has no `private` keyword – by convention, a name starting with `_` is considered internal.

## Summary

- The basic constructs (variable, loop, branch, function, class) **exist in every language**.
- The differences are mainly: **type declarations** (static vs. dynamic), **block marking** (`{}` vs. indentation vs. `end`), **boilerplate** (`main`, class).
- Once you know one language well, you learn the next one much faster.

## Lesson exercise: A Java class in Python

Rewrite the Java class below in Python under the name `BankAccount`!

```java
public class BankAccount {
    private final String owner;
    private int balance;

    public BankAccount(String owner) { this.owner = owner; }

    public void deposit(int amount) {
        if (amount <= 0) throw new IllegalArgumentException("Only a positive amount can be deposited.");
        balance += amount;
    }

    public void withdraw(int amount) {
        if (amount <= 0) throw new IllegalArgumentException("Only a positive amount can be withdrawn.");
        if (amount > balance) throw new IllegalStateException("Insufficient funds.");
        balance -= amount;
    }

    public int getBalance() { return balance; }

    @Override
    public String toString() { return owner + ": " + balance + " Ft"; }
}
```

Pythonic equivalents:

- `ValueError` instead of `IllegalArgumentException`, `RuntimeError` instead of `IllegalStateException`,
- instead of the `getBalance()` getter, a **read-only** `balance` property (`@property`) – assigning to it (`account.balance = 5`) raises `AttributeError`,
- private fields start with `_` (`_balance`), and `__str__` replaces `toString()`.

```python starter required
class BankAccount:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0

    def getBalance(self):
        return self.balance


acc = BankAccount("Anna Kiss")
print(acc.getBalance())
```

<details>
<summary>Solution</summary>

```python solution
class BankAccount:
    """A simple bank account (the Python equivalent of the Java class)."""

    def __init__(self, owner):
        self._owner = owner
        self._balance = 0

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Only a positive amount can be deposited.")
        self._balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Only a positive amount can be withdrawn.")
        if amount > self._balance:
            raise RuntimeError("Insufficient funds.")
        self._balance -= amount

    @property
    def balance(self):
        # A property instead of a getter; no setter, so it is read-only
        return self._balance

    def __str__(self):
        return f"{self._owner}: {self._balance} Ft"


acc = BankAccount("Anna Kiss")
acc.deposit(2000)
acc.withdraw(500)
print(acc, acc.balance)
```

</details>

```python test
acc = BankAccount("Anna Kiss")
assert acc.balance == 0, "A new account has a balance of 0."
acc.deposit(2000)
acc.withdraw(500)
assert acc.balance == 1500, "After depositing 2000 and withdrawing 500 the balance is 1500."
assert str(acc) == "Anna Kiss: 1500 Ft", "The str() looks like: Anna Kiss: 1500 Ft"
for bad in (lambda: acc.deposit(0), lambda: acc.deposit(-5), lambda: acc.withdraw(0)):
    try:
        bad()
        assert False, "A non-positive amount should raise ValueError."
    except ValueError:
        pass
try:
    acc.withdraw(10000)
    assert False, "Withdrawing without funds should raise RuntimeError."
except RuntimeError:
    pass
assert acc.balance == 1500, "A failed operation must not change the balance."
assert isinstance(BankAccount.__dict__.get("balance"), property), "balance must be a @property."
try:
    acc.balance = 99
    assert False, "balance must be read-only (assignment raises AttributeError)."
except AttributeError:
    pass
```

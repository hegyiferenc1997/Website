---
title: Practice – Comparing Languages
summary: Review questions and "translating" code from Java, C# and Ruby into Python.
minutes: 25
kind: practice
---

## Review questions

**1. Which languages compile directly to machine code, and which run on a virtual machine?**

<details>
<summary>Answer</summary>

Compiled to machine code: C, C++, Go, Rust. Compiled to bytecode and run on a virtual machine: Java (JVM), C# (.NET CLR). Python also produces bytecode, which its own virtual machine (the interpreter) executes.

</details>

**2. Which language would you pick for a microcontroller with 32 KB of memory, and why?**

<details>
<summary>Answer</summary>

C (or C++): small resource needs, direct hardware access, and no need for a runtime or garbage collector.

</details>

**3. Why does only JavaScript run natively in the browser, and what is TypeScript for?**

<details>
<summary>Answer</summary>

Browsers contain a JavaScript engine (for historical reasons it became the standard language of the web). TypeScript adds static types to JavaScript and compiles to JavaScript, so it runs the same way in the browser, but type errors are caught at compile time.

</details>

**4. What is the main trade-off between Python and C?**

<details>
<summary>Answer</summary>

Python lets you develop much faster (shorter, more readable code, automatic memory management), but the program runs more slowly. In C the program is very fast, but development is slower and error-prone (manual memory management).

</details>

**5. What corresponds to Python's `self.name` in Ruby, Java and C#?**

<details>
<summary>Answer</summary>

`@name` in Ruby, `this.name` in Java and C# (which can usually be omitted).

</details>

## Exercises

### Exercise 1: From Java to Python

Rewrite the Java method below in Python. Name the function `factorial(n)`.

```java
static long factorial(int n) {
    long result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}
```

```python starter
def factorial(n):
    # TODO: the Python equivalent of the Java code
    pass
```

<details>
<summary>Solution</summary>

```python solution
def factorial(n):
    """Compute n! with a loop (a literal translation of the Java code)."""
    result = 1
    for i in range(2, n + 1):  # n + 1 because of Java's i <= n condition
        result *= i
    return result
```

</details>

```python test
assert factorial(0) == 1
assert factorial(1) == 1
assert factorial(5) == 120
assert factorial(20) == 2432902008176640000
print("All checks passed!")
```

### Exercise 2: From Ruby to Python

Rewrite the Ruby code in Python. The function `long_words(text, min_length)` returns the words that are at least `min_length` long, **in upper case**, as a list.

```ruby
def long_words(text, min_length)
  text.split.select { |word| word.length >= min_length }.map(&:upcase)
end
```

```python starter
def long_words(text, min_length):
    # TODO
    pass
```

<details>
<summary>Solution</summary>

```python solution
def long_words(text, min_length):
    """Ruby's select + map chain is a list comprehension in Python."""
    return [word.upper() for word in text.split() if len(word) >= min_length]
```

</details>

```python test
assert long_words("programming is really fun stuff", 5) == ["PROGRAMMING", "REALLY", "STUFF"]
assert long_words("", 3) == []
assert long_words("one two", 10) == []
print("All checks passed!")
```

### Exercise 3: From C# to Python (class)

Rewrite the C# class in Python. The `Product` class has `name` and `price` attributes and a `sale_price(percent)` method that returns the discounted price rounded to an integer. A negative price raises `ValueError`.

```csharp
public class Product
{
    public string Name { get; }
    public int Price { get; }

    public Product(string name, int price)
    {
        if (price < 0) throw new ArgumentException("The price cannot be negative.");
        Name = name;
        Price = price;
    }

    public int SalePrice(int percent) => (int)Math.Round(Price * (100 - percent) / 100.0);
}
```

```python starter
class Product:
    # TODO: __init__ and sale_price
    pass
```

<details>
<summary>Solution</summary>

```python solution
class Product:
    """A product with a name and a price (the C# class's equivalent)."""

    def __init__(self, name: str, price: int):
        if price < 0:
            raise ValueError("The price cannot be negative.")  # C# ArgumentException → ValueError
        self.name = name
        self.price = price

    def sale_price(self, percent: int) -> int:
        """The discounted price rounded to an integer."""
        return round(self.price * (100 - percent) / 100)
```

</details>

```python test
p = Product("Laptop", 200_000)
assert p.name == "Laptop" and p.price == 200_000
assert p.sale_price(10) == 180_000
assert p.sale_price(0) == 200_000
try:
    Product("Broken", -1)
    assert False, "Expected ValueError"
except ValueError:
    pass
print("All checks passed!")
```

### Exercise 4: Think about it – which language?

Choose a language for each task and justify it in one sentence.

1. An interactive map on a website.
2. Software for a battery-powered device that collects sensor data.
3. Statistical analysis of a university research project's data.
4. A 3D mobile game.

<details>
<summary>Possible answer</summary>

1. **JavaScript/TypeScript** – the only thing that runs natively in the browser.
2. **C** – little memory and energy, direct hardware access.
3. **Python** – pandas, NumPy, matplotlib: ready-made tools for analysis.
4. **C# (Unity)** or **C++ (Unreal)** – the game engines' languages, which export to many platforms.

</details>

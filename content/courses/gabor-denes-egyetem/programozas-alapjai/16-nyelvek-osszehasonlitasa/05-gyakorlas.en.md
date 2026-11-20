---
title: Practice – Comparing Languages
summary: Review questions and "translating" code from Java, C# and Ruby into Python.
minutes: 50
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

## Summary exercise: Text statistics from Ruby to Python

Translate the Ruby function below into Python as `word_stats(text)`!

```ruby
def word_stats(text)
  words = text.downcase.scan(/[[:alpha:]]+/)           # words made of letters only
  counts = words.tally                                  # word => count
  top = counts.sort_by { |w, n| [-n, w] }.first(3)      # the 3 most common
  avg = words.empty? ? 0.0 : (words.sum(&:length).to_f / words.size).round(2)
  { words: words.size, unique: counts.size, most_common: top, avg_length: avg }
end
```

The Python version returns a dictionary with the keys `"words"`, `"unique"`, `"most_common"` and `"avg_length"`; the value of `"most_common"` is a **list of `(word, count)` tuples**.

Hints for the mapping:

- `scan(/[[:alpha:]]+/)` → `re.findall(r"[^\W\d_]+", ...)` (letters, accented ones too),
- `tally` → `collections.Counter`,
- `sort_by { [-n, w] }` → `sorted(..., key=lambda p: (-p[1], p[0]))`.

```python starter required
import re
from collections import Counter


def word_stats(text):
    words = text.split()
    return {"words": len(words)}


print(word_stats("Apple, pear, apple! The pear is ripe, the apple is red."))
```

<details>
<summary>Solution</summary>

```python solution
import re
from collections import Counter


def word_stats(text):
    # Words made of letters only, lowercased (the equivalent of Ruby's scan)
    words = re.findall(r"[^\W\d_]+", text.lower())
    counts = Counter(words)
    # Descending count, alphabetical on ties – the first three
    top = sorted(counts.items(), key=lambda p: (-p[1], p[0]))[:3]
    avg = round(sum(len(w) for w in words) / len(words), 2) if words else 0.0
    return {"words": len(words), "unique": len(counts), "most_common": top, "avg_length": avg}


print(word_stats("Apple, pear, apple! The pear is ripe, the apple is red."))
```

</details>

```python test
r = word_stats("Apple, pear, apple! The pear is ripe, the apple is red.")
assert r["words"] == 11 and r["unique"] == 6, "11 words, 6 of them different (no punctuation, lowercased)."
assert r["most_common"] == [("apple", 3), ("is", 2), ("pear", 2)], "The top three: apple 3, then is 2 and pear 2 alphabetically."
assert r["avg_length"] == 3.64, "The average word length is 40 / 11 ≈ 3.64."
r = word_stats("R2D2 and C-3PO in 2024")
assert r["words"] == 6 and r["unique"] == 6, "Digits are not part of words: r, d, and, c, po, in."
assert word_stats("") == {"words": 0, "unique": 0, "most_common": [], "avg_length": 0.0}, "For empty text: 0, 0, [], 0.0."
assert word_stats("b a b a c")["most_common"] == [("a", 2), ("b", 2), ("c", 1)], "Alphabetical order on equal counts."
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Programming exercises

**1.** **JavaScript-like addition.** In JavaScript `+` converts to text if either side is a string (`1 + "2"` → `"12"`), otherwise it adds numbers. Write the `js_add(a, b)` function, which imitates this behaviour in Python (for numbers and strings)!

```python starter
def js_add(a, b):
    return a + b
```

<details>
<summary>Solution</summary>

```python solution
def js_add(a, b):
    if isinstance(a, str) or isinstance(b, str):
        return str(a) + str(b)              # weak typing: automatic conversion to text
    return a + b
```

</details>

```python test
assert js_add(1, "2") == "12"
assert js_add("a", 3) == "a3"
assert js_add(1, 2) == 3
assert js_add("x", "y") == "xy"
print("All checks passed!")
```

**2.** **32-bit overflow.** In C or Java a 32-bit signed `int` is between −2,147,483,648 and 2,147,483,647, and on overflow it "wraps around". Write the `int32(x)` function, which converts any Python integer into such a 32-bit value!

```python starter
def int32(x):
    return x
```

<details>
<summary>Solution</summary>

```python solution
def int32(x):
    x = x % 2 ** 32                         # into the range 0 .. 2^32 - 1
    if x >= 2 ** 31:
        x -= 2 ** 32                        # the upper half means negative numbers
    return x
```

</details>

```python test
assert int32(5) == 5
assert int32(2147483647) == 2147483647
assert int32(2147483647 + 1) == -2147483648
assert int32(-2147483649) == 2147483647
assert int32(2 ** 32) == 0
print("All checks passed!")
```

**3.** **Rounding differently.** Python's `round()` uses "banker's" rounding: `round(2.5)` → `2`, `round(3.5)` → `4`. Many other languages (and the school rule) always round `.5` up (away from zero). Write the `round_half_up(x)` function, which rounds to an integer this way: `2.5` → `3`, `-2.5` → `-3`!

```python starter
def round_half_up(x):
    return round(x)
```

<details>
<summary>Solution</summary>

```python solution
import math

def round_half_up(x):
    if x >= 0:
        return math.floor(x + 0.5)          # positive: half up
    return -math.floor(-x + 0.5)            # negative: mirrored, away from zero
```

</details>

```python test
assert round_half_up(2.5) == 3
assert round_half_up(3.5) == 4
assert round_half_up(2.4) == 2
assert round_half_up(-2.5) == -3
assert round_half_up(-2.4) == -2
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the value of `round(2.5)` in Python?
= 2
! Banker's rounding: `.5` is rounded towards the even neighbour.

? Which statement is true about Python?
+ it is dynamically and strongly typed
- it is statically and weakly typed
- it is dynamically and weakly typed
- it is statically and strongly typed
! A variable's type is decided at runtime, but `1 + "2"` gives an error; there is no automatic conversion.

? What is the largest 32-bit signed int plus one, with wrap-around?
- 2147483648
+ -2147483648
- 0
- -1
! After the largest value comes the smallest negative one.

? Which language is typically compiled to machine code?
- Python
- JavaScript
+ C
- Bash
! C is translated directly to machine code by the compiler.
```

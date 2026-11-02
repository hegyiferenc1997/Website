---
title: Static vs Dynamic, Strong vs Weak Typing
summary: When a type error is detected, and how "lenient" the language is – the two main aspects of type systems.
minutes: 15
---

## What you will learn

- what **static** and **dynamic** typing mean,
- what **strong** and **weak** typing mean,
- where Python, Java, C and JavaScript belong,
- what an "untyped" language is.

## Two independent aspects

Type systems are usually classified along two questions:

1. **When** does the language check types? → static or dynamic
2. **How strictly** does it treat types? → strong or weak

## Static typing

The type of a variable is known **at compile time** and cannot change. Usually the programmer declares it, but the compiler may also infer it.

```java
// Java: the type must be given, and the compiler checks it.
int age = 20;
age = "twenty";   // compile error: incompatible types
```

- ✅ type errors are found at compile time
- ✅ the IDE helps more (completion, renaming)
- ✅ faster execution (the compiler knows the size of the variable)
- ❌ more typing, less flexible

Examples: C, C++, Java, C#, Go, Rust, TypeScript.

## Dynamic typing

The type belongs to the **value**, not the variable, and is checked **at run time**. The same variable can refer to values of different types.

```python run
x = 20          # now an int
print(type(x))
x = "twenty"    # now a str – allowed in Python
print(type(x))
```

- ✅ shorter, more flexible code, fast prototyping
- ❌ a type error only appears when that line runs
- ❌ in big programs it is harder to see what has which type

Examples: Python, JavaScript, Ruby, PHP.

```python run
def double(x):
    return x * 2

print(double(5))       # 10
print(double("ha"))    # haha – the same function works on text too
# double(None) would raise TypeError only at run time.
```

## Strong and weak typing

- **Strong typing:** the language doesn't mix types on its own; if they don't fit, it reports an error.
- **Weak typing:** the language converts types automatically, sometimes with surprising results.

Python is **strongly** typed:

```python run
try:
    print("5" + 3)
except TypeError as error:
    print("TypeError:", error)
```

JavaScript is **weakly** typed:

```javascript
"5" + 3    // "53"   – converts the number to text
"5" - 3    // 2      – converts the text to a number
[] + {}    // "[object Object]"
```

## Summary table

| | Strong | Weak |
| --- | --- | --- |
| **Static** | Java, C#, Rust, Go | C, C++ (many implicit conversions, pointers) |
| **Dynamic** | Python, Ruby | JavaScript, PHP |

## "Untyped" languages

Strictly speaking, in an **untyped** language all data is just a bit pattern and the language doesn't track types at all. Examples are **assembly** and the old **BCPL**: you can treat the same memory word as a number, an address or a character. In everyday speech "untyped" is often (inaccurately) used for dynamically typed languages, because there you don't have to write the types.

## Summary

- **Static:** types are known and checked at compile time; **dynamic:** at run time, attached to values.
- **Strong:** no surprising automatic conversions; **weak:** there are.
- Python is **dynamically and strongly** typed.
- Truly untyped languages (assembly) work only with bit patterns.

---
title: Practice – Data and Information
summary: Review questions and a summary worksheet on data, number systems and data representation.
minutes: 45
kind: practice
---

## Review questions

Try to answer in your head first, then open the answer!

<details>
<summary>1. Give an example of how data becomes information and then knowledge in a web shop!</summary>

Data: individual purchases (product, price, time). Information: “three times as many board games sell in December as in July”. Knowledge: “the board game stock must be filled up by the end of November”.

</details>

<details>
<summary>2. How do you convert 200 to binary and then to hexadecimal?</summary>

200 = 128 + 64 + 8 → `11001000₂`. In groups of four: `1100 1000` → `C8₁₆`.

</details>

<details>
<summary>3. Why is ASCII not enough for a Hungarian text?</summary>

Because its 128 characters lack the accented letters (á, é, ő, ű…). Those need Unicode, which today we store as UTF-8.

</details>

<details>
<summary>4. How long does a 100 Mbit/s connection take to download a 500 MB file (ideally)?</summary>

100 Mbit/s = 12.5 MB/s, so 500 / 12.5 = 40 seconds.

</details>

Try it yourself:

```python run
# One number in all three forms
n = 200
print(n, bin(n), hex(n))
# The UTF-8 bytes of a text
print(list("Győr".encode("utf-8")))
```

## Summary worksheet

```quiz required
? What is `11111111₂` in decimal?
= 255
! 2⁸ − 1 = 255.

? Write 100 in hexadecimal!
= 64
= 0x64
! 6·16 + 4 = 100.

? How many bits are in a byte?
= 8
! 1 byte = 8 bits.

? How many seconds does a 50 MB file take at 100 Mbit/s, ideally?
= 4
! 100 Mbit/s = 12.5 MB/s; 50 / 12.5 = 4.

? Which statement about UTF-8 is true?
- It stores every character on exactly 2 bytes.
+ It stores ASCII characters on 1 byte, so it is compatible with ASCII.
- It only knows the English alphabet.
- It is used for compressing images.
! UTF-8 is variable length: 1–4 bytes.

? What is the correct order of the DIKW pyramid from bottom to top?
+ data → information → knowledge → wisdom
- information → data → knowledge → wisdom
- knowledge → data → information → wisdom
- data → knowledge → information → wisdom
! Raw data becomes information through interpretation.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Binary conversion by hand.** Write the `to_binary(n)` function, which converts a non-negative integer into a base-2 string using division with remainder (without `bin()`)! The result for 0 is `"0"`.

```python starter
def to_binary(n):
    return str(n % 2)
```

<details>
<summary>Solution</summary>

```python solution
def to_binary(n):
    if n == 0:
        return "0"
    digits = ""
    while n > 0:
        digits = str(n % 2) + digits      # the remainder is the next digit (to the left)
        n //= 2
    return digits
```

</details>

```python test
assert to_binary(0) == "0"
assert to_binary(5) == "101"
assert to_binary(100) == "1100100"
assert to_binary(255) == "11111111"
print("All checks passed!")
```

**2.** **Two's complement.** Write the `complement8(x)` function, which returns the 8-bit two's complement form of an integer between −128 and 127 as an 8-character string!

```python starter
def complement8(x):
    return format(abs(x), "08b")
```

<details>
<summary>Solution</summary>

```python solution
def complement8(x):
    return format(x & 0xFF, "08b")      # the lowest 8 bits: for negatives this is exactly the two's complement
```

</details>

```python test
assert complement8(5) == "00000101"
assert complement8(-5) == "11111011"
assert complement8(-1) == "11111111"
assert complement8(-128) == "10000000"
print("All checks passed!")
```

**3.** **Image size.** Write the `image_mb(width, height, bit_depth)` function, which gives the size of an uncompressed image in megabytes (1 MB = 1024 · 1024 bytes), rounded to 2 decimals!

```python starter
def image_mb(width, height, bit_depth):
    return round(width * height * bit_depth / 1024 / 1024, 2)
```

<details>
<summary>Solution</summary>

```python solution
def image_mb(width, height, bit_depth):
    size_bytes = width * height * bit_depth / 8   # bits to bytes
    return round(size_bytes / 1024 / 1024, 2)
```

</details>

```python test
assert image_mb(1920, 1080, 24) == 5.93
assert image_mb(1024, 1024, 8) == 1.0
assert image_mb(800, 600, 1) == 0.06
print("All checks passed!")
```

### Quick check questions

```quiz
? How many different values can be stored in 10 bits?
= 1024
! $2^{10} = 1024$.

? What is the hexadecimal number `0x1F` in decimal?
= 31
! $1 \cdot 16 + 15 = 31$.

? Why isn't `0.1 + 0.2 == 0.3` equal to `True` in Python?
- because Python is buggy
+ because 0.1 is an infinite fraction in binary, the machine stores only an approximation
- because addition isn't commutative
- because 0.3 isn't a number
! Compare floating-point numbers with a tolerance.

? Which compression is lossless?
- JPEG
- MP3
+ PNG
- the usual compression of videos
! Every bit can be restored from a PNG.
```

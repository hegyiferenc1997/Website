---
title: Deeper – Data in Bits
summary: Negative numbers in two's complement and overflow, why 0.1 + 0.2 isn't exactly 0.3, how many bytes an accented letter takes in UTF-8, how big an image and a sound file are, and how much information a message holds (entropy, compression) – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- how the computer stores **negative numbers**, and what **overflow** is,
- why storing decimal fractions is **inexact**, and what to do about it,
- how many **bytes** a text, an image and a sound recording take – and why,
- what the **amount of information** (entropy) is, and why a file can be compressed.

## 1. Negative numbers: two's complement and overflow

In the basic lesson we converted positive numbers to binary. But how does the computer store **−5** if it only has 0 and 1? The most widespread method is **two's complement**: on $n$ bits the top bit's "value" isn't $+2^{n-1}$ but $-2^{n-1}$. So on 8 bits the range goes from $-128$ to $+127$.

You get a number's negative like this: **flip every bit and add 1**. Let's see:

```python run
# Two's complement on 8 bits: negative numbers and overflow
def binary8(x):
    return format(x & 0xFF, "08b")      # the lowest 8 bits, with leading zeros

def value8(bits):
    x = int(bits, 2)
    return x - 256 if x >= 128 else x   # the top bit is "worth" -128

for x in [5, -5, 127, -128, -1]:
    print(f"{x:>5} → {binary8(x)}")

# negative: flip the bits + 1
b = binary8(5)
flipped = "".join("1" if c == "0" else "0" for c in b)
print(f"\n5 = {b}, flipped {flipped}, +1 → {binary8(int(flipped, 2) + 1)} = {value8(binary8(int(flipped, 2) + 1))}")

# overflow: 127 + 1 doesn't fit in 8 bits
total = binary8(127 + 1)
print(f"127 + 1 = {total} → according to the machine {value8(total)}")
```

**127 + 1 = −128** isn't a typo: the result doesn't fit in 8 bits, so it "wraps around". This is **overflow**, and it has caused real bugs: on 19 January 2038, 32-bit (signed) Unix time counters overflow – that's why systems are moving to 64-bit timestamps. Python integers grow automatically, so in the program above we "cut" to 8 bits by hand; but in C, Java or a database `INTEGER` column the limit is real.

## 2. Why isn't 0.1 + 0.2 equal to 0.3?

Try it in any programming language:

```python run
# Floating-point numbers: decimal fractions are often infinite in binary
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)

# the correct comparison: with a tolerance
from math import isclose
print(isclose(0.1 + 0.2, 0.3))

# for money: calculate in whole cents or with Decimal
from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2"))

# the error adds up: 0.1 ten times
s = 0.0
for _ in range(10):
    s += 0.1
print(f"0.1 ten times = {s!r}")
```

The reason is simple: just as $1/3 = 0.333\ldots$ is infinite in decimal, **0.1 is an infinite fraction in binary** ($0.000110011\ldots_2$). The computer (on 64 bits, per the IEEE 754 standard) stores only an approximation. Three practical rules follow:

- **Don't compare** floating-point numbers with `==`, but with a tolerance (`isclose`).
- Never store **money** in a `float`: use whole cents (`int`) or `Decimal`, and the `NUMERIC` type in a database.
- When adding up many small numbers, the error **accumulates** – scientific computing has special algorithms for this.

## 3. How many bytes? Text, image, sound

In the basic lesson we saw that UTF-8 stores characters with **variable length**. Let's look concretely:

```python run
# UTF-8: one character is 1-4 bytes
for text in ["A", "é", "ő", "€", "😀", "Árvíztűrő tükörfúrógép"]:
    b = text.encode("utf-8")
    print(f"{text!r:<26} {len(text):>2} characters, {len(b):>2} bytes  {b.hex(' ') if len(b) <= 4 else ''}")
```

English letters take 1 byte (that's why UTF-8 is compatible with old ASCII), Hungarian accented letters 2, the euro sign 3, an emoji 4 bytes. That's why a "20-character" field can be longer than 20 bytes – and why a database or website must use **the same encoding** everywhere, otherwise you get "ĂˇrvĂ­ztĹ±rĹ‘"-style garbage.

The size of an image or sound is simple multiplication – **without compression**:

```python run
# Uncompressed image and sound sizes
def image_mb(width, height, bits_per_pixel=24):
    return width * height * bits_per_pixel / 8 / 1024**2

def sound_mb(sec, sample_rate=44100, bit_depth=16, channels=2):
    return sec * sample_rate * bit_depth * channels / 8 / 1024**2

print(f"Full HD image (1920×1080, 24 bit): {image_mb(1920, 1080):.1f} MB")
print(f"4K image (3840×2160, 24 bit):      {image_mb(3840, 2160):.1f} MB")
print(f"3-minute CD-quality song:          {sound_mb(180):.1f} MB")
print(f"the same as MP3 (128 kbit/s):      {180 * 128_000 / 8 / 1024**2:.1f} MB")
```

An uncompressed Full HD image is about 6 MB, a 3-minute song in CD quality about 30 MB – but as MP3 only about 3 MB. The difference is **compression**: JPEG and MP3 are **lossy** (they throw away what the eye or ear barely notices), PNG and ZIP are **lossless** (every bit can be restored).

## 4. How much information is in a message? Entropy

In 1948 Claude Shannon showed how information can be **measured**. If every symbol of a message is equally likely, a symbol carries $\log_2(\text{number of symbols})$ bits of information. If the distribution isn't uniform, the average information (the **entropy**) is:

$$H = -\sum_i p_i \log_2 p_i$$

A coin toss has two outcomes; if the coin is loaded (heads with probability $p$), there's less "surprise":

```plot
title: Information content of a coin toss (bits) as a function of the probability of heads
x: 0.001, 0.999
y: 0, 1.1
f: -(x*log2(x) + (1 - x)*log2(1 - x)) # entropy
dash: 1 # fair coin: 1 bit
```

With a fair coin ($p = 0.5$) it's exactly **1 bit**; if the coin almost always gives heads, the toss tells you hardly anything new. The same holds for text: if a file has few kinds of symbols, or lots of repetition, the entropy is low – and the file **compresses well**:

```python run
# Entropy and compression: repetitive text carries little information
from collections import Counter
from math import log2
import zlib

def entropy(text):
    counts = Counter(text)
    n = len(text)
    return -sum(c / n * log2(c / n) for c in counts.values())

def rle(text):                            # run-length encoding: "aaab" → "3a1b"
    out, i = "", 0
    while i < len(text):
        j = i
        while j < len(text) and text[j] == text[i]:
            j += 1
        out += f"{j - i}{text[i]}"
        i = j
    return out

texts = {"repetitive": "a" * 60 + "b" * 40, "alternating": "ab" * 50, "mixed": "Informatics is the automatic processing of information." * 2}
for name, s in texts.items():
    compressed = len(zlib.compress(s.encode()))
    print(f"{name:<12} entropy {entropy(s):.2f} bits/symbol, {len(s)} symbols → zlib {compressed} bytes, RLE {len(rle(s))} symbols")
```

Notice the **two viewpoints**: the "alternating" text has an entropy of 1 bit per symbol (two symbols, equally frequent), yet zlib compresses it very well, because it recognises the **repeating pattern** – while simple RLE makes it worse than the original! The entropy formula only looks at symbol frequencies; real compressors look at patterns too. What's truly random can't be compressed further: re-compressing good encryption output or an already compressed file (JPEG, MP3, ZIP) gains almost nothing.

| Viewpoint              | What does a "bit" mean to them?                                              | What do they watch out for?                         |
| ---------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| **hardware**           | a voltage level in a transistor, a charge in a cell                          | speed, energy, error correction                     |
| **programmer**         | types: `int` (can it overflow?), `float` (inexact!), `str` (which encoding?) | choosing the type, comparison, encoding             |
| **user**               | file size, storage, download time                                            | resolution and quality versus size                  |
| **information theory** | the measure of surprise                                                      | how compressible it is, how much can be transmitted |

## Summary

- Negative integers are stored in two's complement; on $n$ bits the range is $-2^{n-1}$ to $2^{n-1}-1$, and anything outside it overflows.
- 0.1 is an infinite fraction in binary, so compare floating-point numbers with a tolerance, and store money in whole cents or `Decimal`.
- In UTF-8 a character is 1–4 bytes; an uncompressed image's size is width × height × bit depth, a sound's is time × sample rate × bit depth × channels.
- Entropy is the average information content in bits; repetitive, predictable data compresses well, random data doesn't.

## Lesson exercise

```quiz required
? What is the largest number that can be represented on 8 bits in two's complement?
= 127
! $2^7 - 1 = 127$; the smallest is $-128$.

? What is the two's complement form of −1 on 8 bits?
= 11111111
! 1 = 00000001, flipped 11111110, +1 → 11111111.

? How many bytes is the Hungarian word "tűz" (fire) in UTF-8? (t: 1, ű: 2, z: 1 byte)
= 4
! $1 + 2 + 1 = 4$ bytes, even though it's only 3 characters.

? How should a webshop store product prices?
- as `float`, because it's fast
+ in whole cents (`int`) or as `Decimal` / `NUMERIC`, because floating-point numbers are inexact
- as text, always
- precision doesn't matter
! Even 0.1 + 0.2 isn't exactly 0.3 in floating point.

? Why doesn't a ZIP file get smaller if you zip it again?
- because ZIP doesn't compress
+ because compressed data is already almost random, with little repetition
- because the file system doesn't allow it
- because ZIP files are always 1 MB
! Compression exploits repetition (low entropy).
```

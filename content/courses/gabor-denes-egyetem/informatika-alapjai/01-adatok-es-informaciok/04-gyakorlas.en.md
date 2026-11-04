---
title: Practice – Data and Information
summary: Review questions and a summary worksheet on data, number systems and data representation.
minutes: 20
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

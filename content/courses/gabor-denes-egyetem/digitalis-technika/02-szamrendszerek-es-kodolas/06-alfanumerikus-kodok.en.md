---
title: Alphanumeric Codes – ASCII and Unicode
summary: Encoding letters, digits and control characters: ASCII, EBCDIC, Hollerith, Unicode and UTF-8.
minutes: 15
---

## What you will learn

- how a computer represents **letters and punctuation**,
- the layout of the **ASCII** table and its handy tricks,
- the older **EBCDIC** and **Hollerith** codes,
- what **Unicode** and **UTF-8** are, and why an accented letter may take 2 bytes.

## Alphanumeric codes

**Alphanumeric codes** represent not only numbers but also **letters, punctuation and control characters**. Each character is assigned a number (code point), and that number is stored in binary.

## ASCII

**ASCII** (_American Standard Code for Information Interchange_, 1963) is a **7-bit** code: 2<sup>7</sup> = **128** characters.

| Range (dec) | hex       | Contents                                            |
| ----------- | --------- | --------------------------------------------------- |
| 0–31, 127   | 00–1F, 7F | control characters (e.g. 10 = LF new line, 13 = CR) |
| 32          | 20        | space                                               |
| 48–57       | 30–39     | digits `0`–`9`                                      |
| 65–90       | 41–5A     | uppercase `A`–`Z`                                   |
| 97–122      | 61–7A     | lowercase `a`–`z`                                   |

**Values to remember:** `A` = 65 = 0x41 = 100 0001, `a` = 97 = 0x61, `0` = 48 = 0x30.

### Handy tricks

- **Lower and upper case** differ by exactly **32** (0x20), which is a single bit (the bit of weight 2<sup>5</sup> = 32): `A` = 100 0001, `a` = 110 0001. Flipping one bit switches between them.
- The value of a **digit character** is code − 48. `'7'` (55) → 55 − 48 = 7. Digit codes are 0011 xxxx, where the low 4 bits are the BCD value itself.
- Letters follow each other in **alphabetical order**, so sorting is a simple number comparison.

The 8th bit used to serve as a **parity bit**; later "extended ASCII" code pages (e.g. Latin-2 for Hungarian ő, ű) used it – they were incompatible with each other, hence the "code page chaos".

## Older codes

- **EBCDIC** (_Extended Binary Coded Decimal Interchange Code_) – an 8-bit code used on IBM mainframes; its letters are not contiguous, and it still lives on in banking systems.
- **Hollerith code** – the early code of punched-card data processing (Herman Hollerith, 1890 US census). IBM's predecessor company grew out of it.

## Unicode and UTF-8

**Unicode** puts all the world's writing systems into a single table: more than 150,000 characters, each with a unique **code point** (e.g. U+0041 = `A`, U+0151 = `ő`, U+20AC = `€`). The first 128 code points are the same as ASCII.

**UTF-8** stores a code point in 1–4 bytes:

| Code point range | Bytes | Bit pattern                         | Example          |
| ---------------- | ----- | ----------------------------------- | ---------------- |
| U+0000 – U+007F  | 1     | 0xxxxxxx                            | `A` → 41         |
| U+0080 – U+07FF  | 2     | 110xxxxx 10xxxxxx                   | `é` → C3 A9      |
| U+0800 – U+FFFF  | 3     | 1110xxxx 10xxxxxx 10xxxxxx          | `€` → E2 82 AC   |
| U+10000 –        | 4     | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx | 😀 → F0 9F 98 80 |

UTF-8 is **backward compatible** with ASCII, and the bytes always show where a character starts. Today more than 98% of websites use UTF-8.

```python run
# Character codes in Python
print(ord("A"), hex(ord("A")), format(ord("A"), "07b"))
print(chr(97), chr(0x4A))
print(chr(ord("k") - 32))          # lower to upper case: −32
print(ord("7") - ord("0"))          # value of a digit character
for ch in "Aé€":
    print(ch, "UTF-8 bytes:", ch.encode("utf-8").hex(" "))
```

## Summary

- ASCII: 7 bits, 128 characters; `A` = 65, `a` = 97, `0` = 48.
- Lower and upper case differ by 32 (one bit).
- Unicode: a unique code point for every character; UTF-8: 1–4 bytes, ASCII-compatible.

## Lesson exercise

```quiz required
? What is the ASCII code of `C` in decimal?
= 67
! `A` = 65, and letters follow each other.

? What is the ASCII code of `G` in hexadecimal?
= 47
= 0x47
! `A` = 0x41.

? How many characters are in the original 7-bit ASCII?
= 128
! 2<sup>7</sup>.

? What is the difference between the ASCII codes of a lowercase letter and its uppercase pair?
= 32
! `a` = 97, `A` = 65.

? How many bytes does UTF-8 use for `ő` (U+0151)?
= 2
! Between U+0080 and U+07FF, 2 bytes are needed.

? How many bytes does UTF-8 use for `€` (U+20AC)?
= 3
! Between U+0800 and U+FFFF, 3 bytes are needed.
```

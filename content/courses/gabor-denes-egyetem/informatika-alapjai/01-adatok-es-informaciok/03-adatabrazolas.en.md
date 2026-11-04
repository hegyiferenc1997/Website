---
title: Representing Text, Images and Sound
summary: Bytes and units, character encoding (ASCII, Unicode, UTF-8), pixels and sampling.
minutes: 18
---

## What you will learn

- what a **byte** is, and the difference between **kB** and **KiB**,
- how a letter becomes a number (**ASCII**, **Unicode**, **UTF-8**),
- how a computer stores **images** and **sound**.

## Bytes and units

**1 byte = 8 bits.** For larger units two systems live side by side:

| Decimal (SI) | Value       | Binary (IEC) | Value       |
| ------------ | ----------- | ------------ | ----------- |
| 1 kB         | 1000 bytes  | 1 KiB        | 1024 bytes  |
| 1 MB         | 1000² bytes | 1 MiB        | 1024² bytes |
| 1 GB         | 1000³ bytes | 1 GiB        | 1024³ bytes |
| 1 TB         | 1000⁴ bytes | 1 TiB        | 1024⁴ bytes |

That is why a 1 TB disk “looks smaller” in Windows: 10¹² bytes ≈ 931 GiB, and Windows shows GiB but calls it “GB”.

Network speed is measured in **bits**: 100 Mbit/s = 12.5 MB/s.

## Text: character encoding

Every character has a **code number**. **ASCII** describes 128 characters on 7 bits (English letters, digits, punctuation): `A` = 65, `a` = 97, `0` = 48. Accented letters, Chinese characters or emojis do not fit.

**Unicode** gives a number (code point) to every character of every writing system, e.g. `ő` = U+0151, `😀` = U+1F600. **UTF-8** stores that number on **1–4 bytes**: ASCII characters take 1 byte (so it is backwards compatible), `ő` takes 2, an emoji 4. Today the web is almost entirely UTF-8.

```python run
# Character ↔ code number and the number of UTF-8 bytes
for c in ["A", "a", "ő", "€"]:
    print(c, ord(c), len(c.encode("utf-8")), "bytes")
print(chr(66))
```

## Images

A **raster** (bitmap) image is made of picture elements (pixels). A pixel's colour is usually three numbers: **R**, **G**, **B** (red, green, blue), each 8 bits, so 24 bits = 3 bytes per pixel and 2²⁴ ≈ 16.7 million colours. An uncompressed 1920×1080 image: `1920 · 1080 · 3 = 6,220,800` bytes ≈ 6.2 MB. **JPEG** and **PNG** compress it to a fraction of that.

A **vector** image (SVG) describes shapes (lines, circles, curves), so it can be scaled without distortion.

## Sound

Sound is a continuous wave. The computer **samples** it: it measures the value many times per second (44,100 times on a CD) and stores every sample on a fixed number of bits (16 on a CD). One minute of CD-quality stereo: `44,100 · 16 · 2 · 60` bits ≈ 10.6 MB. MP3 and AAC compress it.

## Summary

- 1 byte = 8 bits; kB = 1000 bytes, KiB = 1024 bytes.
- ASCII: 128 characters; Unicode: every character; UTF-8: stores Unicode on 1–4 bytes.
- Image: pixels with RGB values (24 bits/pixel); sound: sampling and quantisation.

## Exercise

```quiz required
? How many bytes is 1 KiB?
= 1024
! KiB = kibibyte = 2¹⁰ bytes.

? What is the ASCII code of the letter `A` in decimal?
= 65
! A = 65, B = 66, …, a = 97.

? On how many bytes does UTF-8 store the letters of the English alphabet?
+ 1
- 2
- 3
- 4
! ASCII characters take 1 byte in UTF-8.

? How many bytes is an uncompressed 100×100 pixel image with 24-bit colour depth?
= 30000
= 30 000
! 100 · 100 · 3 bytes = 30,000 bytes.

? Which image format is **vector** based?
- JPEG
- PNG
+ SVG
- BMP
! SVG describes shapes, so it scales freely.
```

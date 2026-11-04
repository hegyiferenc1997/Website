---
title: Gyakorlás – adatok és információk
summary: Ellenőrző kérdések és összefoglaló feladatlap az adatokhoz, számrendszerekhez és az adatábrázoláshoz.
minutes: 20
kind: practice
---

## Ellenőrző kérdések

Előbb próbálj meg fejben válaszolni, csak utána nyisd le a választ!

<details>
<summary>1. Mondj egy példát arra, hogyan lesz egy webáruházban az adatból információ, majd tudás!</summary>

Adat: egyes vásárlások (termék, ár, idő). Információ: „decemberben háromszor annyi társasjáték fogy, mint júliusban”. Tudás: „november végére fel kell tölteni a társasjáték-készletet”.

</details>

<details>
<summary>2. Hogyan váltod át a 200-at kettes, majd tizenhatos számrendszerbe?</summary>

200 = 128 + 64 + 8 → `11001000₂`. Négyesével: `1100 1000` → `C8₁₆`.

</details>

<details>
<summary>3. Miért nem elég az ASCII egy magyar szöveghez?</summary>

Mert 128 karakteréből hiányoznak az ékezetes betűk (á, é, ő, ű…). Ezekhez Unicode kell, amit ma UTF-8-ban tárolunk.

</details>

<details>
<summary>4. Mennyi idő alatt tölt le egy 500 MB-os fájlt egy 100 Mbit/s-os kapcsolat (ideális esetben)?</summary>

100 Mbit/s = 12,5 MB/s, tehát 500 / 12,5 = 40 másodperc.

</details>

Próbáld ki magad:

```python run
# Egy szám mindhárom alakban
n = 200
print(n, bin(n), hex(n))
# A szöveg UTF-8 bájtjai
print(list("Győr".encode("utf-8")))
```

## Összefoglaló feladatlap

```quiz required
? Mennyi `11111111₂` tízes számrendszerben?
= 255
! 2⁸ − 1 = 255.

? Írd fel a 100-at tizenhatos számrendszerben!
= 64
= 0x64
! 6·16 + 4 = 100.

? Hány bitből áll egy bájt?
= 8
! 1 bájt = 8 bit.

? Hány másodperc alatt jön le egy 50 MB-os fájl 100 Mbit/s-mal, ideális esetben?
= 4
! 100 Mbit/s = 12,5 MB/s; 50 / 12,5 = 4.

? Melyik állítás igaz az UTF-8-ra?
- Minden karaktert pontosan 2 bájton tárol.
+ Az ASCII karaktereket 1 bájton tárolja, így kompatibilis az ASCII-vel.
- Csak az angol ábécét ismeri.
- Képek tömörítésére való.
! Az UTF-8 változó hosszú: 1–4 bájt.

? Melyik a DIKW-piramis helyes sorrendje alulról felfelé?
+ adat → információ → tudás → bölcsesség
- információ → adat → tudás → bölcsesség
- tudás → adat → információ → bölcsesség
- adat → tudás → információ → bölcsesség
! A nyers adatból értelmezéssel lesz információ.
```

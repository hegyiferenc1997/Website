---
title: Gyakorlás – adatszerkezetek és algoritmusok
summary: Ellenőrző kérdések és összefoglaló feladatlap az algoritmusokhoz és adatszerkezetekhez.
minutes: 20
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Írd le pszeudokóddal, hogyan számolod meg, hány páros szám van egy listában!</summary>

```text
db ← 0
minden x elemre a listában:
    ha x mod 2 = 0, akkor db ← db + 1
vissza: db
```

</details>

<details>
<summary>2. Melyik adatszerkezetet választanád egy szövegszerkesztő „visszavonás” funkciójához, és miért?</summary>

Vermet: mindig a legutóbbi műveletet kell visszavonni elsőként (LIFO).

</details>

<details>
<summary>3. Miért gyorsabb a telefonkönyvben név szerint keresni, mint telefonszám szerint?</summary>

Mert a nevek ábécérendben vannak, így felezéssel (bináris kereséssel) haladhatunk; a számok rendezetlenek, azokat csak sorban végignézve (lineárisan) találjuk meg.

</details>

<details>
<summary>4. Ha egy O(n²) algoritmus 1000 elemre 1 másodpercig fut, nagyjából meddig fut 2000 elemre?</summary>

A méret kétszeres, a futási idő négyszeres: kb. 4 másodperc.

</details>

```python run
# Páros számok megszámolása és a lista rendezése
lista = [8, 3, 6, 11, 4, 7]
db = 0
for x in lista:
    if x % 2 == 0:
        db += 1
print(db, sorted(lista))
```

## Összefoglaló feladatlap

```quiz required
? Melyik adatszerkezet illik egy nyomtatási sorhoz?
- verem
+ sor
- fa
- hasítótábla
! Az elsőként küldött dokumentum nyomtatódik ki elsőként (FIFO).

? Hány lépés kell **legrosszabb esetben** lineáris kereséssel egy 500 elemű listában?
= 500
! Lineáris keresés: O(n).

? Melyik adatszerkezet a Python `dict`-je?
- verem
- láncolt lista
+ hasítótábla
- gráf
! Kulcs alapján átlagosan egy lépésben keres.

? Ha egy O(n²) algoritmus 1000 elemre 2 másodpercig fut, nagyjából hány másodpercig fut 3000 elemre?
= 18
! Háromszoros méret → kilencszeres idő: 2 · 9 = 18.

? Hogy hívják a fa legfelső, szülő nélküli elemét?
= gyökér
! A mappaszerkezetben ez a gyökérkönyvtár.

? Melyik a leggyorsabb növekedésű a felsoroltak közül nagy n-re?
- O(log n)
- O(n)
- O(n log n)
+ O(n²)
! Az n² nő a leggyorsabban.
```

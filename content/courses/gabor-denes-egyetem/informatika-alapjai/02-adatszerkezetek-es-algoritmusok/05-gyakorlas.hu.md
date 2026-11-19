---
title: Gyakorlás – adatszerkezetek és algoritmusok
summary: Ellenőrző kérdések és összefoglaló feladatlap az algoritmusokhoz és adatszerkezetekhez.
minutes: 45
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Bináris keresés lépésszámmal.** Írd meg a `binaris_kereses(lista, cel)` függvényt, amely egy rendezett listában megkeresi a `cel` indexét, és a `(index, lépések száma)` párt adja vissza! Ha nincs benne, az index legyen `-1`. Egy lépés egy középső elem megvizsgálása.

```python starter
def binaris_kereses(lista, cel):
    if cel in lista:
        return (lista.index(cel), 1)
    return (-1, 1)
```

<details>
<summary>Megoldás</summary>

```python solution
def binaris_kereses(lista, cel):
    bal, jobb, lepes = 0, len(lista) - 1, 0
    while bal <= jobb:
        lepes += 1
        kozep = (bal + jobb) // 2
        if lista[kozep] == cel:
            return (kozep, lepes)
        if lista[kozep] < cel:
            bal = kozep + 1                  # a jobb felében folytatjuk
        else:
            jobb = kozep - 1
    return (-1, lepes)
```

</details>

```python test
l = list(range(0, 100, 2))
assert binaris_kereses(l, 48) == (24, 1)
assert binaris_kereses(l, 98) == (49, 6)
assert binaris_kereses(l, 7)[0] == -1
assert binaris_kereses([], 3) == (-1, 0)
print("Minden ellenőrzés sikeres!")
```

**2.** **Zárójelek ellenőrzése.** Írd meg a `rendben(szoveg)` függvényt, amely veremmel ellenőrzi, hogy a `()`, `[]`, `{}` zárójelek helyesen vannak-e párosítva (a többi karaktert hagyd figyelmen kívül)!

```python starter
def rendben(szoveg):
    return szoveg.count("(") == szoveg.count(")")
```

<details>
<summary>Megoldás</summary>

```python solution
PAR = {")": "(", "]": "[", "}": "{"}

def rendben(szoveg):
    verem = []
    for c in szoveg:
        if c in "([{":
            verem.append(c)
        elif c in PAR:
            if not verem or verem.pop() != PAR[c]:   # nincs vagy rossz a párja
                return False
    return not verem
```

</details>

```python test
assert rendben("f(x[1])") is True
assert rendben("([)]") is False
assert rendben("((") is False
assert rendben("{a: [1, (2)]}") is True
assert rendben(")(") is False
print("Minden ellenőrzés sikeres!")
```

**3.** **Buborékrendezés számlálóval.** Írd meg a `buborek(lista)` függvényt, amely visszaadja a rendezett lista másolatát és a cserék számát `(rendezett, cserek)` alakban! Az eredeti lista ne változzon.

```python starter
def buborek(lista):
    return (sorted(lista), 0)
```

<details>
<summary>Megoldás</summary>

```python solution
def buborek(lista):
    a, cserek = lista[:], 0                   # másolaton dolgozunk
    for i in range(len(a) - 1):
        for j in range(len(a) - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                cserek += 1
    return (a, cserek)
```

</details>

```python test
eredeti = [3, 1, 2]
assert buborek(eredeti) == ([1, 2, 3], 2)
assert eredeti == [3, 1, 2]
assert buborek([5, 4, 3, 2, 1]) == ([1, 2, 3, 4, 5], 10)
assert buborek([1, 2, 3]) == ([1, 2, 3], 0)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik adatszerkezet működik „elsőként be, elsőként ki” elven?
- verem
+ sor
- fa
- hasítótábla
! FIFO: a nyomtatási sor is így működik.

? Legfeljebb hány lépés kell a bináris kereséshez egy 1000 elemű rendezett listában?
= 10
! $2^{10} = 1024 \geq 1000$.

? Hányszorosára nő egy $O(n^2)$ algoritmus futási ideje, ha az adat mérete tízszeresére nő?
= 100
! $10^2 = 100$.

? Miért gyors a keresés egy Python-szótárban?
- mert a szótár mindig rendezett
+ mert a hasítófüggvény közvetlenül megmondja, melyik rekeszben van a kulcs
- mert a szótár kicsi
- nem gyors
! Átlagosan $O(1)$ lépés.
```

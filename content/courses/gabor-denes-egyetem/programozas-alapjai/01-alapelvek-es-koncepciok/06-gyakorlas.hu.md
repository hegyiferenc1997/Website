---
title: Gyakorlás – alapelvek
summary: Ellenőrző kérdések és első feladatok a témakör anyagából.
minutes: 20
kind: practice
---

## Ellenőrző kérdések

Próbálj meg előbb magadtól válaszolni, csak utána nyisd le a választ.

**1. Mi a különbség az algoritmus és a program között?**

<details>
<summary>Válasz</summary>

Az algoritmus a megoldás lépéseinek pontos leírása, nyelvtől függetlenül. A program ennek megvalósítása egy konkrét programozási nyelven, amit a gép végre tud hajtani.

</details>

**2. Sorolj fel legalább négy tulajdonságot, ami egy jó algoritmusra jellemző!**

<details>
<summary>Válasz</summary>

Egyértelmű, véges, determinisztikus, általános, és van bemenete és kimenete.

</details>

**3. Melyik az a három vezérlési szerkezet, amiből minden algoritmus felépíthető?**

<details>
<summary>Válasz</summary>

Szekvencia, elágazás (szelekció) és ciklus (iteráció).

</details>

**4. Milyen alakzat jelöli a folyamatábrán a döntést?**

<details>
<summary>Válasz</summary>

A rombusz, amelyből egy „igen” és egy „nem” ág indul.

</details>

**5. Melyik adatszerkezetet választanád, ha azt kell gyorsan eldönteni, hogy egy felhasználónév foglalt-e már?**

<details>
<summary>Válasz</summary>

Halmazt (vagy szótárt): ezekben a „benne van-e?” kérdés átlagosan egy lépésben eldönthető, míg listában az összes elemet végig kellene nézni.

</details>

## Feladatok

### 1. feladat: Névjegy

Írj programot, amely három külön sorba kiírja a neved, a szakod és azt, hogy hányadik féléves vagy.

```python starter
# Írd ide a kiírásokat!
```

<details>
<summary>Megoldás</summary>

```python solution
print("Kiss Anna")
print("Mérnökinformatikus BSc")
print("1. félév")
```

</details>

### 2. feladat: Téglalap

Egy téglalap oldalai `a = 6` és `b = 4`. Számold ki és írd ki a kerületét és a területét! A számításokat a `kerulet` és `terulet` változókba tedd.

```python starter
a = 6
b = 4
kerulet = 0   # javítsd ki!
terulet = 0   # javítsd ki!
print("Kerület:", kerulet)
print("Terület:", terulet)
```

<details>
<summary>Megoldás</summary>

```python solution
a = 6
b = 4
kerulet = 2 * (a + b)
terulet = a * b
print("Kerület:", kerulet)
print("Terület:", terulet)
```

</details>

```python test
assert kerulet == 20, "A kerület 2 * (a + b)"
assert terulet == 24, "A terület a * b"
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Pszeudokódból Python

Írd át Pythonba a következő pszeudokódot! Az eredményt a `nagyobb` változóba tedd.

```text
x := 15
y := 9
Ha x > y akkor nagyobb := x különben nagyobb := y
Írd ki: nagyobb
```

```python starter
x = 15
y = 9
# Írd ide az elágazást!
```

<details>
<summary>Megoldás</summary>

```python solution
x = 15
y = 9
if x > y:
    nagyobb = x
else:
    nagyobb = y
print(nagyobb)
```

</details>

```python test
assert nagyobb == 15
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Tervezés (papíron)

Bontsd lépésekre a következő feladatot, és írd le pszeudokóddal: _„Egy bolt 10 000 Ft feletti vásárlásnál 10% kedvezményt ad. Számold ki a fizetendő összeget.”_

<details>
<summary>Egy lehetséges megoldás</summary>

```text
Olvasd be: összeg
Ha összeg > 10000 akkor
    fizetendő := összeg * 0.9
különben
    fizetendő := összeg
Elágazás vége
Írd ki: fizetendő
```

</details>

## Összefoglaló feladat: Mérési statisztika

Ez a témakör összefoglaló feladata – az összes eddigi lépést használja: algoritmus tervezése, ciklus, elágazás, függvény.

Írj `statisztika(meresek)` függvényt, amely egy számokat tartalmazó listából egy háromelemű listát ad vissza: `[legkisebb, legnagyobb, átlag]`. Az átlagot **két tizedesjegyre kerekítsd** (`round(x, 2)`). A `min()`, `max()` és `sum()` beépített függvényeket **ne** használd – egyetlen ciklusban számold ki mindhármat! Üres listára `None` legyen az eredmény.

```python starter required
def statisztika(meresek):
    # 1. Üres lista? → None
    # 2. Kezdőértékek az első elemből
    # 3. Egyetlen ciklus: legkisebb, legnagyobb, összeg frissítése
    # 4. Vissza: [legkisebb, legnagyobb, átlag két tizedesre kerekítve]
    pass


print(statisztika([12, 7, 21, 3]))   # [3, 21, 10.75]
```

<details>
<summary>Megoldás</summary>

```python solution
def statisztika(meresek):
    if len(meresek) == 0:
        return None
    legkisebb = meresek[0]
    legnagyobb = meresek[0]
    osszeg = 0
    for x in meresek:
        if x < legkisebb:
            legkisebb = x
        if x > legnagyobb:
            legnagyobb = x
        osszeg += x
    return [legkisebb, legnagyobb, round(osszeg / len(meresek), 2)]


print(statisztika([12, 7, 21, 3]))   # [3, 21, 10.75]
```

</details>

```python test
assert statisztika([12, 7, 21, 3]) == [3, 21, 10.75], "statisztika([12, 7, 21, 3]) → [3, 21, 10.75]"
assert statisztika([5]) == [5, 5, 5.0], "Egyetlen mérésnél mindhárom érték ugyanaz."
assert statisztika([-1.5, 2, 0]) == [-1.5, 2, 0.17], "Negatív és tört számokkal is működjön (átlag: 0.17)."
assert statisztika([]) is None, "Üres listára None az eredmény."
```

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

Bontsd lépésekre a következő feladatot, és írd le pszeudokóddal: *„Egy bolt 10 000 Ft feletti vásárlásnál 10% kedvezményt ad. Számold ki a fizetendő összeget.”*

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

---
title: Gyakorlás – multitasking és időosztás
summary: Kísérlet a nice értékkel és a magokkal, ellenőrző kérdések és összefoglaló feladatlap.
minutes: 50
kind: practice
---

## Kísérlet: ki kap több CPU-t?

Az Ubuntu VM-et állítsd **1 processzorra** (Beállítások → Rendszer → Processzor), hogy a két folyamat biztosan versengjen.

```bash
# Két végtelen számoló ciklus: az egyik normál, a másik nice 19-cel.
sh -c 'while :; do :; done' &
nice -n 19 sh -c 'while :; do :; done' &
top                     # figyeld a %CPU és az NI oszlopot, majd q
kill %1 %2              # leállítjuk mindkettőt
```

A normál folyamat a CPU-idő nagy részét kapja, a „kedves” csak a maradékot. Utána állítsd vissza a processzorok számát.

## Ellenőrző kérdések

<details>
<summary>1. Miért nem érdemes 0,01 ms-os kvantumot választani, ha a környezetváltás 0,005 ms?</summary>

Mert a hatékonyság q / (q + s) = 0,01 / 0,015 ≈ 67% lenne: a CPU idejének harmada csak váltogatással menne el.

</details>

<details>
<summary>2. Mi a különbség a multiprogramozás és az időosztás célja között?</summary>

A multiprogramozás a CPU-kihasználtságot növeli (ne álljon tétlenül I/O alatt). Az időosztás a válaszidőt csökkenti, hogy sok interaktív felhasználó úgy érezze, egyedül használja a gépet.

</details>

<details>
<summary>3. Miért emeli meg a Windows az előtérben lévő ablak szálainak prioritását?</summary>

Hogy a felhasználó által éppen használt program gyorsan reagáljon a kattintásokra és a gépelésre, még ha a háttérben számításigényes feladatok futnak is.

</details>

<details>
<summary>4. Miért nem mindig jó, ha a kernel egy szálat a legkevésbé terhelt magra költöztet?</summary>

Mert az új magon hideg a gyorsítótár és a TLB, ezért a szál egy ideig lassabban fut. Ha a terhelés különbsége kicsi, jobb az eredeti magon hagyni (affinitás).

</details>

## Összefoglaló feladatlap

```quiz required
? A kvantum 19 ms, egy környezetváltás 1 ms. Hány százalék a hatékonyság?
= 95
= 95%
! 19 / 20 = 95%.

? 4 folyamat váltakozik, q = 25 ms. Legfeljebb hány ms telik el egy folyamat két futása között?
= 75
! (4 − 1) · 25 = 75 ms.

? Melyik paranccsal indítasz egy programot alacsonyabb prioritással Linuxon?
+ nice -n 10 program
- kill -9 program
- sudo program
- top program
! A futó folyamatokhoz: renice.

? Melyik multitasking-fajtát használja minden mai asztali operációs rendszer?
- kooperatív
+ preemptív
- kötegelt
- egyfeladatos
! Az OS az időzítő segítségével veheti el a CPU-t.

? Melyik Windows prioritásosztály a legveszélyesebb, mert a rendszertől is elveheti a CPU-t?
+ Valós idejű
- Magas
- Normál
- Alacsony
! A 16–31-es szintek mindig megelőzik a közönséges szálakat.

? Hogy hívjuk, amikor több feladat egy időszakban halad, de egy magon felváltva fut?
= konkurencia
= egyidejűség
= concurrency
! A párhuzamosság a valóban egyidejű futás több magon.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Rezsi és várakozás.** Írd meg a `kvantum_elemzes(n, q, s)` függvényt, amely egy párt ad vissza: a rezsit százalékban (s / (q + s) · 100, egy tizedesre kerekítve) és a leghosszabb várakozást két futás között ((n − 1) · (q + s), egy tizedesre).

```python starter
def kvantum_elemzes(n, q, s):
    return (0, 0)
```

<details>
<summary>Megoldás</summary>

```python solution
def kvantum_elemzes(n, q, s):
    rezsi = round(s / (q + s) * 100, 1)
    varakozas = round((n - 1) * (q + s), 1)
    return (rezsi, varakozas)
```

</details>

```python test
assert kvantum_elemzes(5, 4, 1) == (20.0, 20.0)
assert kvantum_elemzes(10, 10, 0.1) == (1.0, 90.9)
assert kvantum_elemzes(1, 20, 0) == (0.0, 0.0)
print("Minden ellenőrzés sikeres!")
```

**2.** **CPU-részesedés nice értékből.** A Linux ütemezője a nice értékből súlyt képez: nagyjából **súly = 1024 / 1,25^nice**. Írd meg a `reszesedes(nice_ertekek)` függvényt, amely visszaadja, hogy az egy magon versengő feladatok a CPU hány százalékát kapják (egész számra kerekítve)!

```python starter
def reszesedes(nice_ertekek):
    return [100 // len(nice_ertekek)] * len(nice_ertekek)
```

<details>
<summary>Megoldás</summary>

```python solution
def reszesedes(nice_ertekek):
    sulyok = [1024 / 1.25 ** n for n in nice_ertekek]
    osszes = sum(sulyok)
    return [round(100 * s / osszes) for s in sulyok]
```

</details>

```python test
assert reszesedes([0, 0]) == [50, 50]
assert reszesedes([0, 1]) == [56, 44]
assert reszesedes([0, 5]) == [75, 25]
assert reszesedes([0, 10]) == [90, 10]
print("Minden ellenőrzés sikeres!")
```

**3.** **Terheléselosztás magok között.** Írd meg a `befejezes(feladatok, magok)` függvényt: a feladatokat (futásidők ms-ban) **a leghosszabbal kezdve** mindig a legkevésbé terhelt magra tesszük. Add vissza, mikor végez a legutolsó mag (ms)!

```python starter
def befejezes(feladatok, magok):
    return sum(feladatok)
```

<details>
<summary>Megoldás</summary>

Ez a „leghosszabb előre” (LPT) mohó módszer. A második példa mutatja a korlátot: egy 10 ms-os feladatot semmilyen elosztás nem gyorsít – egy feladat egyszerre csak egy magon fut.

```python solution
def befejezes(feladatok, magok):
    terheles = [0] * magok
    for f in sorted(feladatok, reverse=True):     # a leghosszabbal kezdünk
        i = terheles.index(min(terheles))         # a legkevésbé terhelt mag
        terheles[i] += f
    return max(terheles)
```

</details>

```python test
assert befejezes([5, 5, 4, 4, 3, 3], 3) == 8
assert befejezes([10, 1, 1, 1], 2) == 10
assert befejezes([2, 2, 2, 2], 4) == 2
assert befejezes([7, 3], 1) == 10
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a különbség a párhuzamosság és a konkurencia között?
+ párhuzamosság: több feladat valóban egyszerre fut több magon; konkurencia: több feladat halad egymásba fonódva, akár egy magon is
- nincs különbség
- a konkurencia csak hálózaton létezik
! Egy magon is lehet konkurencia, de párhuzamosság nem.

? Mi a processzor-affinitás?
+ egy szál lehetőleg ugyanazon a magon fusson, mert ott „meleg” a gyorsítótára
- a processzor órajelének növelése
- a processzor hőmérséklet-szabályozása
! Linuxon a taskset paranccsal állítható.

? Melyik nice érték jelenti a legmagasabb prioritást Linuxon?
= -20
! A tartomány −20 (legmagasabb) … +19 (legalacsonyabb).

? Miért nem érdemes a Windows Feladatkezelőben egy programot „Valós idejű” prioritásra állítani?
+ mert egy elszabadult program elveheti a CPU-t a rendszer többi részétől is
- mert attól a program lassabb lesz
- mert ez csak Linuxon működik
! A valós idejű szintek mindig megelőzik a közönségeseket.

? Mi az önkéntes környezetváltás?
+ amikor a folyamat maga vár (pl. I/O-ra), és lemond a CPU-ról
- amikor lejár az időszelete
- amikor a felhasználó bezárja a programot
! A kényszerített (nonvoluntary) váltás az időszelet lejártakor történik.
```

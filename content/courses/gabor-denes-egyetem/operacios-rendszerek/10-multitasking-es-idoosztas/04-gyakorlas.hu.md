---
title: Gyakorlás – multitasking és időosztás
summary: Kísérlet a nice értékkel és a magokkal, ellenőrző kérdések és összefoglaló feladatlap.
minutes: 25
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

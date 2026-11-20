---
title: Gyakorlás – fejlesztés és optimalizálás
summary: Mérési gyakorlat a virtuális gépeden, ellenőrző kérdések és összefoglaló feladatlap az Amdahl-törvénnyel.
minutes: 50
kind: practice
---

## Mérési gyakorlat a virtuális gépeden

Indítsd el az 1. témakörben telepített Ubuntu virtuális gépet, és végezd el a lépéseket:

1. `uptime` – jegyezd fel a terhelési átlagot, és vesd össze a VM magjainak számával (`nproc`).
2. `systemd-analyze` és `systemd-analyze blame | head` – mennyi ideig tartott az indulás, és mi volt a leglassabb?
3. `free -h` – mennyi a **used**, a **buff/cache** és az **available** memória?
4. Egy másik terminálban indíts terhelést: `yes > /dev/null` (Ctrl + C állítja le), és figyeld a `top` kimenetét. Melyik oszlop nő?
5. Windows 11 VM-en nyisd meg a Feladatkezelő **Indítás** fülét: mely programok vannak „Magas” hatással?

<details>
<summary>Mire figyelj?</summary>

- 2 magos VM-en a 2,0 körüli terhelési átlag teljes kihasználtságot jelent.
- A `yes` egy magot 100%-ra terhel; a `top`-ban a `us` (felhasználói idő) nő, a terhelési átlag lassan 1-gyel emelkedik.
- Az indulási időt a VM-ben a virtuális lemez sebessége is befolyásolja; SSD-n lévő VM gyorsabban indul.

</details>

## Ellenőrző kérdések

<details>
<summary>1. Miért kerül előbb egy új kernelfunkció az -rc kiadásokba, mint a stabil verzióba?</summary>

Mert a beolvasztási ablak után hetekig csak tesztelés és hibajavítás folyik. A kiadásra jelölt (rc) verziókat sokan kipróbálják, így a hibák még a stabil kiadás előtt kiderülnek.

</details>

<details>
<summary>2. Miért nem érdemes egy lassú gépen „vakon” mindent kikapcsolni?</summary>

Mert lehet, hogy nem az a szűk keresztmetszet, és fontos funkciót (pl. biztonsági frissítést, víruskeresőt) kapcsolsz ki. Előbb mérj, aztán célzottan változtass, egyszerre egy dolgot.

</details>

<details>
<summary>3. Egy program 50%-a soros. Megéri-e 64 magos gépet venni hozzá?</summary>

Nem igazán: az Amdahl-törvény szerint a gyorsulás felső határa 1 / 0,5 = 2, és 64 maggal is csak kb. 1,97-szeres. Előbb a soros részt kell csökkenteni.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy program 90%-a párhuzamosítható. Hányszoros gyorsulást ad 9 mag az Amdahl-törvény szerint?
= 5
! 1 / (0,1 + 0,9/9) = 1 / (0,1 + 0,1) = 5.

? Mennyi ugyanennek a programnak az elméleti felső gyorsulása?
= 10
! 1 / (1 − 0,9) = 10.

? Egy 2 magos gépen a terhelési átlag 2,0. Mit jelent ez?
+ mindkét mag teljesen dolgozik, de nem vár senki
- a gép kétszeresen túlterhelt
- a gép félig terhelt
- a gép áll
! A terhelési átlagot a magok számához kell viszonyítani.

? Mi a Linux swappiness alapértéke Ubuntun?
= 60
! 0 és 200 között állítható.

? Melyik NEM szükséges egy SSD karbantartásához?
+ töredezettségmentesítés
- TRIM
- firmware-frissítés
- elegendő szabad hely
! SSD-n a töredezettség nem lassít, a felesleges írás csak koptatja.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Terhelési átlag számolása.** A kernel 5 másodpercenként frissít: új = régi · e^(−5/P) + n · (1 − e^(−5/P)). Írd meg a `load_atlag(mintak, P=60)` függvényt: a `mintak` lista az 5 másodpercenként mért futó/kész folyamatszámok, a kezdőérték 0. Add vissza a végső értéket két tizedesre kerekítve!

```python starter
def load_atlag(mintak, P=60):
    return sum(mintak) / len(mintak)
```

<details>
<summary>Megoldás</summary>

```python solution
import math

def load_atlag(mintak, P=60):
    e = math.exp(-5 / P)
    atlag = 0.0
    for n in mintak:
        atlag = atlag * e + n * (1 - e)      # exponenciálisan csillapított átlag
    return round(atlag, 2)
```

</details>

```python test
assert load_atlag([4] * 12) == 2.53              # 1 perc, 4 folyamat
assert load_atlag([4] * 60) == 3.97              # 5 perc
assert load_atlag([4] * 12, P=900) == 0.26       # a 15 perces érték lassan reagál
assert load_atlag([0] * 10) == 0.0
print("Minden ellenőrzés sikeres!")
```

**2.** **Egy szerver sorbanállási modellje.** Másodpercenként `lam` kérés érkezik, egy kérés kiszolgálása `S` másodperc. Írd meg a `szerver(lam, S)` függvényt: kihasználtság U = lam · S; ha U ≥ 1, add vissza a `None`-t (a sor végtelenre nő). Egyébként a válaszidő R = S / (1 − U), és Little törvényével a rendszerben lévő kérések száma L = lam · R. Add vissza az `(U, R, L)` hármast, mindet három tizedesre kerekítve!

```python starter
def szerver(lam, S):
    return (0, S, 0)
```

<details>
<summary>Megoldás</summary>

Figyeld meg: 50-ről 90 kérés/mp-re (1,8-szoros forgalom) a válaszidő 20 ms-ról 100 ms-ra nő – ötszörösére. Ez a „hokiütő” görbe.

```python solution
def szerver(lam, S):
    U = lam * S
    if U >= 1:
        return None                          # több munka érkezik, mint amennyi elvégezhető
    R = S / (1 - U)                          # M/M/1 válaszidő
    L = lam * R                              # Little törvénye
    return (round(U, 3), round(R, 3), round(L, 3))
```

</details>

```python test
assert szerver(50, 0.01) == (0.5, 0.02, 1.0)
assert szerver(90, 0.01) == (0.9, 0.1, 9.0)
assert szerver(120, 0.01) is None
print("Minden ellenőrzés sikeres!")
```

**3.** **Percentilis.** Írd meg a `percentilis(adatok, p)` függvényt a „legközelebbi rang” módszerrel: rendezd az adatokat, és add vissza a ⌈p/100 · n⌉-edik elemet (1-től számozva)!

```python starter
def percentilis(adatok, p):
    return sum(adatok) / len(adatok)
```

<details>
<summary>Megoldás</summary>

```python solution
import math

def percentilis(adatok, p):
    rendezett = sorted(adatok)
    rang = max(1, math.ceil(p / 100 * len(rendezett)))   # 1-től számozott rang
    return rendezett[rang - 1]
```

</details>

```python test
ido = [12, 15, 11, 300, 14, 13, 16, 12, 18, 450]
assert percentilis(ido, 50) == 14
assert percentilis(ido, 90) == 300
assert percentilis(ido, 100) == 450
assert percentilis([5], 99) == 5
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik a négy fő erőforrás, amelyet teljesítményfigyelésnél nézünk?
+ CPU, memória, lemez, hálózat
- CPU, monitor, billentyűzet, egér
- RAM, ROM, BIOS, UEFI
! A leglassabb (először betelő) a szűk keresztmetszet.

? Magas I/O-várakozás (wa) mellett alacsony a CPU-használat. Mi valószínűleg a szűk keresztmetszet?
+ a lemez
- a processzor
- a hálózati kártya
! A CPU a lemezre vár.

? Egy 4 magos gépen a terhelési átlag 8,0. Mit jelent ez?
+ kétszeres túlterhelés: átlagosan minden futó mellett egy folyamat vár
- a gép félig terhelt
- a gép tétlen
! A terhelési átlagot a magok számához viszonyítjuk.

? Miért nem baj Linuxon, ha a free parancs szerint alig van „szabad” memória?
+ mert a kernel a nem használt memóriát lemezgyorsítótárnak használja, és szükség esetén azonnal felszabadítja
- mert a Linux nem használ memóriát
- mert a swap mindig elég
! Az „available” oszlop a lényeg, nem a „free”.

? Mi a teendő optimalizálás előtt?
+ mérni, és egyszerre csak egy dolgot változtatni
- minél több beállítást egyszerre átállítani
- új hardvert venni
! Ami nem mérhető, arról nem tudod, javult-e.
```

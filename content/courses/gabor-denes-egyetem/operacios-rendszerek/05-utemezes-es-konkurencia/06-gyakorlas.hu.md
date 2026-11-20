---
title: Gyakorlás – ütemezés és konkurencia
summary: Ellenőrző kérdések és egy számolós összefoglaló feladatlap ütemezésből, szemaforokból és holtpontból.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem használható a gyakorlatban a tiszta SJF?</summary>

Mert a következő CPU-löket hosszát nem ismerjük előre. Becsülni lehet (pl. a korábbi löketek exponenciális átlagával), de pontosan nem tudható.

</details>

<details>
<summary>2. Mi történik Round Robinnál, ha a kvantum nagyobb, mint a leghosszabb löket?</summary>

Minden folyamat egyetlen kvantumban lefut, és soha nem szakítják meg, tehát az ütemezés pontosan FCFS-sé válik.

</details>

<details>
<summary>3. Miért nem elég egy sima `if (szabad) szabad = false;` a zároláshoz?</summary>

Mert a vizsgálat és a beállítás két külön lépés: két szál is láthatja egyszerre, hogy szabad, és mindkettő belép. Atomi hardverutasítás (pl. test-and-set, compare-and-swap) vagy az OS által adott mutex kell.

</details>

<details>
<summary>4. Mi a különbség a holtpont és a kiéheztetés között?</summary>

Holtpontnál a résztvevők közül senki sem halad, körben várnak egymásra. Kiéheztetésnél a rendszer halad, csak egy (alacsony prioritású) folyamat nem kerül sorra soha.

</details>

<details>
<summary>5. Hogyan töri meg a holtpontot az étkező filozófusoknál, ha legfeljebb négyen ülhetnek le egyszerre?</summary>

Négy filozófus és öt villa esetén legalább egyikük biztosan megkapja mindkét villát, megeszik, és visszaadja őket – így nem alakulhat ki körkörös várakozás.

</details>

## Összefoglaló feladatlap

Három folyamat érkezik a 0. ms-ban ebben a sorrendben: **P1 = 4 ms**, **P2 = 8 ms**, **P3 = 2 ms**.

```quiz required
? Mennyi az összes várakozási idő (ms) FCFS-sel?
= 16
! Várakozás: P1 = 0, P2 = 4, P3 = 12 → 16.

? Mennyi az összes várakozási idő (ms) SJF-fel?
= 8
! Sorrend: P3 (0–2), P1 (2–6), P2 (6–14). Várakozás: 0 + 2 + 6 = 8.

? Mennyi az összes várakozási idő (ms) Round Robinnal, q = 4 ms?
= 14
! P1 0–4, P2 4–8, P3 8–10, P2 10–14. Várakozás: P1 = 0, P2 = 14 − 8 = 6, P3 = 10 − 2 = 8 → 14.

? Egy szemafor kezdőértéke 2. Négy szál hívja a `wait()`-et, majd egy szál a `signal()`-t. Hány szál blokkolt ezután?
= 1
! Ketten bejutnak, ketten várnak; a signal az egyiket felébreszti.

? Melyik NEM a holtpont szükséges feltétele?
- kölcsönös kizárás
- foglalva várakozás
- körkörös várakozás
+ preemptív ütemezés
! A negyedik feltétel a „nincs erőszakos elvétel”.

? Melyik ütemezés adja a legkisebb átlagos várakozási időt, ha a löketeket ismerjük és mindenki egyszerre érkezik?
+ SJF
- FCFS
- Round Robin
- prioritásos, véletlen prioritással
! Bizonyítható, hogy az SJF optimális az átlagos várakozásra.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **FCFS és SJF átlagos várakozás.** Minden folyamat a 0. ms-ban érkezik. Írd meg az `atlag_varakozas(loketek, sjf=False)` függvényt: FCFS-nél a megadott sorrendben, SJF-nél a löketek szerint növekvő sorrendben futnak; add vissza az átlagos várakozási időt!

```python starter
def atlag_varakozas(loketek, sjf=False):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
def atlag_varakozas(loketek, sjf=False):
    sorrend = sorted(loketek) if sjf else list(loketek)
    ido, osszes = 0, 0
    for loket in sorrend:
        osszes += ido                 # ennyit várt, mielőtt sorra került
        ido += loket
    return osszes / len(sorrend)
```

</details>

```python test
assert atlag_varakozas([4, 8, 2]) == 16 / 3
assert atlag_varakozas([4, 8, 2], sjf=True) == 8 / 3
assert atlag_varakozas([24, 3, 3]) == 17
assert atlag_varakozas([24, 3, 3], sjf=True) == 3
print("Minden ellenőrzés sikeres!")
```

**2.** **Round Robin befejezési idők.** Írd meg az `rr_befejezes(loketek, q)` függvényt: a folyamatok a 0. ms-ban érkeznek a megadott sorrendben, Round Robin ütemezés q kvantummal (a váltás idejét hanyagold el). Add vissza a befejezési időket a folyamatok eredeti sorrendjében!

```python starter
def rr_befejezes(loketek, q):
    return [0] * len(loketek)
```

<details>
<summary>Megoldás</summary>

```python solution
from collections import deque

def rr_befejezes(loketek, q):
    maradek = list(loketek)
    sor = deque(range(len(loketek)))
    vege = [0] * len(loketek)
    ido = 0
    while sor:
        i = sor.popleft()
        fut = min(q, maradek[i])
        ido += fut
        maradek[i] -= fut
        if maradek[i] > 0:
            sor.append(i)              # vissza a sor végére
        else:
            vege[i] = ido
    return vege
```

</details>

```python test
assert rr_befejezes([4, 8, 2], 4) == [4, 14, 10]
assert rr_befejezes([5, 3], 2) == [8, 7]
assert rr_befejezes([3], 10) == [3]
print("Minden ellenőrzés sikeres!")
```

**3.** **Bankár algoritmus – biztonságos az állapot?** Írd meg a `biztonsagos(szabad, max_igeny, foglal)` függvényt egyetlen erőforrástípusra: `szabad` a szabad példányok száma, a listák folyamatonként a maximális igényt és a jelenleg lefoglaltat adják. Az állapot biztonságos, ha van olyan sorrend, amelyben minden folyamat megkaphatja a hiányzó részt, lefut, és felszabadítja, amit foglal.

```python starter
def biztonsagos(szabad, max_igeny, foglal):
    return True
```

<details>
<summary>Megoldás</summary>

Az első példában: P2-nek 2 hiányzik (3 szabad) → lefut, 5 szabad; P1-nek 5 hiányzik → lefut, 10 szabad; végül P3 is. A másodikban 2 szabad: P2 lefut (4 szabad), de P1-nek és P3-nak is 5-5 hiányzik → elakadunk.

```python solution
def biztonsagos(szabad, max_igeny, foglal):
    kesz = [False] * len(foglal)
    haladt = True
    while haladt:
        haladt = False
        for i in range(len(foglal)):
            if not kesz[i] and max_igeny[i] - foglal[i] <= szabad:
                szabad += foglal[i]          # lefut, és visszaadja, amit foglalt
                kesz[i] = True
                haladt = True
    return all(kesz)
```

</details>

```python test
assert biztonsagos(3, [10, 4, 9], [5, 2, 2]) is True
assert biztonsagos(2, [10, 4, 9], [5, 2, 3]) is False
assert biztonsagos(0, [2, 2], [2, 2]) is True
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik ütemezés okozhat kiéheztetést, ha folyamatosan érkeznek rövid folyamatok?
+ SJF
- FCFS
- Round Robin
! A hosszú folyamat sosem kerül sorra; öregítés (aging) segít.

? Mit jelent a kritikus szakasz?
+ a kódnak az a része, amely közös adatot ér el, és egyszerre csak egy szál futtathatja
- a program leglassabb része
- a kernel indító kódja
! Mutex vagy szemafor védi.

? Egy bináris szemafor (mutex) értéke 1. Egy szál meghívja a wait()-et. Mennyi lesz az értéke?
= 0
! A következő wait() már blokkol.

? Melyik módszer előzi meg a holtpontot a körkörös várakozás kizárásával?
+ minden szál ugyanabban a rögzített sorrendben foglalja a zárakat
- minden szál véletlen sorrendben foglal
- több szálat indítunk
! Ha mindenki először az A, aztán a B zárat kéri, nem alakulhat ki kör.

? Mit jelent a „foglalva várakozás” (hold and wait) holtpontfeltétel?
- a folyamat aktívan, ciklusban várakozik
+ a folyamat már tart erőforrást, és közben újabbra vár
- a folyamat sosem kap erőforrást
! A négy feltétel: kölcsönös kizárás, foglalva várakozás, nincs elvétel, körkörös várakozás.
```

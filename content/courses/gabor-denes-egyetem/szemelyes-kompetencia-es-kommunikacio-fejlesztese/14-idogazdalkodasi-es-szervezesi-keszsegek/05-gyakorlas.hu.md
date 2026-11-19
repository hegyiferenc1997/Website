---
title: Gyakorlás – időgazdálkodás és szervezés
summary: Ellenőrző kérdések és összefoglaló feladatlap a célkitűzésről, a rangsorolásról és az időbeosztási technikákról; egy saját heti terv elkészítése.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Írd át SMART céllá: „Jobb leszek angolból.”</summary>

Például: „Január 31-ig minden hétköznap 20 percet gyakorlok egy nyelvtanuló alkalmazással, és elolvasok 4 angol nyelvű szakcikket a szoftverfejlesztésről.” Konkrét, mérhető, reális, releváns és határidős.

</details>

<details>
<summary>2. Miért a 2. negyed (nem sürgős, de fontos) a legfontosabb az Eisenhower-mátrixban?</summary>

Mert itt vannak a hosszú távú céljaidat szolgáló tevékenységek (rendszeres tanulás, egészség, kapcsolatok, fejlődés). Ha ezek elmaradnak, előbb-utóbb sürgőssé válnak (vizsga előtti éjszakai tanulás), és az 1. negyedben, stresszben kell tűzoltani.

</details>

<details>
<summary>3. Készíts heti tervet időblokkolással!</summary>

Írd be először a fix időpontokat (órák, munka), aztán a 2. negyedbe tartozó fontos feladatokat hosszabb blokkokban (pl. kétszer 2 óra programozás), egy-két rövid blokkot az e-mailekre és üzenetekre, és pihenőt, sportot, alvást. A hét végén nézd meg, mi valósult meg, és igazíts a terven.

</details>

<details>
<summary>4. Mit tanácsolnál egy csoporttársnak, aki egy hete halogatja egy nagy beadandó elkezdését?</summary>

Bontsa le kis lépésekre, és írja le az első 5 perces lépést (pl. „létrehozom a projektmappát és a README-t”); alkalmazza az 5 perces szabályt; tegye el a telefont; dolgozzon Pomodoro-ritmusban; ha elakad, kérdezzen; és szabjon magának korábbi, saját részhatáridőket.

</details>

## Összefoglaló feladatlap

> Hétfő reggel van. A teendőid: (a) szerdai programozás beadandó, (b) péntekre egy matek gyakorlófeladatsor, (c) a csoportchat 40 olvasatlan üzenete, (d) a portfólióprojekted, (e) egy sorozat új évada.

```quiz required
? Melyik negyedbe esik a szerdai beadandó hétfő reggel?
+ 1. sürgős és fontos
- 2. nem sürgős, de fontos
- 3. sürgős, de nem fontos
- 4. se nem sürgős, se nem fontos
! Fontos és közeli határidő.

? Melyik negyedbe esik a portfólióprojekt?
- 1. sürgős és fontos
+ 2. nem sürgős, de fontos
- 3. sürgős, de nem fontos
- 4. se nem sürgős, se nem fontos
! Hosszú távon fontos, de nincs rajta közeli határidő.

? Mit kezdj a 40 olvasatlan chatüzenettel?
- azonnal, egyenként elolvasod mindet, a beadandó előtt
+ egy rövid, kijelölt időblokkban futod át őket, a fontos teendőid után
- soha nem olvasod el
- mindegyikre válaszolsz
! Sekély munka – csoportosítsd.

? A beadandóra 4 pomodorót tervezel. Hány perc lesz ez a szünetekkel együtt, ha a 3 rövid szünet 5 perces, a negyedik pomodoro után pedig nem tartasz szünetet?
= 115
! 4 · 25 + 3 · 5 = 115 perc.

? Melyik technika segít leginkább, ha a beadandó elkezdése nehezen megy?
- megvárni, amíg kedved lesz hozzá
+ az 5 perces szabály és az első kis lépés leírása
- még egy rész a sorozatból
- az összes chatüzenet elolvasása
! Az elkezdés a legnehezebb.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Korrekciós szorzó.** Írd meg a `szorzo(naplo)` függvényt, amely `(becslés, valós idő)` párok listájából kiszámolja a valós/becsült arányok mediánját (2 tizedesre)!

```python starter
def szorzo(naplo):
    return round(sum(v for _, v in naplo) / sum(b for b, _ in naplo), 2)
```

<details>
<summary>Megoldás</summary>

```python solution
from statistics import median

def szorzo(naplo):
    return round(median(v / b for b, v in naplo), 2)   # a medián kevésbé érzékeny a kiugrókra
```

</details>

```python test
assert szorzo([(2, 3), (4, 6), (5, 7.5)]) == 1.5
assert szorzo([(2, 3.5), (3, 4.5), (4, 6), (2, 2.5), (5, 9), (3, 4.5)]) == 1.5
assert szorzo([(1, 1), (1, 10), (1, 2)]) == 2.0
print("Minden ellenőrzés sikeres!")
```

**2.** **Heti kapacitás.** Írd meg a `tervezheto(kotott, tartalek)` függvényt, amely a heti 168 órából levonja a kötött idők (`{tevékenység: óra}`) összegét, és a maradékból `tartalek` arányt félretesz – a tervezhető órák számát adja (1 tizedesre)!

```python starter
def tervezheto(kotott, tartalek):
    return round(168 - sum(kotott.values()) - tartalek, 1)
```

<details>
<summary>Megoldás</summary>

```python solution
def tervezheto(kotott, tartalek):
    szabad = 168 - sum(kotott.values())        # ami a kötött idők után marad
    return round(szabad * (1 - tartalek), 1)
```

</details>

```python test
assert tervezheto({"alvás": 52.5, "órák": 22, "egyéb": 58}, 0.2) == 28.4
assert tervezheto({"minden": 138}, 0.2) == 24.0
assert tervezheto({}, 0) == 168.0
print("Minden ellenőrzés sikeres!")
```

**3.** **Legnagyobb késés.** Írd meg az `edd_keses(feladatok)` függvényt, amely `(név, időigény, határidő)` hármasokat a határidő szerint rendezve egymás után elvégez (0. naptól kezdve), és visszaadja a legnagyobb késést napokban (0, ha semmi sem késik)!

```python starter
def edd_keses(feladatok):
    ido, keses = 0, 0
    for _, hossz, hatarido in feladatok:
        ido += hossz
        keses = max(keses, ido - hatarido)
    return keses
```

<details>
<summary>Megoldás</summary>

```python solution
def edd_keses(feladatok):
    ido, keses = 0, 0
    for _, hossz, hatarido in sorted(feladatok, key=lambda f: f[2]):   # legközelebbi határidő előbb
        ido += hossz
        keses = max(keses, ido - hatarido)
    return keses
```

</details>

```python test
f = [("esszé", 4, 5), ("labor", 1, 7), ("doksi", 3, 4), ("gyakorló", 2, 9)]
assert edd_keses(f) == 2
assert edd_keses([("a", 1, 5), ("b", 1, 5)]) == 0
assert edd_keses([("hosszú", 5, 10), ("rövid", 1, 1)]) == 0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a Parkinson-törvény?
+ a munka kitölti a rendelkezésre álló időt
- a legfontosabb feladatokat kell előbb elvégezni
- minden feladat kétszer annyi ideig tart
- a munka 20%-a hozza az eredmény 80%-át
! Ezért segít a rövidebb, de reális határidő.

? 25 Pomodoro-egységet (25 perc munka + 5 perc szünet) tervezel egy hétre. Hány óra ez összesen a szünetekkel együtt? (tizedes törtként)
= 12,5
= 12.5
! $25 \cdot 30 = 750$ perc $= 12{,}5$ óra.

? Melyik SMART-cél?
- „Jobb leszek programozásból.”
+ „November 30-ig megoldom a gyakorló feladatsor mind a 20 feladatát.”
- „Sokat tanulok.”
- „Valamikor megtanulom a Dockert.”
! Konkrét, mérhető, elérhető, releváns és határidős.

? Az Eisenhower-mátrix melyik negyedébe tartozik egy nem sürgős, de fontos feladat (pl. vizsgára készülés hetekkel előre)?
- azonnal megcsinálni
+ betervezni (időpontot adni neki)
- delegálni
- elhagyni
! Ez a negyed hozza a legtöbb hosszú távú értéket.
```

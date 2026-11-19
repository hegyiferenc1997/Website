---
title: Gyakorlás – memóriakezelés
summary: Ellenőrző kérdések, számolós feladatok címfordításból és lapcseréből, kísérlet a VM-ben.
minutes: 55
kind: practice
---

## Kísérlet: kevés memória a VM-ben

1. Készíts **pillanatképet** az Ubuntu VM-ről.
2. Állítsd le, és a **Beállítások → Rendszer** alatt vedd le a memóriát **2048 MB**-ra.
3. Indítsd el, nyiss meg sok böngészőfület, és figyeld egy terminálban: `vmstat 1`. Látod, ahogy az `si`/`so` oszlopok (lapozás) megnőnek?
4. Állítsd vissza a memóriát (vagy a pillanatképet).

## Ellenőrző kérdések

<details>
<summary>1. Miért nincs külső töredezettség lapozásnál, de belső igen?</summary>

Mert bármely lap bármely szabad keretbe kerülhet, így minden szabad keret felhasználható. A belső töredezettség viszont megmarad: a folyamat utolsó lapja általában nincs tele.

</details>

<details>
<summary>2. Miért kell a laphibát okozó utasítást újra végrehajtani?</summary>

Mert az utasítás nem tudott lefutni: a hivatkozott adat nem volt a memóriában. A lap betöltése után ugyanaz az utasítás most már sikeresen lefut.

</details>

<details>
<summary>3. Miért nem használják a valódi rendszerek a pontos LRU-t?</summary>

Mert minden egyes memória-hozzáférésnél frissíteni kellene, melyik lapot mikor használták – ez túl drága. Ehelyett a hardver csak egy „használt” bitet állít, és az OS ebből közelít (óra algoritmus).

</details>

<details>
<summary>4. Mit tanácsolnál egy diáknak, akinek a laptopja folyamatosan „tekeri a lemezt” és nagyon lassú?</summary>

Valószínűleg vergődés: kevés a RAM a futó programokhoz. Zárjon be programokat (különösen sok böngészőfület), a Feladatkezelőben nézze meg a memóriahasználatot, és ha lehet, bővítse a RAM-ot.

</details>

## Összefoglaló feladatlap

```quiz required
? Lyukak sorban: 100, 500, 200, 300, 600 KB. Melyiket választja a worst fit egy 212 KB-os kérésre? (KB-ban)
= 600
! A legnagyobbat.

? A lapméret 4096 bájt, a 2. lap a 6. keretben van. Mi a 8300-as logikai cím fizikai címe?
= 24684
! p = 2, d = 8300 − 8192 = 108; 6 · 4096 + 108 = 24 684.

? 32 bites címtér, 4 KB-os lapok: hány bites a lapszám?
= 20
! 32 − 12 = 20.

? Egy 10 000 bájtos program 4096 bájtos lapokat kap. Hány lapot foglal?
= 3
! 10 000 / 4096 ≈ 2,44, felfelé kerekítve 3.

? Melyik lapot cseréli az LRU algoritmus?
- a legrégebben betöltöttet
+ a legrégebben használtat
- azt, amelyikre a legkésőbb lesz szükség
- egy véletlenszerűen választottat
! Least Recently Used.

? Mi a Windows lapozófájljának neve?
= pagefile.sys
! Linuxon swap partíció vagy swapfile.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Címfordítás laptáblával.** Írd meg a `fizikai(cim, laptabla, lapmeret=4096)` függvényt: bontsd a virtuális címet lapszámra és eltolásra, keresd meg a lapszámhoz tartozó keretet a `laptabla` szótárban, és add vissza a fizikai címet. Ha a lap nincs a táblában, add vissza a `None`-t (laphiba)!

```python starter
def fizikai(cim, laptabla, lapmeret=4096):
    return cim
```

<details>
<summary>Megoldás</summary>

```python solution
def fizikai(cim, laptabla, lapmeret=4096):
    lap, eltolas = divmod(cim, lapmeret)     # lapszám és lapon belüli eltolás
    if lap not in laptabla:
        return None                          # laphiba
    return laptabla[lap] * lapmeret + eltolas
```

</details>

```python test
tabla = {0: 5, 1: 2, 3: 7}
assert fizikai(100, tabla) == 5 * 4096 + 100
assert fizikai(4096 + 10, tabla) == 2 * 4096 + 10
assert fizikai(2 * 4096, tabla) is None
assert fizikai(3 * 4096 + 4095, tabla) == 7 * 4096 + 4095
print("Minden ellenőrzés sikeres!")
```

**2.** **LRU laphibák.** Írd meg az `lru_hibak(hivatkozasok, keretek)` függvényt, amely megszámolja a laphibákat LRU lapcserével: ha a memória tele van, a **legrégebben használt** lapot kell kidobni.

```python starter
def lru_hibak(hivatkozasok, keretek):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
def lru_hibak(hivatkozasok, keretek):
    memoria = []                     # elöl a legrégebben használt
    hibak = 0
    for lap in hivatkozasok:
        if lap in memoria:
            memoria.remove(lap)      # találat: a végére kerül (legutóbb használt)
        else:
            hibak += 1
            if len(memoria) == keretek:
                memoria.pop(0)       # a legrégebben használt megy
        memoria.append(lap)
    return hibak
```

</details>

```python test
sor = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]
assert lru_hibak(sor, 3) == 9
assert lru_hibak([1, 2, 1, 2], 2) == 2
assert lru_hibak([1, 2, 3, 1, 2, 3], 2) == 6
print("Minden ellenőrzés sikeres!")
```

**3.** **Effektív memória-elérési idő.** A TLB keresése `tlb` ns, egy memóriaolvasás `mem` ns. TLB-találatnál 1 memóriaolvasás kell, TLB-hibánál 2 (laptábla + adat; egyszintű laptáblát feltételezve). Írd meg az `eat(tlb, mem, talalati_arany)` függvényt!

```python starter
def eat(tlb, mem, talalati_arany):
    return mem
```

<details>
<summary>Megoldás</summary>

```python solution
def eat(tlb, mem, talalati_arany):
    talalat = tlb + mem              # TLB + az adat
    hiba = tlb + 2 * mem             # TLB + laptábla + az adat
    return talalati_arany * talalat + (1 - talalati_arany) * hiba
```

</details>

```python test
assert round(eat(20, 100, 0.8), 1) == 140.0
assert round(eat(20, 100, 0.98), 1) == 122.0
assert round(eat(0, 100, 1.0), 1) == 100.0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Egy 32 bites címtérben 4 KB-os lapokat használunk. Hány bit jut az eltolásra (offset)?
= 12
! 4096 = 2¹², a maradék 20 bit a lapszám.

? Mi a vergődés (thrashing)?
+ a rendszer több időt tölt lapozással, mint hasznos munkával, mert kevés a memória a futó folyamatoknak
- a merevlemez fizikai rezgése
- a TLB túl gyakori ürítése
! Megoldás: kevesebb egyidejű folyamat vagy több RAM.

? Mi a különbség a belső és a külső tördelődés között?
+ belső: a kiosztott blokkon belül marad kihasználatlan hely; külső: a szabad hely sok kis darabban van szétszórva
- a belső a RAM-ban, a külső a lemezen keletkezik
- nincs különbség
! A lapozás megszünteti a külső tördelődést, de kis belsőt okoz (a lap végén).

? Mi a Bélády-anomália?
- a laphibák száma csökken, ha kevesebb keretünk van
+ FIFO lapcserénél több keret néha több laphibát okoz
- az LRU mindig a legjobb
! Az LRU-nál és az optimálisnál nem fordul elő.

? Melyik lapcsere-algoritmus a legjobb elméletben, de a gyakorlatban megvalósíthatatlan?
+ az optimális (OPT): azt dobja ki, amelyiket a legkésőbb használják újra
- FIFO
- LRU
- óra (clock)
! A jövőt nem ismerjük – mércének használják.
```

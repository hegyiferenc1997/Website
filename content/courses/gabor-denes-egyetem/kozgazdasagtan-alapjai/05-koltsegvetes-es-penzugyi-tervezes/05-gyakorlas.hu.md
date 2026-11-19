---
title: Gyakorlás – költségvetés és pénzügyek
summary: Ellenőrző kérdések és összefoglaló feladatlap az állami költségvetésről, egy egyetemista havi tervéről, kamatos kamatról és hitelekről.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem feltétlenül baj, ha az állam recesszió idején hiányt termel?</summary>

Mert recesszióban a magánszektor kereslete visszaesik, és a hiány (több kiadás, kevesebb adó) ezt részben pótolja, így tompítja a visszaesést. Az automatikus stabilizátorok ezt maguktól is elvégzik. A baj akkor van, ha a hiány fellendülésben is tartósan magas marad, és az adósság egyre nő.

</details>

<details>
<summary>2. Mi a különbség a költségvetési hiány és az államadósság között?</summary>

A hiány egy év bevételeinek és kiadásainak különbsége (áramlás), az adósság a korábbi hiányok felhalmozott összege egy adott időpontban (állomány). Ha a hiány csökken, de még pozitív, az adósság forintban tovább nő.

</details>

<details>
<summary>3. Miért érdemes már egyetemistaként kis összeggel elkezdeni a megtakarítást?</summary>

A kamatos kamat miatt az idő a legfontosabb tényező: ugyanaz az összeg 40 év alatt sokkal többre nő, mint 20 év alatt. A rendszeres megtakarítás szokása is fontosabb, mint az elején félretett összeg nagysága.

</details>

<details>
<summary>4. Egy áruhitel-ajánlat „0% kamatot” hirdet, de a THM 18%. Hogyan lehetséges ez?</summary>

A THM a kamaton kívül minden díjat tartalmaz (kezelési költség, folyósítási díj, kötelező biztosítás). A reklámozott kamat lehet nulla, a hitel mégis drága. Ezért a THM alapján kell összehasonlítani.

</details>

## Összefoglaló feladatlap

Egy egyetemista havi nettó jövedelme 280 000 Ft. Egy országos költségvetésben a bevétel 38, a kiadás 41 ezer milliárd Ft, a GDP 100 ezer milliárd Ft.

```quiz required
? Az 50/30/20 szabály szerint mennyi jut havonta a vágyott kiadásokra (Ft)?
= 84000
! 30% · 280 000.

? Mennyi a költségvetési hiány a GDP százalékában?
= 3
= 3%
! (41 − 38) / 100.

? Megfelel-e ez a maastrichti hiánykritériumnak?
+ igen, éppen a határon
- nem
! A határ a GDP 3%-a.

? A diák 150 000 Ft-ot 2 évre lekötött évi 4%-os kamatos kamatra. Mennyi lesz a végén (Ft)?
= 162240
! 150 000 · 1,04² = 162 240.

? Mennyi a jelenértéke egy 1 év múlva kapott 315 000 Ft-nak 5%-os kamatláb mellett (Ft)?
= 300000
! 315 000 / 1,05.

? Mennyi az egyszerű multiplikátor, ha MPC = 0,5?
= 2
! 1 / (1 − 0,5).

? Két hitel: A – 12% kamat, THM 16%; B – 14% kamat, THM 15%. Melyik olcsóbb?
- A
+ B
! A THM dönt: 15% < 16%.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Havi törlesztő.** Írd meg a `torleszto(hitel, eves_kamat, ev)` függvényt, amely az annuitásos hitel havi részletét adja vissza egész forintra kerekítve ($A = H \cdot \frac{i}{1 - (1 + i)^{-n}}$, $i$ a havi kamatláb, $n$ a hónapok száma)!

```python starter
def torleszto(hitel, eves_kamat, ev):
    return round(hitel * (1 + eves_kamat / 100) / (ev * 12))
```

<details>
<summary>Megoldás</summary>

```python solution
def torleszto(hitel, eves_kamat, ev):
    i = eves_kamat / 100 / 12              # havi kamatláb
    n = ev * 12                            # részletek száma
    return round(hitel * i / (1 - (1 + i) ** -n))
```

</details>

```python test
assert torleszto(20_000_000, 6.5, 20) == 149115
assert torleszto(20_000_000, 6.5, 10) == 227096
assert torleszto(15_000_000, 3, 20) == 83190
print("Minden ellenőrzés sikeres!")
```

**2.** **Kamatos kamat havi befizetéssel.** Írd meg a `megtakaritas(havi, eves_kamat, ev)` függvényt, amely megadja, mennyi pénzünk lesz, ha minden hónap végén `havi` forintot teszünk félre, és a pénz havonta kamatozik (`eves_kamat / 12` %-kal)! Egész forintra kerekíts.

```python starter
def megtakaritas(havi, eves_kamat, ev):
    return round(havi * 12 * ev)
```

<details>
<summary>Megoldás</summary>

10 év alatt 2,4 millió forintot fizetünk be, a kamat pedig közel 900 ezret tesz hozzá.

```python solution
def megtakaritas(havi, eves_kamat, ev):
    i = eves_kamat / 100 / 12
    egyenleg = 0.0
    for _ in range(ev * 12):
        egyenleg = egyenleg * (1 + i) + havi   # kamatozik, aztán befizetünk
    return round(egyenleg)
```

</details>

```python test
assert megtakaritas(10_000, 0, 1) == 120000
assert megtakaritas(78_572, 4, 3) == 3000002
assert megtakaritas(20_000, 6, 10) == 3277587
print("Minden ellenőrzés sikeres!")
```

**3.** **Fiskális multiplikátor.** Írd meg a `multiplikator(c, t=0, m=0)` függvényt, amely a fogyasztási határhajlandóságból (`c`), az adókulcsból (`t`) és az importhajlandóságból (`m`) kiszámolja a kiadási multiplikátort: $\frac{1}{1 - c(1 - t) + m}$, 2 tizedesre!

```python starter
def multiplikator(c, t=0, m=0):
    return round(1 / (1 - c), 2)
```

<details>
<summary>Megoldás</summary>

Egy kis, nyitott, magas adójú gazdaságban a multiplikátor ezért sokkal kisebb, mint az egyszerű $\frac{1}{1 - c}$ képlet szerint.

```python solution
def multiplikator(c, t=0, m=0):
    return round(1 / (1 - c * (1 - t) + m), 2)   # az adó és az import "szivárgás"
```

</details>

```python test
assert multiplikator(0.8) == 5.0
assert multiplikator(0.75) == 4.0
assert multiplikator(0.8, 0.25, 0) == 2.5
assert multiplikator(0.8, 0.25, 0.3) == 1.43
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Az 50/30/20 szabály szerint a 400 000 Ft-os nettó jövedelemből mennyit érdemes megtakarításra fordítani (Ft)?
= 80000
! A jövedelem 20%-a.

? Egy 1 millió Ft-os betét évi 5%-os kamatos kamattal mennyit ér 2 év múlva (Ft)?
= 1102500
! $1\,000\,000 \cdot 1{,}05^2 = 1\,102\,500$.

? Mi az automatikus stabilizátor példája?
+ recesszióban automatikusan nő a munkanélküli-segélyre fordított összeg
- az állam új autópályát épít
- a parlament adócsökkentést szavaz meg
- a jegybank kamatot csökkent
! Külön döntés nélkül tompítja a ciklust.

? Mennyi a jelenértéke egy 1 év múlva esedékes 110 000 Ft-nak, ha a kamatláb 10% (Ft)?
= 100000
! $\frac{110\,000}{1{,}1} = 100\,000$.

? Az államháztartás bevétele 30 000, kiadása 32 000 milliárd Ft. Mennyi az egyenleg (milliárd Ft)?
= -2000
= −2000
! $30\,000 - 32\,000 = -2000$, azaz hiány.
```

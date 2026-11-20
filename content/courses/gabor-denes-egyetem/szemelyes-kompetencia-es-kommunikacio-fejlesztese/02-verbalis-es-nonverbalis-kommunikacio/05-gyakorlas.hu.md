---
title: Gyakorlás – verbális és nonverbális kommunikáció
summary: Ellenőrző kérdések és összefoglaló feladatlap a paraverbális jelekről, a testbeszéd csatornáiról és a kongruenciáról.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a különbség a verbális és a paraverbális kommunikáció között?</summary>

A verbális a kimondott vagy leírt szavak tartalma, a paraverbális a beszéd hangzása: hangerő, tempó, hangmagasság, hangsúly, szünet. Ugyanaz a mondat a hangzás miatt egészen mást jelenthet.

</details>

<details>
<summary>2. Miért veszélyes egyetlen testbeszéd-jelből következtetni?</summary>

Mert egy jelnek sok oka lehet (a keresztbe tett kar jelenthet elzárkózást, de azt is, hogy fázik az illető, vagy így kényelmes neki). Jelcsoportokat és a helyzetet együtt érdemes nézni, és ha bizonytalan vagy, kérdezz rá.

</details>

<details>
<summary>3. Hogyan tudsz online, kikapcsolt kamerák mellett visszajelzést kapni egy előadásban?</summary>

Kérj aktív jelzést: reakció-emoji, rövid chatüzenet, gyors szavazás, név szerinti kérdés. Rendszeresen állj meg, és kérdezd meg, világos-e.

</details>

<details>
<summary>4. Miért jelent kommunikációt a pontosság?</summary>

A kronemika szerint az idő kezelése is üzenet: a rendszeres késés azt sugallja, hogy a többiek ideje kevésbé fontos. A gyors vagy lassú válaszidő is jelzi, mennyire tartod fontosnak a másikat.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik mondatban a hangsúly fejezi ki, hogy **valaki más** mondta?
+ „**Én** nem mondtam, hogy ő hibázott.”
- „Én **nem** mondtam, hogy ő hibázott.”
- „Én nem mondtam, hogy ő **hibázott**.”
- „Én nem **mondtam**, hogy ő hibázott.”
! A hangsúly az „én”-en van.

? Hány alapzónát írt le Edward T. Hall a térközszabályozásban?
= 4
! Intim, személyes, társasági, nyilvános.

? Egy állásinterjún az interjúztató 2 méterre ül tőled. Melyik zónában vagytok?
- intim
- személyes
+ társasági
- nyilvános
! 1,2–3,6 m.

? Melyik **nem** nonverbális csatorna?
- mimika
- testtartás
+ szókincs
- térközszabályozás
! A szókincs a verbális kommunikáció része.

? Egy kolléga azt mondja: „Persze, szívesen segítek”, miközben sóhajt és a telefonját nézi. Mit mondhatunk erről?
- kongruens üzenet
+ inkongruens üzenet
- tisztán verbális üzenet
- aszinkron üzenet
! A szavak és a testbeszéd ellentmondanak.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Beszédtempó.** Írd meg a `tempo(szavak, masodperc)` függvényt, amely megadja a beszéd tempóját szó/percben, egészre kerekítve!

```python starter
def tempo(szavak, masodperc):
    return round(szavak / masodperc)
```

<details>
<summary>Megoldás</summary>

```python solution
def tempo(szavak, masodperc):
    return round(szavak / (masodperc / 60))   # másodpercből percet csinálunk
```

</details>

```python test
assert tempo(140, 60) == 140
assert tempo(74, 27) == 164
assert tempo(300, 150) == 120
print("Minden ellenőrzés sikeres!")
```

**2.** **Töltelékszavak aránya.** Írd meg a `toltelek_arany(szoveg, toltelekek)` függvényt, amely megadja a töltelékszavak arányát a szövegben (3 tizedesre)! A szavakat kisbetűsítsd, és a végükről vágd le az írásjeleket (`.,!?`) – így a „Szóval,” is töltelékszónak számít, a „hátizsák” viszont nem.

```python starter
def toltelek_arany(szoveg, toltelekek):
    db = sum(szoveg.lower().count(t) for t in toltelekek)
    return round(db / len(szoveg.split()), 3)
```

<details>
<summary>Megoldás</summary>

```python solution
def toltelek_arany(szoveg, toltelekek):
    szavak = [s.strip(".,!?").lower() for s in szoveg.split()]   # egész szavakat hasonlítunk
    db = sum(1 for s in szavak if s in toltelekek)
    return round(db / len(szavak), 3)
```

</details>

```python test
t = {"szóval", "hát", "izé"}
assert toltelek_arany("Szóval, ez a projekt. Hát, izé.", t) == 0.5
assert toltelek_arany("A hátizsák a padon van.", t) == 0.0
assert toltelek_arany("Hát hát hát jó", t) == 0.75
print("Minden ellenőrzés sikeres!")
```

**3.** **Egy testbeszédjel ereje.** Írd meg az `utolagos(alap, jel_ha_igaz, jel_ha_hamis)` függvényt a Bayes-tétellel: annak esélye, hogy valaki valóban nem ért egyet, ha látjuk a jelet (3 tizedesre)!

```python starter
def utolagos(alap, jel_ha_igaz, jel_ha_hamis):
    return round(jel_ha_igaz, 3)
```

<details>
<summary>Megoldás</summary>

```python solution
def utolagos(alap, jel_ha_igaz, jel_ha_hamis):
    igaz = alap * jel_ha_igaz                 # nem ért egyet ÉS mutatja a jelet
    hamis = (1 - alap) * jel_ha_hamis         # egyetért, de mégis mutatja
    return round(igaz / (igaz + hamis), 3)
```

</details>

```python test
assert utolagos(0.2, 0.6, 0.3) == 0.333
assert utolagos(0.5, 0.6, 0.2) == 0.75
assert utolagos(0.1, 0.9, 0.1) == 0.5
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi az alapviselkedés (baseline) a testbeszéd értelmezésében?
- a testbeszéd szótára
+ valakinek a megszokott viselkedése, amihez képest a változást figyeljük
- az első benyomás
- a kulturális átlag
! A változás az árulkodó, nem maga a jel.

? Egy 10 perces sávba 140 szó/perc tempóval hány szó fér?
= 1400
! $10 \cdot 140 = 1400$.

? Mit jelent a kongruencia?
+ a szavak, a hang és a testbeszéd ugyanazt üzenik
- a gyors beszéd
- a sok szakszó
- a hosszú szemkontaktus
! Ha ellentmondanak egymásnak, a hallgató a nonverbális jelnek hisz inkább.

? Mi a töltelékszavak legjobb ellenszere?
- gyorsabb beszéd
+ egy rövid, csendes szünet
- hangosabb beszéd
- több szakszó
! A szünet a töltelékszó helyét veszi át.
```

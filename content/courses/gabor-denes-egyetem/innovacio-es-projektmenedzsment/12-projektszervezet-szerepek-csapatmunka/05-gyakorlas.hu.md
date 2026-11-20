---
title: Gyakorlás – szervezet, szerepek, csapat
summary: Ellenőrző kérdések és összefoglaló feladatlap a tizenkettedik témakörhöz.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Egy fejlesztőt az osztályvezetője sürgős üzemeltetési feladatra visz el a projekt kritikus hetében. Milyen szervezeti formára utal ez, és mit tehet a PM?</summary>

Gyenge vagy kiegyensúlyozott mátrixra, ahol az osztályvezető erősebb. A PM egyeztessen az osztályvezetővel, mutassa meg a hatást (kritikus út, határidő), és ha nem jutnak dűlőre, eszkalálja a szponzorhoz vagy az irányítóbizottsághoz.

</details>

<details>
<summary>2. Miért baj, ha egy RACI-sorban két „A” van?</summary>

Mert nem egyértelmű, ki a végső felelős; döntéskor egymásra mutogathatnak, vagy ellentmondó döntéseket hozhatnak. Minden tevékenységnek pontosan egy elszámoltatható gazdája kell legyen.

</details>

<details>
<summary>3. Egy új csapat első két hetében mindenki udvarias, de senki sem mond ellent a PM-nek. Melyik szakaszban vannak, és mire számíthat a PM?</summary>

Az alakulás szakaszában. Hamarosan jön a viharzás: a viták felszínre kerülnek. A PM tisztázza a célokat, szerepeket és szabályokat, és készüljön fel a konfliktusok konstruktív kezelésére.

</details>

<details>
<summary>4. Két fejlesztő vitázik, melyik keretrendszert használják. A döntés fontos, és van rá egy hét. Melyik konfliktuskezelési stílust javasolnád?</summary>

Az együttműködőt: közösen gyűjtsék össze a szempontokat (teljesítmény, csapattudás, támogatottság), próbálják ki mindkettőt egy kis prototípuson, és az adatok alapján döntsenek.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik szervezeti formában dolgoznak a tagok teljes munkaidőben a projekten, és a PM-nek teljes jogköre van?
- funkcionális
- gyenge mátrix
+ projektorientált
- kiegyensúlyozott mátrix
! A cég projektekre épül.

? Melyik PMO-típus ad **sablonokat és jó gyakorlatokat**, de nem ír elő semmit?
+ támogató
- ellenőrző
- irányító
! Supportive PMO.

? Egy RACI-sorban ez áll: PM = A, fejlesztő = R, tesztelő = C, megrendelő = I. Ki **végzi el** a munkát?
- PM
+ fejlesztő
- tesztelő
- megrendelő
! R = Responsible, végrehajtó.

? Egy csapattag mindig a részletekre figyel, és addig nem nyugszik, amíg minden hiba javítva nincs. Melyik Belbin-szerep?
- ötletgazda
- formáló
+ befejező
- forráskutató
! Completer Finisher.

? Éles rendszerleállásnál a PM azonnal dönt a visszaállításról, vita nélkül. Melyik konfliktuskezelési stílus ez, és mikor helyénvaló?
+ versengő – vészhelyzetben, ha gyors döntés kell
- elkerülő – apró ügyekben
- alkalmazkodó – ha nekünk nem fontos
- kompromisszumkereső – egyenrangú felek között
! Competing.

? Melyik **nem** Daniel Pink belső motivációs eleme?
- autonómia
- szakmai fejlődés (mastery)
- cél (purpose)
+ prémium
! A pénz külső motiváló; Pink szerint kreatív munkánál a belsők számítanak.

? Hány szakaszból áll Tuckman bővített (1977-es) modellje?
= 5
= öt
! Alakulás, viharzás, normaalkotás, működés, feloszlás.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **RACI-ellenőrzés.** Írd meg a `raci_hibak(raci)` függvényt, amely a `{feladat: {személy: szerep}}` szótárból azoknak a feladatoknak a listáját adja vissza (az eredeti sorrendben), ahol nem pontosan egy „A” van, vagy nincs egyetlen „R” sem!

```python starter
def raci_hibak(raci):
    return [f for f, sz in raci.items() if "R" not in sz.values()]
```

<details>
<summary>Megoldás</summary>

```python solution
def raci_hibak(raci):
    hibas = []
    for feladat, szerepek in raci.items():
        ertekek = list(szerepek.values())
        if ertekek.count("A") != 1 or "R" not in ertekek:   # pontosan egy A, legalább egy R
            hibas.append(feladat)
    return hibas
```

</details>

```python test
raci = {
    "követelmények": {"Anna": "A", "Bence": "R", "Csilla": "C"},
    "backend": {"Anna": "A", "Bence": "R", "Dávid": "A"},
    "tesztelés": {"Anna": "I", "Bence": "R"},
    "élesítés": {"Anna": "A", "Bence": "R"},
}
assert raci_hibak(raci) == ["backend", "tesztelés"]
assert raci_hibak({"x": {"a": "A"}}) == ["x"]
print("Minden ellenőrzés sikeres!")
```

**2.** **Szűk keresztmetszet.** Írd meg az `r_terheles(raci)` függvényt, amely személyenként megszámolja az „R” szerepeket (szótár), és a `szuk_keresztmetszet(raci)` függvényt, amely a legtöbb „R”-rel rendelkező személy nevét adja!

```python starter
def r_terheles(raci):
    db = {}
    for szerepek in raci.values():
        for nev in szerepek:
            db[nev] = db.get(nev, 0) + 1
    return db

def szuk_keresztmetszet(raci):
    return max(r_terheles(raci), key=r_terheles(raci).get)
```

<details>
<summary>Megoldás</summary>

```python solution
def r_terheles(raci):
    db = {}
    for szerepek in raci.values():
        for nev, szerep in szerepek.items():
            if szerep == "R":                       # csak a végrehajtói szerep számít
                db[nev] = db.get(nev, 0) + 1
    return db

def szuk_keresztmetszet(raci):
    terheles = r_terheles(raci)
    return max(terheles, key=terheles.get)
```

</details>

```python test
raci = {
    "követelmények": {"Anna": "A", "Bence": "R", "Csilla": "C"},
    "UI-terv": {"Anna": "I", "Csilla": "R", "Dávid": "A"},
    "backend": {"Anna": "A", "Bence": "R"},
    "tesztelés": {"Anna": "C", "Bence": "R"},
}
assert r_terheles(raci) == {"Bence": 3, "Csilla": 1}
assert szuk_keresztmetszet(raci) == "Bence"
print("Minden ellenőrzés sikeres!")
```

**3.** **Ringelmann-hatás.** Írd meg a `ringelmann(n, c)` függvényt, amely megadja, hány ember erejével dolgozik egy `n` fős csoport, ha minden további tag az egyéni teljesítményt `c` aránnyal csökkenti (1 tizedesre, nem lehet negatív), és a `legjobb_meret(c, max_n)` függvényt, amely megadja, hány fős csoport (1 és `max_n` között) teljesít összesen a legtöbbet!

```python starter
def ringelmann(n, c):
    return round(n * (1 - c), 1)

def legjobb_meret(c, max_n):
    return max_n
```

<details>
<summary>Megoldás</summary>

```python solution
def ringelmann(n, c):
    return round(n * max(0.0, 1 - c * (n - 1)), 1)

def legjobb_meret(c, max_n):
    return max(range(1, max_n + 1), key=lambda n: n * max(0.0, 1 - c * (n - 1)))
```

</details>

```python test
assert ringelmann(8, 0.07) == 4.1
assert ringelmann(4, 0.05) == 3.4
assert legjobb_meret(0.07, 20) == 8
assert legjobb_meret(0.04, 30) == 13
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik szervezeti formában a legnagyobb a projektmenedzser jogköre?
- funkcionális
- gyenge mátrix
+ projektorientált
- kiegyensúlyozott mátrix
! A projektorientált szervezetben a projektmenedzser rendelkezik az erőforrásokkal.

? Mi a Tuckman-modell második szakasza?
- formálódás (forming)
+ viharzás (storming)
- normázás (norming)
- teljesítés (performing)
! Forming, storming, norming, performing (és adjourning).

? Hány csatorna van, ha egy 9 fős csapatot három 3 fős alcsapatra bontunk, és a három vezető egymással is kapcsolatot tart?
= 12
! $3 \cdot 3 + 3 = 12$ (egy 3 fős csapatban 3 csatorna van).

? Mit jelent a pszichológiai biztonság egy csapatban?
+ a tagok büntetéstől való félelem nélkül vállalhatják a hibáikat, kérdezhetnek és ellentmondhatnak
- senki sem kritizálhat senkit
- a csapattagok fizetése garantált
- a projekt kockázatmentes
! A Google kutatása szerint ez a sikeres csapatok legfontosabb jellemzője.
```

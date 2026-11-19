---
title: Gyakorlás – kommunikáció és érintettek
summary: Ellenőrző kérdések és összefoglaló feladatlap a tizenharmadik témakörhöz.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem elég a szponzornak minden héten egy 20 oldalas státuszjelentést küldeni?</summary>

Mert a szponzor nagy hatalmú, de kevés idejű érintett: a hosszú jelentést valószínűleg nem olvassa el (push kommunikáció). Rövid, egyoldalas RAG-jelentés kell a döntést igénylő pontokkal, és fontos ügyekben személyes egyeztetés.

</details>

<details>
<summary>2. Helyezd el a hatalom–érdek mátrixban egy új menza-alkalmazás érintettjeit: rektor, hallgatók, menzaüzemeltető cég, egyetemi gondnokság.</summary>

Rektor: nagy hatalom, közepes–kis érdeklődés → elégedetten tartani. Hallgatók: kis hatalom, nagy érdeklődés → tájékoztatni (és bevonni a tesztelésbe). Menzaüzemeltető: nagy hatalom (nélküle nem működik), nagy érdeklődés → szorosan kezelni. Gondnokság: kis hatalom, kis érdeklődés → figyelni.

</details>

<details>
<summary>3. A tanulmányi osztály vezetője ellenzi az új rendszert, mert „a régi is működött”. Mit tennél?</summary>

Meghallgatnám, mitől tart (pl. több munka az átálláskor, hibák az adatokban). Bemutatnám a konkrét előnyöket a csapatának, bevonnám kulcsfelhasználóként a tesztelésbe, képzést és átmeneti támogatást biztosítanék, és egy gyors sikert (pl. automatizált riport) korán megmutatnék.

</details>

<details>
<summary>4. Egy beszállító 20%-kal drágábban kínálja a licencet, mint a piaci ár. Hogyan használnád a BATNA-t?</summary>

Előre felmérném az alternatívákat (másik szállító, nyílt forráskódú megoldás). Ha ezek közül a legjobb olcsóbb a mostani ajánlatnál, az erős tárgyalási pozíció: objektív kritériumként a piaci árat hoznám, és ha nem engednek, a BATNA-t választanám.

</details>

## Összefoglaló feladatlap

```quiz required
? Hány kommunikációs csatorna van egy **12 fős** projektcsapatban?
= 66
! 12 · 11 / 2.

? Egy 4 fős csapathoz 2 új tag érkezik. Hány csatornával **több** lesz?
= 9
! 6 · 5 / 2 = 15; 4 · 3 / 2 = 6; 15 − 6.

? Melyik **push** típusú kommunikáció?
+ heti státuszjelentés e-mailben
- videóhívás
- projektwiki
- személyes megbeszélés
! A küldő eljuttatja, de nem biztos, hogy elolvassák.

? Egy hatóság jogszabály alapján, azonnali határidővel leállíthatja a projektet. Milyen érintett a kiemelkedési modell szerint?
- alvó
- követelőző
+ meghatározó
- diszkrecionális
! Mindhárom jellemző (hatalom, legitimitás, sürgősség) megvan.

? A pénzügyi igazgató nagy hatalmú, de alig érdekli a projekt. Melyik stratégia?
- szorosan kezelni
+ elégedetten tartani
- tájékoztatni
- figyelni
! Keep satisfied: röviden, a lényegről.

? Melyik bevonási stratégia lényege, hogy az érintett maga vezeti a változás egy részét?
- tájékoztatás
- konzultáció
- bevonás
+ felhatalmazás
! Ő lesz a változás „nagykövete”.

? Melyik a jó megbeszélés-zárás?
- „Majd megbeszéljük később.”
+ a döntések és a feladatok (ki, mit, mikorra) rögzítése és kiküldése
- mindenki elmondja, mit csinált hétvégén
- új témák felvetése a megbeszélés végén
! Írásos emlékeztető döntésekkel és feladatokkal.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Hatalom–érdek mátrix.** Írd meg a `strategia(hatalom, erdek, kuszob=5)` függvényt, amely a kuszob fölötti értéket magasnak tekintve visszaadja a stratégiát: `"szorosan együttműködni"`, `"elégedettnek tartani"`, `"folyamatosan tájékoztatni"` vagy `"figyelemmel kísérni"`!

```python starter
def strategia(hatalom, erdek, kuszob=5):
    return "szorosan együttműködni" if hatalom > kuszob else "figyelemmel kísérni"
```

<details>
<summary>Megoldás</summary>

```python solution
def strategia(hatalom, erdek, kuszob=5):
    if hatalom > kuszob:
        return "szorosan együttműködni" if erdek > kuszob else "elégedettnek tartani"
    return "folyamatosan tájékoztatni" if erdek > kuszob else "figyelemmel kísérni"
```

</details>

```python test
assert strategia(8, 8) == "szorosan együttműködni"
assert strategia(9, 4) == "elégedettnek tartani"
assert strategia(4, 9) == "folyamatosan tájékoztatni"
assert strategia(2, 3) == "figyelemmel kísérni"
print("Minden ellenőrzés sikeres!")
```

**2.** **Kiemelkedési modell.** Írd meg a `kiemelkedes(hatalom, legitimitas, surgosseg)` függvényt (logikai paraméterek), amely az érintett típusát adja: `"szunnyadó"`, `"mérlegelendő"`, `"követelőző"`, `"domináns"`, `"veszélyes"`, `"függő"`, `"döntő"` vagy `"nem érintett"`!

```python starter
def kiemelkedes(hatalom, legitimitas, surgosseg):
    return "döntő" if hatalom and legitimitas and surgosseg else "nem érintett"
```

<details>
<summary>Megoldás</summary>

```python solution
def kiemelkedes(hatalom, legitimitas, surgosseg):
    tipusok = {
        (1, 0, 0): "szunnyadó", (0, 1, 0): "mérlegelendő", (0, 0, 1): "követelőző",
        (1, 1, 0): "domináns", (1, 0, 1): "veszélyes", (0, 1, 1): "függő",
        (1, 1, 1): "döntő", (0, 0, 0): "nem érintett",
    }
    return tipusok[(int(hatalom), int(legitimitas), int(surgosseg))]
```

</details>

```python test
assert kiemelkedes(True, True, True) == "döntő"
assert kiemelkedes(True, True, False) == "domináns"
assert kiemelkedes(False, True, True) == "függő"
assert kiemelkedes(False, False, True) == "követelőző"
assert kiemelkedes(True, False, False) == "szunnyadó"
print("Minden ellenőrzés sikeres!")
```

**3.** **Bevonási teendők.** Írd meg a `bevonasi_rangsor(erintettek)` függvényt, amely `(név, hatalom, jelenlegi, kívánt)` négyesek listájából azoknak a nevét adja vissza, akiknél a kívánt szint magasabb a jelenleginél, a (kívánt − jelenlegi) × hatalom prioritás szerint csökkenő sorrendben!

```python starter
def bevonasi_rangsor(erintettek):
    rendezett = sorted(erintettek, key=lambda e: -(e[3] - e[2]))
    return [e[0] for e in rendezett if e[3] > e[2]]
```

<details>
<summary>Megoldás</summary>

A kiinduló kód csak a hiányt nézi, így a kis hatalmú, de nagy hiányú érintett kerülne az élre.

```python solution
def bevonasi_rangsor(erintettek):
    rendezett = sorted(erintettek, key=lambda e: -(e[3] - e[2]) * e[1])   # hiány × hatalom
    return [e[0] for e in rendezett if e[3] > e[2]]
```

</details>

```python test
erintettek = [("oktatók", 5, 2, 4), ("tanulmányi osztály", 7, 3, 5), ("rektor", 9, 3, 4),
              ("hallgatói önkormányzat", 4, 1, 4), ("informatikai igazgatóság", 8, 4, 5),
              ("szoftverszállító", 6, 4, 4)]
assert bevonasi_rangsor(erintettek) == ["tanulmányi osztály", "hallgatói önkormányzat",
                                        "oktatók", "rektor", "informatikai igazgatóság"]
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a pull kommunikáció?
- e-mail küldése minden érintettnek
+ az információ egy közös helyen elérhető, az érintett maga keresi meg (pl. wiki, irányítópult)
- élő megbeszélés
- telefonhívás
! Push: elküldjük; pull: elérhetővé tesszük; interaktív: párbeszéd.

? Mit jelent a BATNA?
+ a tárgyalásos megállapodás legjobb alternatívája – mit tennénk, ha nem jön létre megállapodás
- a tárgyalás kezdő ajánlata
- a tárgyalás határideje
- a tárgyalófelek listája
! Minél jobb a BATNA-d, annál erősebb a tárgyalási pozíciód.

? Egy érintett jelenlegi szintje 1, a kívánt 4, a hatalma 3. Mennyi a prioritása?
= 9
! $(4 - 1) \cdot 3 = 9$.

? Melyik negyedbe tartozik a kis hatalmú, de nagyon érdekelt érintett?
- szorosan együttműködni
- elégedettnek tartani
+ folyamatosan tájékoztatni
- figyelemmel kísérni
! Őket rendszeresen tájékoztatni kell, és gyakran értékes visszajelzést adnak.
```

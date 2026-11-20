---
title: Gyakorlás – tervezés és kritikus út
summary: Ellenőrző kérdések és egy teljes kritikusút-számítás összefoglaló feladatlapként.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért főnevekből áll a WBS, és nem igékből?</summary>

Mert a WBS a szállítandó eredményeket (mit kell elkészíteni) bontja le, nem a munkavégzés lépéseit. A tevékenységek (igék) a munkacsomagok alatt, a tevékenységlistában jelennek meg.

</details>

<details>
<summary>2. Készíts WBS-t egy egyetemi konferencia weboldalához (2 szint elég)!</summary>

1. Konferencia weboldal: 1.1 Projektmenedzsment; 1.2 Tartalom (program, előadók, helyszín); 1.3 Arculat és felület; 1.4 Regisztrációs modul; 1.5 Tesztelés; 1.6 Indítás (domain, tárhely, közzététel).

</details>

<details>
<summary>3. Miért a kritikus út a hálóterv leghosszabb útja?</summary>

Mert a projekt csak akkor ér véget, ha minden út végigért. A leghosszabb út határozza meg a legrövidebb lehetséges átfutási időt, és ezen az úton nincs tartalék.

</details>

<details>
<summary>4. Mi a különbség a feltételezés és a korlát között?</summary>

A korlát kötött, ismert feltétel (pl. fix költségkeret, kötelező határidő). A feltételezés bizonytalan, de a tervezéshez igaznak vett állítás – ha kiderül, hogy hamis, kockázattá válik.

</details>

## Összefoglaló feladatlap

Egy mobilalkalmazás fejlesztésének tevékenységei (időtartam napokban):

| Tev. | Leírás                     | Időtartam | Megelőző |
| ---- | -------------------------- | --------- | -------- |
| A    | követelmények              | 4         | –        |
| B    | felhasználói felület terve | 3         | A        |
| C    | szerveroldal fejlesztése   | 5         | A        |
| D    | felület fejlesztése        | 2         | B        |
| E    | adatbázis és API           | 4         | C        |
| F    | tesztelés és kiadás        | 3         | D, E     |

```text
          ┌───► B (3) ───► D (2) ───┐
 A (4) ───┤                         ├───► F (3)
          └───► C (5) ───► E (4) ───┘
```

```quiz required
? Mennyi az F tevékenység legkorábbi kezdése (ES)?
= 13
= 13 nap
! ES(F) = max(EF(D), EF(E)) = max(9, 13).

? Hány nap a projekt legrövidebb átfutási ideje?
= 16
= 16 nap
! EF(F) = 13 + 3.

? Mennyi a B tevékenység tartalékideje (nap)?
= 4
= 4 nap
! LS(B) = 8, ES(B) = 4.

? Melyik a kritikus út?
- A → B → D → F
+ A → C → E → F
- A → B → C → F
- C → E → F
! 4 + 5 + 4 + 3 = 16 nap, minden tevékenység tartaléka 0.

? Ha a D tevékenység 3 napot csúszik, hány napos lesz a projekt?
= 16
= 16 nap
! D tartaléka 4 nap, így a 3 napos csúszás nem tolja ki a projekt végét.

? Melyik dokumentum vizsgálja a TELOS szempontokat?
- projekt alapító okirat
+ megvalósíthatósági tanulmány
- WBS-szótár
- Gantt-diagram
! Technikai, gazdasági, jogi, működési, ütemezési megvalósíthatóság.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Kritikus út.** Írd meg a `cpm(tev)` függvényt, amely a `{név: (időtartam, [megelőzők])}` szótárból (amely már helyes sorrendben van) a `(projekt hossza, kritikus tevékenységek listája)` párt adja vissza! A kritikus lista a felsorolás sorrendjét kövesse.

```python starter
def cpm(tev):
    return (sum(ido for ido, _ in tev.values()), list(tev))
```

<details>
<summary>Megoldás</summary>

```python solution
def cpm(tev):
    ES, EF = {}, {}
    for nev, (ido, elozok) in tev.items():            # előre számítás
        ES[nev] = max((EF[e] for e in elozok), default=0)
        EF[nev] = ES[nev] + ido
    hossz = max(EF.values())
    LS = {}
    for nev in reversed(list(tev)):                    # visszafelé számítás
        utodok = [u for u, (_, el) in tev.items() if nev in el]
        LS[nev] = min((LS[u] for u in utodok), default=hossz) - tev[nev][0]
    return (hossz, [n for n in tev if LS[n] == ES[n]])  # tartalék nélküliek
```

</details>

```python test
pelda = {"A": (3, []), "B": (2, ["A"]), "C": (4, ["A"]), "D": (3, ["B"]), "E": (2, ["C", "D"])}
assert cpm(pelda) == (10, ["A", "B", "D", "E"])
webshop = {"Köv": (4, []), "UI": (3, ["Köv"]), "DB": (3, ["Köv"]), "Backend": (6, ["DB"]),
           "Frontend": (5, ["UI"]), "Fizetés": (3, ["Backend"]), "Teszt": (4, ["Frontend", "Fizetés"]),
           "Élesítés": (1, ["Teszt"])}
assert cpm(webshop) == (21, ["Köv", "DB", "Backend", "Fizetés", "Teszt", "Élesítés"])
print("Minden ellenőrzés sikeres!")
```

**2.** **Topologikus sorrend.** Írd meg a `topologikus(tev)` függvényt, amely tetszőleges sorrendű `{név: (időtartam, [megelőzők])}` szótárból olyan listát ad, amelyben minden tevékenység a megelőzői után jön! Ha a függőségekben kör van, adjon vissza `None`-t.

```python starter
def topologikus(tev):
    return list(tev)
```

<details>
<summary>Megoldás</summary>

A kör (A vár B-re, B vár A-ra) hibás terv: egyik tevékenység sem kezdhető el, ezért a program jelezze.

```python solution
def topologikus(tev):
    sorrend = []
    while len(sorrend) < len(tev):
        uj = [n for n, (_, el) in tev.items() if n not in sorrend and all(e in sorrend for e in el)]
        if not uj:
            return None                    # nincs elindítható tevékenység: kör van
        sorrend.extend(uj)
    return sorrend
```

</details>

```python test
def helyes(tev, sorrend):
    return sorted(sorrend) == sorted(tev) and all(
        sorrend.index(e) < sorrend.index(n) for n, (_, el) in tev.items() for e in el)

forditott = {"E": (2, ["C", "D"]), "D": (3, ["B"]), "C": (4, ["A"]), "B": (2, ["A"]), "A": (3, [])}
assert helyes(forditott, topologikus(forditott))
assert helyes({"B": (1, ["A"]), "A": (1, [])}, topologikus({"B": (1, ["A"]), "A": (1, [])}))
assert topologikus({"A": (1, ["B"]), "B": (1, ["A"])}) is None
print("Minden ellenőrzés sikeres!")
```

**3.** **WBS összegzés.** Írd meg a `wbs_osszeg(elem)` függvényt, amely egy egymásba ágyazott szótárban (a levelek számok: a munkacsomagok becslései) rekurzívan összeadja a becsléseket!

```python starter
def wbs_osszeg(elem):
    return sum(v for v in elem.values() if isinstance(v, (int, float)))
```

<details>
<summary>Megoldás</summary>

```python solution
def wbs_osszeg(elem):
    if isinstance(elem, (int, float)):
        return elem                        # munkacsomag
    return sum(wbs_osszeg(gyerek) for gyerek in elem.values())   # a gyerekek összege
```

</details>

```python test
wbs = {"Tervezés": {"Követelmények": 400, "UI-terv": 300},
       "Fejlesztés": {"Backend": 1200, "Frontend": 900, "Fizetés": 500},
       "Bevezetés": {"Tesztelés": 600, "Élesítés": 100}}
assert wbs_osszeg(wbs) == 4000
assert wbs_osszeg(wbs["Fejlesztés"]) == 2600
assert wbs_osszeg({"a": {"b": {"c": 5}}, "d": 2}) == 7
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit mond a WBS 100%-os szabálya?
+ a gyerekelemek együtt pontosan a szülő teljes munkáját fedik le
- minden munkacsomag 100 óránál rövidebb
- a projekt 100%-ban kész
- a költségvetés 100%-át el kell költeni
! Se több, se kevesebb munka, mint a szülőelemé.

? Mit jelent az FS függőség?
- a két tevékenység egyszerre kezdődik
+ a rákövetkező csak az előző befejezése után kezdődhet
- a két tevékenység egyszerre fejeződik be
- a rákövetkező befejezése az előző kezdéséhez kötött
! Finish-to-Start: a leggyakoribb függőségtípus.

? Egy tevékenység ES = 4, LS = 7. Mennyi a tartalékideje (nap)?
= 3
! Tartalék = LS − ES = 3.

? Mit tartalmaz a projekt alapító okirat?
- a részletes ütemtervet napra pontosan
+ a projekt célját, a főbb kereteket, a szponzort és a projektmenedzser kijelölését
- a csapattagok fizetését
- a kódot
! Ez a projekt hivatalos „születési anyakönyvi kivonata”.
```

---
title: Gyakorlás – PM-szoftverek és összefoglalás
summary: Ellenőrző kérdések és összefoglaló feladatlap a tizenötödik témakörhöz, a tárgy egészét átfogó számolós feladatokkal.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Egy 4 fős hallgatói csapat féléves beadandóján dolgozik. Milyen eszközt javasolnál, és miért?</summary>

Egy egyszerű Kanban-táblát, például Trellót vagy GitHub Projectst: ingyenes, gyorsan tanulható, és GitHub Projects esetén a feladatok közvetlenül a kódhoz kapcsolódnak. Egy MS Project vagy egy túlkonfigurált Jira ekkora csapatnak felesleges teher.

</details>

<details>
<summary>2. Miért veszélyes a túlkonfigurálás egy PM-eszköz bevezetésénél?</summary>

Mert ha túl sok az állapot és a kötelező mező, a csapat nem frissíti a jegyeket, így az eszköz elavult képet mutat a projektről, és a vezetés rossz adatok alapján dönt. Egyszerűen kell kezdeni, és csak valós igény esetén bővíteni.

</details>

<details>
<summary>3. Az új eszköz bevezetése után a vezetőség továbbra is Excel-riportot kér. Melyik ADKAR-lépés sérül, és mi a teendő?</summary>

A megerősítés (Reinforcement): ha a riport a régi úton készül, a csapatnak nem éri meg az új eszközt naprakészen tartani. A vezetőségnek az eszköz irányítópultjáról kell tájékozódnia, a régi táblázatokat pedig le kell zárni.

</details>

<details>
<summary>4. Az összefoglaló projektben a CPI = 0,8. Mondj két lehetséges projektvezetői döntést!</summary>

Terjedelem csökkentése (egy funkció halasztása a következő verzióra) vagy pótlólagos keret kérése a szponzortól – mindkettőt a változáskezelési folyamaton keresztül. Emellett érdemes megvizsgálni a túlköltés okát (pl. alulbecslés, szakértelemhiány).

</details>

## Összefoglaló feladatlap

```quiz required
? Súlyok: funkciók 0,6, költség 0,4. Az „X” eszköz pontjai: 3 és 5. Mennyi a súlyozott pontszáma?
= 3,8
= 3.8
! 0,6 · 3 + 0,4 · 5 = 1,8 + 2,0.

? Egy eszköz ára felhasználónként havi 10 euró. Mennyi egy 25 fős szervezet éves licencköltsége euróban?
= 3000
! 10 · 25 · 12.

? Melyik eszköz inkább a projekt **dokumentációjának** („memóriájának”) helye?
- Trello
- MS Project
+ Confluence
- Jira
! Tudásbázis: jegyzőkönyvek, döntési napló, okirat.

? Hogyan gépesíthető a Definition of Done egy Jira-szerű eszközben?
- több kötelező mezővel minden jegyen
+ munkafolyamat-szabállyal: „Kész” csak zöld tesztek és jóváhagyott kódellenőrzés után
- a jegyek törlésével sprint végén
- a burndown-diagram elrejtésével
! Átmeneti feltétel a munkafolyamatban.

? Tevékenységek: A 2 nap; B 5 nap (A után); C 3 nap (A után); D 2 nap (B és C után). Hány napos a projekt?
= 9
= 9 nap
! A–B–D: 2 + 5 + 2.

? EV = 30, PV = 40. Mennyi az SPI?
= 0,75
= 0.75
! EV / PV.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Fordulópont.** Két eszköz pontszáma egy szempont `w` súlyától lineárisan függ: $A(w) = a_0 + a_1 w$, $B(w) = b_0 + b_1 w$. Írd meg a `fordulopont(a0, a1, b0, b1)` függvényt, amely megadja, melyik `w`-nél egyenlő a kettő (3 tizedesre); ha a két egyenes párhuzamos, adjon `None`-t!

```python starter
def fordulopont(a0, a1, b0, b1):
    return round((b0 - a0) / (a1 + b1), 3)
```

<details>
<summary>Megoldás</summary>

```python solution
def fordulopont(a0, a1, b0, b1):
    if a1 == b1:
        return None                        # párhuzamos egyenesek: soha nem egyenlők (vagy mindig)
    return round((b0 - a0) / (a1 - b1), 3) # a0 + a1·w = b0 + b1·w
```

</details>

```python test
assert fordulopont(2.9, 2.1, 4.4, -1.4) == 0.429
assert fordulopont(3, 2, 4, -1) == 0.333
assert fordulopont(1, 1, 2, 1) is None
print("Minden ellenőrzés sikeres!")
```

**2.** **Munkafolyamat-ellenőrzés.** Írd meg az `elso_szabalytalan(tortenet, atmenetek)` függvényt, amely egy jegy állapottörténetéből az első szabálytalan átmenetet adja vissza `(honnan, hova)` párként, vagy `None`-t, ha minden átmenet engedélyezett!

```python starter
def elso_szabalytalan(tortenet, atmenetek):
    return None
```

<details>
<summary>Megoldás</summary>

```python solution
def elso_szabalytalan(tortenet, atmenetek):
    for honnan, hova in zip(tortenet, tortenet[1:]):   # egymást követő állapotpárok
        if hova not in atmenetek[honnan]:
            return (honnan, hova)
    return None
```

</details>

```python test
atmenetek = {"Új": {"Folyamatban", "Elutasítva"}, "Folyamatban": {"Ellenőrzés", "Új"},
             "Ellenőrzés": {"Kész", "Folyamatban"}, "Kész": set(), "Elutasítva": set()}
assert elso_szabalytalan(["Új", "Folyamatban", "Ellenőrzés", "Kész"], atmenetek) is None
assert elso_szabalytalan(["Új", "Folyamatban", "Kész"], atmenetek) == ("Folyamatban", "Kész")
assert elso_szabalytalan(["Új", "Elutasítva", "Folyamatban"], atmenetek) == ("Elutasítva", "Folyamatban")
print("Minden ellenőrzés sikeres!")
```

**3.** **Átfutási percentilis.** Írd meg a `percentilis(adatok, p)` függvényt: rendezd az adatokat, és add vissza a `round(p · n)`-edik elemet (1-től számozva; `int(p * n + 0.5)`), valamint az `atlag_es_p85(adatok)` függvényt, amely az `(átlag 1 tizedesre, 85. percentilis)` párt adja!

```python starter
def percentilis(adatok, p):
    return adatok[int(p * len(adatok) + 0.5) - 1]

def atlag_es_p85(adatok):
    return (round(sum(adatok) / len(adatok), 1), percentilis(adatok, 0.85))
```

<details>
<summary>Megoldás</summary>

```python solution
def percentilis(adatok, p):
    rendezett = sorted(adatok)                       # a percentilishez rendezni kell
    return rendezett[int(p * len(rendezett) + 0.5) - 1]

def atlag_es_p85(adatok):
    return (round(sum(adatok) / len(adatok), 1), percentilis(adatok, 0.85))
```

</details>

```python test
idok = [5, 2, 10, 3, 3, 14, 4, 3, 6, 2]
assert atlag_es_p85(idok) == (5.2, 10)
assert percentilis(list(range(20, 0, -1)), 0.85) == 17
assert percentilis([5, 1, 3], 0.5) == 3
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik nézet mutatja a feladatokat időtengelyen, sávokként, a függőségekkel együtt?
+ Gantt-nézet
- Kanban-tábla
- lista nézet
- naptár
! A Gantt a klasszikus ütemezők alapnézete.

? Mi a pilot szerepe egy új PM-eszköz bevezetésében?
- az eszköz azonnali bevezetése az egész szervezetben
+ egy kisebb csapattal való kipróbálás, a tapasztalatok alapján finomítva a bevezetést
- a régi eszköz törlése
- az eszköz árának kialkudása
! Kis kockázattal derül ki, mi működik a gyakorlatban.

? Két eszköz: A = 2 + 3w, B = 3 + w. Melyik w-nél egyenlő a pontszámuk? (tizedes törtként)
= 0,5
= 0.5
! $2 + 3w = 3 + w \Rightarrow w = 0{,}5$.

? 10 jegy átfutási ideje rendezve: 1, 2, 2, 3, 3, 4, 4, 5, 8, 12. Mennyi a 85. percentilis (az egyszerű módszerrel)?
= 8
! A $0{,}85 \cdot 10 = 8{,}5 \to 9$. elem: 8.
```

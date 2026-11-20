---
title: Gyakorlás – csapatmunka és vezetői kommunikáció
summary: Ellenőrző kérdések és összefoglaló feladatlap a csapatszerepekről, a vezetési stílusokról, a visszajelzésről és a delegálásról.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Gondold végig egy korábbi csapatmunkádat: melyik Belbin-szerepeket töltötted be, és melyik hiányzott a csapatból?</summary>

Nincs egyetlen jó válasz. Érdemes megnézni, mi ment jól és mi nem: ha a végén minden csúszott, hiányozhatott a megvalósító vagy a befejező; ha sokat vitatkoztatok, de nem jutottatok döntésre, a koordinátor; ha a megoldás kreativitás nélküli lett, az ötletgazda.

</details>

<details>
<summary>2. Miért nincs egyetlen legjobb vezetési stílus?</summary>

Mert a hatékony stílus függ a helyzettől (válság vagy nyugodt fejlesztés), a feladattól és a munkatárs felkészültségétől és elkötelezettségétől. A helyzeti vezetés szerint ugyanannak az embernek más-más feladatban más stílus kell.

</details>

<details>
<summary>3. Írj SBI-visszajelzést egy csapattársnak, aki rendszeresen az utolsó pillanatban tölti fel a kódját!</summary>

„Az elmúlt két sprintben (S) a kódod a határidő előtti éjszakán került fel a repóba (B). Emiatt nem maradt idő az átnézésre, és a demón két hiba is előjött (I). Mit gondolsz, mi segítene, hogy korábban fel tudd tölteni – esetleg kisebb részletekben?”

</details>

<details>
<summary>4. Miért ne vedd vissza a delegált feladatot az első elakadásnál?</summary>

Mert a munkatárs így nem tanul, és azt üzened, hogy nem bízol benne; legközelebb már próbálkozni sem fog. Inkább kérdésekkel segíts, adj forrást, és hagyd, hogy ő találja meg a megoldást.

</details>

## Összefoglaló feladatlap

> Négyfős egyetemi projektcsapatot vezetsz: Anna tapasztalt Python-fejlesztő, Bence elsőéves és most tanulja a Gitet, Csilla jól ír, de bizonytalan a prezentációban, Dávid sok ötlettel áll elő.

```quiz required
? Melyik Belbin-szerep illik leginkább Dávidhoz?
+ ötletgazda
- befejező
- megvalósító
- helyzetértékelő
! Kreatív, új ötletek.

? Bencének kell beállítania a közös repót. Melyik helyzeti vezetési stílus illik hozzá?
+ irányító (pontos lépések, szoros követés)
- delegáló
- laissez-faire
- egyik sem, majd rájön
! Kezdő szint ebben a feladatban.

? Annának kell megírnia az adatfeldolgozó modult. Melyik stílus illik hozzá?
- irányító
- tanácsadó
- támogató
+ delegáló
! Tapasztalt és magabiztos ebben a feladatban.

? Csilla tudja az anyagot, de bizonytalan a prezentációban. Melyik stílus illik hozzá?
- irányító
- delegáló
+ támogató (bátorítás, közös döntés)
- autokratikus
! Tudja, de bizonytalan → támogatás.

? A projekt végén Dávid ötlete alapján a megrendelő elégedett volt. Melyik a legjobb SBI-elem a **hatás** részhez?
- „Dávid kreatív ember.”
- „A tegnapi bemutatón…”
+ „…és a megrendelő azt mondta, ez volt a legjobb funkció.”
- „…bemutattad az új keresőt…”
! Az Impact a viselkedés következménye.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **A delegálás megtérülése.** Írd meg a `megterules(sajat_ido, betanitas, ellenorzes)` függvényt egy heti ismétlődő feladatra: hány hét után térül meg a delegálás (1 tizedesre)? Ha a heti megtakarítás nem pozitív, adjon `None`-t!

```python starter
def megterules(sajat_ido, betanitas, ellenorzes):
    return round(betanitas / sajat_ido, 1)
```

<details>
<summary>Megoldás</summary>

```python solution
def megterules(sajat_ido, betanitas, ellenorzes):
    megtakaritas = sajat_ido - ellenorzes          # ennyit nyersz hetente
    if megtakaritas <= 0:
        return None
    return round(betanitas / megtakaritas, 1)
```

</details>

```python test
assert megterules(2, 6, 0.5) == 4.0
assert megterules(3, 10, 1) == 5.0
assert megterules(8, 10, 8) is None
print("Minden ellenőrzés sikeres!")
```

**2.** **Hiányzó szerepek.** Írd meg a `hianyzo_szerepek(csapat, szerepek)` függvényt, amely egy `{név: [erős szerepek]}` csapatból és a szerepek listájából ábécérendben visszaadja azokat a szerepeket, amelyekben senki sem erős!

```python starter
def hianyzo_szerepek(csapat, szerepek):
    return []
```

<details>
<summary>Megoldás</summary>

```python solution
def hianyzo_szerepek(csapat, szerepek):
    lefedett = {sz for erossegek in csapat.values() for sz in erossegek}   # amit valaki vállal
    return sorted(set(szerepek) - lefedett)
```

</details>

```python test
sz = ["serkentő", "megvalósító", "befejező", "koordinátor", "ötletgazda"]
cs = {"Ági": ["ötletgazda"], "Dani": ["serkentő", "ötletgazda"], "Emese": ["koordinátor", "megvalósító"]}
assert hianyzo_szerepek(cs, sz) == ["befejező"]
assert hianyzo_szerepek({}, ["a", "b"]) == ["a", "b"]
print("Minden ellenőrzés sikeres!")
```

**3.** **Helyzeti vezetés.** Írd meg a `stilus(felkeszultseg, elkotelezettseg)` függvényt (1–5 skálák): felkészültség ≤ 2 és elkötelezettség ≥ 4 → `"S1"`; felkészültség ≥ 4 és elkötelezettség ≥ 4 → `"S4"`; felkészültség ≥ 4 és elkötelezettség ≤ 3 → `"S3"`; minden más eset → `"S2"`!

```python starter
def stilus(felkeszultseg, elkotelezettseg):
    return "S4" if felkeszultseg >= 4 else "S1"
```

<details>
<summary>Megoldás</summary>

```python solution
def stilus(felkeszultseg, elkotelezettseg):
    if felkeszultseg <= 2 and elkotelezettseg >= 4:
        return "S1"                                 # lelkes kezdő: irányítás
    if felkeszultseg >= 4:
        return "S4" if elkotelezettseg >= 4 else "S3"   # tapasztalt: delegálás vagy támogatás
    return "S2"                                     # tanuló, elbizonytalanodott: tanácsadás
```

</details>

```python test
assert stilus(1, 5) == "S1"
assert stilus(2, 2) == "S2"
assert stilus(4, 2) == "S3"
assert stilus(5, 5) == "S4"
assert stilus(3, 4) == "S2"
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi az SBI-modell három eleme?
+ helyzet, viselkedés, hatás
- szerep, siker, ötlet
- stratégia, büdzsé, ütemterv
- dicséret, kritika, dicséret
! Konkrét helyzet, megfigyelhető viselkedés, és annak hatása.

? Egy heti feladat 4 órádba kerül; a betanítás 9 óra, utána hetente 1 óra ellenőrzés marad nálad. Hány hét után térül meg a delegálás?
= 3
! $9 / (4 - 1) = 3$ hét.

? Melyik Belbin-szerep jellemzője, hogy precíz, hibákat keres és határidőre befejez?
- ötletgazda
+ befejező
- erőforrás-feltáró
- koordinátor
! A befejező (completer finisher) zárja le gondosan a munkát.

? Mire való a négyszemközti (1:1) beszélgetés?
- csak a fizetésemelés megbeszélésére
+ rendszeres, bizalmas beszélgetés a munkatárs fejlődéséről, gondjairól és visszajelzéseiről
- a csapat nyilvános értékelésére
- a projekt státuszának felolvasására
! A munkatárs ideje, nem a vezetőé.
```

---
title: Gyakorlás – robotprogramozás
summary: Ellenőrző kérdések, parancssorozat végrehajtása, akadályelkerülés, P szabályozó és útkeresés.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

**1. Mi a különbség az érzékelő és a beavatkozó között? Mondj mindkettőre két példát!**

<details>
<summary>Válasz</summary>

Az érzékelő (szenzor) adatot gyűjt a környezetről vagy a robotról (pl. ultrahangos távolságmérő, kamera, giroszkóp), a beavatkozó (aktuátor) a vezérlő döntését fizikai hatássá alakítja (pl. motor, szervo, megfogó).

</details>

**2. Mi az érzékel–gondolkodik–cselekszik ciklus?**

<details>
<summary>Válasz</summary>

A robotprogram végtelen ciklusa: beolvassa a szenzorokat (érzékel), a program logikája dönt (gondolkodik), majd utasítást ad a beavatkozóknak (cselekszik), és ezt másodpercenként sokszor megismétli.

</details>

**3. Miért jobb a medián szűrő az átlagnál, ha a szenzor néha teljesen hibás értéket ad?**

<details>
<summary>Válasz</summary>

Mert a medián a középső érték, így egy-egy kiugró mérés nem befolyásolja, az átlagot viszont egyetlen nagy hiba is erősen elhúzza.

</details>

**4. Mi a hátránya a be-ki szabályozásnak, és hogyan javít ezen az arányos szabályozó?**

<details>
<summary>Válasz</summary>

A be-ki szabályozó teljes sebességgel megy, amíg el nem éri a célt, ezért a tehetetlenség miatt túllő, és oda-vissza rángathat. Az arányos szabályozó a hibával arányos sebességet ad, így a cél közelében lelassít és finoman áll be.

</details>

**5. Miért adja a szélességi keresés (BFS) a legrövidebb utat egy rácson?**

<details>
<summary>Válasz</summary>

Mert rétegenként halad: előbb az összes 1 lépésre lévő mezőt vizsgálja meg, aztán a 2 lépésre lévőket, és így tovább. Így amikor először eléri a célt, annál rövidebb út nem létezhet.

</details>

**6. Miért érdemes a robot döntési logikáját különválasztani a hardvert kezelő kódtól?**

<details>
<summary>Válasz</summary>

Mert így a logika szimulációban és egységtesztekkel is kipróbálható drága hardver és veszély nélkül, a hardver cseréjekor pedig csak az érzékelő/beavatkozó réteget kell átírni.

</details>

## Feladatok

### 1. feladat: Parancssorozat végrehajtása

A robot a `(0, 0)` pontból indul **észak** felé néz. Írj `vegrehajt(parancsok)` függvényt, amely egy parancssort (`E` = egy lépés előre, `J` = jobbra fordul, `B` = balra fordul) végrehajt, és visszaadja a végső `(x, y, irany)` hármast. Észak felé az `y` nő, kelet felé az `x`. Az irány az `"É"`, `"K"`, `"D"`, `"Ny"` egyike. Ismeretlen parancsra dobjon `ValueError`-t.

```python starter
def vegrehajt(parancsok):
    # TODO
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
IRANYOK = ["É", "K", "D", "Ny"]
LEPES = {"É": (0, 1), "K": (1, 0), "D": (0, -1), "Ny": (-1, 0)}

def vegrehajt(parancsok):
    """Végrehajtja az E/J/B parancsokat, és visszaadja a végső (x, y, irány) hármast."""
    x, y, irany = 0, 0, "É"
    for parancs in parancsok:
        if parancs == "E":
            dx, dy = LEPES[irany]
            x, y = x + dx, y + dy
        elif parancs == "J":
            irany = IRANYOK[(IRANYOK.index(irany) + 1) % 4]
        elif parancs == "B":
            irany = IRANYOK[(IRANYOK.index(irany) - 1) % 4]
        else:
            raise ValueError(f"Ismeretlen parancs: {parancs}")
    return x, y, irany
```

</details>

```python test
assert vegrehajt("") == (0, 0, "É")
assert vegrehajt("EE") == (0, 2, "É")
assert vegrehajt("EJEE") == (2, 1, "K")
assert vegrehajt("JJJJ") == (0, 0, "É")
assert vegrehajt("BE") == (-1, 0, "Ny")
try:
    vegrehajt("EX")
    assert False, "ValueError-t vártunk"
except ValueError:
    pass
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Akadályelkerülés

Írj `dontes(tavolsag)` függvényt, amely egy távolságmérés (cm) alapján visszaadja a robot teendőjét:

- érvénytelen mérés (≤ 0 vagy > 400): `"állj"` (biztonsági okból),
- 20 cm alatt: `"fordulj"`,
- 20 és 50 cm között (50 nélkül): `"lassíts"`,
- egyébként: `"előre"`.

Írj egy `iranyit(meresek)` függvényt is, amely a mérések listájára a döntések listáját adja vissza.

```python starter
def dontes(tavolsag):
    # TODO
    pass

def iranyit(meresek):
    # TODO
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def dontes(tavolsag):
    """Egyetlen távolságmérés alapján dönt a robot teendőjéről."""
    if tavolsag <= 0 or tavolsag > 400:
        return "állj"       # hibás szenzor: inkább álljunk meg
    if tavolsag < 20:
        return "fordulj"
    if tavolsag < 50:
        return "lassíts"
    return "előre"

def iranyit(meresek):
    """A mérések sorozatára a döntések listája."""
    return [dontes(t) for t in meresek]
```

</details>

```python test
assert dontes(100) == "előre"
assert dontes(50) == "előre"
assert dontes(49.9) == "lassíts"
assert dontes(20) == "lassíts"
assert dontes(19) == "fordulj"
assert dontes(0) == "állj"
assert dontes(999) == "állj"
assert iranyit([120, 35, 10, -1]) == ["előre", "lassíts", "fordulj", "állj"]
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: P szabályozó határokkal

Írj `p_szabalyozo(cel, mert, kp, max_sebesseg)` függvényt, amely a `kp * (mert - cel)` sebességet adja vissza, de a `[-max_sebesseg, max_sebesseg]` tartományba szorítva. Írj egy `szimulal(kezdo, cel, kp, max_sebesseg, lepesek)` függvényt is, amely minden lépésben `mert -= sebesseg` szerint mozgatja a robotot, és visszaadja a végső távolságot két tizedesre kerekítve.

```python starter
def p_szabalyozo(cel, mert, kp, max_sebesseg):
    # TODO
    pass

def szimulal(kezdo, cel, kp, max_sebesseg, lepesek):
    # TODO
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def p_szabalyozo(cel, mert, kp, max_sebesseg):
    """Arányos szabályozó: a hibával arányos sebesség, korlátozva."""
    sebesseg = kp * (mert - cel)
    return max(-max_sebesseg, min(max_sebesseg, sebesseg))

def szimulal(kezdo, cel, kp, max_sebesseg, lepesek):
    """A robot mozgásának szimulációja P szabályozóval."""
    mert = kezdo
    for _ in range(lepesek):
        mert -= p_szabalyozo(cel, mert, kp, max_sebesseg)
    return round(mert, 2)
```

</details>

```python test
assert p_szabalyozo(30, 100, 0.5, 10) == 10        # korlátozva
assert p_szabalyozo(30, 40, 0.5, 10) == 5.0
assert p_szabalyozo(30, 10, 0.5, 10) == -10        # túl közel: tolat
assert p_szabalyozo(30, 30, 0.5, 10) == 0
assert abs(szimulal(100, 30, 0.5, 10, 30) - 30) < 0.01
assert szimulal(30, 30, 0.5, 10, 5) == 30
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Hány lépés a célig?

Írj `lepesszam(palya)` függvényt, amely szélességi kereséssel megadja, legkevesebb hány lépésben jut el a robot az `S` mezőről a `C` mezőre (csak fel, le, jobbra, balra léphet, a `#` fal). Ha nincs út, adjon vissza `-1`-et. Feltételezheted, hogy a pályát körben fal veszi körül.

```python starter
from collections import deque

def lepesszam(palya):
    # TODO
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
from collections import deque

def lepesszam(palya):
    """A legrövidebb út hossza S-ből C-be (BFS), vagy -1, ha nincs út."""
    for s, sor in enumerate(palya):
        if "S" in sor:
            start = (s, sor.index("S"))
    tav = {start: 0}                 # mezőnként a starttól mért lépésszám
    varakozo = deque([start])
    while varakozo:
        s, o = varakozo.popleft()
        if palya[s][o] == "C":
            return tav[(s, o)]
        for ds, do in [(-1, 0), (0, 1), (1, 0), (0, -1)]:
            uj = (s + ds, o + do)
            if palya[uj[0]][uj[1]] != "#" and uj not in tav:
                tav[uj] = tav[(s, o)] + 1
                varakozo.append(uj)
    return -1
```

</details>

```python test
assert lepesszam(["#####", "#S.C#", "#####"]) == 2
assert lepesszam(["#####", "#S#C#", "#####"]) == -1
assert lepesszam([
    "#######",
    "#S..#.#",
    "#.#.#.#",
    "#.#...#",
    "#.###C#",
    "#######",
]) == 7
print("Minden ellenőrzés sikeres!")
```

## Összefoglaló feladat: Robotporszívó: mit tud kitakarítani?

Egy robotporszívó az `R` mezőről indul, és minden olyan szabad (`.`) mezőt kitakarít, ahová fel, le, jobbra vagy balra lépkedve el tud jutni. Írj `takarit(terkep)` függvényt, amely szótárat ad vissza:

- `"tiszta"`: hány `.` mezőt takarított ki,
- `"elerhetetlen"`: hány `.` mező maradt piszkos, mert nem lehet odajutni,
- `"terkep"`: az új térkép (szöveglista), amelyen a kitakarított mezők helyén `o` áll; az `R`, a falak és az elérhetetlen mezők változatlanok.

A bemeneti térképet ne módosítsd! A pályát körben fal veszi körül. Tipp: szélességi vagy mélységi bejárás (elárasztás) egy halmazzal a meglátogatott mezőkhöz.

```python starter required
def takarit(terkep):
    tiszta = sum(sor.count(".") for sor in terkep)
    return {"tiszta": tiszta, "elerhetetlen": 0, "terkep": terkep}


TERKEP = [
    "########",
    "#R..#..#",
    "#.#.#..#",
    "#...####",
    "########",
]
for sor in takarit(TERKEP)["terkep"]:
    print(sor)
```

<details>
<summary>Megoldás</summary>

```python solution
from collections import deque


def takarit(terkep):
    for s, sor in enumerate(terkep):
        if "R" in sor:
            start = (s, sor.index("R"))
    # Elárasztás: minden elérhető mező bejárása
    latott = {start}
    sor_ = deque([start])
    while sor_:
        s, o = sor_.popleft()
        for sz in ((s - 1, o), (s + 1, o), (s, o - 1), (s, o + 1)):
            if sz not in latott and terkep[sz[0]][sz[1]] == ".":
                latott.add(sz)
                sor_.append(sz)
    # Új térkép: a kitakarított mezők helyére o kerül
    uj = []
    for s, sor in enumerate(terkep):
        uj.append("".join("o" if (s, o) in latott and m == "." else m for o, m in enumerate(sor)))
    tiszta = len(latott) - 1          # az R mezőt nem számoljuk
    osszes = sum(sor.count(".") for sor in terkep)
    return {"tiszta": tiszta, "elerhetetlen": osszes - tiszta, "terkep": uj}


TERKEP = [
    "########",
    "#R..#..#",
    "#.#.#..#",
    "#...####",
    "########",
]
for sor in takarit(TERKEP)["terkep"]:
    print(sor)
```

</details>

```python test
TERKEP = ["########", "#R..#..#", "#.#.#..#", "#...####", "########"]
masolat = list(TERKEP)
e = takarit(TERKEP)
assert TERKEP == masolat, "A bemeneti térképet ne módosítsd."
assert e["tiszta"] == 7 and e["elerhetetlen"] == 4, "7 mező érhető el, 4 a fal mögött marad."
assert e["terkep"] == ["########", "#Roo#..#", "#o#o#..#", "#ooo####", "########"], "A kitakarított mezők helyén o álljon, a többi változatlan."
assert takarit(["###", "#R#", "###"]) == {"tiszta": 0, "elerhetetlen": 0, "terkep": ["###", "#R#", "###"]}, "Szabad mező nélkül nincs mit takarítani."
e = takarit(["#####", "#.#R#", "#.#.#", "#####"])
assert e["tiszta"] == 1 and e["elerhetetlen"] == 2 and e["terkep"][2] == "#.#o#", "Csak a szomszédos (nem átlós) mezőkön lehet haladni."
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Programozási feladatok

**1.** **Robot a rácson.** Egy robot a `(0, 0)` pontról indul, északra (`"É"`) néz. Parancsai: `"F"` = egy lépés előre, `"L"` = fordulás balra 90°-ot, `"R"` = fordulás jobbra 90°-ot. Írd meg a `pozicio(parancsok)` függvényt, amely a végén `(x, y, irany)` hármast ad vissza! Az irányok óramutató szerint: `"É"`, `"K"`, `"D"`, `"Ny"`; északra `y` nő, keletre `x` nő.

```python starter
def pozicio(parancsok):
    return (0, parancsok.count("F"), "É")
```

<details>
<summary>Megoldás</summary>

```python solution
IRANYOK = ["É", "K", "D", "Ny"]
LEPES = {"É": (0, 1), "K": (1, 0), "D": (0, -1), "Ny": (-1, 0)}

def pozicio(parancsok):
    x, y, i = 0, 0, 0                       # i: index az IRANYOK listában
    for p in parancsok:
        if p == "L":
            i = (i - 1) % 4
        elif p == "R":
            i = (i + 1) % 4
        elif p == "F":
            dx, dy = LEPES[IRANYOK[i]]
            x, y = x + dx, y + dy
    return (x, y, IRANYOK[i])
```

</details>

```python test
assert pozicio("") == (0, 0, "É")
assert pozicio("FF") == (0, 2, "É")
assert pozicio("RFF") == (2, 0, "K")
assert pozicio("FRFRFRF") == (0, 0, "Ny")
assert pozicio("LLF") == (0, -1, "D")
print("Minden ellenőrzés sikeres!")
```

**2.** **Mozgóátlag szűrő.** A szenzorok zajosak, ezért a méréseket simítjuk. Írd meg a `szuro_atlag(meresek, ablak)` függvényt, amely minden `ablak` hosszú, egymást követő szakasz átlagát adja vissza listában, 2 tizedesre kerekítve! Ha kevesebb mérés van, mint az ablak, üres listát adjon.

```python starter
def szuro_atlag(meresek, ablak):
    return meresek
```

<details>
<summary>Megoldás</summary>

```python solution
def szuro_atlag(meresek, ablak):
    eredmeny = []
    for i in range(len(meresek) - ablak + 1):
        szakasz = meresek[i:i + ablak]      # az aktuális ablak
        eredmeny.append(round(sum(szakasz) / ablak, 2))
    return eredmeny
```

</details>

```python test
assert szuro_atlag([10, 20, 30, 40], 2) == [15.0, 25.0, 35.0]
assert szuro_atlag([1, 2, 3], 3) == [2.0]
assert szuro_atlag([1, 2], 3) == []
assert szuro_atlag([10, 50, 10, 10], 3) == [23.33, 23.33]
print("Minden ellenőrzés sikeres!")
```

**3.** **Akadálykerülés.** Egy robotnak három távolságérzékelője van (bal, közép, jobb, cm-ben). Írd meg az `akadaly_dontes(bal, kozep, jobb, kuszob=30)` függvényt: ha a középső távolság nagyobb a küszöbnél, `"előre"`; különben arra forduljon (`"balra"` / `"jobbra"`), amerre több a hely, ha az nagyobb a küszöbnél (egyenlőségnél balra); ha egyik oldal sem szabad, `"hátra"`.

```python starter
def akadaly_dontes(bal, kozep, jobb, kuszob=30):
    return "előre"
```

<details>
<summary>Megoldás</summary>

```python solution
def akadaly_dontes(bal, kozep, jobb, kuszob=30):
    if kozep > kuszob:
        return "előre"                      # szabad az út
    if bal >= jobb and bal > kuszob:
        return "balra"
    if jobb > kuszob:
        return "jobbra"
    return "hátra"                          # mindenhol akadály
```

</details>

```python test
assert akadaly_dontes(10, 100, 10) == "előre"
assert akadaly_dontes(80, 20, 50) == "balra"
assert akadaly_dontes(40, 20, 90) == "jobbra"
assert akadaly_dontes(60, 20, 60) == "balra"
assert akadaly_dontes(10, 20, 25) == "hátra"
assert akadaly_dontes(10, 30, 10) == "hátra"
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit jelent a robotikában az „érzékel – tervez – cselekszik” ciklus?
+ a robot folyamatosan méri a környezetét, dönt, majd végrehajtja a döntést
- a robot egyszer tervez, utána csak végrehajt
- a robot csak a felhasználó parancsaira mozog
- a robot nem használ érzékelőket
! Ez a ciklus másodpercenként akár százszor is lefut.

? Hány értékből áll a 3 hosszú mozgóátlag eredménye 10 mérésre?
= 8
! 10 − 3 + 1 = 8 ablak fér el.

? Mire jó a mozgóátlag szűrő?
- a mérések felgyorsítására
+ a zajos mérések kisimítására
- a robot sebességének növelésére
- a memória megtakarítására
! Cserébe kissé késlelteti a változásokat.

? Egy PD-szabályozóban mit figyel a D (deriváló) tag?
- a hiba nagyságát
+ a hiba változásának sebességét
- a hibák összegét
- a motor hőmérsékletét
! A D tag fékez, ha a hiba gyorsan csökken, így kisebb a túllendülés.
```

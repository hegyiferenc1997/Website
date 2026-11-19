---
title: Gyakorlás – programozási nyelvek és környezetek
summary: Ellenőrző kérdések és összefoglaló feladatlap a nyelvekről, a fordításról és a fejlesztőeszközökről.
minutes: 43
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért írják az operációs rendszereket C-ben, és miért nem Pythonban?</summary>

Mert a C fordított, alacsony szinthez közeli nyelv: gyors, közvetlenül kezeli a memóriát és a hardvert, és nem kell hozzá értelmező. A Python értelmezett és lassabb, és a futtatásához már egy működő rendszer kell.

</details>

<details>
<summary>2. Mondj egy példát mindhárom hibafajtára!</summary>

Szintaktikai: `if x > 3` kettőspont nélkül Pythonban. Futásidejű: `int("alma")`. Logikai: a kör területét `2 * r * pi`-vel számolod `r * r * pi` helyett.

</details>

<details>
<summary>3. Miért érdemes egy új funkciót külön git-ágon fejleszteni?</summary>

Mert a főág (`main`) közben működőképes marad; az ágat át lehet nézni (pull request), és csak akkor olvasztják be, ha kész és tesztelt.

</details>

```python run
# Egy logikai hiba és a javítása
szamok = [4, 8, 6]
rossz_atlag = sum(szamok) / 2          # hibás: fix 2-vel oszt
jo_atlag = sum(szamok) / len(szamok)   # helyes
print(rossz_atlag, jo_atlag)
```

## Összefoglaló feladatlap

```quiz required
? Mit ír ki a fenti példa második értékként (a helyes átlagot)?
= 6.0
= 6
! (4 + 8 + 6) / 3 = 6.0.

? Melyik nyelv **értelmezett**?
- C
- Rust
+ Python
- Go
! A Python-értelmező futás közben hajtja végre a kódot.

? Melyik paradigma épít osztályokra és öröklésre?
+ objektumorientált
- funkcionális
- deklaratív
- gépi kód
! Pl. Java, C#.

? Melyik git-parancs tölti fel a helyi commitokat a GitHubra?
- git pull
+ git push
- git init
- git log
! A pull letölt, a push feltölt.

? Hogy hívják a git-tárolók egyik legnépszerűbb online szolgáltatását (Microsoft tulajdonában)?
= GitHub
! A GitLab és a Bitbucket a fő vetélytársai.

? Mit csinál a JIT-fordító?
+ futás közben gépi kódra fordítja a bájtkódot
- előre lefordítja a teljes programot exe-fájllá
- kijavítja a logikai hibákat
- formázza a kódot
! Just-in-time: éppen időben.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Tokenekre bontás.** Írd meg a `tokenek(kifejezes)` függvényt, amely egy aritmetikai kifejezést számokra (egész számokra, szövegként) és a `+ - * / ( )` jelekre bont, a szóközöket kihagyva!

```python starter
def tokenek(kifejezes):
    return kifejezes.split()
```

<details>
<summary>Megoldás</summary>

```python solution
def tokenek(kifejezes):
    eredmeny, szam = [], ""
    for c in kifejezes:
        if c.isdigit():
            szam += c                         # a szám jegyeit összegyűjtjük
        else:
            if szam:
                eredmeny.append(szam)
                szam = ""
            if c in "+-*/()":
                eredmeny.append(c)
    if szam:
        eredmeny.append(szam)
    return eredmeny
```

</details>

```python test
assert tokenek("2 + 3*4") == ["2", "+", "3", "*", "4"]
assert tokenek("(12+3)/5") == ["(", "12", "+", "3", ")", "/", "5"]
assert tokenek("42") == ["42"]
print("Minden ellenőrzés sikeres!")
```

**2.** **Fordítás megtérülése.** Írd meg a `megeri_forditani(fordit, futas, szorzo)` függvényt, amely megadja a legkisebb `n` futásszámot, amelynél a lefordított változat összes ideje (`fordit + n · futas`) kisebb, mint az értelmezetté (`n · szorzo · futas`)! Ha a szorzó legfeljebb 1, adjon `None`-t.

```python starter
def megeri_forditani(fordit, futas, szorzo):
    return round(fordit / futas)
```

<details>
<summary>Megoldás</summary>

```python solution
def megeri_forditani(fordit, futas, szorzo):
    if szorzo <= 1:
        return None                           # az értelmezett sosem lassabb
    n = 1
    while fordit + n * futas >= n * szorzo * futas:
        n += 1
    return n
```

</details>

```python test
assert megeri_forditani(30, 1, 4) == 11
assert megeri_forditani(20, 0.5, 10) == 5
assert megeri_forditani(10, 1, 1) is None
print("Minden ellenőrzés sikeres!")
```

**3.** **Hash-lánc ellenőrzése.** Egy „commitlista” `(előző azonosító, üzenet, saját azonosító)` hármasokból áll, ahol a saját azonosító `sha1(f"{előző}|{üzenet}")` első 7 karaktere. Írd meg az `elso_hibas(lanc)` függvényt, amely az első olyan elem indexét adja vissza, amelynek azonosítója nem stimmel, vagy amelynek „előző” mezője nem egyezik az előtte lévő saját azonosítójával (`None`, ha minden rendben)!

```python starter
def elso_hibas(lanc):
    return None
```

<details>
<summary>Megoldás</summary>

```python solution
import hashlib

def elso_hibas(lanc):
    for i, (elozo, uzenet, sajat) in enumerate(lanc):
        vart = hashlib.sha1(f"{elozo}|{uzenet}".encode()).hexdigest()[:7]
        if sajat != vart:
            return i                          # a tartalmat módosították
        if i > 0 and elozo != lanc[i - 1][2]:
            return i                          # elszakadt a lánc
    return None
```

</details>

```python test
import hashlib
def cid(e, u):
    return hashlib.sha1(f"{e}|{u}".encode()).hexdigest()[:7]
a = cid("gyoker", "indítás"); b = cid(a, "belépés"); c = cid(b, "README")
jo = [("gyoker", "indítás", a), (a, "belépés", b), (b, "README", c)]
assert elso_hibas(jo) is None
assert elso_hibas([("gyoker", "indítás", a), (a, "belépés (módosítva)", b), (b, "README", c)]) == 1
assert elso_hibas([("gyoker", "indítás", a), ("xxx", "belépés", cid("xxx", "belépés"))]) == 1
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik programozási nyelv jellemzően fordított (gépi kódra)?
- Python
- JavaScript
+ C
- Bash
! A C fordítóval gépi kódra fordul.

? Mennyi a `(2 + 3) * 4 - 10 / 5` kifejezés értéke?
= 18
! $20 - 2 = 18$.

? Mi a különbség a `git commit` és a `git push` között?
+ a commit a saját gépeden rögzít egy változatot, a push feltölti a commitokat a távoli tárolóba
- nincs különbség
- a push helyben ment, a commit feltölt
- a commit törli a változtatásokat
! Push nélkül a többiek nem látják a commitjaidat.

? Melyik hibát jelzi már a program elindítása előtt az értelmező?
+ szintaktikai hibát (pl. hiányzó zárójel)
- nullával való osztást
- rossz eredményt adó képletet
- elfogyó memóriát
! A szintaktikai hiba az elemzésnél derül ki.
```

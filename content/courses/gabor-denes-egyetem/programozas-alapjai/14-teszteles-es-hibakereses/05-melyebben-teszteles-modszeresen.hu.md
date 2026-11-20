---
title: Mélyebben – tesztelés módszeresen
summary: Hogyan válassz teszteseteket ekvivalencia-osztályokkal és határértékekkel, egységtesztek a unittest keretrendszerrel, véletlen bemenetekkel végzett tulajdonságalapú tesztelés (ábrával arról, hány teszt kell egy ritka hibához), és a hibás verzió megkeresése felezéssel – futtatható programokkal és programozós kötelező feladattal.
minutes: 55
---

## Amit ebben a leckében megtanulsz

- hogyan válassz **kevés, de jó** tesztesetet (ekvivalencia-osztályok, határértékek),
- hogyan írj egységteszteket a beépített **unittest** keretrendszerrel,
- hogyan találnak meg a **véletlen** bemenetek olyan hibát, amelyre nem gondoltál,
- hogyan keresd meg **felezéssel**, melyik változtatás rontotta el a programot.

## 1. Melyik bemenetet teszteld?

Az alapleckében láttuk, miért kell tesztelni. De minden bemenetet nem lehet kipróbálni – egy életkort váró függvénynél is végtelen sok szám van. A megoldás: a bemeneteket **ekvivalencia-osztályokra** bontjuk (amelyekre a függvény ugyanúgy viselkedik), mindegyikből veszünk egy képviselőt, és külön figyelünk a **határokra**, mert ott a leggyakoribb a hiba (`<` helyett `<=`):

```python run
# Ekvivalencia-osztályok és határértékek egy jegyár-függvényen
def jegyar(eletkor):
    if eletkor < 0:
        raise ValueError("negatív életkor")
    if eletkor < 6:
        return 0          # gyerek: ingyenes
    if eletkor < 18:
        return 500        # diák
    if eletkor < 65:
        return 1000       # felnőtt
    return 500            # nyugdíjas

# osztályonként egy képviselő + minden határ mindkét oldala
tesztek = [(3, 0), (12, 500), (40, 1000), (80, 500),            # képviselők
           (0, 0), (5, 0), (6, 500), (17, 500), (18, 1000),     # határok
           (64, 1000), (65, 500)]
hibak = [(kor, vart, jegyar(kor)) for kor, vart in tesztek if jegyar(kor) != vart]
print(f"{len(tesztek)} teszteset, {len(hibak)} hiba", hibak)
try:
    jegyar(-1)
except ValueError:
    print("negatív életkorra ValueError: rendben")
```

11 teszteset lefedi az összes osztályt és minden határt – több tesztnek alig lenne haszna, kevesebbnek nagy a kockázata. A határok azért fontosak, mert ha valaki `eletkor < 18` helyett `eletkor <= 18`-at ír, azt csak a 18 éves tesztelő veszi észre; a 12 és a 40 éves nem.

## 2. Egységtesztek a unittest keretrendszerrel

Egy keretrendszer egységes formát, automatikus futtatást és áttekinthető jelentést ad. A Pythonba beépített `unittest`-ben a tesztek egy osztály `test_` kezdetű metódusai:

```python run
# Egységtesztek unittesttel (a kimenetet a standard kimenetre irányítjuk)
import sys
import unittest

class Kosar:
    def __init__(self):
        self.tetelek = {}

    def hozzaad(self, termek, ar, db=1):
        if ar < 0 or db <= 0:
            raise ValueError("érvénytelen ár vagy darabszám")
        self.tetelek[termek] = (ar, self.tetelek.get(termek, (ar, 0))[1] + db)

    def vegosszeg(self):
        return sum(ar * db for ar, db in self.tetelek.values())

class KosarTeszt(unittest.TestCase):
    def setUp(self):                          # minden teszt előtt friss kosár
        self.k = Kosar()

    def test_ures_kosar(self):
        self.assertEqual(self.k.vegosszeg(), 0)

    def test_osszeadas(self):
        self.k.hozzaad("toll", 250, 2)
        self.k.hozzaad("füzet", 690)
        self.assertEqual(self.k.vegosszeg(), 1190)

    def test_ugyanaz_ketszer(self):
        self.k.hozzaad("toll", 250)
        self.k.hozzaad("toll", 250)
        self.assertEqual(self.k.tetelek["toll"], (250, 2))

    def test_negativ_ar(self):
        with self.assertRaises(ValueError):
            self.k.hozzaad("hiba", -100)

csomag = unittest.TestLoader().loadTestsFromTestCase(KosarTeszt)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(csomag)
```

A `setUp` minden teszt előtt lefut, így a tesztek **függetlenek** egymástól – egy elrontott teszt nem rontja el a következőt. Az `assertRaises` azt ellenőrzi, hogy hibás bemenetre tényleg kivétel jön. Valódi projektekben sokan a tömörebb **pytest**-et használják (ott egy sima `assert` is elég), de a gondolkodás ugyanaz.

## 3. Véletlen bemenetek: tulajdonságalapú tesztelés

A kézzel írt tesztesetek csak azokat a hibákat találják meg, amelyekre **gondoltunk**. A tulajdonságalapú tesztelés másképp kérdez: mi az, aminek **minden** bemenetre igaznak kell lennie? Egy rendezésnél például: az eredmény rendezett, és ugyanazok az elemek vannak benne. Ezt aztán sok véletlen bemeneten ellenőrizzük:

```python run
# Tulajdonságalapú tesztelés véletlen bemenetekkel: egy rejtett hiba felderítése
import random
from collections import Counter

def rendez_hibas(lista):
    return sorted(set(lista))          # HIBA: a set kiszűri az ismétlődéseket

def tulajdonsagok_rendben(rendezo, lista):
    eredmeny = rendezo(lista)
    rendezett = all(a <= b for a, b in zip(eredmeny, eredmeny[1:]))
    ugyanazok = Counter(eredmeny) == Counter(lista)
    return rendezett and ugyanazok

print("kézi tesztek:", tulajdonsagok_rendben(rendez_hibas, [3, 1, 2]), tulajdonsagok_rendben(rendez_hibas, [5, 4]))

random.seed(7)
for proba in range(1, 1001):
    lista = [random.randint(0, 20) for _ in range(random.randint(0, 6))]
    if not tulajdonsagok_rendben(rendez_hibas, lista):
        print(f"a {proba}. véletlen teszt hibát talált: {lista} → {rendez_hibas(lista)}")
        break
```

A két kézi teszt átment (mert nem volt bennük ismétlődő elem), a véletlen tesztelés pedig pár próbálkozásból megtalálta a hibát. Hány véletlen teszt kell? Ha egy hiba a bemenetek $p$ részénél jön elő, $k$ teszt után $1 - (1 - p)^k$ eséllyel bukkanunk rá:

```plot
title: Annak esélye (%), hogy k véletlen teszt megtalálja a hibát
x: 0, 300
y: 0, 100
param: p = 0.01, 0.001, 0.1, 0.001
f: 100*(1 - (1 - p)^x) # a hiba a bemenetek p részénél jön elő
dash: 95
```

1%-os gyakoriságú hibához kb. 300 teszt kell a 95%-os biztonsághoz – ezt kézzel senki nem írná meg, géppel egy pillanat. A Pythonban erre a **hypothesis** könyvtár a bevett eszköz, amely ráadásul a hibás bemenetet a lehető legkisebbre is egyszerűsíti.

## 4. Melyik változtatás rontotta el? Felezés

„Múlt héten még működött.” Ha 100 változtatás (commit) történt azóta, nem kell mind a 100-at végignézni: a **felezéssel** (mint a bináris keresésnél) kb. 7 lépésből megvan az első hibás. A `git bisect` parancs pontosan ezt csinálja:

```python run
# A hibát behozó változtatás megkeresése felezéssel (mint a git bisect)
from math import ceil, log2

verziok = 100
elso_hibas = 63                              # ezt nem tudjuk – ezt keressük

def teszt_atmegy(verzio):
    return verzio < elso_hibas               # a valóságban: lefuttatjuk a teszteket ezen a verzión

jo, rossz, lepes = 0, verziok - 1, 0         # tudjuk: a 0. még jó, a legutóbbi már rossz
while rossz - jo > 1:
    kozep = (jo + rossz) // 2
    lepes += 1
    if teszt_atmegy(kozep):
        jo = kozep
    else:
        rossz = kozep
    print(f"{lepes}. lépés: a(z) {kozep}. verzió {'jó' if teszt_atmegy(kozep) else 'ROSSZ'}")
print(f"az első hibás verzió: {rossz} ({lepes} lépésben; legfeljebb {ceil(log2(verziok))} kellett volna)")
```

A felezés feltétele, hogy legyen egy **automatikus teszt**, amely eldönti, jó-e egy verzió – ez is egy érv amellett, hogy a hibát először egy tesztben rögzítsük, és csak utána javítsuk ki.

| Nézőpont        | Mit jelent neki a tesztelés?                                                     |
| --------------- | -------------------------------------------------------------------------------- |
| **fejlesztő**   | bátran átírhatja a kódot: ha valamit elront, a tesztek azonnal szólnak           |
| **tesztelő**    | módszeres esetválasztás: osztályok, határok, hibás bemenetek, véletlen bemenetek |
| **felhasználó** | kevesebb hiba élesben – a hibát a fejlesztő találja meg, nem ő                   |
| **cégvezetés**  | a teszt költség, de egy élesben talált hiba sokszorosába kerül                   |

## Összefoglalás

- Ekvivalencia-osztályonként egy képviselő és minden határ mindkét oldala: kevés, de hatékony teszteset.
- A unittestben a tesztek `test_` metódusok; a `setUp` függetlenné teszi őket, az `assertRaises` a kivételt ellenőrzi.
- A tulajdonságalapú tesztelés véletlen bemeneteken ellenőriz általános szabályokat; a ritka hibához sok teszt kell.
- A hibát behozó változtatást felezéssel, kb. log₂ n lépésben lehet megtalálni.

## A lecke feladata: jegyár határértékekkel

Írd meg a `jegyar(eletkor)` függvényt, amely a lecke első példája szerinti árakat adja: 6 év alatt 0, 6–17 évesen 500, 18–64 évesen 1000, 65 évtől 500 Ft! Negatív életkorra dobjon `ValueError`-t. A kiinduló kódban **határhibák** vannak – a tesztek pont ezeket keresik.

```python starter required
def jegyar(eletkor):
    if eletkor <= 6:
        return 0
    if eletkor <= 18:
        return 500
    if eletkor <= 65:
        return 1000
    return 500


print(jegyar(18))
```

<details>
<summary>Megoldás</summary>

```python solution
def jegyar(eletkor):
    if eletkor < 0:
        raise ValueError("negatív életkor")
    if eletkor < 6:
        return 0
    if eletkor < 18:
        return 500
    if eletkor < 65:
        return 1000
    return 500


print(jegyar(18))
```

</details>

```python test
for kor, vart in [(0, 0), (5, 0), (6, 500), (17, 500), (18, 1000), (64, 1000), (65, 500), (90, 500)]:
    assert jegyar(kor) == vart, f"{kor} évesen {vart} Ft a jegy"
try:
    jegyar(-1)
    assert False, "negatív életkorra ValueError kell"
except ValueError:
    pass
```

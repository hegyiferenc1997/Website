---
title: Gyakorlás – innováció és kreativitás
summary: Ellenőrző kérdések és összefoglaló feladatlap az első témakörhöz.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

Előbb próbálj meg fejben válaszolni, csak utána nyisd le a választ!

<details>
<summary>1. Miért nem innováció egy szabadalmaztatott, de soha be nem vezetett találmány?</summary>

Mert az innováció lényege a gyakorlati bevezetés és az értékteremtés. A szabadalom csak az ötlet jogi védelme; amíg senki nem használja, nem hoz hasznot.

</details>

<details>
<summary>2. Mit jelent Schumpeter „teremtő rombolás” fogalma? Mondj egy informatikai példát!</summary>

Az új megoldás kiszorítja a régit, és ezzel átalakítja a piacot. Példa: a felhőalapú irodai programok és a webes e-mail visszaszorították a dobozos, telepítős szoftvereket.

</details>

<details>
<summary>3. Miben különbözik a radikális és a diszruptív innováció?</summary>

A radikális a technológiai újdonság mértékéről szól (alapvetően új megoldás). A diszruptív a piaci hatásról: egyszerűbb, olcsóbb termékkel alulról támadja meg a piacvezetőt. Egy diszruptív innováció technológiailag akár egyszerű is lehet.

</details>

<details>
<summary>4. Miért kell szétválasztani a divergens és a konvergens szakaszt?</summary>

Mert az azonnali kritika elfojtja az ötleteket. Előbb sok ötletet gyűjtünk ítélkezés nélkül, csak utána értékelünk és választunk.

</details>

<details>
<summary>5. Egy egyetemi csapat egy menza-alkalmazást tervez. Hogyan segítene a design thinking?</summary>

Először interjúkkal megértenék a diákok gondjait (empátia), megfogalmaznák a fő problémát (pl. „sokat kell sorban állni”), ötletelnének, gyors papír- vagy kattintható prototípust készítenének, és valódi diákokkal tesztelnék, majd az eredmények alapján ismételnének.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy bank mobilalkalmazásában megjelenik az azonnali, telefonszámra küldhető átutalás. Milyen típusú innováció ez?
+ termékinnováció (szolgáltatásinnováció)
- folyamatinnováció
- szervezeti innováció
- marketinginnováció
! Az ügyfél által használt szolgáltatás maga lett új.

? Egy cég áttér a havi előfizetéses árazásra egyszeri licencvásárlás helyett. Milyen típusú innováció ez a négyes felosztásban?
- termékinnováció
- folyamatinnováció
+ marketinginnováció
- szervezeti innováció
! Az ár és az értékesítés módja változott, a termék nem.

? Melyik a **diszruptív** innováció klasszikus példája?
- a következő processzorgeneráció 10%-kal gyorsabb
+ a digitális fényképezés, amely kiszorította a filmes gyártókat
- egy autógyár új színt vezet be
- egy étterem új menüt állít össze
! Kezdetben gyengébb képminőség, később felzárkózott, és kiszorította a piacvezetőt.

? Ki vezette be a **nyílt innováció** fogalmát (2003)? (vezetéknév)
= Chesbrough
= Henry Chesbrough
! Henry Chesbrough, a Berkeley egyetem kutatója.

? Egy megbeszélésen a csoport csak az **előnyöket** gyűjti. Melyik kalapot viselik?
- zöld
- fehér
+ sárga
- kék
! Sárga = optimizmus, előnyök.

? Melyik technika épít egy **meglévő** termék célzott kérdésekkel történő átalakítására?
- gondolattérkép
+ SCAMPER
- 6-3-5 módszer
- laterális gondolkodás
! A SCAMPER hét kérdése (helyettesít, kombinál, adaptál, módosít, más célra, elhagy, megfordít) egy meglévő megoldásból indul ki.

? Hány lépésből áll a design thinking folyamata (a Stanford-modell szerint)?
= 5
= öt
! Empátia, definiálás, ötletelés, prototípus, teszt.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Morfológiai doboz.** Írd meg a `kombinaciok(doboz)` függvényt, amely egy `{jellemző: [lehetőségek]}` szótárból megadja, hány különböző ötlet (kombináció) képezhető!

```python starter
def kombinaciok(doboz):
    return sum(len(lehetosegek) for lehetosegek in doboz.values())
```

<details>
<summary>Megoldás</summary>

A lehetőségeket nem összeadni, hanem összeszorozni kell: minden választás minden másikkal párosítható.

```python solution
def kombinaciok(doboz):
    db = 1
    for lehetosegek in doboz.values():
        db *= len(lehetosegek)             # minden jellemzőnél szorzódik a választások száma
    return db
```

</details>

```python test
assert kombinaciok({"a": [1, 2, 3], "b": [1, 2]}) == 6
assert kombinaciok({"p": [1, 2, 3], "f": [1, 2, 3, 4], "b": [1, 2, 3], "c": [1, 2, 3]}) == 108
assert kombinaciok({"x": ["egyetlen"]}) == 1
print("Minden ellenőrzés sikeres!")
```

**2.** **Hány ötlet kell?** Írd meg a `legalabb_egy(p, n)` függvényt, amely megadja, mekkora eséllyel van legalább egy jó ötlet `n` független ötlet között, ha egy ötlet `p` eséllyel jó (3 tizedesre), és a `hany_otlet(p, cel)` függvényt, amely megadja a legkisebb `n`-t, amelynél ez az esély eléri a `cel` értéket!

```python starter
def legalabb_egy(p, n):
    return round(p * n, 3)

def hany_otlet(p, cel):
    return round(cel / p)
```

<details>
<summary>Megoldás</summary>

A `p · n` csak nagyon kicsi `p · n` esetén jó közelítés – nagy `n`-nél akár 1-nél nagyobb „valószínűséget” is adna.

```python solution
def legalabb_egy(p, n):
    return round(1 - (1 - p) ** n, 3)      # 1 − annak esélye, hogy mind rossz

def hany_otlet(p, cel):
    n = 1
    while 1 - (1 - p) ** n < cel:
        n += 1
    return n
```

</details>

```python test
assert legalabb_egy(0.1, 2) == 0.19
assert legalabb_egy(0.05, 20) == 0.642
assert hany_otlet(0.05, 0.9) == 45
assert hany_otlet(0.5, 0.9) == 4
print("Minden ellenőrzés sikeres!")
```

**3.** **Súlyozott pontozás.** Írd meg a `gyoztes(otletek, sulyok)` függvényt, amely az `{ötlet: {szempont: pont}}` szótárból a súlyozott pontszám szerint legjobb ötlet nevét adja vissza!

```python starter
def gyoztes(otletek, sulyok):
    return max(otletek, key=lambda nev: sum(otletek[nev].values()))
```

<details>
<summary>Megoldás</summary>

```python solution
def gyoztes(otletek, sulyok):
    def pont(nev):
        return sum(sulyok[sz] * p for sz, p in otletek[nev].items())   # súlyozott összeg
    return max(otletek, key=pont)
```

</details>

```python test
otletek = {
    "AI": {"érték": 5, "megvalósíthatóság": 2, "újdonság": 5},
    "csoportos": {"érték": 4, "megvalósíthatóság": 4, "újdonság": 3},
    "kártyás": {"érték": 3, "megvalósíthatóság": 5, "újdonság": 2},
}
assert gyoztes(otletek, {"érték": 0.4, "megvalósíthatóság": 0.3, "újdonság": 0.3}) == "AI"
assert gyoztes(otletek, {"érték": 0.3, "megvalósíthatóság": 0.6, "újdonság": 0.1}) == "kártyás"
assert gyoztes(otletek, {"érték": 0.5, "megvalósíthatóság": 0.4, "újdonság": 0.1}) == "csoportos"
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Egy morfológiai dobozban 4 jellemző van, mindegyikhez 3 lehetőség. Hány kombináció képezhető?
= 81
! $3^4 = 81$.

? Mi a SCAMPER módszer lényege?
- az ötletek pontozása
+ kérdéslista egy meglévő termék módosításához (helyettesít, kombinál, átalakít, …)
- a csapattagok szerepeinek kiosztása
- a piac méretének becslése
! Minden betű egy átalakítási irányt jelöl.

? Egy ötlet 20% eséllyel jó. Mekkora eséllyel van legalább egy jó 3 független ötlet között? (tizedes törtként, 3 tizedesre)
= 0,488
= 0.488
! $1 - 0{,}8^3 = 1 - 0{,}512 = 0{,}488$.

? Melyik a radikális innováció jellemzője?
- egy meglévő termék kis javítása
+ alapvetően új technológia vagy megoldás, amely új lehetőségeket nyit
- csak az ár csökkentése
- a marketingkampány megújítása
! Az inkrementális innováció a kis lépésekben javító változat.
```

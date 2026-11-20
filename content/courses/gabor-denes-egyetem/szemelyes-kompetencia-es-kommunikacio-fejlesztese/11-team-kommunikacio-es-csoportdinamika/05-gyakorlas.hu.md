---
title: Gyakorlás – team kommunikáció és csoportdinamika
summary: Ellenőrző kérdések és összefoglaló feladatlap a csoportfejlődésről, a csoportos döntés csapdáiról és a csapatkommunikáció gyakorlatáról.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem érdemes elkerülni a viharzás szakaszt?</summary>

Mert a viták során derülnek ki a különböző elvárások és munkamódok, és ezekből lesznek a közös normák. Ha a csapat kerüli a vitát, álharmóniában ragad, és a problémák később, rosszabb pillanatban jönnek elő.

</details>

<details>
<summary>2. Hogyan előzheti meg egy vezető a csoportgondolkodást?</summary>

Utoljára mondja el a véleményét; kijelöl egy ördögügyvédet; kifejezetten kéri az ellenvéleményeket; külső szakértőt von be; pre-mortemet tart; csendes ötleteléssel vagy névtelen szavazással gyűjt véleményt.

</details>

<details>
<summary>3. Miért nem gyorsít egy késésben lévő projekten, ha négy új fejlesztőt adnak hozzá?</summary>

Mert az újakat be kell tanítani (ez a meglévők idejét is viszi), és a kommunikációs csatornák száma négyzetesen nő: 6 fő helyett 10 főnél 15 helyett 45 csatorna van. Ez Brooks törvénye.

</details>

<details>
<summary>4. Mondj három szabályt egy távmunkában dolgozó csapat chatjéhez!</summary>

Például: kérdezz nyilvános csatornában, ne privátban; válaszolj szálban; az első üzenetben legyen benne a kérdés és a kontextus; a sürgős ügyeket külön jelöld (vagy hívj); a döntéseket írd be a wikibe.

</details>

## Összefoglaló feladatlap

> Egy 6 fős csapat két hónapja dolgozik egy mobilalkalmazáson. A határidő közeleg, a vezető két új fejlesztőt kér.

```quiz required
? Hány kétszemélyes kommunikációs csatorna van most a 6 fős csapatban?
= 15
! 6 · 5 / 2 = 15.

? Hány csatorna lesz, ha két új fejlesztő érkezik?
= 28
! 8 · 7 / 2 = 28.

? Az új tagok érkezése után a csapatban újra viták kezdődnek a munkamódszerekről. Melyik szakaszba lépett vissza a csapat?
- alakulás nélkül azonnal működés
+ viharzás
- felbomlás
- normaképzés után működés
! Új tagok → a normákat újra kell egyeztetni.

? A tervezésen a vezető elmondja a véleményét, és mindenki bólint, pedig a fejlesztők szerint a terv irreális. Mi lenne a legjobb változtatás?
- még gyorsabb döntés
+ a vezető utoljára szóljon, és a becslést a csapat egyszerre, egymástól függetlenül adja meg (pl. planning poker)
- a fejlesztők ne vegyenek részt a tervezésen
- szavazás kézfeltartással, a vezető után
! Csoportgondolkodás ellen: független vélemények.

? A retrospektíven kiderül, hogy az egyik tag hetek óta nem mer szólni, ha elakad. Melyik tényező hiányzik leginkább?
- Brooks törvénye
+ pszichológiai biztonság
- társas lógás
- Delphi-módszer
! Biztonságosnak kell lennie kérdezni és hibát beismerni.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Condorcet-tétel.** Írd meg a `tobbseg(n, p)` függvényt, amely megadja, mekkora eséllyel dönt jól egy `n` (páratlan) fős csoport többsége, ha mindenki egymástól függetlenül `p` eséllyel dönt jól (3 tizedesre)! Segítség: `math.comb(n, k)`.

```python starter
def tobbseg(n, p):
    return round(p, 3)
```

<details>
<summary>Megoldás</summary>

```python solution
from math import comb

def tobbseg(n, p):
    # legalább n//2 + 1 tagnak kell jól döntenie
    return round(sum(comb(n, k) * p**k * (1 - p)**(n - k) for k in range(n // 2 + 1, n + 1)), 3)
```

</details>

```python test
assert tobbseg(1, 0.7) == 0.7
assert tobbseg(3, 0.8) == 0.896
assert tobbseg(9, 0.7) == 0.901
assert tobbseg(3, 0.5) == 0.5
print("Minden ellenőrzés sikeres!")
```

**2.** **Rejtett profil.** Egy információt `k` ember tud, és mindegyikük egymástól függetlenül `q` eséllyel hozza szóba. Írd meg az `elhangzik(q, k)` függvényt, amely megadja, mekkora eséllyel hangzik el a megbeszélésen (3 tizedesre)!

```python starter
def elhangzik(q, k):
    return round(q * k, 3)
```

<details>
<summary>Megoldás</summary>

```python solution
def elhangzik(q, k):
    return round(1 - (1 - q) ** k, 3)     # 1 − annak esélye, hogy senki sem említi
```

</details>

```python test
assert elhangzik(0.3, 1) == 0.3
assert elhangzik(0.3, 3) == 0.657
assert elhangzik(0.5, 4) == 0.938
print("Minden ellenőrzés sikeres!")
```

**3.** **Tuckman-szakasz.** A `tunetek` szótár szakaszonként a jellemző tünetek halmazát tartalmazza. Írd meg a `szakasz(megfigyelt, tunetek)` függvényt, amely azt a szakaszt adja vissza, amelynek a legtöbb tünete szerepel a megfigyelt halmazban (egyenlőségnél a szótárban előbb álló nyer)!

```python starter
def szakasz(megfigyelt, tunetek):
    return list(tunetek)[0]
```

<details>
<summary>Megoldás</summary>

```python solution
def szakasz(megfigyelt, tunetek):
    talalat = {nev: len(jelek & megfigyelt) for nev, jelek in tunetek.items()}
    return max(talalat, key=talalat.get)   # max az első legnagyobbat adja
```

</details>

```python test
t = {"alakulás": {"udvariasság", "bizonytalan szerepek"}, "viharzás": {"viták", "frakciók", "csúszás"},
     "normaképzés": {"közös szabályok", "nyílt visszajelzés"}, "működés": {"önálló döntések", "magas teljesítmény"}}
assert szakasz({"viták", "csúszás", "udvariasság"}, t) == "viharzás"
assert szakasz({"közös szabályok"}, t) == "normaképzés"
assert szakasz({"magas teljesítmény", "önálló döntések", "viták"}, t) == "működés"
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a csoportgondolkodás (groupthink)?
+ az egyetértés fenntartása fontosabbá válik a kritikus gondolkodásnál, ezért senki sem mond ellent
- a csoport mindig jobban dönt az egyénnél
- a csoport tagjai egyénileg döntenek
- brainstorming technika
! Az ellenvélemények elhallgatása rossz döntésekhez vezet.

? Hány kommunikációs csatorna van egy 8 fős csapatban ($k(k-1)/2$)?
= 28
! $8 \cdot 7 / 2 = 28$.

? Mi a társas lógás (social loafing)?
- a csapat közös szünete
+ csoportban az egyén kevesebb erőfeszítést tesz, mert az ő hozzájárulása kevésbé látszik
- a vezető túlterhelése
- a csapatépítő program
! Ellenszer: látható, egyéni felelősség.

? Mit jelent a pszichológiai biztonság egy csapatban?
- senkit sem lehet kritizálni
+ a tagok kockázat nélkül kérdezhetnek, hibázhatnak és mondhatnak ellent
- mindenki ugyanazt gondolja
- a vezető dönt mindenről
! Ebben a légkörben kerülnek elő a problémák időben.
```

---
title: Mélyebben – csoportos döntés szimulációval
summary: Mikor okosabb a csoport, mint az egyén? A Condorcet-féle esküdtszéki tétel, és hogyan teszi tönkre a függetlenség hiánya (a csoportgondolkodás szimulációja), a „rejtett profil”: miért nem kerül elő az egyedi információ, és a Tuckman-szakasz felismerése tünetekből – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- mikor dönt **jobban** egy csoport többségi szavazással, mint egy ember,
- miért **rontja el** a csoport bölcsességét, ha mindenki a hangadóhoz igazodik,
- miért marad gyakran **rejtve** az, amit csak egy csapattag tud,
- hogyan ismerd fel a csapatod **fejlődési szakaszát** a tünetekből.

## 1. A csoport bölcsessége: a Condorcet-tétel

Nicolas de Condorcet francia matematikus a 18. században észrevette: ha minden csoporttag **egymástól függetlenül** $p > 0{,}5$ valószínűséggel dönt jól, akkor a **többségi szavazás** annál biztosabban helyes, minél nagyobb a csoport. Három fő esetén a többség akkor dönt jól, ha legalább ketten jól döntenek:

$$P_3 = p^3 + 3p^2(1 - p)$$

```plot
title: A többségi döntés helyességének esélye az egyéni pontosság függvényében
x: 0, 1
y: 0, 1
f: x # egy ember
f: x^3 + 3*x^2*(1 - x) # 3 fő többsége
f: x^5 + 5*x^4*(1 - x) + 10*x^3*(1 - x)^2 # 5 fő többsége
```

A görbék $p = 0{,}5$-nél metszik egymást. Ha az egyének jobbak a pénzfeldobásnál, a csoport **még jobb** (a görbék az átló fölött vannak); ha rosszabbak – például mert félre vannak tájékoztatva –, a csoport **még rosszabb**. Pontosan számolva, $p = 0{,}7$ esetén:

```python run
# Condorcet-tétel: független tagok többségi szavazásának pontossága
from math import comb

def tobbseg(n, p):
    # annak esélye, hogy n (páratlan) független tagból a többség jól dönt
    return sum(comb(n, k) * p**k * (1 - p)**(n - k) for k in range(n // 2 + 1, n + 1))

for n in [1, 3, 5, 9, 15]:
    print(f"{n:>2} fő: {tobbseg(n, 0.7):.1%}")
```

Egy 70%-os pontosságú ember helyett 9 független, ugyanilyen pontos ember többsége már **90%** feletti eséllyel dönt jól. Ez a „tömegek bölcsessége” – de van egy apró betűs része: **függetlenség**.

## 2. Ha mindenki a hangadóhoz igazodik: csoportgondolkodás

Az alapleckében tanult **csoportgondolkodás** (groupthink) éppen a függetlenséget szünteti meg: a megbeszélésen először a csapatvezető vagy a legmagabiztosabb ember szól, és a többiek – kényelemből, tiszteletből vagy félelemből – hozzá igazodnak. Szimuláljuk: az első szóló után minden tag 70% eséllyel **egyszerűen átveszi** az ő véleményét, és csak a maradék esetben gondolkodik önállóan (ilyenkor ő is 70% eséllyel dönt jól):

```python run
# Csoportgondolkodás szimulációja: független tagok vs. az első szólóhoz igazodó tagok
import random

random.seed(42)                                     # ismételhető eredmény

def szimulal(n, p, igazodas, ismetles=10000):
    jo = 0
    for _ in range(ismetles):
        elso = random.random() < p                  # az első szóló jól dönt-e
        szavazat = [elso]
        for _ in range(n - 1):
            if random.random() < igazodas:
                szavazat.append(elso)               # átveszi a hangadó véleményét
            else:
                szavazat.append(random.random() < p)  # önállóan dönt
        jo += sum(szavazat) > n / 2
    return jo / ismetles

for n in [3, 5, 9]:
    fuggetlen = szimulal(n, 0.7, 0.0)
    igazodo = szimulal(n, 0.7, 0.7)
    print(f"{n} fő: független {fuggetlen:.0%}, igazodó {igazodo:.0%}")
```

Ha a tagok 70%-ban az első szólóhoz igazodnak, a csoport alig jobb, mint **egyetlen ember** – mindegy, hányan vannak. A létszám nem segít, ha a csoport valójában egy emberként gondolkodik.

Mit lehet tenni? Az alapleckében tanult technikák pontosan a függetlenséget védik:

- **Először egyénileg, írásban** döntsön mindenki (vagy rangsoroljon), és csak utána beszéljétek meg.
- **A vezető szóljon utoljára** – különben az ő véleménye horgonyként hat.
- **Ördögügyvéd**: valakinek kifejezetten az a feladata, hogy az ellenérveket keresse.
- **Pszichológiai biztonság**: ahol nem kockázatos ellentmondani, ott a tagok valóban a saját véleményüket mondják.

## 3. A rejtett profil: miért nem kerül elő, amit csak egy ember tud?

Egy csoport nagy előnye lehetne, hogy a tagok **különböző információkat** hoznak. A kutatások (Stasser és Titus „rejtett profil” kísérletei) szerint azonban a megbeszélések főleg arról szólnak, amit **mindenki tud** – az egyedi információ gyakran elő sem kerül.

Egyszerű modell: egy információt **minden birtokosa** egymástól függetlenül $q$ eséllyel említ meg. Ha $k$ ember tudja, annak esélye, hogy elhangzik:

$$P(\text{elhangzik}) = 1 - (1 - q)^k$$

```python run
# Rejtett profil: mekkora eséllyel hangzik el egy információ, ha k ember tudja?
q = 0.3                                   # egy birtokos ennyi eséllyel hozza szóba
for k in [1, 2, 3, 4]:
    print(f"{k} ember tudja: {1 - (1 - q) ** k:.0%} eséllyel hangzik el")

# egy döntés: a közös információk az A, az egyedi információk a B lehetőség mellett szólnak
kozos = 4                                  # 4 közös tény, mind a 4 tag tudja
egyedi = 4                                 # 4 egyedi tény, mindegyiket csak 1 tag tudja
print(f"\nvárhatóan elhangzó közös tény (A mellett): {kozos * (1 - (1 - q) ** 4):.1f}")
print(f"várhatóan elhangzó egyedi tény (B mellett):  {egyedi * (1 - (1 - q) ** 1):.1f}")
```

Bár mindkét lehetőség mellett ugyanannyi tény szól, a megbeszélésen az A melletti közös tényekből **átlagosan 3** elhangzik, a B melletti egyediekből csak **1,2**. A csoport ezért az A-t választja – pedig ha minden információ előkerülne, talán a B lenne a jobb. Ellenszerek:

- **Szerepek**: mindenki „szakértője” egy területnek, és kifejezetten az a dolga, hogy arról beszámoljon („Bálint, a biztonsági oldalon mit láttál?”).
- **Írásos előkészítés**: a megbeszélés előtt mindenki leírja, amit tud – egy közös dokumentumban az egyedi információ is látszik.
- **Kérdés a végén**: „Van valami, amit csak te tudsz, és még nem mondtál el?”

## 4. Melyik szakaszban van a csapat?

Tuckman modellje (alakulás, viharzás, normaképzés, működés, felbomlás) az alapleckéből ismert. A gyakorlatban a szakaszt **tünetekből** lehet felismerni:

```python run
# Tuckman-szakasz felismerése tünetek alapján (a legtöbb egyező tünet nyer)
tunetek = {
    "alakulás": {"udvariasság", "bizonytalan szerepek", "a vezetőre várnak", "kevés vita"},
    "viharzás": {"viták a módszerről", "frakciók", "határidő-csúszás", "a vezető megkérdőjelezése"},
    "normaképzés": {"közös szabályok", "nyílt visszajelzés", "kevesebb konfliktus", "csapatnyelv"},
    "működés": {"önálló döntések", "gyors problémamegoldás", "magas teljesítmény", "egymás segítése"},
}

def szakasz(megfigyelt):
    talalat = {nev: len(jelek & megfigyelt) for nev, jelek in tunetek.items()}
    return max(talalat, key=talalat.get), talalat

megfigyelt = {"viták a módszerről", "határidő-csúszás", "frakciók", "udvariasság"}
nev, talalat = szakasz(megfigyelt)
print(f"valószínű szakasz: {nev}  {talalat}")
```

A viharzás felismerése azért fontos, mert ilyenkor a csapat hajlamos **pánikba esni** („rossz a csapat!”), pedig ez a fejlődés természetes része. Ilyenkor segít: a szerepek és a döntési szabályok **kimondása**, egy retrospektív megbeszélés, és a viták **tartalomra** terelése a személyek helyett.

## Összefoglalás

- Condorcet-tétel: ha a tagok függetlenek és jobbak a véletlennél, a többségi döntés a létszámmal egyre pontosabb.
- Ha a tagok a hangadóhoz igazodnak, a csoport alig jobb egy embernél – ezért először egyénileg, írásban döntsetek, és a vezető szóljon utoljára.
- A rejtett profil: a közös információ nagyobb eséllyel hangzik el ($1 - (1 - q)^k$), az egyedi gyakran rejtve marad; szerepekkel és írásos előkészítéssel lehet előhozni.
- A Tuckman-szakasz tünetekből felismerhető; a viharzás természetes, nem a csapat kudarca.

## A lecke feladata

```quiz required
? Három független csapattag mindegyike 80% eséllyel dönt jól. Mekkora eséllyel dönt jól a többség? (tizedes törtként)
= 0,896
= 0.896
! $0{,}8^3 + 3 \cdot 0{,}8^2 \cdot 0{,}2 = 0{,}512 + 0{,}384 = 0{,}896$.

? Egy információt egyetlen csapattag tud, és 30% eséllyel hozza szóba. Ha három ember tudná (egymástól függetlenül 30% eséllyel szóba hozva), mekkora eséllyel hangzana el? (tizedes törtként)
= 0,657
= 0.657
! $1 - 0{,}7^3 = 1 - 0{,}343 = 0{,}657$.

? Mi a legjobb módszer a csoportgondolkodás ellen egy döntés előtt?
- a vezető mondja el először a véleményét, hogy legyen kiindulópont
+ mindenki először egyénileg, írásban dönt, és a vezető szól utoljára
- minél gyorsabb, egyhangú döntés
- csak a legtapasztaltabb tag szavazzon
! Ez őrzi meg a függetlenséget.

? A csapatban viták vannak a módszerről, frakciók alakultak, és csúsznak a határidők. Melyik Tuckman-szakaszban vannak valószínűleg?
- alakulás
+ viharzás
- normaképzés
- működés
! Ezek a viharzás tipikus tünetei.

? Miért nem segít a nagyobb létszám, ha mindenki a hangadóhoz igazodik?
- mert a nagy csoport mindig rosszabbul dönt
+ mert a tagok szavazatai nem függetlenek, így a csoport gyakorlatilag egy emberként dönt
- mert a többségi szavazás matematikailag hibás
- mert túl sok a kommunikációs csatorna
! A Condorcet-tétel feltétele a függetlenség.
```

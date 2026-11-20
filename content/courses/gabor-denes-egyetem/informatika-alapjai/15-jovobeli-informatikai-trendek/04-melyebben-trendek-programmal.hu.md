---
title: Mélyebben – trendek programmal kipróbálva
summary: Egy saját „gépi tanulás” egyenes illesztéssel, miért félrevezető a pontosság egy ritka esemény felismerésénél (precízió és felidézés), egy mini blokklánc munkabizonyítékkal, mennyit gyorsít egy kvantumalgoritmus a keresésen, és egy adatközpont energiamérlege – kis programokkal és interaktív ábrával.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- mit jelent **valójában** a gépi tanulás – egy egyszerű modellen, amelyet te „tanítasz”,
- hogyan értékeld egy MI-modell eredményét, és miért **csal** a pontosság ritka eseményeknél,
- hogyan véd egy **blokklánc** a módosítás ellen,
- mekkora a **kvantumgyorsítás** valójában, és mennyi energiát fogyaszt az informatika.

## 1. Gépi tanulás egy egyenessel

Az alapleckében láttuk, hogy a gépi tanulásnál a program **adatokból** tanulja meg a szabályt, ahelyett hogy mi írnánk meg. A legegyszerűbb példa: egy egyenes illesztése. Néhány hallgató adataiból (heti tanulási óra → elért pontszám) a program megkeresi azt az egyenest, amelyre a hibák négyzetösszege a legkisebb (**legkisebb négyzetek módszere**):

```python run
# "Tanítás": egyenes illesztése legkisebb négyzetekkel, majd előrejelzés
orak = [1, 2, 3, 4, 5, 6, 8, 10]
pontok = [35, 42, 50, 54, 60, 66, 74, 85]

n = len(orak)
ax, ay = sum(orak) / n, sum(pontok) / n
meredekseg = sum((x - ax) * (y - ay) for x, y in zip(orak, pontok)) / sum((x - ax) ** 2 for x in orak)
tengely = ay - meredekseg * ax
print(f"a tanult modell: pont ≈ {tengely:.1f} + {meredekseg:.2f} · óra")

for uj in [7, 12, 40]:
    becsles = tengely + meredekseg * uj
    print(f"{uj:>2} óra → becslés: {becsles:.0f} pont")
```

A modell 7 órára jó becslést ad, de 40 órára **kb. 250 pontot** jósol – ami lehetetlen, ha a maximum 100 (és már 12 órára is 97-et, ami gyanúsan sok). Ez az MI egyik legfontosabb korlátja: a modell csak azon a tartományon megbízható, amelyről **adatot látott**. Egy nagy nyelvi modell is hasonló elven működik (csak milliárdnyi paraméterrel és szöveggel): a tanult mintázatokból jósol, és ha a kérdés kívül esik ezeken, magabiztosan **tévedhet** („hallucináció”).

## 2. Mikor csal a pontosság? Precízió és felidézés

Egy bank MI-modellt használ a csalások kiszűrésére. A tranzakcióknak csak **1%-a** csalás. Egy „modell”, amely mindenre azt mondja, hogy „nem csalás”, **99%-ban pontos** – és teljesen haszontalan. Ezért két másik mutatót is nézünk:

- **precízió**: a modell által csalásnak jelöltek közül hány valóban az (mennyi a téves riasztás),
- **felidézés** (recall): a valódi csalások közül hányat talált meg.

```python run
# Pontosság, precízió, felidézés egy ritka esemény (1% csalás) felismerésénél
def mutatok(tp, fp, fn, tn):
    pontossag = (tp + tn) / (tp + fp + fn + tn)
    precizio = tp / (tp + fp) if tp + fp else 0
    felidezes = tp / (tp + fn) if tp + fn else 0
    return pontossag, precizio, felidezes

# 10 000 tranzakció, ebből 100 csalás
modellek = {
    "mindig 'nem csalás'": (0, 0, 100, 9900),
    "óvatos modell": (60, 40, 40, 9860),
    "érzékeny modell": (95, 500, 5, 9400),
}
for nev, (tp, fp, fn, tn) in modellek.items():
    p, pr, f = mutatok(tp, fp, fn, tn)
    print(f"{nev:<22} pontosság {p:6.1%}, precízió {pr:6.1%}, felidézés {f:6.1%}")
```

Melyik a jobb modell? Ez **nézőpont** kérdése. A banknak a kimaradt csalás drága (magas felidézés kell), az ügyfélnek viszont bosszantó, ha minden második vásárlását letiltják (magas precízió kell). Ugyanez a kérdés egy orvosi szűrésnél: ott a kimaradt betegség a legrosszabb, ezért a felidézést részesítik előnyben, és a pozitív eredményt egy második vizsgálattal ellenőrzik.

## 3. Mini blokklánc munkabizonyítékkal

Az alapleckében láttuk, hogy a blokklánc blokkjai az előző blokk **hash**-ét is tartalmazzák (mint a git commitjai). A nyilvános blokkláncok egy további trükköt is használnak: egy blokk csak akkor érvényes, ha a hash-e bizonyos számú **nullával** kezdődik. Ehhez egy számot (**nonce**) addig kell próbálgatni, amíg ilyen hash nem jön ki – ez a **munkabizonyíték** (proof of work):

```python run
# Mini blokklánc: minden blokk az előző hash-ét tartalmazza, és munkabizonyítékot kell találni
import hashlib

def banyasz(elozo_hash, adat, nehezseg):
    nonce = 0
    while True:
        h = hashlib.sha256(f"{elozo_hash}|{adat}|{nonce}".encode()).hexdigest()
        if h.startswith("0" * nehezseg):          # elég nullával kezdődik?
            return nonce, h
        nonce += 1

lanc, elozo = [], "0" * 64
for adat in ["Anna → Béla: 5", "Béla → Csilla: 2", "Csilla → Anna: 1"]:
    nonce, h = banyasz(elozo, adat, 4)
    lanc.append((adat, nonce, h))
    print(f"{adat:<18} nonce = {nonce:>6}, hash = {h[:16]}...")
    elozo = h

# a nehézség minden plusz nullával kb. 16-szoros munkát jelent
for nehezseg in [1, 2, 3, 4]:
    print(f"{nehezseg} nulla: átlagosan kb. {16 ** nehezseg:,} próbálkozás".replace(",", " "))
```

Ha valaki egy régi blokkot módosítana, annak hash-e megváltozna, így az **összes** utána következő blokkot újra „ki kellene bányásznia” – gyorsabban, mint a hálózat többi része. Ez adja a védelmet. Az ár: a munkabizonyíték **óriási energiát** fogyaszt (a Bitcoin hálózata egy közepes ország éves áramfogyasztásával vetekszik). Ezért tértek át sok blokkláncon más módszerekre (pl. _proof of stake_), és ezért érdemes minden projektnél megkérdezni: **tényleg** kell ide blokklánc, vagy elég egy közös adatbázis?

## 4. Kvantumgyorsítás és zöld IT

A kvantumszámítógépről gyakran halljuk, hogy „mindent exponenciálisan gyorsabban old meg”. Ez nem igaz. Egy rendezetlen adathalmazban való keresésnél például a **Grover-algoritmus** $N$ helyett kb. $\sqrt{N}$ lépést igényel – ez **négyzetes**, nem exponenciális gyorsítás:

```plot
title: Lépésszám egy rendezetlen, N elemű adathalmazban való keresésnél
x: 1, 10000
y: 0, 5000
f: x/2 # klasszikus: átlagosan N/2 lépés
f: sqrt(x) # Grover-algoritmus: kb. √N lépés
```

Ez nagy $N$-nél jelentős, de egy 128 bites titkosítási kulcsot így is csak $2^{64}$ lépésben lehetne kipróbálni – ezért elég a kulcshosszt **megduplázni** (AES-256). A nyilvános kulcsú titkosítás (RSA) helyzete más: azt a **Shor-algoritmus** valóban gyorsan feltörné egy elég nagy kvantumszámítógépen, ezért vezetik be már most a **kvantumbiztos** algoritmusokat.

A **zöld IT** szempontjából az egyik legfontosabb mutató egy adatközpont **PUE**-értéke (Power Usage Effectiveness): az összes felhasznált energia osztva a számítógépek energiájával. A különbség a hűtésre, áramátalakításra stb. megy el:

```python run
# Adatközpont energiamérlege: PUE és a megtakarítás
it_teljesitmeny_kw = 500                         # a szerverek teljesítménye
for pue in [2.0, 1.5, 1.2, 1.1]:
    ossz_kw = it_teljesitmeny_kw * pue
    evi_mwh = ossz_kw * 24 * 365 / 1000
    ft = lambda x: f"{x:,.0f}".replace(",", " ")  # magyar ezres tagolás
    print(f"PUE {pue}: összesen {ossz_kw:.0f} kW, évente {ft(evi_mwh)} MWh, ebből hűtés stb. {ft(evi_mwh * (1 - 1 / pue))} MWh")
```

Egy PUE = 2,0-ás régi adatközpont ugyanannyi számításhoz majdnem kétszer annyi energiát használ, mint egy modern, 1,1-es. A **nézőpontok**: az üzemeltetőnek ez költség, a társadalomnak szén-dioxid-kibocsátás, a fejlesztőnek pedig feladat – egy hatékonyabb algoritmus vagy egy kisebb MI-modell is energiát takarít meg.

| Trend                 | Valódi lehetőség                                    | Gyakori túlzás                                    |
| --------------------- | --------------------------------------------------- | ------------------------------------------------- |
| **MI / gépi tanulás** | mintázatok felismerése sok adatból, automatizálás   | „mindent tud és sosem téved”                      |
| **blokklánc**         | közös, módosíthatatlan napló bizalom nélkül         | „minden adatbázist le kell cserélni”              |
| **kvantum**           | bizonyos problémák (pl. RSA, szimuláció) gyorsítása | „mindent exponenciálisan gyorsabban old meg”      |
| **IoT**               | valós idejű adatok gépekről, épületekről            | „minden eszköz legyen okos” – biztonsági kockázat |

## Összefoglalás

- A gépi tanulás adatokból tanul szabályt (pl. egyenest illeszt); a modell csak a látott tartományban megbízható.
- Ritka eseményeknél a pontosság félrevezet; a precízió a téves riasztásokat, a felidézés a kimaradt eseteket méri.
- A blokklánc blokkjai hash-sel láncolódnak; a munkabizonyíték véd a módosítás ellen, de sok energiát fogyaszt.
- A Grover-keresés négyzetes, nem exponenciális gyorsítás; az adatközpontok hatékonyságát a PUE méri.

## A lecke feladata

```quiz required
? Egy tanult modell: pont ≈ 30 + 5 · óra. Hány pontot jósol 8 óra tanulásra?
= 70
! $30 + 5 \cdot 8 = 70$.

? Egy modell 100 csalásból 80-at talál meg, és közben 20 rendben lévő tranzakciót is csalásnak jelöl. Hány százalék a precíziója?
= 80
! $80 / (80 + 20) = 80\%$.

? Ugyanennél a modellnél (100 csalásból 80-at talál meg) hány százalék a felidézés?
= 80
! $80 / 100 = 80\%$.

? Kb. hány lépés kell a Grover-algoritmusnak egy 1 000 000 elemű rendezetlen adathalmazban?
= 1000
! $\sqrt{10^6} = 1000$, szemben a klasszikus kb. 500 000 lépéssel.

? Egy adatközpont szerverei 400 kW-ot fogyasztanak, a teljes fogyasztás 600 kW. Mennyi a PUE? (tizedes törtként)
= 1,5
= 1.5
! $600 / 400 = 1{,}5$.
```

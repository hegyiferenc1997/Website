---
title: Mélyebben – tárgyalás és együttműködés szimulációval
summary: Többtémás tárgyalás pontozással (miért rosszabb a „középen találkozunk”, mint a cserealku, és mi a Pareto-hatékony megállapodás), az ismételt fogolydilemma kis versenye (miért nyer hosszú távon az együttműködés), és a Thomas–Kilmann-stílusok kiválasztása helyzetek szerint – kis programokkal.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- miért születik **jobb megállapodás**, ha egyszerre több témáról tárgyaltok,
- mit jelent, hogy egy megállapodás **Pareto-hatékony**,
- miért **térül meg** hosszú távon az együttműködés (ismételt fogolydilemma),
- hogyan válassz **konfliktuskezelési stílust** a helyzethez.

## 1. Többtémás tárgyalás: ne az ár legyen az egyetlen téma

Egy kisvállalkozás (a megrendelő) foglalórendszert rendel tőletek. Három témáról kell megállapodni: **határidő**, **ár** és a **támogatás** hossza (hány hónapig javítjátok ingyen a hibákat). A felkészülés során mindkét fél pontozza, mennyit ér neki egy-egy lehetőség (az alapleckéből ismert érdekek számszerűsítése):

| Téma      | Lehetőség | Megrendelő pontja | Fejlesztő pontja |
| --------- | --------- | ----------------: | ---------------: |
| határidő  | 4 hét     |                40 |                0 |
|           | 6 hét     |                20 |               15 |
|           | 8 hét     |                 0 |               30 |
| ár        | 2,0 M Ft  |                30 |                0 |
|           | 2,5 M Ft  |                15 |               25 |
|           | 3,0 M Ft  |                 0 |               50 |
| támogatás | 3 hónap   |                 0 |               20 |
|           | 6 hónap   |                10 |               10 |
|           | 12 hónap  |                30 |                0 |

A megrendelőnek a **gyors határidő** és a **hosszú támogatás** a fontos (mert a szezon kezdetére kell a rendszer, és nincs saját informatikusa). A fejlesztőnek az **ár** számít a legtöbbet. A „kézenfekvő” megoldás mindenben középen találkozni. Nézzük meg az összes, $3 \cdot 3 \cdot 3 = 27$ lehetséges csomagot!

```python run
# Többtémás tárgyalás: az összes csomag pontszáma, a kompromisszum és a Pareto-hatékony csomagok
from itertools import product

temak = {
    "határidő": [("4 hét", 40, 0), ("6 hét", 20, 15), ("8 hét", 0, 30)],
    "ár": [("2,0 M Ft", 30, 0), ("2,5 M Ft", 15, 25), ("3,0 M Ft", 0, 50)],
    "támogatás": [("3 hónap", 0, 20), ("6 hónap", 10, 10), ("12 hónap", 30, 0)],
}
csomagok = []
for valasztas in product(*temak.values()):          # minden kombináció
    nev = ", ".join(v[0] for v in valasztas)
    csomagok.append((nev, sum(v[1] for v in valasztas), sum(v[2] for v in valasztas)))

def dominalt(c):
    # van-e olyan csomag, amely mindkét félnek legalább ilyen jó, és valamelyiknek jobb?
    return any(d[1] >= c[1] and d[2] >= c[2] and (d[1], d[2]) != (c[1], c[2]) for d in csomagok)

kompromisszum = next(c for c in csomagok if c[0] == "6 hét, 2,5 M Ft, 6 hónap")
print(f"kompromisszum: {kompromisszum[0]} → megrendelő {kompromisszum[1]}, fejlesztő {kompromisszum[2]}")
print(f"Pareto-hatékony? {'nem' if dominalt(kompromisszum) else 'igen'}\n")

print("mindkét félnek legalább olyan jó, Pareto-hatékony csomagok:")
for nev, m, f in sorted(csomagok, key=lambda c: -(c[1] + c[2])):
    if m >= kompromisszum[1] and f >= kompromisszum[2] and not dominalt((nev, m, f)):
        print(f"  {nev:<28} megrendelő {m}, fejlesztő {f}, együtt {m + f}")
```

A „középen találkozunk” kompromisszum (45 + 50 pont) **nem Pareto-hatékony**: van olyan megállapodás, amely **mindkét félnek jobb**. Ha a megrendelő megkapja a neki fontos gyors határidőt és hosszú támogatást, cserébe elfogadja a magasabb árat (4 hét, 3,0 M Ft, 12 hónap), akkor neki 70, a fejlesztőnek 50 pont jár – vagy a 6 hét, 3,0 M Ft, 12 hónap csomagnál mindketten jobban járnak (50 és 65 pont).

Ez a **cserealku** (logrolling): mindenki abban enged, ami **neki kevésbé fontos, a másiknak viszont nagyon**. Ehhez az kell, hogy:

- **egyszerre** tárgyaljatok több témáról (ha előbb lezárjátok az árat, a cserelehetőség elvész),
- **kérdezzetek** az érdekekről („Miért fontos a 4 hét?”), mert a pontszámokat a valóságban senki sem teszi az asztalra,
- a „tortát” előbb **növeljétek**, és csak utána osszátok el.

> **Pareto-hatékony** egy megállapodás, ha nincs olyan másik, amely legalább az egyik félnek jobb, és egyiknek sem rosszabb. A jó tárgyaló nem áll meg az első elfogadható megoldásnál, hanem megkérdezi: „Van olyan változat, ami mindkettőnknek jobb?”

## 2. Miért éri meg együttműködni? Az ismételt fogolydilemma

Egy csapatban újra és újra eldől, hogy segítesz-e a másiknak (együttműködsz), vagy a saját feladatodra koncentrálsz, és hagyod, hogy ő oldja meg a gondját (önző lépés). Egyetlen alkalommal az önzés kifizetődőbbnek tűnhet. A **fogolydilemma** ezt modellezi; a pontok:

| Te \ A másik      | együttműködik | önző |
| ----------------- | :-----------: | :--: |
| **együttműködsz** |     3, 3      | 0, 5 |
| **önző vagy**     |     5, 0      | 1, 1 |

Robert Axelrod híres számítógépes versenyében a stratégiák sokszor egymás után játszottak. Rendezzünk egy kis versenyt négy stratégiával, 10 körös párosításokkal:

```python run
# Ismételt fogolydilemma: kis körmérkőzés négy stratégiával
PONT = {("E", "E"): (3, 3), ("E", "Ö"): (0, 5), ("Ö", "E"): (5, 0), ("Ö", "Ö"): (1, 1)}

def mindig_egyuttmukodo(sajat, masik): return "E"
def mindig_onzo(sajat, masik): return "Ö"
def szemet_szemert(sajat, masik): return masik[-1] if masik else "E"   # először együttműködik, aztán utánoz
def haragtarto(sajat, masik): return "Ö" if "Ö" in masik else "E"      # egy önzés után örökre önző

strategiak = [mindig_egyuttmukodo, mindig_onzo, szemet_szemert, haragtarto]

def meccs(a, b, korok=10):
    ta, tb, pa, pb = [], [], 0, 0
    for _ in range(korok):
        la, lb = a(ta, tb), b(tb, ta)
        x, y = PONT[(la, lb)]
        ta.append(la); tb.append(lb); pa += x; pb += y
    return pa, pb

osszpont = {s.__name__: 0 for s in strategiak}
for i, a in enumerate(strategiak):
    for b in strategiak[i:]:                          # mindenki mindenkivel (és önmagával) egyszer
        pa, pb = meccs(a, b)
        osszpont[a.__name__] += pa
        if a is not b:
            osszpont[b.__name__] += pb
for nev, p in sorted(osszpont.items(), key=lambda t: -t[1]):
    print(f"{nev:<20} {p:>3} pont")
```

A „mindig önző” stratégia minden egyes meccsen legalább annyi pontot szerez, mint az ellenfele – **mégis utolsó**, mert az együttműködőkkel együtt nem tud nagy pontszámot elérni. A **szemet szemért** (tit for tat) és a haragtartó áll az élen: **kedvesen kezdenek** (együttműködnek), de **nem hagyják magukat kihasználni**.

Mit jelent ez a csapatmunkában?

- **Kezdj együttműködéssel**: segíts, oszd meg az információt, tételezd fel a jó szándékot.
- **Reagálj** a kihasználásra (a szemet szemért nem naiv), de **bocsáss meg** gyorsan: ha a másik visszatér az együttműködéshez, te is térj vissza. (A haragtartó egy véletlen félreértés miatt örökre elveszíti az együttműködés hasznát – egy valódi csapatban ez a legnagyobb kockázata.)
- A csapat **ismételt játék**: aki ma önző, az holnap nem kap segítséget. Ezért egy jó csapatkultúrában az együttműködés az ésszerű döntés, nem csak a kedves.

## 3. Melyik konfliktuskezelési stílus mikor?

Az alapleckéből ismert Thomas–Kilmann-modell két tengelye: mennyire fontos az **ügy** (a saját célod), és mennyire fontos a **kapcsolat** (a másik fél céljai). Egyik stílus sem „a jó” – a helyzet dönt:

```python run
# Thomas–Kilmann: stílusválasztás az ügy és a kapcsolat fontossága szerint (1–5)
def stilus(ugy, kapcsolat, sietni_kell=False):
    if sietni_kell and ugy >= 4:
        return "versengő (gyors, határozott döntés)"
    if ugy >= 4 and kapcsolat >= 4:
        return "problémamegoldó (együttműködő)"
    if ugy >= 4:
        return "versengő"
    if kapcsolat >= 4:
        return "alkalmazkodó"
    if ugy <= 2 and kapcsolat <= 2:
        return "elkerülő"
    return "kompromisszumkereső"

helyzetek = [
    ("élesben leállt a szerver, vitatkoztok a teendőn", 5, 3, True),
    ("hosszú távú megrendelővel az architektúráról", 5, 5, False),
    ("a csapattárs a meetingterem színét választaná", 1, 4, False),
    ("egy idegen kommentel egy fórumon, hogy rossz a kódstílusod", 1, 1, False),
    ("ki vigye a demó előadását, mindkettőtöknek közepesen fontos", 3, 3, False),
]
for leiras, u, k, s in helyzetek:
    print(f"{leiras:<62} → {stilus(u, k, s)}")
```

A program persze leegyszerűsít, de a gondolkodásmódot mutatja: **először mérd fel**, mennyire fontos neked az ügy és a kapcsolat, és csak utána válassz. A gond általában az, hogy mindenki a **megszokott** stílusát használja mindenhol: az örökké alkalmazkodó kolléga a fontos ügyekben is enged, az örökké versengő pedig a meetingterem színén is vitatkozik.

## Összefoglalás

- Többtémás tárgyalásnál a „középen találkozunk” gyakran nem Pareto-hatékony; a cserealku (mindenki abban enged, ami neki kevésbé fontos) mindkét félnek jobb megállapodást adhat.
- A témákról egyszerre tárgyalj, és kérdezz az érdekekről – a tortát előbb növeld, csak utána oszd el.
- Az ismételt fogolydilemmában a kedvesen kezdő, de a kihasználásra reagáló és megbocsátó stratégia (szemet szemért) teljesít jól; a csapatmunka ismételt játék.
- A konfliktuskezelési stílust az ügy és a kapcsolat fontossága szerint válaszd, ne megszokásból.

## A lecke feladata

```quiz required
? A lecke pontozási táblája szerint hány pontot ér a megrendelőnek a „4 hét, 2,5 M Ft, 12 hónap” csomag?
= 85
! $40 + 15 + 30 = 85$.

? A fogolydilemmában te önző vagy, a másik együttműködik. Hány pontot kapsz ebben a körben?
= 5
! A táblázat szerint az önző lépés 5 pontot ér, ha a másik együttműködik.

? Mikor Pareto-hatékony egy megállapodás?
- ha mindkét fél ugyanannyi pontot kap
- ha mindenben középen találkoztak
+ ha nincs olyan másik megállapodás, amely legalább az egyik félnek jobb, és egyiknek sem rosszabb
- ha a megrendelő elfogadta
! Pareto-hatékony megállapodásból már nem lehet senkinek javítani a helyzetén úgy, hogy a másiké ne romoljon.

? Mit lép a „szemet szemért” stratégia az első körben?
+ együttműködik
- önző
- véletlenszerűen választ
- kihagyja a kört
! Kedvesen kezd, utána a másik előző lépését utánozza.

? A kapcsolat nagyon fontos neked, az ügy viszont jelentéktelen (pl. a meetingterem színe). Melyik stílus illik ide?
- versengő
- elkerülő
+ alkalmazkodó
- problémamegoldó
! Fontos kapcsolat, kevéssé fontos ügy → alkalmazkodó.
```

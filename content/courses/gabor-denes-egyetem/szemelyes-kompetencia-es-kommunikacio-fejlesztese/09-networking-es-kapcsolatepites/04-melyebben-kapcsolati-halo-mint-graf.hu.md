---
title: Mélyebben – a kapcsolati háló mint gráf
summary: A kapcsolati háló gráfként – ki tud bemutatni kinek (szélességi keresés), hány embert érsz el két lépésben, miért értékesek a „hidak” két csoport között (a gyenge kötések számokkal), mennyi időt kér a kapcsolatok ápolása, és hogyan „hűl ki” egy kapcsolat – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan írható le a kapcsolati háló **gráfként**, és hogyan találd meg a legrövidebb **bemutatási láncot**,
- hány embert érsz el **másodfokú** kapcsolatokon keresztül,
- miért különlegesen értékesek a csoportokat összekötő **hidak**,
- mennyi **időt** kér a kapcsolatok ápolása, és mikor érdemes jelentkezni.

## 1. Ki tud bemutatni? Legrövidebb út a gráfban

Egy kapcsolati háló **gráf**: a csúcsok emberek, az élek ismeretségek. Szeretnél gyakornoki helyet egy cégnél, ahol Eszter dolgozik – de nem ismered őt. Ki tud bemutatni? A **szélességi keresés** (BFS) a legrövidebb láncot találja meg: először a közvetlen ismerőseidet nézi, aztán az ő ismerőseiket, és így tovább.

```python run
# Kapcsolati háló gráfként: legrövidebb bemutatási lánc szélességi kereséssel
from collections import deque

ismeretsegek = {
    "Te": ["Ádám", "Bori", "Csaba"],
    "Ádám": ["Te", "Dóra"],
    "Bori": ["Te", "Csaba", "Gergő"],
    "Csaba": ["Te", "Bori"],
    "Dóra": ["Ádám", "Eszter", "Feri"],
    "Gergő": ["Bori", "Feri"],
    "Feri": ["Dóra", "Gergő", "Eszter"],
    "Eszter": ["Dóra", "Feri"],
}

def lanc(kezdo, cel):
    elozo = {kezdo: None}
    sor = deque([kezdo])
    while sor:
        most = sor.popleft()
        if most == cel:                         # visszafejtjük az utat
            ut = []
            while most:
                ut.append(most)
                most = elozo[most]
            return ut[::-1]
        for szomszed in ismeretsegek[most]:
            if szomszed not in elozo:
                elozo[szomszed] = most
                sor.append(szomszed)
    return None

print(" → ".join(lanc("Te", "Eszter")))
masodfoku = {b for a in ismeretsegek["Te"] for b in ismeretsegek[a]} - set(ismeretsegek["Te"]) - {"Te"}
print(f"közvetlen ismerős: {len(ismeretsegek['Te'])}, másodfokú: {sorted(masodfoku)}")
```

A program szerint Ádám bemutat Dórának, aki bemutat Eszternek. A gyakorlatban ez így néz ki: megkérdezed Ádámot, ismer-e valakit a cégnél; ő megkeresi Dórát, aki – mivel egy ismerőse kéri – szívesen továbbít egy rövid bemutatkozást. Egy ilyen **ajánlott** megkeresés sokkal nagyobb eséllyel kap választ, mint egy hideg üzenet.

**Másodfokú kapcsolatok:** ha 100 ismerősöd van, és mindegyiküknek további 100, akkor elvben 10 000 embert érsz el két lépésben. A valóságban kevesebbet, mert az ismerőseid egymást is ismerik (**átfedés**) – de még így is több ezer emberről van szó. A LinkedIn „2. fokú kapcsolat” jelölése pontosan ezt mutatja.

## 2. Hidak: a gyenge kötések ereje számokkal

Az alapleckében láttuk Granovetter megfigyelését: az új állásokról gyakran a **gyenge kötéseken** (ismerősök, volt csoporttársak) keresztül hallunk, nem a közeli barátoktól. Miért? Mert a közeli barátaink **ugyanazt** tudják, amit mi – ugyanabban a csoportban mozgunk. A gyenge kötés viszont gyakran **híd** egy másik csoport felé.

Ezt meg is mérhetjük: két baráti kör (egyetemi csoport és egy meetup-csapat) között egyetlen ember, Lili a kapcsolat. Számoljuk meg, hány legrövidebb út megy át rajta!

```python run
# Hídszerep: hány pár közti legrövidebb út halad át egy adott emberen? (egyszerűsített köztiségi mutató)
from collections import deque
from itertools import combinations

halo = {
    "Anna": ["Bence", "Cili", "Lili"], "Bence": ["Anna", "Cili"], "Cili": ["Anna", "Bence"],
    "Lili": ["Anna", "Máté"],                                   # Lili a híd
    "Máté": ["Lili", "Nóra", "Olivér"], "Nóra": ["Máté", "Olivér"], "Olivér": ["Máté", "Nóra"],
}

def ut(a, b):
    elozo, sor = {a: None}, deque([a])
    while sor:
        x = sor.popleft()
        for y in halo[x]:
            if y not in elozo:
                elozo[y] = x
                sor.append(y)
    lepesek, x = [], b
    while x:
        lepesek.append(x)
        x = elozo[x]
    return lepesek[::-1]

atmeno = {szemely: 0 for szemely in halo}
for a, b in combinations(halo, 2):
    for kozbulso in ut(a, b)[1:-1]:                  # a két végpont nem számít
        atmeno[kozbulso] += 1
for szemely, db in sorted(atmeno.items(), key=lambda t: -t[1]):
    print(f"{szemely:<7} {db:>2} legrövidebb út halad át rajta")
```

Lili (és a két csoport „kapuja”, Anna és Máté) rengeteg úton ül, pedig neki csak **két** ismerőse van. Bence, Cili, Nóra és Olivér egyetlen úton sem. Ez a hídszerep: aki két csoport között áll, az **információ** és a **lehetőségek** áramlásának útjába kerül – ő hall először a másik csoport álláshirdetéseiről, projektjeiről. A tanulság számodra:

- Ne csak a saját szakos csoportodban építs kapcsolatokat: egy **meetup**, egy **hackathon**, egy **nyílt forrású projekt** vagy egy másik szak hallgatói új csoportokba visznek.
- Te magad is lehetsz híd: ha két ismerősöd hasznos lehet egymásnak, **mutasd be őket** – ez az „adok-kapok” egyik legértékesebb formája.

## 3. Mennyi idő a kapcsolatok ápolása?

Az alapleckében láttuk Dunbar rétegeit: kb. **5** közeli, **15** jó, **50** baráti és **150** tartós, értelmes kapcsolatot tudunk egyszerre fenntartani. Számoljunk egy egyszerű időkerettel: mennyi idő havonta, ha rétegenként más gyakorisággal és hosszan keresed az embereket?

```python run
# Kapcsolatápolás időkerete: rétegenként hány ember, milyen gyakran, hány perc egy kontaktus
retegek = [  # (réteg, emberek száma, kontaktus havonta, perc/kontaktus)
    ("közeli", 5, 4, 60),
    ("jó ismerős", 10, 1, 30),
    ("szakmai kapcsolat", 35, 0.25, 15),     # negyedévente egy üzenet vagy kávé
    ("tágabb kör", 100, 1 / 12, 5),         # évente egy rövid üzenet
]
ossz = 0
for nev, db, gyakorisag, perc in retegek:
    havi = db * gyakorisag * perc
    ossz += havi
    print(f"{nev:<18} {db:>3} fő → {havi:5.0f} perc/hó")
print(f"összesen: {ossz / 60:.1f} óra/hó, kb. {ossz / 60 / 4.3:.1f} óra/hét")
```

A tágabb kör (100 ember) fenntartása havonta alig **42 percbe** kerül, ha évente egyszer írsz nekik egy rövid, személyes üzenetet (gratulálsz egy új munkahelyhez, megosztasz egy cikket, ami eszedbe juttatta őket). A közeli kapcsolatok viszont a legtöbb időt kérik – és ez rendben van.

## 4. Mikor jelentkezz? A kapcsolat „kihűlése”

Egy kapcsolat kontaktus nélkül fokozatosan **kihűl**: egy idő után már kínos megkeresni valakit, akivel évek óta nem beszéltél – főleg, ha épp segítséget kérnél. Egy egyszerű szemléltető modell szerint a kapcsolat „melegsége” exponenciálisan csökken, $T$ hónapos jellemző idővel:

```plot
title: Egy kapcsolat „melegsége” kontaktus nélkül (szemléltető modell)
x: 0, 36
y: 0, 1
param: T = 12, 2, 36, 1
f: exp(-x/T) # melegség x hónap után
dash: 0.5 # félúton kihűlt
```

Ha $T = 12$ hónap, a melegség kb. **8 hónap** alatt feleződik ($T \cdot \ln 2$). A tanulság: **akkor jelentkezz, amikor még nem kell semmi** – egy rövid gratuláció vagy „rád gondoltam, láttam ezt a cikket” üzenet visszaállítja a kapcsolatot, és ha később segítséget kérsz, az már nem lesz kínos.

> A modell csak szemléltet: egy mély barátság évekig is kibírja a csendet, egy egyszeri konferencia-ismeretség viszont hetek alatt elfelejtődik. A $T$ értékét a kapcsolat erőssége határozza meg.

## Összefoglalás

- A kapcsolati háló gráf; a legrövidebb bemutatási láncot szélességi kereséssel lehet megtalálni, és az ajánlott megkeresés sokkal hatásosabb a hidegnél.
- A másodfokú kapcsolatok száma a közvetlenek számának nagyjából a négyzete (az átfedés csökkenti).
- A csoportokat összekötő hidakon sok legrövidebb út halad át: ők hallanak először az új lehetőségekről – lépj be új csoportokba, és mutasd be egymásnak az ismerőseidet.
- A tágabb kapcsolatok ápolása kevés időt kér; jelentkezz, amikor még nincs szükséged semmire.

## A lecke feladata

```quiz required
? A lecke első gráfjában hány lépésben (hány élen át) éred el Esztert a legrövidebb úton?
= 3
! Te → Ádám → Dóra → Eszter: 3 él.

? 5 közvetlen ismerősöd van, mindegyiküknek további 4 ismerőse (rajtad kívül), és nincs átfedés. Hány másodfokú kapcsolatod van?
= 20
! $5 \cdot 4 = 20$.

? Miért értékes egy „híd” két csoport között?
- mert neki van a legtöbb ismerőse
+ mert sok legrövidebb út halad át rajta, így a másik csoport információi és lehetőségei rajta keresztül érnek el
- mert ő a csoport vezetője
- mert ő a legaktívabb a közösségi médiában
! Lilinek csak két ismerőse volt, mégis rajta ment át a legtöbb út.

? A lecke időkerete szerint a 100 fős tágabb kör ápolása évi egy 5 perces üzenettel számolva hány percet igényel havonta? (egészre kerekítve)
= 42
! $100 \cdot \frac{1}{12} \cdot 5 \approx 41{,}7 \approx 42$ perc.

? Mikor a legjobb felvenni a kapcsolatot egy régi ismerőssel?
- csak akkor, ha segítség kell
+ akkor, amikor még nincs szükséged semmire, egy rövid, személyes üzenettel
- soha, mert az kínos
- csak az ünnepek előtt, sablonüzenettel
! Így később a segítségkérés sem lesz kínos.
```

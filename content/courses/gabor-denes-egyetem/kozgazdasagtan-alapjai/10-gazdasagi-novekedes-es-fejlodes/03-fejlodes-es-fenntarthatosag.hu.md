---
title: Fejlődés, egyenlőtlenség és fenntarthatóság
summary: A növekedés nem minden: a humán fejlettségi index (HDI), a jövedelmi egyenlőtlenség mérése (Lorenz-görbe, Gini-együttható), a szegénység, a fenntartható fejlődési célok, a zöld növekedés és a szén-dioxid-kibocsátás ára.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **növekedés** és a **fejlődés** között,
- mit mér a **humán fejlettségi index** (HDI),
- hogyan mérjük az **egyenlőtlenséget** (Lorenz-görbe, Gini-együttható),
- mit jelent a **fenntartható fejlődés**,
- hogyan kezelhető közgazdaságilag a **klímaváltozás** (szén-dioxid ára).

## Növekedés és fejlődés

- A **növekedés** mennyiségi: több termelés (reál GDP).
- A **fejlődés** minőségi: jobb egészség, oktatás, intézmények, életminőség, szabadság. Amartya Sen (Nobel-díj, 1998) szerint a fejlődés a **képességek** és a választási lehetőségek bővülése.

A kettő általában együtt jár, de nem mindig: egy olajexportőr ország GDP-je nőhet úgy is, hogy a lakosság többsége nem fejlődik.

## A humán fejlettségi index (HDI)

Az ENSZ Fejlesztési Programja (UNDP) által számolt **HDI** három dimenziót összegez 0 és 1 közötti értékben:

| Dimenzió                | Mutató                                   |
| ----------------------- | ---------------------------------------- |
| hosszú, egészséges élet | születéskor várható élettartam           |
| tudás                   | átlagos és várható iskolai évek          |
| tisztes életszínvonal   | egy főre jutó GNI (vásárlóerő-paritáson) |

Magyarország a „nagyon magas” fejlettségű országok közé tartozik.

## Egyenlőtlenség

### A Lorenz-görbe

Sorba rendezzük a háztartásokat jövedelem szerint, és ábrázoljuk, hogy a népesség alsó $x$ része a jövedelmek hányad részét kapja.

```plot
title: Lorenz-görbe
x: 0, 1
y: 0, 1
param: k = 2, 1, 5, 0.25
f: x # tökéletes egyenlőség
f: x^k # Lorenz-görbe
area: x - x^k @ 0, 1
value: Gini-együttható = (k - 1) / (k + 1)
```

- Tökéletes egyenlőségnél a görbe az **átló** (a népesség 20%-a kapja a jövedelem 20%-át).
- Minél jobban „belóg” a görbe, annál nagyobb az egyenlőtlenség.

### A Gini-együttható

A **Gini-együttható** az átló és a Lorenz-görbe közötti terület kétszerese: **0** = tökéletes egyenlőség, **1** = egyetlen ember kap mindent. A jóléti európai országokban 0,25–0,30 körüli (Magyarországon 0,28–0,30 körül), az USA-ban 0,4 körüli, egyes latin-amerikai és afrikai országokban 0,5 feletti.

Az ábrán a **k** csúszka a Lorenz-görbe alakját változtatja; az $x^k$ alakú görbénél a Gini $(k-1)/(k+1)$.

### Miért számít az egyenlőtlenség?

- a túl nagy egyenlőtlenség csökkentheti a lehetőségek egyenlőségét (oktatás, egészség), és ronthatja a társadalmi bizalmat,
- némi egyenlőtlenség viszont ösztönöz (a tanulás, a vállalkozás, az innováció megtérül),
- az állam az **adókkal és transzferekkel** csökkenti (5. témakör) – a vita a mértékről szól.

## Szegénység

- **Abszolút szegénység:** a létfenntartáshoz szükséges minimum alatt élők (a Világbank mérőszáma napi kb. 3 dollár vásárlóerő-paritáson). Aránya a világban 1990 óta drámaian csökkent, főleg Kelet- és Dél-Ázsia növekedése miatt.
- **Relatív szegénység:** a mediánjövedelem 60%-a alatt élők (az EU-s mérőszám).

## Fenntartható fejlődés

A **fenntartható fejlődés** a Brundtland-jelentés (1987) szerint olyan fejlődés, amely kielégíti a jelen szükségleteit anélkül, hogy veszélyeztetné a jövő generációk lehetőségeit.

Az ENSZ **17 fenntartható fejlődési célja** (SDG, 2015–2030) többek között: a szegénység és az éhezés felszámolása, minőségi oktatás, nemek közötti egyenlőség, tiszta energia, tisztességes munka és gazdasági növekedés, éghajlatvédelem.

## A klímaváltozás mint externália

A szén-dioxid-kibocsátás **negatív externália** (1. témakör): a kibocsátó nem fizeti meg a kárt, amit okoz – ezért a piac **túl sokat** termel belőle. Közgazdasági megoldások:

- **szén-dioxid-adó:** a kibocsátás árat kap, a szennyező fizet,
- **kibocsátás-kereskedelem (cap and trade):** az állam meghatározza a teljes kibocsátási keretet, a cégek egymással kereskedhetnek a kvótákkal. Az EU kibocsátás-kereskedelmi rendszere (**EU ETS**) 2005 óta működik,
- **támogatás** a zöld technológiáknak (napelem, akkumulátor, hőszivattyú),
- **szabályozás** (pl. a belső égésű motoros új autók uniós kivezetése).

A **zöld növekedés** célja, hogy a GDP úgy nőjön, hogy közben a kibocsátás csökkenjen (**szétválás**, _decoupling_). Az EU-ban és Magyarországon is az 1990-es évek óta csökken a kibocsátás, miközben a GDP nőtt.

## Összefoglalás

- Növekedés: mennyiségi; fejlődés: minőségi (egészség, oktatás, szabadság).
- HDI: várható élettartam, iskolázottság, egy főre jutó GNI.
- Egyenlőtlenség: Lorenz-görbe, Gini (0 = egyenlő, 1 = teljesen egyenlőtlen).
- Fenntartható fejlődés: a jövő generációk lehetőségeinek megőrzése; 17 SDG.
- A CO₂ negatív externália: szén-dioxid-adó, kibocsátás-kereskedelem, támogatás, szabályozás.

## A lecke feladata

```quiz required
? Melyik **nem** a HDI három dimenziója közül való?
- várható élettartam
- iskolázottság
- egy főre jutó jövedelem
+ a katonai kiadások aránya
! A három: egészség, tudás, életszínvonal.

? Mit jelent a 0-s Gini-együttható?
+ tökéletes egyenlőség
- tökéletes egyenlőtlenség
- nincs jövedelem
- a mérés hibás
! Mindenki ugyanannyit kap.

? Az ábrán k = 3. Mennyi a Gini-együttható?
= 0,5
= 0.5
= 1/2
! (3 − 1) / (3 + 1).

? Mi a kibocsátás-kereskedelem (cap and trade) lényege?
- a szennyezés teljes tiltása
+ az állam rögzíti a teljes kibocsátási keretet, a kvótákkal kereskedni lehet
- minden cég ugyanannyit szennyezhet ingyen
- csak a háztartásokat érinti
! Az EU ETS 2005 óta működik.

? Miért **negatív externália** a szén-dioxid-kibocsátás?
- mert drága a mérése
+ mert a kibocsátó nem fizeti meg az általa okozott kárt
- mert az állam bocsátja ki
- mert közjószág
! A költség egy részét mások (és a jövő generációk) viselik.
```

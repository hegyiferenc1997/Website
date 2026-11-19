---
title: Mélyebben – a beszéd és a testbeszéd elemzése
summary: Beszédtempó és töltelékszavak mérése egy előadás leiratából, miért félrevezető egyetlen testbeszédjelből következtetni (alapviselkedés és Bayes-szemlélet), és hogyan olvassák ugyanazt a jelet különböző kultúrák – kis programokkal és interaktív ábrával.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan **mérd meg** a saját beszédedet (tempó, töltelékszavak, mondathossz),
- miért **nem lehet** egyetlen testbeszédjelből gondolatot olvasni,
- mi az **alapviselkedés** (baseline), és miért ehhez képest figyeljük a változást,
- hogyan **értelmezik másképp** ugyanazt a jelet más kultúrákban.

## 1. A beszéd mérése: tempó és töltelékszavak

A paraverbális jelekről (tempó, hangerő, szünet) könnyű általánosságokat mondani, de a fejlődéshez **mérni** érdemes. Vegyél fel egy 2 perces próbaelőadást a telefonoddal, gépeltesd le (a legtöbb jegyzetelő app tud leiratot készíteni), és elemezd egy kis programmal:

```python run
# Beszédelemzés egy leiratból: tempó, töltelékszavak és mondathossz
import re

leirat = """Szóval a projektünk egy órarendtervező alkalmazás. Hát igazából az volt a cél,
hogy a hallgatók könnyebben össze tudják rakni az órarendjüket. Ugye mindenki ismeri azt,
amikor két óra ütközik. Izé, szóval a backend Pythonban készült, a frontend pedig Reactben.
Az adatbázis PostgreSQL. A legnagyobb kihívás az ütközések gyors ellenőrzése volt,
mert egy félévben akár több száz kurzus is lehet. Hát ezt végül egy rendezett listával
oldottuk meg, ami sokkal gyorsabb lett. Igazából ennyi, köszönöm."""
perc = 0.45                                   # a felvétel hossza percben (27 másodperc)

szavak = re.findall(r"\w+", leirat.lower())
toltelek = {"szóval", "hát", "igazából", "ugye", "izé"}
talalat = [s for s in szavak if s in toltelek]
mondatok = [m for m in re.split(r"[.!?]", leirat) if m.strip()]

print(f"szavak száma: {len(szavak)}, tempó: {len(szavak) / perc:.0f} szó/perc")
print(f"töltelékszavak: {len(talalat)} db ({len(talalat) / len(szavak):.1%}) – {sorted(set(talalat))}")
print(f"átlagos mondathossz: {len(szavak) / len(mondatok):.1f} szó")
```

Hogyan értelmezd az eredményt?

- **Tempó**: magyarul a nyugodt, jól követhető előadás nagyjából **120–150 szó/perc**. Izgalomban a legtöbben gyorsítanak – ha 170 fölött vagy, tudatosan tarts szüneteket a mondatok végén.
- **Töltelékszavak**: néhány teljesen természetes, de ha minden tizedik szó „szóval”, „hát” vagy „igazából”, a hallgató ezeket kezdi számolni a tartalom helyett. A legjobb ellenszer a **csendes szünet**: a töltelékszó helyére egyszerűen hallgass el egy pillanatra.
- **Mondathossz**: élőszóban a **rövidebb mondatok** jobban követhetők, mint írásban – egy 30 szavas mondat végére a hallgató elfelejti az elejét.

Számoljunk a tempóval! Egy 10 perces előadásra szánt szöveg hossza a tempótól függ:

```plot
title: Az előadás hossza (perc) a szöveg hosszának (szó) függvényében
x: 0, 2000
y: 0, 16
param: v = 140, 100, 200, 5
f: x / v # előadás hossza percben
dash: 10 # 10 perces idősáv
```

Ha 140 szó/perccel beszélsz, a 10 perces sávba kb. **1400 szó** fér. Ha az izgalomtól 180-ra gyorsulsz, ugyanaz a szöveg 7,8 perc alatt elfogy – vagy ha 100-ra lassítasz a kérdések miatt, 14 percig tart. Ezért a kész szövegnél **10–15%-kal rövidebbet** tervezz.

## 2. Testbeszéd: miért nem lehet gondolatot olvasni?

Népszerű cikkek szerint a karba tett kéz „elutasítást”, az orr megérintése „hazugságot” jelent. A kutatások ezt nem támasztják alá: egyetlen jelnek **sok oka** lehet. A karba tett kéz jelentheti, hogy valaki fázik, kényelmesen ül, koncentrál – vagy tényleg ellenkezik.

A Bayes-tétel megmutatja, miért csalóka egy jel. Tegyük fel, hogy egy prezentáción a hallgatók **20%-a** valóban nem ért egyet veled. Közülük **60%** teszi karba a kezét, de az egyetértők közül is **30%** (hideg van a teremben, így kényelmes):

```python run
# Bayes-szemlélet: mennyire árulkodó egy testbeszédjel?
def utolagos(alap, jel_ha_igaz, jel_ha_hamis):
    # P(egyet nem ért | karba tett kéz)
    igaz = alap * jel_ha_igaz
    hamis = (1 - alap) * jel_ha_hamis
    return igaz / (igaz + hamis)

# több, egymástól független jel egymás után (karba tett kéz, elfordulás, egyszavas válaszok)
p = 0.20
for i, (jel_igaz, jel_hamis) in enumerate([(0.60, 0.30), (0.50, 0.15), (0.70, 0.20)], 1):
    p = utolagos(p, jel_igaz, jel_hamis)
    print(f"{i}. jel után: {p:.0%}")
```

Egyetlen jelből csak **33%** az esélye, hogy valaki tényleg nem ért egyet – kétszer annyi eséllyel téved, aki „leolvassa” a karba tett kézből. Ha viszont **több jel együtt** jelenik meg (karba tett kéz, elfordulás, egyszavas válaszok), az esély már **85% körül** van. Ez a **jelcsoportok** (clusters) elve: soha ne egyetlen jelből következtess.

> A modell egyszerűsít: a valóságban a jelek nem teljesen függetlenek. A tanulság mégis érvényes – egy jel csak gyanú, több jel együtt már információ.

## 3. Az alapviselkedés (baseline)

Van, aki mindig keveset mosolyog, mindig gyorsan beszél, vagy mindig karba teszi a kezét. Nála ezek a jelek **semmit sem jelentenek**, mert ez az **alapviselkedése**. Az árulkodó a **változás** az alapviselkedéshez képest:

| Helyzet                                                                               | Következtetés                                                 |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Péter mindig halkan, rövid mondatokban beszél a meetingeken.                          | Ez az alapviselkedése, nem jelent érdektelenséget.            |
| Zsófi általában lelkes és sokat kérdez, de ma csendes, és kamera nélkül csatlakozott. | Változás: érdemes négyszemközt megkérdezni, minden rendben-e. |
| A megrendelő eddig minden javaslatnál bólogatott, most hosszan hallgat, és jegyzetel. | Változás: lehet, hogy kételyei vannak – kérdezz rá nyíltan.   |

A legjobb „testbeszédolvasás” tehát nem a jelek szótára, hanem: **figyeld meg az alapot, vedd észre a változást, és kérdezz** („Úgy látom, ez a rész kevésbé győzött meg – mi a véleményed?”).

## 4. Egy jel, több kultúra

Ugyanaz a nonverbális jel kultúránként mást jelenthet – egy nemzetközi csapatban vagy egy külföldi megrendelővel ez könnyen félreértést okoz:

| Jel                          | Egyik értelmezés                        | Másik értelmezés                                                                                  |
| ---------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| tartós szemkontaktus         | őszinteség, figyelem (pl. Észak-Európa) | tiszteletlenség egy idősebb vagy magasabb rangú féllel szemben (pl. több kelet-ázsiai kultúrában) |
| bólintás                     | „egyetértek”                            | „hallom, amit mondasz” – nem feltétlenül egyetértés                                               |
| hosszú csend egy kérdés után | zavar, elakadás                         | tisztelet és alapos mérlegelés (pl. Finnországban vagy Japánban)                                  |
| hüvelykujj fel               | „rendben”                               | egyes kultúrákban sértő gesztus                                                                   |

A nézőpontváltás itt is a kulcs: ha egy jel „furcsának” tűnik, először gondolj arra, hogy a másik fél **más szabályok szerint** kommunikál – és szükség esetén szóban is erősítsd meg a lényeget („Akkor ebben megegyeztünk?”). A 8. témakör részletesen foglalkozik a kulturális különbségekkel.

## Összefoglalás

- A saját beszéded mérhető: tempó (kb. 120–150 szó/perc), töltelékszavak aránya, mondathossz; a töltelékszó legjobb helyettesítője a szünet.
- Egyetlen testbeszédjel csak gyanú (Bayes-szemlélet); több jel együtt (jelcsoport) már információ.
- Az alapviselkedéshez képesti változás az árulkodó, nem maga a jel.
- Ugyanaz a jel kultúránként mást jelenthet; kétség esetén kérdezz és erősíts meg szóban.

## A lecke feladata

```quiz required
? Egy 1200 szavas előadásszöveget 150 szó/perc tempóban mondasz el. Hány percig tart?
= 8
! $1200 / 150 = 8$ perc.

? Egy 600 szavas leiratban 12 töltelékszó van. Hány töltelékszó jut 100 szóra?
= 2
! $12 / 600 \cdot 100 = 2$.

? A hallgatók 50%-a nem ért egyet. Az egyet nem értők 60%-a, az egyetértők 20%-a teszi karba a kezét. Mekkora eséllyel nem ért egyet valaki, aki karba tette a kezét? (tizedes törtként)
= 0,75
= 0.75
! $\frac{0{,}5 \cdot 0{,}6}{0{,}5 \cdot 0{,}6 + 0{,}5 \cdot 0{,}2} = \frac{0{,}3}{0{,}4} = 0{,}75$.

? Egy kolléga minden meetingen karba tett kézzel ül. Mit jelent ez valószínűleg?
- biztosan elutasítja a javaslatokat
+ az alapviselkedése, önmagában nem jelent semmit
- hazudik
- unatkozik
! Az alapviselkedéshez képesti változás az árulkodó, nem maga a jel.

? Egy külföldi partner hosszan hallgat a kérdésed után. Mi a legjobb reakció?
- azonnal megismételni a kérdést hangosabban
- arra következtetni, hogy nem ért egyet
+ hagyni időt a válaszra, mert sok kultúrában a csend a mérlegelés jele, és szükség esetén szóban rákérdezni
- témát váltani
! Ugyanaz a jel kultúránként mást jelenthet.
```

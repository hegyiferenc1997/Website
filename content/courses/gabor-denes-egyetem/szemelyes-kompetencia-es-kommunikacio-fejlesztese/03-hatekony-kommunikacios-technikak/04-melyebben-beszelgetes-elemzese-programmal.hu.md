---
title: Mélyebben – beszélgetések elemzése programmal
summary: Ki mennyit beszélt, és milyen kérdéseket tett fel? Egy követelményfelmérő interjú leiratának elemzése (beszédarány, nyitott és zárt kérdések), a te-üzenetek kiszűrése és átírása az erőszakmentes kommunikáció négy lépésével, és egy interjú két változata három nézőpontból – kis programokkal.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan **mérd meg**, mennyire hallgattál valóban egy beszélgetésben (beszédarány),
- hogyan **ismerd fel** programmal a nyitott és a zárt kérdéseket,
- hogyan írj át egy **te-üzenetet** a megfigyelés–érzés–szükséglet–kérés lépésekkel,
- hogyan néz ki ugyanaz az **interjú** jól és rosszul, több szemszögből.

## 1. Ki beszélt többet? A beszédarány

Egy **követelményfelmérő interjúban** (amikor a megrendelőtől megtudod, mit szeretne) az a cél, hogy **ő** beszéljen. Ökölszabály: a kérdező a beszélgetés legfeljebb **20–30%-át** töltse ki, a többit a megkérdezett. Ha te beszélsz többet, akkor nem felméred az igényeket, hanem a saját elképzelésedet adod el.

Egy leiratból ez könnyen mérhető:

```python run
# Beszédarány és kérdéstípusok egy interjú leiratából
import re

leirat = [
    ("Fejlesztő", "Milyen gondjaitok vannak most a foglalásokkal?"),
    ("Megrendelő", "Telefonon és e-mailben jönnek a foglalások, és gyakran kétszer adunk ki egy időpontot."),
    ("Fejlesztő", "Ez hetente hányszor fordul elő?"),
    ("Megrendelő", "Talán kétszer-háromszor, de olyankor az ügyfél nagyon dühös, és van, aki nem is jön vissza."),
    ("Fejlesztő", "Kell-e, hogy az ügyfél online is lemondhassa a foglalását?"),
    ("Megrendelő", "Igen."),
    ("Fejlesztő", "Mesélj, hogyan néz ki egy tipikus nap a recepción!"),
    ("Megrendelő", "Reggel átnézzük a napi listát, közben folyamatosan csörög a telefon, és papíron vezetjük a változásokat, amit este valaki bemásol a táblázatba."),
]

szavak = {}
for ki, mondat in leirat:
    szavak[ki] = szavak.get(ki, 0) + len(re.findall(r"\w+", mondat))
osszes = sum(szavak.values())
for ki, db in szavak.items():
    print(f"{ki:<10} {db:>3} szó ({db / osszes:.0%})")

nyitott_kezdet = ("mi", "milyen", "hogyan", "miért", "mesélj", "mit", "mikor")
for ki, mondat in leirat:
    if ki == "Fejlesztő":
        elso = re.findall(r"\w+", mondat.lower())[0]
        tipus = "nyitott" if elso in nyitott_kezdet else "zárt"
        print(f"  [{tipus:<7}] {mondat}")
```

Ebben a részletben a fejlesztő a szavak kb. **37%-át** mondta – pedig csak kérdezett! Ez a cél fölött van: rövid részletben még természetes, de egy hosszabb interjúban már arra utal, hogy túl sok és túl hosszú kérdés hangzik el, vagy a kérdező kommentál is. A kérdések fele **nyitott**, és ami a legfontosabb: a nyitott kérdések hozták a legtöbb információt (a papíron vezetett változások egy teljesen új igényt mutatnak meg: **szinkronizálás**). A zárt kérdésre („Kell-e…?”) egyetlen szó jött.

> A program egyszerű szabállyal dolgozik (az első szó alapján), ezért tévedhet: az „Ez hetente hányszor…?” kérdést például zártnak sorolja, mert az első szava „ez” – valójában egy számot kérdez, ami félig zárt kérdés. A magyar zárt kérdéseket gyakran a **-e** kérdőszócska jelzi („Kell-e…”, „Tudod-e…”). Egy valódi elemzésnél érdemes kézzel is átnézni a besorolást.

## 2. Az interjú két változata – három nézőpontból

**A változat (rossz):**

```text
Fejlesztő: Szóval csinálnánk egy webes foglalórendszert React-tel, push értesítéssel, meg
           egy admin felülettel. Az jó lenne, ugye?
Megrendelő: Hát... gondolom, igen.
Fejlesztő: Szuper! És kell bele naptár-szinkron is, nem?
Megrendelő: Ha ön szerint kell...
```

**B változat (jó):** az 1. pontban elemzett leirat.

| Nézőpont       | A változat                                                                                | B változat                                                                        |
| -------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Megrendelő** | Nem érti a szakszavakat, kínos nemet mondani, ezért rábólint. Úgy érzi, nem rá figyelnek. | Végre elmondhatja, mi fáj; úgy érzi, megértették.                                 |
| **Fejlesztő**  | Gyorsan „megvan a terv”, de vakon: nem tudja, mi a valódi probléma (a dupla foglalás).    | Lassabbnak tűnik, de kiderül egy rejtett igény (a papíros változások szinkronja). |
| **A projekt**  | Nagy esély, hogy olyat építenek, amire nincs szükség – később drága átírás.               | A fejlesztés a valódi problémát célozza; kevesebb meglepetés az átadáskor.        |

Az A változat hibái az alapleckékből ismerősek: **szakzsargon** (szemantikai zaj), **sugalmazó kérdés** („Az jó lenne, ugye?”), **zárt kérdések** sorozata, és a kérdező beszél többet. A „Ha ön szerint kell...” mondat pedig vészjel: a megrendelő **nem egyetért, hanem feladja**.

## 3. Te-üzenetből én-üzenet: az erőszakmentes kommunikáció

Marshall Rosenberg **erőszakmentes kommunikációja** (Nonviolent Communication, NVC) négy lépésben ír le egy asszertív üzenetet:

1. **Megfigyelés** – tény, ítélet nélkül: „A múlt héten kétszer került be a fő ágba teszt nélküli kód.”
2. **Érzés** – a saját érzésed: „Aggódom…”
3. **Szükséglet** – ami mögötte van: „…mert fontos, hogy a demó stabil legyen.”
4. **Kérés** – konkrét, teljesíthető: „Megkérnélek, hogy a merge előtt futtasd le a teszteket?”

A te-üzenetek árulkodó jelei a **minősítés** és az **általánosítás** („mindig”, „soha”, „megint”). Egy kis program megmutatja, hol kell átfogalmazni:

```python run
# Te-üzenetek árulkodó jelei: általánosítás és minősítés; javaslat az átírásra
import re

jelek = {
    r"\bmindig\b": "általánosítás – nevezz meg konkrét esetet",
    r"\bsoha\b": "általánosítás – nevezz meg konkrét esetet",
    r"\bmegint\b": "szemrehányás – írd le, mi történt",
    r"\b(hanyag|lusta|figyelmetlen)\w*": "minősítés – a viselkedést írd le, ne a személyt",
    r"\bmiért nem\b": "vádló kérdés – kérj inkább",
}

uzenetek = [
    "Megint nem futtattad le a teszteket, mindig te rontod el a buildet.",
    "Miért nem szóltál, hogy késik a feladat? Ez elég hanyag dolog.",
    "Tegnap a buildet két elbukó teszt állította meg; megkérnélek, hogy merge előtt futtasd le őket.",
]
for u in uzenetek:
    talalat = [magyarazat for minta, magyarazat in jelek.items() if re.search(minta, u.lower())]
    print(f"„{u}”")
    for t in talalat or ["rendben: tényt közöl és kér"]:
        print(f"   → {t}")
```

Az utolsó üzenet ugyanazt a problémát jelzi, de **tényt** mond (tegnap, két teszt), és **kér**. A másik fél így nem védekezni kezd, hanem megoldáson gondolkodik.

**Nézőpontváltás:** az NVC-t néha „mesterkéltnek” érzik – főleg, ha szó szerint, sablonosan mondják. A cél nem a négy lépés gépies elmondása, hanem a **gondolkodásmód**: válaszd szét a tényt az értelmezéstől, vállald a saját érzésedet, és kérj konkrétan. Egy tapasztalt kolléga ugyanezt egy természetes mondatban is el tudja mondani.

## Összefoglalás

- Igényfelmérésnél a kérdező beszéljen legfeljebb a szavak 20–30%-ában; a beszédarány egy leiratból könnyen mérhető.
- A nyitott kérdések hozzák az új információt; a zárt és a sugalmazó kérdések a saját elképzelésedet erősítik meg.
- Az én-üzenet (NVC) lépései: megfigyelés, érzés, szükséglet, kérés; a „mindig”, „soha”, „megint” és a minősítő szavak te-üzenetre utalnak.
- Ugyanaz a beszélgetés a megrendelő, a fejlesztő és a projekt szemszögéből egészen mást jelenthet.

## A lecke feladata

```quiz required
? Egy interjú leirata 1200 szó, ebből a kérdező 300 szót mondott. Hány százalékát beszélte ki a beszélgetésnek? (csak a számot írd)
= 25
! $300 / 1200 = 0{,}25 = 25\%$.

? Melyik a legjobb nyitó kérdés egy követelményfelmérő interjúban?
- „Kell-e mobilalkalmazás is?”
- „Ugye a React jó lesz?”
+ „Hogyan néz ki most egy foglalás az elejétől a végéig?”
- „Hány felhasználó lesz pontosan?”
! A nyitott kérdés hozza a legtöbb információt, és nem sugalmaz.

? Mi az erőszakmentes kommunikáció (NVC) négy lépésének helyes sorrendje?
+ megfigyelés, érzés, szükséglet, kérés
- érzés, kérés, megfigyelés, szükséglet
- kérés, megfigyelés, érzés, szükséglet
- szükséglet, érzés, kérés, megfigyelés
! Először a tény, utána a saját érzés és szükséglet, végül a konkrét kérés.

? Melyik mondat te-üzenet?
- „Tegnap két teszt bukott el a merge után.”
+ „Mindig te rontod el a buildet.”
- „Aggódom a demó miatt.”
- „Megkérnélek, hogy futtasd le a teszteket.”
! Általánosítás („mindig”) és minősítés.

? Az interjúban a megrendelő ezt mondja: „Ha ön szerint kell...” Mit jelez ez valószínűleg?
- lelkes egyetértést
+ hogy nem érti vagy nem meri vitatni a javaslatot, csak enged
- hogy pontosan tudja, mit akar
- hogy a fejlesztő jól kérdezett
! Ez nem egyetértés, hanem feladás – vissza kell térni a nyitott kérdésekhez.
```

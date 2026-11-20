---
title: Mélyebben – kultúrák és etikai döntések számokkal
summary: Közös munkaidő számítása egy három időzónás csapatban, miért nagyobb az egyének közti különbség egy kultúrán belül, mint a kultúrák átlaga között (eloszlások átfedése), és egy etikai dilemma elemzése három etikai elmélet szemszögéből – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan számold ki egy nemzetközi csapat **közös munkaidejét**, és mit tegyél, ha nincs,
- miért **félrevezető** egy kulturális átlagot egyetlen emberre alkalmazni,
- hogyan elemezz egy etikai dilemmát **három különböző etikai elmélet** szerint,
- miért segít egy **szakmai etikai kódex** a nehéz helyzetekben.

## 1. Időzónák: mennyi a közös munkaidő?

Egy nyílt forráskódú projekt három fő fejlesztője Budapesten, Bengaluruban (India) és San Franciscóban dolgozik, mindenki helyi idő szerint 9 és 17 óra között. Télen a helyi idő eltérése az egyezményes világidőtől (UTC): Budapest +1, Bengaluru +5,5, San Francisco −8 óra.

```python run
# Közös munkaidő három időzónában (fél órás felbontással, UTC-ben számolva)
csapat = {"Budapest": 1, "Bengaluru": 5.5, "San Francisco": -8}   # eltérés UTC-től (téli idő)
kezd, vege = 9, 17                                                # helyi munkaidő

def munkaido_utc(eltolas):
    # a munkaidő fél órás sávjai UTC-ben (0–47-ig számozva, a nap körbeér)
    return {int(((kezd - eltolas) * 2 + i) % 48) for i in range((vege - kezd) * 2)}

savok = {varos: munkaido_utc(e) for varos, e in csapat.items()}
varosok = list(csapat)
for i in range(len(varosok)):
    for j in range(i + 1, len(varosok)):
        kozos = savok[varosok[i]] & savok[varosok[j]]
        print(f"{varosok[i]} – {varosok[j]}: {len(kozos) / 2} óra közös munkaidő")
mindharom = savok["Budapest"] & savok["Bengaluru"] & savok["San Francisco"]
print(f"mindhárman: {len(mindharom) / 2} óra")
```

Budapest és Bengaluru között reggel 3,5 óra az átfedés, de **San Francisco** senkivel sem fedi le a munkaidőt (Budapestnél egy órával lemarad). Mit lehet tenni?

- **Aszinkron kommunikáció az alap**: írásos döntések, részletes jegyek, felvett demók – hogy senkinek ne kelljen éjjel ébren lennie az információért.
- **Forgó meetingidőpont**: ha élő megbeszélés kell, a kényelmetlen időpontot ne mindig ugyanaz a fél viselje.
- **Átadás a nap végén** („follow the sun”): aki befejezi a napot, rövid összefoglalót ír a következő időzónának.

> Figyelem: a nyári időszámítás az eltéréseket megváltoztatja – és nem mindenhol ugyanakkor kezdődik, Indiában pedig egyáltalán nincs. Ezért egy valódi naptárprogram időzóna-adatbázist használ, nem fix eltolásokat.

## 2. Kulturális átlag és egyén: az eloszlások átfedése

Az alapleckékben Hofstede dimenzióit tanultuk (pl. hatalmi távolság, individualizmus). Ezek **országos átlagok**, és itt jön a leggyakoribb hiba: egy átlagból következtetni egy **konkrét emberre**. Tegyük fel, hogy egy tulajdonság (pl. mennyire közvetlenül mond valaki kritikát) egy kultúrán belül normális eloszlású, és két kultúra átlaga között $d$ szórásnyi a különbség:

```plot
title: Két kultúra tagjainak eloszlása egy tulajdonság mentén
x: -4, 6
y: 0, 0.45
param: d = 1, 0, 4, 0.1
f: exp(-x^2/2)/sqrt(2*pi) # A kultúra
f: exp(-(x - d)^2/2)/sqrt(2*pi) # B kultúra
```

Húzd a csúszkát: még $d = 1$ szórásnyi különbségnél is – ami a társadalomtudományokban **nagy** különbségnek számít – a két görbe nagyrészt **átfedi** egymást. Számoljuk ki, mekkora az átfedés, és mekkora az esélye, hogy egy véletlenszerűen választott „A” kultúrabeli ember **közvetlenebb**, mint egy „B” kultúrabeli:

```python run
# Két normális eloszlás átfedése és a "fordított" párok aránya d szórásnyi különbségnél
from math import erf, sqrt

def fi(z):
    # a standard normális eloszlásfüggvény
    return 0.5 * (1 + erf(z / sqrt(2)))

for d in [0.2, 0.5, 1.0, 2.0]:
    atfedes = 2 * fi(-d / 2)                 # a két görbe alatti közös terület
    forditott = fi(-d / sqrt(2))             # P(egy A-beli > egy B-beli), ha B átlaga d-vel nagyobb
    print(f"d = {d}: átfedés {atfedes:.0%}, az esetek {forditott:.0%}-ában az 'A' ember a közvetlenebb")
```

Ha a különbség 1 szórásnyi, a két eloszlás **62%-ban** átfedi egymást, és az esetek **24%-ában** épp fordított a helyzet, mint amit a sztereotípia mondana. Vagyis: a kulturális dimenziók hasznosak arra, hogy **számíts** a különbségekre és **ne vedd személyesnek** őket – de egy konkrét kollégáról csak akkor tudsz meg valamit, ha **megismered őt**.

## 3. Egy etikai dilemma három szemszögből

Egy hallgatói vállalkozásban dolgozol, amely egy egészségügyi időpontfoglaló alkalmazást fejleszt. Két nappal a megrendelőnek tartott bemutató előtt kiderül, hogy egy ritka esetben (kb. ezerből egy foglalásnál) a rendszer **rossz orvoshoz** rendeli a beteget. A vezető ezt javasolja: „Ne szóljunk róla, a demón úgysem jön elő, utána csendben kijavítjuk.”

Három nagy etikai elmélet háromféle kérdést tesz fel:

| Elmélet                           | A kérdés                                                                | Mit mond itt?                                                                                                               |
| --------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **következményelvű** (haszonelvű) | Melyik lehetőség hozza a legtöbb jót és a legkevesebb kárt mindenkinek? | A titkolás rövid távon kényelmes, de ha élesben egy beteg rossz helyre megy, a kár (egészség, bizalom, per) sokkal nagyobb. |
| **kötelességetika** (deontológia) | Milyen szabályt, kötelességet sértünk?                                  | A megrendelőnek joga van tudni egy ismert, egészséget érintő hibáról; a megtévesztés önmagában helytelen.                   |
| **erényetika**                    | Mit tenne egy becsületes, felelős szakember?                            | Elmondaná a hibát, javaslatot hozna a javításra – így építené a hosszú távú bizalmat.                                       |

A következményelvű gondolkodás számokkal is szemléltethető. A súlyokat te adod meg – ez maga is etikai döntés:

```python run
# Következményelvű mérlegelés: várható haszon és kár lehetőségenként (szemléltető pontszámok)
lehetosegek = {
    # (név): [(valószínűség, hatás pontokban, kit érint)]
    "titkoljuk, utána csendben javítjuk": [
        (0.90, +10, "csapat: sima demó"),
        (0.10, -200, "beteg és megrendelő: a hiba élesben kijön, bizalomvesztés"),
    ],
    "elmondjuk a hibát és a javítási tervet": [
        (1.00, -5, "csapat: kínosabb demó"),
        (1.00, +15, "megrendelő: bízhat bennünk, tervezhet"),
    ],
}
for nev, hatasok in lehetosegek.items():
    varhato = sum(p * h for p, h, _ in hatasok)
    print(f"{nev:<40} várható érték: {varhato:+.1f}")
```

A titkolás várható értéke negatív (−11), mert egy kis valószínűségű, de **súlyos** kár is elég ahhoz, hogy felborítsa a mérleget. A két másik elmélet ugyanide jut, csak más úton – ez gyakori, és jó jel: ha mindhárom elmélet ugyanazt mondja, nyugodtan dönthetsz. Ha ellentmondanak egymásnak, az valódi dilemma, és érdemes másokkal is megbeszélni.

**Szakmai kódex mint kapaszkodó:** az ACM etikai kódexe (ACM Code of Ethics) kimondja, hogy a szakember kerülje a kárt, legyen őszinte és megbízható, és a nyilvánosság jólétét helyezze előtérbe. Egy ilyen kódexre hivatkozni a vezetővel szemben is könnyebb, mint a „szerintem ez nem helyes” érzésre: „A szakmai normák szerint az ismert, egészséget érintő hibát jelezni kell – javaslom, hogy mutassuk be a javítási tervet is, így profibbnak tűnünk.”

## Összefoglalás

- Egy nemzetközi csapat közös munkaideje UTC-re átszámolva könnyen kiszámolható; ha nincs átfedés, az aszinkron, írásos kommunikáció és a forgó meetingidőpont segít.
- A kulturális dimenziók átlagok: még nagy különbségnél is erősen átfedik egymást az eloszlások, ezért egy emberről csak a megismerése után tudsz következtetni.
- Egy etikai dilemma három kérdése: mi a legjobb következmény (haszonelvűség), milyen kötelességet sértünk (deontológia), mit tenne egy jó szakember (erényetika).
- A szakmai etikai kódex közös, hivatkozható mérce a nehéz helyzetekben.

## A lecke feladata

```quiz required
? Budapest UTC+1, New York UTC−5; mindkét helyen 9 és 17 óra között dolgoznak helyi idő szerint. Hány óra a közös munkaidő?
= 2
! UTC-ben Budapest 8–16, New York 14–22 óra között dolgozik; az átfedés 14–16, azaz 2 óra.

? Két kultúra átlaga között egy tulajdonságban nagy a különbség. Mit tudsz ebből egy konkrét kollégáról?
- pontosan, hogyan fog viselkedni
+ csak egy gyenge előzetes várakozást – az egyének közti különbség nagy, ezért meg kell ismerni őt
- hogy biztosan az átlagnak megfelelően viselkedik
- semmit, mert a kultúra nem létezik
! Az eloszlások még nagy különbségnél is erősen átfedik egymást.

? Melyik etikai elmélet kérdése: „Milyen szabályt, kötelességet sértünk meg?”
- következményelvű etika
+ kötelességetika (deontológia)
- erényetika
- egyik sem
! A deontológia a kötelességekre és szabályokra figyel, nem a következményekre.

? A titkolás esetén 90% eséllyel +10, 10% eséllyel −200 pont a hatás. Mennyi a várható érték?
= -11
! $0{,}9 \cdot 10 + 0{,}1 \cdot (-200) = 9 - 20 = -11$.

? Nincs közös munkaidő a csapat két tagja között. Mi a legjobb gyakorlat?
- minden döntést élő hívásban hozni, éjszaka is
+ aszinkron, írásos kommunikáció (döntések, jegyek, napvégi összefoglaló), és ha kell, forgó meetingidőpont
- a távoli kollégát kihagyni a döntésekből
- csak e-mailt küldeni válasz nélkül
! Az aszinkron kommunikáció az alap, a kényelmetlen időpontot ne mindig ugyanaz viselje.
```

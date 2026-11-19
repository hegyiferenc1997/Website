---
title: Mélyebben – a PM-eszközök adatai programmal
summary: Eszközválasztás súlyozott mátrixszal és érzékenységvizsgálattal (melyik súlynál fordul a döntés?), egy Jira-szerű munkafolyamat mint állapotgép a szabálytalan átmenetek kiszűrésével, és Kanban-mutatók (átfutási idő, 85. percentilis, heti áteresztőképesség) jegyadatokból – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan vizsgáld meg, mennyire **stabil** egy súlyozott mátrixos eszközválasztás,
- hogyan írható le egy jegy-munkafolyamat **állapotgépként**, és hogyan ellenőrzi ezt egy eszköz,
- hogyan számold ki a PM-eszközből exportált adatokból a legfontosabb **Kanban-mutatókat**.

## 1. Eszközválasztás: mikor fordul a döntés?

Két eszközt hasonlítunk össze négy szempont szerint (1–5 pont). A „funkciók” súlya vitatott: a fejlesztők fontosnak tartják, a vezetés kevésbé. Nézzük meg, hogyan függ a győztes ettől a súlytól (a többi szempont súlya arányosan osztozik a maradékon):

```python run
# Súlyozott értékelő mátrix érzékenységvizsgálattal: hogyan függ a győztes a "funkciók" súlyától?
pontok = {
    "A (Jira-szerű)":   {"funkciók": 5, "ár": 2, "integrációk": 5, "egyszerűség": 2},
    "B (Trello-szerű)": {"funkciók": 3, "ár": 5, "integrációk": 3, "egyszerűség": 5},
}
tobbi = {"ár": 0.3, "integrációk": 0.3, "egyszerűség": 0.4}   # a maradék súly felosztása

def pontszam(eszkoz, w):
    p = pontok[eszkoz]
    return w * p["funkciók"] + (1 - w) * sum(s * p[k] for k, s in tobbi.items())

for w in [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]:
    a, b = pontszam("A (Jira-szerű)", w), pontszam("B (Trello-szerű)", w)
    print(f"funkciók súlya {w:.0%}: A = {a:.2f}, B = {b:.2f} → {'A' if a > b else 'B'} nyer")

# A fordulópont: 2,9 + 2,1w = 4,4 − 1,4w
print(f"\nfordulópont: w = {1.5 / 3.5:.1%}")
```

Ha a funkciók súlya **43%** alatt van, az egyszerűbb, olcsóbb B nyer, fölötte a sokoldalú A. Ez a szám sokkal hasznosabb a vitában, mint egyetlen végeredmény: ha mindenki egyetért, hogy a funkciók súlya legfeljebb 30%, a döntés **stabil** (B), és nem kell tovább vitatkozni. Ha a vélemények a fordulópont két oldalán vannak, érdemes egy kísérleti (pilot) csapattal mindkettőt kipróbálni.

```plot
title: A két eszköz pontszáma a „funkciók” súlyának függvényében
x: 0, 1
y: 2, 5
f: 2.9 + 2.1*x # A (Jira-szerű)
f: 4.4 - 1.4*x # B (Trello-szerű)
point: 0.4286, 3.8 # fordulópont
```

## 2. A munkafolyamat mint állapotgép

Egy Jira-szerű eszközben a jegyek **állapotok** között mozognak, de nem tetszőlegesen: a munkafolyamat (_workflow_) megadja, melyik **átmenet** engedélyezett. Ez egy **állapotgép**:

```python run
# Jegy-munkafolyamat állapotgépként: csak az engedélyezett átmenetek hajthatók végre
atmenetek = {
    "Új":           {"Folyamatban", "Elutasítva"},
    "Folyamatban":  {"Ellenőrzés", "Új"},
    "Ellenőrzés":   {"Kész", "Folyamatban"},      # az ellenőrzésből vissza lehet küldeni
    "Kész":         set(),                        # végállapot
    "Elutasítva":   set(),
}

def ellenoriz(tortenet):
    allapot = tortenet[0]
    for kovetkezo in tortenet[1:]:
        if kovetkezo not in atmenetek[allapot]:
            return f"szabálytalan átmenet: {allapot} → {kovetkezo}"
        allapot = kovetkezo
    return f"rendben, végállapot: {allapot}"

jegyek = {
    "WEB-101": ["Új", "Folyamatban", "Ellenőrzés", "Folyamatban", "Ellenőrzés", "Kész"],
    "WEB-102": ["Új", "Folyamatban", "Kész"],
    "WEB-103": ["Új", "Elutasítva", "Folyamatban"],
}
for jegy, tortenet in jegyek.items():
    print(f"{jegy}: {ellenoriz(tortenet)}")
```

A WEB-102 kihagyta a kódellenőrzést – a munkafolyamat ezt nem engedi, így a minőségbiztosítási szabályt **az eszköz kényszeríti ki**, nem az emberek jóindulata. A WEB-103-at elutasították, majd mégis elkezdték: ezt is tiltja a folyamat (újra kellene nyitni egy külön átmenettel, amelyet naplóz a rendszer). A WEB-101 kétszer is visszakerült az ellenőrzésből – ez nem hiba, de ha sok jegynél előfordul, érdemes megnézni, miért (pl. nem egyértelműek az elfogadási feltételek).

## 3. Kanban-mutatók jegyadatokból

A PM-eszközökből a jegyek történetét exportálni lehet. Az **átfutási idő** (_cycle time_) a munka megkezdésétől a befejezésig tart. Az átlag mellett a **85. percentilis** a hasznos: „a jegyek 85%-a ennyi idő alatt elkészül” – ez jó alap egy ígérethez.

```python run
# Kanban-mutatók: átfutási idő jegyenként, átlag, 85. percentilis és heti áteresztőképesség
from datetime import date

jegyek = [  # (azonosító, munka kezdete, befejezés)
    ("WEB-101", date(2026, 10, 1), date(2026, 10, 6)), ("WEB-104", date(2026, 10, 2), date(2026, 10, 4)),
    ("WEB-105", date(2026, 10, 2), date(2026, 10, 12)), ("WEB-106", date(2026, 10, 5), date(2026, 10, 8)),
    ("WEB-107", date(2026, 10, 6), date(2026, 10, 9)), ("WEB-108", date(2026, 10, 7), date(2026, 10, 21)),
    ("WEB-109", date(2026, 10, 9), date(2026, 10, 13)), ("WEB-110", date(2026, 10, 12), date(2026, 10, 15)),
    ("WEB-111", date(2026, 10, 13), date(2026, 10, 19)), ("WEB-112", date(2026, 10, 14), date(2026, 10, 16)),
]
idok = sorted((vege - kezd).days for _, kezd, vege in jegyek)
print("átfutási idők (nap):", idok)
print(f"átlag: {sum(idok) / len(idok):.1f} nap")
p85 = idok[int(0.85 * len(idok) + 0.5) - 1]           # egyszerű percentilis: a 85%-os sorszámú elem
print(f"85. percentilis: {p85} nap")

hetek = {}
for _, _, vege in jegyek:
    het = vege.isocalendar()[1]                        # az ISO-hét sorszáma
    hetek[het] = hetek.get(het, 0) + 1
print("befejezett jegyek hetente:", dict(sorted(hetek.items())))
```

Az átlag 5 nap körül van, de a jegyek 85%-a csak kb. 10 nap alatt készül el – az egy-két „beragadt” jegy (WEB-105, WEB-108) erősen széthúzza az eloszlást. Ezért ígérjünk percentilis alapján („egy átlagos jegy kb. 10 napon belül kész”), és vizsgáljuk meg a kiugró jegyeket: miért ragadtak be? (Gyakori ok: függőség egy másik csapattól, vagy egy túl nagy, fel nem bontott feladat.) A legtöbb Kanban-eszköz ezeket a mutatókat automatikusan rajzolja (_cycle time scatterplot_, _throughput chart_) – de most már tudod, mi van mögöttük.

## Összefoglalás

- A súlyozott mátrix eredményét érdemes érzékenységvizsgálattal ellenőrizni: hol a fordulópont, és a vélemények melyik oldalon vannak?
- A jegy-munkafolyamat állapotgép: az engedélyezett átmenetek kényszerítik ki a folyamatszabályokat (pl. kötelező kódellenőrzés).
- Kanban-mutatók: átfutási idő jegyenként, átlag és 85. percentilis, heti áteresztőképesség; az ígéret a percentilisre épüljön.

## A lecke feladata

```quiz required
? Két eszköz pontszáma: A = 3 + 2w, B = 4 − w, ahol w egy szempont súlya. Melyik w-nél egyenlő a két pontszám? (tizedes törtként)
= 0,33
= 0.33
= 1/3
! $3 + 2w = 4 - w \Rightarrow 3w = 1 \Rightarrow w = \frac13 \approx 0{,}33$.

? A lecke munkafolyamatában melyik átmenet szabálytalan?
- Ellenőrzés → Folyamatban
- Új → Elutasítva
+ Folyamatban → Kész
- Ellenőrzés → Kész
! A „Folyamatban” állapotból csak az ellenőrzésre (vagy vissza az újba) lehet lépni.

? Egy jegy munkáját október 3-án kezdték, és október 10-én fejezték be. Hány nap az átfutási ideje?
= 7
! $10 - 3 = 7$ nap.

? 20 jegy átfutási ideje növekvő sorrendben ismert. Hányadik elem a 85. percentilis (az egyszerű módszerrel)?
= 17
! $0{,}85 \cdot 20 = 17$.

? Miért jobb a 85. percentilisre építeni egy ígéretet, mint az átlagra?
- mert mindig kisebb az átlagnál
+ mert a kiugró, beragadt jegyek miatt az átlag félrevezető, a percentilis viszont megmondja, a jegyek mekkora része készül el adott idő alatt
- mert a Kanban tiltja az átlag használatát
- mert az átlagot nem lehet kiszámolni
! „A jegyek 85%-a ennyi idő alatt kész” – ez egy kezelhető kockázatú ígéret.
```

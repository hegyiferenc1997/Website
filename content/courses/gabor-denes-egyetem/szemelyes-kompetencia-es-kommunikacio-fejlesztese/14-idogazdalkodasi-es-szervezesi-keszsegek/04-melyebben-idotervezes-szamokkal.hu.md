---
title: Mélyebben – időtervezés számokkal
summary: A tervezési tévedés és a saját becslésed korrekciós szorzója, a heti kapacitás és a tartalék kiszámolása, a feladatok sorrendjének hatása (rövidebb előbb vagy közelebbi határidő előbb?), és egy vizsgaidőszak megtervezése három nézőpontból – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- mi a **tervezési tévedés**, és hogyan javítsd a saját becsléseidet adatokkal,
- hogyan számold ki, mennyi **szabad kapacitásod** van egy héten, és mennyi tartalék kell,
- hogyan függ a feladatok **sorrendjétől**, hogy mennyit késel,
- hogyan tervezz meg egy **vizsgaidőszakot** reálisan.

## 1. A tervezési tévedés és a korrekciós szorzó

Daniel Kahneman és Amos Tversky írta le a **tervezési tévedést**: rendszeresen alábecsüljük, mennyi időbe telik egy feladat – akkor is, ha tudjuk, hogy a korábbi hasonló feladatok is tovább tartottak. A jó hír: ez a torzítás **mérhető és javítható**. Jegyezd fel néhány héten át, mennyire becsültél egy feladatot, és mennyi ideig tartott valójában:

```python run
# Tervezési tévedés: a saját becslések korrekciós szorzója a múltbeli adatokból
from statistics import median

naplo = [  # (feladat, becslés órában, valós idő órában)
    ("programozás házi 1", 2, 3.5),
    ("adatbázis gyakorló feladatsor", 3, 4.5),
    ("prezentáció elkészítése", 4, 6),
    ("matek feladatlap", 2, 2.5),
    ("beadandó esszé", 5, 9),
    ("jegyzet összeállítása a vizsgára", 3, 4.5),
]
aranyok = [valos / becsles for _, becsles, valos in naplo]
szorzo = median(aranyok)                       # a medián kevésbé érzékeny a kiugró esetekre
print("arányok:", [round(a, 2) for a in aranyok])
print(f"korrekciós szorzó (medián): {szorzo:.2f}\n")

uj_feladatok = [("hálózatok labor jegyzőkönyv", 3), ("szakdolgozati témaötletek", 2)]
for nev, becsles in uj_feladatok:
    print(f"{nev:<30} becslés {becsles} óra → reális terv: {becsles * szorzo:.1f} óra")
```

A naplód szerint a feladataid a becsült idő kb. **1,5-szeresét** viszik el. Ez nem jellemhiba – mindenki így működik –, de ha tudod, **beépítheted** a tervbe. Ezt hívják „külső nézőpontnak”: ne azt kérdezd, szerinted mennyi ideig tart, hanem azt, hogy **a hasonló feladatok mennyi ideig tartottak**.

> Miért a medián és nem az átlag? Egy-egy kiugró eset (pl. amikor a beadandónál elromlott a géped) nagyon elhúzná az átlagot. A medián a „tipikus” arányt mutatja.

## 2. Mennyi időm van valójában? A heti kapacitás

Egy héten 168 óra van, de ebből nagyon sok **kötött**: alvás, órák, utazás, étkezés, munka. Számoljuk ki, mennyi marad a tanulásra és a projektekre – és mennyit érdemes ebből valóban betervezni:

```python run
# Heti kapacitás: kötött idők levonása, tartalék, és a tervezett feladatok összevetése
het = 7 * 24
kotott = {"alvás": 7 * 7.5, "órák és labor": 22, "utazás": 8, "étkezés, háztartás": 14,
          "részmunkaidős munka": 20, "sport, pihenés, barátok": 16}
szabad = het - sum(kotott.values())
tartalek_arany = 0.2                            # váratlan dolgokra
tervezheto = szabad * (1 - tartalek_arany)
print(f"kötött: {sum(kotott.values())} óra, szabad: {szabad} óra, tervezhető (20% tartalékkal): {tervezheto:.1f} óra")

szorzo = 1.5                                    # a saját korrekciós szorzód
feladatok = {"programozás házi": 4, "adatbázis projekt": 6, "matek gyakorlás": 3, "esszé": 4, "vizsgára készülés": 5}
igeny = sum(feladatok.values()) * szorzo
print(f"feladatok becsült ideje: {sum(feladatok.values())} óra, korrigálva: {igeny:.1f} óra")
print("✓ belefér" if igeny <= tervezheto else f"⚠ túlvállalás: {igeny - tervezheto:.1f} órával több, mint a kapacitás")
```

A becslés szerint a 22 óra feladat kényelmesen belefér a 28,4 órás tervezhető időbe – de ha a korrekciós szorzót is figyelembe veszed, **33 óra** a valós igény, ez **4,6 órával több**, mint ami van. Ilyenkor három lehetőséged van: **elhagyni** valamit (melyik a legkevésbé fontos? – Eisenhower-mátrix), **csökkenteni** a hatókört (jó, de nem tökéletes megoldás), vagy **áttenni** egy másik hétre. A rossz megoldás az, ha a pihenésből és az alvásból veszel el – az a következő hetekben visszaüt.

## 3. Számít a sorrend?

Három beadandód van, mindegyiknek más a hossza és a határideje. Milyen sorrendben csináld? Két klasszikus ütemezési szabály:

- **SPT** (shortest processing time): a **legrövidebb** feladat először – így a legtöbb feladat a lehető leghamarabb kész (kicsi az átlagos befejezési idő).
- **EDD** (earliest due date): a **legközelebbi határidejű** először – így a legkisebb a legnagyobb késés.

```python run
# Ütemezés: legrövidebb előbb (SPT) vs. legközelebbi határidő előbb (EDD)
feladatok = [  # (név, időigény nap, határidő: hányadik napon kell leadni)
    ("esszé", 4, 5),
    ("labor jegyzőkönyv", 1, 7),
    ("projektdokumentáció", 3, 4),
    ("gyakorló feladatsor", 2, 9),
]

def ertekel(sorrend):
    ido, kesesek, befejezesek = 0, [], []
    for nev, hossz, hatarido in sorrend:
        ido += hossz
        befejezesek.append(ido)
        kesesek.append(max(0, ido - hatarido))
    return sum(befejezesek) / len(befejezesek), max(kesesek), sum(1 for k in kesesek if k > 0)

for nev, kulcs in [("SPT (legrövidebb előbb)", lambda f: f[1]), ("EDD (határidő előbb)", lambda f: f[2])]:
    sorrend = sorted(feladatok, key=kulcs)
    atlag, max_keses, keso_db = ertekel(sorrend)
    print(f"{nev:<24} {' → '.join(f[0] for f in sorrend)}")
    print(f"{'':<24} átlagos befejezési idő: {atlag:.1f} nap, legnagyobb késés: {max_keses} nap, késő feladatok: {keso_db}")
```

Az SPT szerint a kis feladatok gyorsan lekerülnek a listáról (ez **motivál**), és az átlagos befejezési idő is kisebb – de az esszé **5 napot** késik. Az EDD-vel ugyan három feladat is késik, de egyik sem több **2 napnál** – ha egy nagy késés súlyos következménnyel jár (pl. el sem fogadják a beadandót), ez a fontosabb. A tanulság: a sorrend **célfüggő**. Határidős munkánál az EDD a jó alapszabály; ha nincsenek kemény határidők, és a lendület számít, az SPT segít. Az is látszik: ha az összes feladat nem fér bele a határidőkbe, egyik sorrend sem segít – az ütemezés csak elosztja a késést, eltüntetni nem tudja. Ilyenkor újra kell tárgyalni a határidőt, vagy szűkíteni kell a hatókört.

## 4. Egy vizsgaidőszak, három nézőpont

Négy vizsgád van három hét alatt. Hogyan tervezd meg?

| Nézőpont                                | Mit mond?                                                                                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **„Legközelebbi vizsga először”** (EDD) | Mindig arra tanulj, ami a legközelebb van. Egyszerű, de a későbbi, nehéz vizsgák anyaga az utolsó napokra marad.                                 |
| **Kapacitás és nehézség szerint**       | Becsüld meg minden vizsgához a szükséges órát (a korrekciós szorzóval!), és oszd el visszafelé a vizsganapoktól; a nehéz tárgyat korán kezdd el. |
| **A tanulás tudománya** (15. témakör)   | Ne egy tárgyat „blokkban” tanulj napokig: az elosztott ismétlés és a tárgyak váltogatása (interleaving) hosszabb távon jobb eredményt ad.        |

A gyakorlatban a három nézőpont **kombinációja** működik a legjobban: a kapacitásszámítás megmondja, belefér-e minden; a nehéz tárgyakat korán elkezded; a napokat két-három tárgy között osztod meg; és a vizsga előtti utolsó napot az aktuális tárgy **ismétlésére** tartod. Az **ábra** azt mutatja, mennyi idő kell egy adott anyagmennyiséghez a korrekciós szorzótól függően:

```plot
title: Szükséges tanulási idő (óra) a becsült idő függvényében
x: 0, 30
y: 0, 60
param: k = 1.5, 1, 2.5, 0.1
f: k*x # korrigált (reális) idő
f: x # az eredeti becslés
dash: 40 # a vizsgaidőszakra szánt órák
```

Ha 25 órát becsültél, 1,5-ös szorzóval 37,5 óra a reális igény – ez még belefér a 40 órába. 2-es szorzóval viszont már 50 óra kellene: ilyenkor **korábban kell kezdeni**.

## Összefoglalás

- A tervezési tévedés mérhető: a múltbeli valós és becsült idők arányának mediánja a korrekciós szorzód; a becsléseket ezzel szorozd.
- A heti kapacitás = 168 óra − kötött idők; ebből kb. 20% tartalékot hagyj, és vesd össze a korrigált feladatigénnyel.
- A sorrend számít: a legrövidebb előbb (SPT) az átlagos befejezési időt, a legközelebbi határidő előbb (EDD) a legnagyobb késést minimalizálja.
- Egy vizsgaidőszak tervezésekor a kapacitásszámítás, a nehéz tárgyak korai kezdése és az elosztott ismétlés együtt működik.

## A lecke feladata

```quiz required
? Három korábbi feladatodnál a becslés 2, 4 és 5 óra volt, a valós idő 3, 6 és 7,5 óra. Mennyi a korrekciós szorzód (a három arány mediánja)? (tizedes törtként)
= 1,5
= 1.5
! Mindhárom arány $1{,}5$, így a medián is $1{,}5$.

? Ugyanezzel a szorzóval mennyi időt tervezz egy 6 órásra becsült feladatra (órában)?
= 9
! $6 \cdot 1{,}5 = 9$ óra.

? Egy héten 30 óra szabad időd van, és 20% tartalékot hagysz. Hány órát tervezhetsz be feladatokra?
= 24
! $30 \cdot 0{,}8 = 24$ óra.

? Három feladat: 1, 2 és 3 nap hosszú, határidő nincs. Melyik sorrend adja a legkisebb átlagos befejezési időt?
+ 1 → 2 → 3 napos (legrövidebb előbb)
- 3 → 2 → 1 napos (leghosszabb előbb)
- 2 → 3 → 1 napos
- mindegy, mindegyik ugyanannyi
! Befejezések: 1, 3, 6 → átlag 3,33 nap; fordítva 3, 5, 6 → átlag 4,67 nap.

? A korrigált feladatigény 12 órával több a heti kapacitásodnál. Melyik a legrosszabb megoldás?
- egy kevésbé fontos feladat elhagyása
- a hatókör szűkítése
- egy feladat áttétele a következő hétre
+ az alvásból és a pihenésből elvenni a hiányzó időt
! Ez a következő hetekben visszaüt: fáradtabban lassabban és rosszabbul dolgozol.
```

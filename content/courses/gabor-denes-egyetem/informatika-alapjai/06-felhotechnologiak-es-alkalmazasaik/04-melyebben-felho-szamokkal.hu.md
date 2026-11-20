---
title: Mélyebben – a felhő számokkal
summary: Saját szerver vagy felhő – mikor melyik olcsóbb, hogyan nő a rendelkezésre állás több szerverrel, mit mond Little törvénye egy Kanban-tábláról, és hogyan torzít egy levágott tengelyű diagram – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan számold ki, mikor **olcsóbb** a felhő a saját szervernél, és mikor fordítva,
- miért **megbízhatóbb** a szolgáltatás több szerverrel, és mekkora a nyereség,
- mit árul el egy Kanban-tábla a **várakozási időről** (Little törvénye),
- hogyan ismerd fel számokkal a **megtévesztő diagramot**.

## 1. Saját szerver vagy felhő?

Egy kis csapat webalkalmazást indít. Két lehetőség van: vesznek egy szervert (egyszeri költség + áram + karbantartás), vagy bérelnek a felhőben (havidíj, a használat arányában). Melyik olcsóbb? **Attól függ, mennyit használják**:

```python run
# Saját szerver vs. felhő: havi költség a kihasználtság függvényében (feltevések, Ft)
szerver_ar = 1_200_000               # egyszeri, 3 év alatt "használódik el"
szerver_havi = szerver_ar / 36 + 25_000   # értékcsökkenés + áram, hálózat, karbantartás
felho_ora = 120                      # Ft óránként egy hasonló virtuális gépre

for kihasznaltsag in [0.1, 0.25, 0.5, 0.75, 1.0]:
    felho_havi = felho_ora * 24 * 30 * kihasznaltsag   # csak akkor fizetsz, amikor fut
    olcsobb = "felhő" if felho_havi < szerver_havi else "saját szerver"
    ft = lambda x: f"{x:>8,.0f}".replace(",", " ")     # magyar ezres tagolás
    print(f"{kihasznaltsag:4.0%} időben fut: felhő {ft(felho_havi)} Ft, saját {ft(szerver_havi)} Ft → {olcsobb}")
```

A felhő akkor nyer, ha a gép **csak néha** kell (egy egyetemi projekt, egy kampányoldal, éjszakai számítások), vagy ha a terhelés **ingadozik**, és hirtelen tízszer annyi gép kell. A folyamatosan, teljes terheléssel futó rendszereknél a saját (vagy hosszú távra lefoglalt) gép lehet olcsóbb. A pénz mellett **más nézőpontok** is számítanak: a saját szerverhez ember kell, aki frissíti és megjavítja; a felhőnél viszont függsz a szolgáltatótól, és az adataid egy másik cég gépén vannak.

## 2. Rendelkezésre állás: miért jobb két szerver, mint egy?

Ha egy szerver az idő 99%-ában működik, a szolgáltatás évente kb. 3,7 napig áll. Ha **két** egymástól független szerver van, és elég, ha az egyik működik, a szolgáltatás csak akkor áll, ha **mindkettő** egyszerre hibás:

$$A_n = 1 - (1 - a)^n$$

```plot
title: A szolgáltatás rendelkezésre állása (%) a független szerverek számának függvényében
x: 1, 4
y: 90, 100
param: a = 0.95, 0.8, 0.999, 0.005
f: 100*(1 - (1 - a)^x) # legalább egy szerver működik
dash: 99.9 # "három kilences"
```

```python run
# Redundancia: éves leállás egy, két és három független szerverrel
for a in [0.95, 0.99]:
    for n in [1, 2, 3]:
        A = 1 - (1 - a) ** n
        print(f"egy szerver {a:.0%}, {n} szerver: {A:.6%} → évente {(1 - A) * 365 * 24:8.2f} óra leállás")
```

Egy 99%-os szerverrel évente kb. 88 óra a leállás, kettővel kb. 53 perc, hárommal fél perc. **De** a képlet feltétele, hogy a hibák **függetlenek**: ha a két szerver ugyanabban a teremben, ugyanazon az áramkörön van, egy áramszünet mindkettőt leállítja. Ezért helyezik a felhőszolgáltatók a gépeket külön **rendelkezésre állási zónákba** (külön épület, áram, hálózat).

## 3. Kanban és Little törvénye

Az alapleckében láttuk a Kanban-táblát (Teendő – Folyamatban – Kész). Little törvénye egy egyszerű, de meglepően hasznos összefüggés:

$$\text{átlagos átfutási idő} = \frac{\text{folyamatban lévő munkák száma}}{\text{átlagos átbocsátás}}$$

Ha a csapatnál átlagosan 12 kártya van „Folyamatban”, és hetente 4 lesz kész, egy új feladat átlagosan **3 hét** alatt ér végig. Ha korlátozzák a párhuzamos munkák számát (**WIP-korlát**), az átfutás rövidül:

```python run
# Little törvénye: átfutási idő = folyamatban lévő munka / átbocsátás
atbocsatas = 4                               # kész kártya hetente
for wip in [12, 8, 4]:
    print(f"{wip:>2} kártya folyamatban, heti {atbocsatas} kész → átlagos átfutás {wip / atbocsatas:.1f} hét")

# egy valódi tábla naplójából: mikor került "Folyamatban"-ba és mikor lett kész (nap)
kartyak = [(1, 4), (1, 9), (2, 5), (3, 12), (5, 8), (6, 10)]
atfutas = [kesz - kezd for kezd, kesz in kartyak]
print(f"mért átfutási idők: {atfutas}, átlag {sum(atfutas) / len(atfutas):.1f} nap")
```

Ez a csapat **nézőpontja** mellett a megrendelőé is: ha valaki megkérdezi, „mikor lesz kész az új funkció?”, a mért átfutási időkből becsülhetsz, nem a hasadból.

## 4. Megtévesztő diagramok számokkal

Az alapleckében volt szó a megtévesztő ábrákról. Az egyik leggyakoribb trükk a **levágott függőleges tengely**: ha a tengely nem nulláról indul, egy kis különbség óriásinak látszik. Számoljuk ki, mennyire:

```python run
# Levágott tengely: a látszólagos és a valódi arány
a, b = 92, 96                                # két termék elégedettségi pontja (%)
for tengely_alja in [0, 50, 90]:
    lathato_a, lathato_b = a - tengely_alja, b - tengely_alja
    print(f"tengely {tengely_alja}-tól: B oszlopa {lathato_b / lathato_a:.2f}-szer magasabbnak látszik (valójában {b / a:.2f}-szer)")
```

Ha a tengely 90-ről indul, a 4 pontos (kb. 4%-os) különbség **háromszoros** magasságkülönbségnek látszik. Egy jól megtervezett oszlopdiagram ezért **nulláról indul**; ha mégis a különbséget akarod kiemelni, mutasd meg egyértelműen a tengely kezdőértékét, vagy válassz más diagramtípust (pl. pontdiagramot).

| Nézőpont                    | Mi számít neki a felhőnél?                                      |
| --------------------------- | --------------------------------------------------------------- |
| **pénzügy**                 | havidíj kontra beruházás, kiszámítható költség                  |
| **üzemeltetés**             | kevesebb hardverkarbantartás, de új eszközök és fiókok kezelése |
| **biztonság / adatvédelem** | hol vannak az adatok (EU?), ki fér hozzájuk, titkosítás         |
| **csapat**                  | közös dokumentumok, valós idejű együttműködés bárhonnan         |

## Összefoglalás

- A felhő akkor olcsóbb, ha a gépet csak időnként használod vagy ingadozik a terhelés; folyamatos, teljes terhelésnél a saját gép lehet kedvezőbb.
- $n$ független szerverrel a rendelkezésre állás $1 - (1-a)^n$, de csak akkor, ha a hibák valóban függetlenek (külön zónák).
- Little törvénye: átfutási idő = folyamatban lévő munka / átbocsátás – a WIP-korlát rövidíti az átfutást.
- A levágott tengely felnagyítja a különbségeket; az oszlopdiagram tengelye nulláról induljon.

## A lecke feladata

```quiz required
? Két független szerver mindegyike 90%-ban működik. Hány százalék a szolgáltatás rendelkezésre állása, ha elég az egyik?
= 99
! $1 - 0{,}1^2 = 0{,}99$.

? Egy csapatnál átlagosan 10 kártya van folyamatban, és hetente 5 lesz kész. Hány hét az átlagos átfutási idő?
= 2
! $10 / 5 = 2$ hét.

? Egy virtuális gép óradíja 100 Ft. Mennyibe kerül egy 30 napos hónapban, ha csak az idő negyedében fut (Ft)?
= 18000
! $100 \cdot 24 \cdot 30 \cdot 0{,}25 = 18\,000$ Ft.

? Miért nem feltétlenül 99,99%-os a rendelkezésre állás két 99%-os szerverrel?
- mert a képlet rossz
+ mert ha ugyanazon a helyen, ugyanazon az áramon vannak, a hibáik nem függetlenek
- mert két szerver mindig lassabb
- mert a felhő nem engedi
! Ezért vannak a gépek külön rendelkezésre állási zónákban.

? Egy oszlopdiagram tengelye 90-ről indul, az értékek 92 és 96. Mi a gond vele?
- semmi
+ a kis különbség sokszorosnak látszik, ezért megtévesztő
- túl sok a szín
- hiányzik a cím
! Az oszlopdiagram tengelye nulláról induljon.
```

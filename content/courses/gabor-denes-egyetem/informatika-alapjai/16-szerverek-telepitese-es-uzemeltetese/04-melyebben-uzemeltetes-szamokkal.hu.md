---
title: Mélyebben – üzemeltetés számokkal
summary: Hány szerver kell egy adott forgalomhoz, és miért lassul be egy szerver jóval 100% előtt (sorbanállás), mekkora eséllyel vész el adat egy RAID 5 tömbben az újraépítés alatt, miért a 95. percentilis a jó mérőszám a válaszidőre, és hány mentést tart meg egy forgatási rend – kis programokkal és interaktív ábrával.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- hogyan **méretezz** egy szolgáltatást a várható forgalomhoz,
- miért lassul be egy szerver **drámaian**, amikor a terhelése 80–90% fölé megy,
- mennyire **véd** valójában a RAID, és mikor nem elég,
- hogyan **mérd** a válaszidőt (átlag helyett percentilissel), és hogyan tervezz **mentési** rendet.

## 1. Méretezés: hány szerver kell?

Egy egyetemi tárgyfelvételi rendszer a jelentkezés első percében hirtelen nagy forgalmat kap. Ha tudjuk, hány kérés érkezik másodpercenként, és egy szerver mennyit bír, kiszámolhatjuk a szükséges gépek számát – **tartalékkal** együtt:

```python run
# Méretezés: hány szerver kell a csúcsforgalomhoz, tartalékkal és egy gép kiesésével számolva
from math import ceil

hallgatok = 12_000
aktiv_arany = 0.4                   # a csúcspercben ennyien kattintgatnak
keres_per_fo_perc = 6               # kérés percenként egy aktív felhasználótól
szerver_kapacitas = 150             # kérés/másodperc, amit egy szerver kényelmesen bír
cel_kihasznaltsag = 0.7             # nem akarjuk 100%-ra terhelni (lásd a következő részt)

csucs = hallgatok * aktiv_arany * keres_per_fo_perc / 60
szukseges = ceil(csucs / (szerver_kapacitas * cel_kihasznaltsag))
print(f"csúcsforgalom: {csucs:.0f} kérés/s")
print(f"szükséges szerver 70%-os kihasználtsággal: {szukseges}")
print(f"+1 tartalék (N+1), ha egy gép kiesik: {szukseges + 1}")
```

Az **N+1** elv azt jelenti, hogy egy gép kiesése (vagy karbantartása) esetén is elbírja a rendszer a csúcsot. A felhőben a gépek számát **automatikusan** is lehet növelni a terheléssel (autoscaling) – a fenti számítás akkor is kell, hogy tudd, milyen határokat állíts be, és mennyibe fog kerülni.

## 2. Miért lassul be egy szerver 100% előtt?

Egy szerver olyan, mint egy pénztár a boltban: ha a kérések véletlenszerűen érkeznek, akkor is kialakul **sor**, ha átlagosan van szabad kapacitás. A sorbanállás-elmélet legegyszerűbb modellje szerint az átlagos válaszidő:

$$T = \frac{S}{1 - \rho}$$

ahol $S$ egy kérés kiszolgálási ideje, $\rho$ pedig a kihasználtság (0 és 1 között).

```plot
title: Átlagos válaszidő (ms) a szerver kihasználtságának (%) függvényében
x: 0, 98
y: 0, 500
param: s = 20, 5, 50, 5
f: s/(1 - x/100) # T = S / (1 − ρ), S = s ms
dash: 100 # 100 ms: ennél lassabbnak érzi a felhasználó
```

```python run
# Válaszidő a kihasználtság függvényében: T = S / (1 - ρ)
S = 20                                       # ms, egy kérés kiszolgálása
for rho in [0.5, 0.7, 0.8, 0.9, 0.95, 0.99]:
    print(f"{rho:4.0%} kihasználtság: átlagos válaszidő {S / (1 - rho):6.0f} ms")
```

50%-nál a válaszidő kétszerese a kiszolgálási időnek, 90%-nál tízszerese, 99%-nál százszorosa. Ezért nem tervezünk 100%-os kihasználtságra: a **görbe a végén elszáll**, és egy kis forgalomnövekedés is drámai lassulást okoz. Ez a pénztáros, a call center és az autópálya esetében is ugyanígy működik.

## 3. Mennyire véd a RAID?

Az alapleckében láttuk, hogy a RAID 5 egy lemez kiesését elviseli. De ha egy lemez kiesik, a tömböt **újra kell építeni** – ez nagy lemezeknél akár egy-két napig tart, és ez alatt a maradék lemezek **mindegyikét** végig kell olvasni. Ha közben egy második lemez is meghibásodik, minden adat elvész:

```python run
# Adatvesztés esélye a RAID-újraépítés alatt (egyszerű modell, független hibákkal)
from math import comb

afr = 0.02                                   # egy lemez éves meghibásodási aránya (2%)
ujraepites_nap = 2                           # ennyi ideig tart az újraépítés

def masodik_hiba(maradek_lemez, tures):
    p_nap = afr / 365 * ujraepites_nap       # egy lemez meghibásodásának esélye az újraépítés alatt
    # annak esélye, hogy legalább "tures" további lemez is kiesik
    return sum(comb(maradek_lemez, k) * p_nap**k * (1 - p_nap)**(maradek_lemez - k) for k in range(tures, maradek_lemez + 1))

for nev, lemezek, tures in [("RAID 5, 4 lemez", 4, 1), ("RAID 5, 12 lemez", 12, 1), ("RAID 6, 12 lemez", 12, 2)]:
    p = masodik_hiba(lemezek - 1, tures)
    print(f"{nev:<17} újraépítés alatti adatvesztés esélye: {p:.5%}")
```

A modell szerint a kockázat a lemezek számával nő (12 lemeznél majdnem négyszer akkora, mint 4-nél), és a **RAID 6** (két lemez is kieshet) nagyságrendekkel biztonságosabb. A valóságban a kockázat **nagyobb**, mint a modell mutatja: az azonos sorozatból, azonos időben vett lemezek gyakran egyszerre öregszenek, és az újraépítés terhelése is növeli a hiba esélyét – a független hibák feltételezése itt optimista. És a legfontosabb: **a RAID nem mentés** – a véletlen törlés vagy a zsarolóvírus ellen nem véd.

## 4. Válaszidő mérése: miért nem elég az átlag?

Egy weboldal átlagos válaszideje 120 ms – ez jól hangzik. De mi van, ha a kérések 5%-a 2 másodpercig tart? Ezek a felhasználók azt élik meg, hogy „lassú az oldal”. Ezért az üzemeltetők **percentiliseket** figyelnek: a **p95** az az érték, amelynél a kérések 95%-a gyorsabb.

```python run
# Válaszidők: átlag, medián, p95 és p99 egy napló alapján
import random
from statistics import mean, quantiles

random.seed(9)
idok = [random.gauss(80, 15) for _ in range(950)] + [random.uniform(800, 2500) for _ in range(50)]   # 5% lassú kérés
q = quantiles(idok, n=100)                  # 99 vágópont: q[49] a medián, q[94] a p95
print(f"átlag:  {mean(idok):6.0f} ms")
print(f"medián: {q[49]:6.0f} ms")
print(f"p95:    {q[94]:6.0f} ms")
print(f"p99:    {q[98]:6.0f} ms")

# riasztási szabály: ha a p95 egy határ fölé megy
hatar = 500
print("RIASZTÁS: a p95 a határ felett!" if q[94] > hatar else "rendben")
```

Az átlag (kb. 160 ms) elrejti, hogy minden huszadik kérés másodpercekig tart; a p95 és a p99 megmutatja. A **monitorozás** nézőpontjából ezért a riasztás a percentilisekre épül, és a szolgáltatási szint (SLA/SLO) is gyakran így fogalmaz: „a kérések 95%-a 300 ms alatt.”

## 5. Mentési rend: mennyi mentést tartsunk meg?

Egy gyakori forgatási rend a **nagyapa–apa–fiú** (GFS): naponta készül mentés, ebből az utolsó 7 napot tartjuk meg; a heti mentésekből 4-et; a havikból 12-t. Így egy évre visszamenőleg is van mentés, mégsem kell 365 példányt tárolni:

```python run
# Nagyapa–apa–fiú mentési rend: hány mentés van, és milyen régre lehet visszamenni?
napi, heti, havi = 7, 4, 12
print(f"tárolt mentések: {napi + heti + havi} (365 napi mentés helyett)")
print(f"visszaállítás: az elmúlt {napi} napból bármelyik napra, {heti} hétig hetente, {havi} hónapig havonta")

# ha egy hiba (pl. csendes adatsérülés) csak 3 hét után derül ki:
for nap in [3, 20, 60, 400]:
    if nap <= napi:
        valasz = "napi mentésből, pontosan"
    elif nap <= heti * 7:
        valasz = "heti mentésből (legfeljebb 1 hét adat vész el)"
    elif nap <= havi * 30:
        valasz = "havi mentésből (legfeljebb 1 hónap adat vész el)"
    else:
        valasz = "NINCS ilyen régi mentés"
    print(f"{nap:>3} napja történt hiba → {valasz}")
```

És a legfontosabb szabály, amit sokan kihagynak: **a mentést rendszeresen vissza is kell állítani próbaképpen.** Egy sosem kipróbált mentésről csak a baj napján derül ki, hogy hiányos vagy olvashatatlan.

| Nézőpont        | Mire figyel az üzemeltetésben?                                               |
| --------------- | ---------------------------------------------------------------------------- |
| **üzemeltető**  | kapacitás, kihasználtság, p95-ös válaszidő, riasztások, mentések             |
| **fejlesztő**   | hatékony kód (kisebb kiszolgálási idő), naplózás, egészség-ellenőrző végpont |
| **felhasználó** | gyors, mindig elérhető szolgáltatás – a háttér nem érdekli                   |
| **cégvezetés**  | költség kontra kockázat: mennyi tartalék és redundancia éri meg              |

## Összefoglalás

- A méretezéshez a csúcsforgalmat, a szerverkapacitást és a célkihasználtságot kell ismerni; az N+1 elv egy gép kiesését is elbírja.
- A válaszidő $S/(1-\rho)$ szerint nő: 90%-os kihasználtságnál tízszerese a kiszolgálási időnek – ezért nem tervezünk 100%-ra.
- A RAID 5 újraépítés alatt sérülékeny, a RAID 6 sokkal biztonságosabb; de a RAID nem mentés.
- A válaszidőt percentilisekkel (p95, p99) mérjük; a mentési rend (pl. GFS) mellett a visszaállítás próbája is kötelező.

## A lecke feladata

```quiz required
? Csúcsidőben 840 kérés érkezik másodpercenként, egy szerver 150 kérés/s-ot bír, és legfeljebb 70%-ra terhelnénk. Hány szerver kell (tartalék nélkül)?
= 8
! $840 / (150 \cdot 0{,}7) = 840 / 105 = 8$.

? Egy kérés kiszolgálása 10 ms. Mennyi az átlagos válaszidő 80%-os kihasználtságnál (ms)?
= 50
! $10 / (1 - 0{,}8) = 50$ ms.

? Mit jelent, hogy a p95-ös válaszidő 300 ms?
- az átlagos válaszidő 300 ms
+ a kérések 95%-a 300 ms-nál gyorsabb
- a kérések 95%-a 300 ms-nál lassabb
- a szerver 95%-os kihasználtságon fut
! A percentilis a lassú kéréseket is megmutatja, amelyeket az átlag elrejt.

? Hány mentést tárol egy 7 napi + 4 heti + 12 havi mentést megtartó forgatási rend?
= 23
! $7 + 4 + 12 = 23$.

? Miért nem helyettesíti a RAID a mentést?
- mert a RAID lassú
+ mert a véletlen törlést vagy a zsarolóvírus titkosítását azonnal minden lemezre átvezeti
- mert a RAID csak két lemezzel működik
- mert a RAID drágább
! A RAID a lemezhiba ellen véd, nem az adatok elvesztése ellen.
```

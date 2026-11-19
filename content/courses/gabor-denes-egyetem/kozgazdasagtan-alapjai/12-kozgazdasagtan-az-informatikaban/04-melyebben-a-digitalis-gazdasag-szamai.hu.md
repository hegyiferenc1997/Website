---
title: Mélyebben – a digitális gazdaság számai
summary: Miért viszi a győztes az egész piacot a hálózati hatás miatt (szimuláció), mikor éri meg egy freemium szolgáltatás növekedése, hogyan hoz több bevételt két szoftververzió egy helyett, és mikor olcsóbb a felhő a saját szervernél – kis programokkal és csúszkás ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- miért alakul ki a digitális piacokon gyakran **„a győztes mindent visz”** helyzet,
- miért nem mindig jó hír egy ingyenes szolgáltatás **gyors növekedése**,
- hogyan működik az **árdiszkrimináció** verziózással,
- hogyan döntsd el, hogy **felhő** vagy **saját szerver** a jobb.

## 1. Hálózati hatás: a győztes mindent visz

Két, egyformán jó üzenetküldő alkalmazás 10–10 felhasználóval indul. Minden új felhasználó azt választja szívesebben, amelyiken több ismerőse van – a választás esélye a hálózat értékével (Metcalfe-törvény szerint kb. a méret négyzetével) arányos:

```python run
# Hálózati hatás: két üzenetküldő app versenye – az új felhasználó a nagyobb hálózatot választja szívesebben
import random

def verseny(seed, uj_felhasznalok=10_000):
    r = random.Random(seed)
    a, b = 10, 10                                  # mindkettő 10 felhasználóval indul
    for _ in range(uj_felhasznalok):
        # a választás esélye a hálózat méretének NÉGYZETÉVEL arányos (Metcalfe: érték ~ n²)
        if r.random() < a ** 2 / (a ** 2 + b ** 2):
            a += 1
        else:
            b += 1
    return a / (a + b)

for seed in range(1, 7):
    print(f"{seed}. világ: az A app piaci részesedése {verseny(seed):.0%}")
```

Hat „párhuzamos világban” futtatva: mindig az egyik app **szinte az egész piacot** megszerzi – de hogy melyik, azt a kezdeti **véletlen** dönti el, nem a minőség! Ez a hálózati hatás következménye: a nagyobb hálózat vonzóbb, ezért tovább nő (pozitív visszacsatolás). Ezért költenek a startupok hatalmas összegeket a gyors növekedésre („blitzscaling”), és ezért figyelik a versenyhatóságok különösen a platformokat (az EU digitális piacokról szóló jogszabálya, a DMA).

```plot
title: Hálózat értéke és költsége – a kritikus tömeg
x: 0, 100
y: 0, 100
param: c = 0.5, 0.1, 1, 0.05
f: x^2/100 # érték (~ n²)
f: 20 + c*x # költség
```

A két görbe metszéspontja a **kritikus tömeg**: alatta a hálózat többe kerül, mint amennyit ér a felhasználóknak, fölötte magától nő.

## 2. Freemium: a növekedés csak akkor jó, ha a fedezet pozitív

Egy szolgáltatás ingyenes alapcsomagot és havi 3000 Ft-os fizetős csomagot kínál. Minden felhasználó (az ingyenes is!) havi 150 Ft szerver- és támogatási költséget okoz:

```python run
# Freemium tölcsér: megéri-e a növekedés? Az egy felhasználóra jutó fedezet dönt
latogato_havonta = 200_000
regisztral = 0.05                 # a látogatók 5%-a regisztrál (ingyenes csomag)
ar = 3_000                        # Ft/hó a fizetős csomag
fix_koltseg = 6_000_000           # fejlesztők, iroda (Ft/hó)
koltseg_felhasznalonkent = 150    # szerver, támogatás (Ft/hó/felhasználó – az ingyenesnek is!)

for konverzio in [0.04, 0.08]:    # az ingyenesek hány százaléka fizet
    fedezet = konverzio * ar - koltseg_felhasznalonkent        # egy felhasználó átlagos havi hozzájárulása
    print(f"konverzió {konverzio:.0%}: egy felhasználó fedezete {fedezet:+.0f} Ft/hó")
    felhasznalo = 0.0
    for honap in range(1, 25):
        felhasznalo = felhasznalo * 0.97 + latogato_havonta * regisztral   # havi 3% lemorzsolódás
        if honap in (6, 12, 24):
            eredmeny = felhasznalo * fedezet - fix_koltseg
            print(f"   {honap:>2}. hónap: {felhasznalo:7,.0f} felhasználó, eredmény {eredmeny:12,.0f} Ft")
```

4%-os konverziónál egy felhasználó átlagosan $0{,}04 \cdot 3000 = 120$ Ft-ot hoz, de 150-be kerül: **minden új felhasználóval nő a veszteség**, bármilyen gyors a növekedés! 8%-os konverziónál a fedezet pozitív, és a cég egy éven belül nyereségessé válik. A tanulság: a felhasználószám önmagában hiú mutató („vanity metric”) – az **egy felhasználóra jutó fedezet** (unit economics) dönti el, hogy a skálázás gazdagít vagy tönkretesz.

## 3. Verziózás: egy termék, két ár

Három vevőtípus eltérően értékeli egy szoftver alap- és profi változatát. Egyetlen ár vagy két verzió hoz több bevételt?

```python run
# Verziózás: egy szoftver Alap és Pro változata – három vevőtípus fizetési hajlandósága (Ft/hó)
vevok = {"diák": (1500, 2000, 500), "szabadúszó": (2500, 6000, 300), "cég": (3000, 12000, 100)}
#                   (Alapért, Proért, darabszám)

# 1) egyetlen termék (Pro) egyetlen áron: melyik ár hozza a legtöbbet?
legjobb = max((p * sum(n for a, pr, n in vevok.values() if pr >= p), p) for p in [2000, 6000, 12000])
print(f"egy ár: {legjobb[1]:,} Ft → bevétel {legjobb[0]:,} Ft/hó")

# 2) két verzió: Alap 1500 Ft, Pro 5000 Ft – mindenki azt választja, amelyiknél a legnagyobb a "nyeresége"
alap, pro = 1500, 5000
bevetel = 0
for nev, (wa, wp, n) in vevok.items():
    nyer_alap, nyer_pro = wa - alap, wp - pro
    valaszt = "Pro" if nyer_pro >= max(nyer_alap, 0) else "Alap" if nyer_alap >= 0 else "semmi"
    bevetel += n * (pro if valaszt == "Pro" else alap if valaszt == "Alap" else 0)
    print(f"   {nev:<10} → {valaszt}")
print(f"két verzió: bevétel {bevetel:,} Ft/hó")
```

Egy ár mellett vagy olcsón adjuk mindenkinek (és a cégek a fizetési hajlandóságuknál sokkal kevesebbet fizetnek), vagy drágán (és a diákok kimaradnak). Két verzióval a vevők **maguk választják ki** a nekik szóló árat (önszelekció): a diák az olcsó alapcsomagot, a szabadúszó és a cég a Prót – a bevétel 15%-kal nagyobb. A Pro árát úgy kell beállítani, hogy a szabadúszónak ne érje meg az alapcsomagra „lecsúszni”. Ugyanez a logika a diákkedvezmény, a „Home/Business” kiadás vagy a fapados repülőjegy mögött.

## 4. Felhő vagy saját szerver?

```python run
# Felhő vagy saját szerver? Mikor térül meg a saját gép, és mi van, ha ingadozik a terhelés?
sajat_beruhazas, sajat_havi = 6_000_000, 150_000      # vásárlás + áram, üzemeltetés havonta
felho_havi_teljes = 450_000                           # ugyanekkora kapacitás folyamatosan bérelve

honap = sajat_beruhazas / (felho_havi_teljes - sajat_havi)
print(f"folyamatos teljes terhelésnél a saját szerver {honap:.0f} hónap alatt térül meg")

# A felhőben csak a ténylegesen használt kapacitást fizetjük
for kihasznaltsag in [1.0, 0.5, 0.2]:
    felho = felho_havi_teljes * kihasznaltsag
    sajat_3ev = sajat_beruhazas + 36 * sajat_havi
    print(f"átlagos kihasználtság {kihasznaltsag:.0%}: 3 év felhő {36 * felho:>12,.0f} Ft vs saját {sajat_3ev:>12,.0f} Ft")
```

Folyamatos, egyenletes, teljes terhelésnél a saját szerver kb. 20 hónap alatt megtérül, és 3 év alatt olcsóbb. A legtöbb szolgáltatás terhelése viszont **ingadozik** (nappal sok, éjjel kevés felhasználó, kampányok, szezonalitás); a felhőben csak a ténylegesen használt kapacitást fizetjük, így 50%-os átlagos kihasználtságnál már a felhő a nyerő. A felhő ezenfelül a fix költséget **változó költséggé** alakítja – egy induló cégnek nem kell milliókat előre befektetnie, és ha a termék nem válik be, nincs a nyakán egy drága gép. Ezért indul ma szinte minden startup felhőben, és ezért visznek vissza egyes nagy, kiszámítható terhelésű cégek rendszereket saját szerverre.

## Összefoglalás

- Hálózati hatás: pozitív visszacsatolás, „a győztes mindent visz”, kritikus tömeg; a véletlen és a gyorsaság sokszor fontosabb a minőségnél.
- Freemium: csak akkor éri meg nőni, ha az egy felhasználóra jutó fedezet pozitív.
- Verziózás: a vevők önszelekciója révén több fogyasztói többlet alakul bevétellé.
- Felhő: változó költség, rugalmas kapacitás; ingadozó terhelésnél olcsóbb, egyenletes, teljes terhelésnél a saját gép térül meg.

## A lecke feladata

```quiz required
? A Metcalfe-törvény szerint hányszorosára nő egy hálózat értéke, ha a felhasználók száma 10-ről 20-ra nő?
= 4
! Az érték a felhasználók számának négyzetével arányos: $2^2 = 4$.

? Egy freemium szolgáltatásban a felhasználók 5%-a fizet havi 2000 Ft-ot, minden felhasználó költsége havi 80 Ft. Mennyi az egy felhasználóra jutó havi fedezet (Ft)?
= 20
! $0{,}05 \cdot 2000 - 80 = 20$ Ft.

? Egy saját szerver 3,6 millió Ft, üzemeltetése havi 100 ezer Ft; ugyanez a felhőben havi 400 ezer Ft. Hány hónap alatt térül meg a saját szerver folyamatos teljes terhelésnél?
= 12
! $\frac{3\,600\,000}{400\,000 - 100\,000} = 12$.

? Mi a hálózati hatás jellemző következménye a piacszerkezetre?
- tökéletes verseny sok kis szereplővel
+ egy vagy néhány domináns platform kialakulása
- állandóan csökkenő árak minden szereplőnél
- a minőség mindig eldönti a versenyt
! A nagyobb hálózat vonzóbb, így tovább nő.

? Mi a verziózás (pl. Alap és Pro csomag) fő célja?
- csökkenteni a fejlesztési költséget
+ hogy az eltérő fizetési hajlandóságú vevők maguk válasszák ki a nekik szóló árat
- hogy minden vevő a drágább csomagot vegye
- hogy kiszorítsa a versenytársakat
! Ez az árdiszkrimináció egyik formája, önszelekcióval.
```

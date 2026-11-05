---
title: A szoftveripar üzleti modelljei és mutatói
summary: Hogyan keres pénzt egy szoftvercég? Licenc, SaaS-előfizetés, freemium, felhasználásalapú és hirdetési modell, árdiszkrimináció és verziózás, az egységgazdaságtan mutatói (MRR, lemorzsolódás, CAC, LTV), a felhő gazdaságtana és a nyílt forráskód.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- a szoftverek fő **bevételi modelljeit**,
- mi az **árdiszkrimináció** és a **verziózás**,
- hogyan számolod ki az **egységgazdaságtan** mutatóit (MRR, lemorzsolódás, CAC, LTV),
- mi a **felhő** gazdasági előnye (beruházás helyett működési költség),
- hogyan lehet pénzt keresni **nyílt forráskóddal**.

## Bevételi modellek

| Modell                           | Lényege                                                  | Példa                                                   |
| -------------------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| **egyszeri licenc**              | egyszer fizetsz, örökre használhatod (a frissítés külön) | régebbi irodai programok, egyes játékok                 |
| **előfizetés / SaaS**            | havi vagy éves díj a szolgáltatásért                     | irodai csomagok, tervezőprogramok, streaming            |
| **freemium**                     | az alapverzió ingyenes, a többletfunkciók fizetősek      | jegyzetelő, zenei és tárhelyszolgáltatások              |
| **felhasználásalapú**            | annyit fizetsz, amennyit használsz                       | felhő: CPU-óra, tárhely GB-ban, API-hívások, MI-tokenek |
| **hirdetési**                    | a felhasználónak ingyenes, a hirdetők fizetnek           | keresők, közösségi média                                |
| **jutalék / piactér**            | a platform minden tranzakcióból részesedést kap          | alkalmazásboltok, szállásfoglalók                       |
| **alkalmazáson belüli vásárlás** | ingyenes alapjáték, fizetős virtuális tárgyak            | mobiljátékok                                            |

A **SaaS** (_Software as a Service_) az utóbbi évtizedben vált uralkodóvá: a cégnek kiszámíthatóbb, ismétlődő bevétel, a vevőnek kisebb kezdeti kiadás, mindig friss verzió.

## Árdiszkrimináció és verziózás

Mivel a határköltség közel nulla, az árat a **fizetési hajlandóság** szerint érdemes megszabni. **Árdiszkrimináció:** ugyanazt a terméket különböző vevőknek különböző áron adják.

- **Verziózás:** alap / pro / vállalati csomag – mindenki kiválasztja a neki megfelelőt (önszelekció).
- **Csoportos kedvezmény:** diákár, oktatási licenc (az egyetemisták alacsonyabb fizetési hajlandóságát veszi figyelembe – és korán „rászoktat” a termékre).
- **Regionális árazás:** ugyanaz az előfizetés olcsóbb a kisebb jövedelmű országokban.
- **Mennyiségi kedvezmény:** éves előfizetés olcsóbb, mint 12 havi.

A **fogyasztói többlet** (4. témakör) így részben a céghez kerül, de több vevő juthat a termékhez.

## Egységgazdaságtan

Egy előfizetéses cég egészségét néhány mutató jelzi:

- **MRR / ARR:** havi / éves ismétlődő bevétel.
- **ARPU:** egy felhasználóra jutó átlagos bevétel (havonta).
- **Lemorzsolódás** (_churn_): a felhasználók hány százaléka mondja le havonta az előfizetést.
- **CAC** (_customer acquisition cost_): egy új ügyfél megszerzésének költsége (marketing, értékesítés).
- **LTV** (_lifetime value_): egy ügyfélből az élettartama alatt várható bruttó haszon.

Egyszerű közelítéssel:

$$ LTV = \frac{ARPU \cdot \text{bruttó árrés}}{\text{havi lemorzsolódás}} $$

**Példa:** ARPU = 3000 Ft/hó, bruttó árrés 80%, havi lemorzsolódás 4% → $LTV = 3000 \cdot 0{,}8 / 0{,}04 = 60\,000$ Ft. Ha a CAC 15 000 Ft, akkor $LTV / CAC = 4$.

Ökölszabály: az **LTV/CAC legalább 3** legyen – különben drágább ügyfelet szerezni, mint amennyit hoz. A lemorzsolódás csökkentése gyakran többet ér, mint új ügyfelek szerzése.

```python run
# Egy előfizetéses szolgáltatás egységgazdaságtana
arpu = 3000          # Ft / felhasználó / hó
arres = 0.8          # bruttó árrés
lemorzsolodas = 0.04 # havi arány
cac = 15000          # Ft / új ügyfél

ltv = arpu * arres / lemorzsolodas
print("LTV:", round(ltv), "Ft")
print("LTV/CAC:", round(ltv / cac, 2))
print("Átlagos élettartam:", round(1 / lemorzsolodas), "hónap")
```

## A felhő gazdaságtana

- **Beruházás helyett működési költség** (_capex → opex_): nem kell előre szervertermet építeni, havonta a használatért fizetsz. Egy startupnak ez óriási előny: kicsi a belépési korlát.
- **Rugalmasság:** csúcsidőben több kapacitás, éjjel kevesebb – nem kell a csúcsra méretezni.
- **Méretgazdaságosság:** a felhőszolgáltatók óriási méretben olcsóbban vesznek hardvert, energiát, és jobban kihasználják.
- **De:** nagy, egyenletes terhelésnél a saját infrastruktúra olcsóbb lehet, és figyelni kell a **bezártságra** (1. lecke) és a kimenő adatforgalom díjaira.

## A nyílt forráskód gazdaságtana

Miért adnak ingyen szoftvert a cégek és a fejlesztők?

- **Kiegészítő termékek:** a szoftver ingyenes, a támogatás, a felhős üzemeltetés, a vállalati funkciók fizetősek (pl. Linux-disztribúciók vállalati támogatása, nyílt forráskódú adatbázisok felhős változata).
- **Szabvány kialakítása:** ha az én megoldásom terjed el, az egész ökoszisztéma rám épül.
- **Közös fejlesztés:** a költségek megoszlanak, a hibák gyorsabban kiderülnek.
- **Jelzés és humántőke:** a fejlesztő portfóliója, hírneve nő (8. témakör).

A nyílt forráskód **pozitív externália** és sok szempontból **közjószág** – a fenntartása (karbantartók finanszírozása) ezért visszatérő probléma.

## Összefoglalás

- Modellek: licenc, SaaS, freemium, felhasználásalapú, hirdetési, jutalék, alkalmazáson belüli vásárlás.
- Közel nulla határköltségnél az árat a fizetési hajlandóság szabja: verziózás, diákár, regionális ár.
- Egységgazdaságtan: LTV = ARPU · árrés / lemorzsolódás; LTV/CAC ≥ 3.
- Felhő: capex helyett opex, rugalmasság, méretgazdaságosság – de bezártság.
- Nyílt forráskód: kiegészítő termékek, szabvány, közös fejlesztés, jelzés.

## A lecke feladata

```quiz required
? Melyik a **freemium** modell?
- egyszeri vásárlás, örök használat
+ ingyenes alapverzió, fizetős többletfunkciók
- csak hirdetésekből él
- a felhasználás arányában fizetsz
! Free + premium.

? ARPU = 2000 Ft/hó, bruttó árrés 75%, havi lemorzsolódás 5%. Mennyi az LTV (Ft)?
= 30000
! 2000 · 0,75 / 0,05.

? Ugyanitt a CAC 12 000 Ft. Mennyi az LTV/CAC arány?
= 2,5
= 2.5
! 30 000 / 12 000 – a 3-as ökölszabály alatt.

? Melyik az **árdiszkrimináció** példája?
+ diákkedvezményes előfizetés
- minden vevő ugyanazt az árat fizeti
- a termék ingyenes
- az ár a gyártási költséggel egyenlő
! Különböző ár a fizetési hajlandóság szerint.

? Miért előnyös egy startupnak a felhő?
- mert mindig olcsóbb a saját szervernél
+ mert nem kell előre nagy beruházás, és a használat szerint fizet
- mert nincs bezártság
- mert ingyenes
! Capex helyett opex.
```

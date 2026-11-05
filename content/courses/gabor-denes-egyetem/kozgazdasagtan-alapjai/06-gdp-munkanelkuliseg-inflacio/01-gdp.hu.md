---
title: A GDP és mérése
summary: Mit mér a bruttó hazai termék, hogyan számolják háromféleképpen, mi a különbség a nominális és a reál GDP között, és mit nem mutat meg a GDP.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **GDP** pontos meghatározása,
- a GDP mérésének **három módszerét**, köztük a $C + I + G + (X - M)$ képletet,
- a **nominális** és a **reál** GDP különbségét,
- mi az **egy főre jutó GDP**, a **vásárlóerő-paritás** és a **GNI**,
- a GDP **korlátait**.

## Mi a GDP?

A **bruttó hazai termék** (GDP, _Gross Domestic Product_) egy ország területén egy adott időszak (negyedév, év) alatt előállított **végső** termékek és szolgáltatások **piaci értéke**.

A meghatározás minden szava fontos:

- **piaci érték**: forintban, piaci áron mérjük, így összeadható a laptop és a hajvágás,
- **végső**: csak a végső felhasználónak eladott termékek – a köztes termékeket (pl. a laptopba épített chipet) nem számoljuk külön, különben **kétszer** számolnánk,
- **előállított**: a használt cikkek eladása (egy használt telefon) nem része, mert azt korábban már beszámították,
- **hazai**: az ország területén – a Magyarországon működő német autógyár termelése a magyar GDP része,
- **adott időszak**: áramlás, nem állomány.

## Háromféle mérés

A jövedelem körforgása (2. témakör) miatt a háromféle számítás elvileg ugyanazt adja:

1. **Termelési módszer:** az összes **hozzáadott érték** összege (a kibocsátás értéke mínusz a felhasznált köztes termékek).
2. **Kiadási módszer:** a végső felhasználások összege.
3. **Jövedelmi módszer:** a termelésből származó jövedelmek összege (bérek, profitok, kamatok, bérleti díjak) + termelési adók − támogatások + értékcsökkenés.

### A hozzáadott érték példája

| Szereplő     | Eladási ár | Felhasznált köztes termék | Hozzáadott érték         |
| ------------ | ---------- | ------------------------- | ------------------------ |
| chipgyártó   | 50 000     | 0                         | 50 000                   |
| laptopgyártó | 200 000    | 50 000                    | 150 000                  |
| kereskedő    | 250 000    | 200 000                   | 50 000                   |
| **összesen** |            |                           | **250 000** = a végső ár |

### A kiadási oldal

$$ GDP = C + I + G + (X - M) $$

| Tag     | Jelentés                | Példa                                            |
| ------- | ----------------------- | ------------------------------------------------ |
| $C$     | háztartások fogyasztása | élelmiszer, telefon, streaming                   |
| $I$     | beruházás               | új gyár, szerverek, lakásépítés, készletváltozás |
| $G$     | állami vásárlások       | orvosok bére, utak (a transzferek **nem**!)      |
| $X - M$ | nettó export            | export − import                                  |

A nyugdíj és a családi pótlék **nem** része a $G$-nek, mert nem termék vagy szolgáltatás vásárlása, hanem jövedelem-átcsoportosítás (az ebből vett termékek $C$-ként jelennek meg).

Magyarország nyitott gazdaság: az export és az import is a GDP **80% körül** van, ezért a nettó export kicsi, de a világgazdaság állapota nagyon erősen hat ránk.

## Nominális és reál GDP

- **Nominális GDP:** folyó áron – nőhet úgy is, hogy semmivel sem termelünk többet, csak drágább minden.
- **Reál GDP:** egy bázisév árain (változatlan áron) – a **valódi termelést** mutatja. A **gazdasági növekedés** a reál GDP változása.

$$ \text{reál GDP} = \frac{\text{nominális GDP}}{\text{GDP-deflátor}} \cdot 100 $$

Ha a nominális GDP 10%-kal nő, az árszint (deflátor) 6%-kal, a reál növekedés kb. **4%**.

## Egy főre jutó GDP, PPP, GNI

- **Egy főre jutó GDP** = GDP / népesség – az életszínvonal durva mércéje.
- **Vásárlóerő-paritás (PPP):** figyelembe veszi, hogy az árak országonként eltérnek (egy hajvágás Budapesten olcsóbb, mint Zürichben). Az EU-s összehasonlítások PPP-ben készülnek; Magyarország egy főre jutó GDP-je így az uniós átlag kb. háromnegyede.
- **GNI** (bruttó nemzeti jövedelem) = GDP + a külföldről kapott jövedelmek − a külföldre fizetett jövedelmek. Ahol sok a külföldi tulajdonú vállalat (mint nálunk), ott a profitok egy része kiáramlik, így a **GNI kisebb a GDP-nél**.

## Mit nem mutat a GDP?

- a **háztartási munkát** és az önkéntes munkát (főzés, gyereknevelés, nyílt forráskódú fejlesztés),
- a **feketegazdaságot** (becslik, de pontatlan),
- a **jövedelem elosztását** – az átlag nőhet úgy is, hogy a többségnek nem lesz jobb,
- a **környezeti károkat** (a szennyezés eltakarítása még növeli is a GDP-t),
- a **szabadidőt**, az egészséget, a boldogságot,
- az **ingyenes digitális szolgáltatások** értékét (keresők, térképek, Wikipédia) – ezt a 12. témakörben tárgyaljuk.

Ezért vannak kiegészítő mutatók, pl. a **HDI** (10. témakör).

## Összefoglalás

- GDP: egy ország területén egy időszak alatt előállított végső termékek piaci értéke.
- Háromféle mérés: termelési (hozzáadott érték), kiadási ($C + I + G + X - M$), jövedelmi.
- Reál GDP = változatlan áron; a növekedés a reál GDP változása.
- Egy főre jutó GDP, PPP, GNI.
- A GDP nem mér jólétet, elosztást, környezetet, háztartási munkát.

## A lecke feladata

```quiz required
? Melyik része a magyar GDP-nek?
- egy használt autó eladása magánszemélyek között
- a laptopba beépített chip értéke külön
+ egy Magyarországon működő külföldi tulajdonú gyár termelése
- egy magyar cég németországi gyárának termelése
! Hazai = az ország területén.

? C = 50, I = 20, G = 22, X = 80, M = 75 (ezer milliárd Ft). Mennyi a GDP?
= 97
! 50 + 20 + 22 + (80 − 75).

? Egy szoftvercég 2 millió Ft-ért vesz licencet, és a vele készített terméket 5 millió Ft-ért adja el. Mennyi a hozzáadott értéke (millió Ft)?
= 3
! 5 − 2.

? A nominális GDP 8%-kal, a GDP-deflátor 5%-kal nőtt. Kb. hány százalékos a reál növekedés?
= 3
= 3%
! 8 − 5.

? Melyik **nem** része a kiadási oldal G tagjának?
- a tanárok bére
- egy új autópálya
+ a nyugdíjak
- a katonák felszerelése
! A nyugdíj transzfer, nem termékvásárlás.
```

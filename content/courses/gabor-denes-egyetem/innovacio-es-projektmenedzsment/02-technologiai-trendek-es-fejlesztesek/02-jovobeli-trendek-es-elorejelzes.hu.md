---
title: Jövőbeli trendek és előrejelzésük
summary: Kvantum-számítástechnika, kiterjesztett valóság, blokklánc, fenntartható informatika; a Gartner-féle hype-ciklus, a technológiai S-görbe és Moore törvénye.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- melyek a **feltörekvő** technológiák, amelyek a következő évtizedet alakíthatják,
- hogyan olvasd a **Gartner-féle hype-ciklust**,
- mit mutat a technológiai **S-görbe**, és mit mond **Moore törvénye**.

## Feltörekvő technológiák

| Technológia                                     | Lényeg                                                               | Lehetséges alkalmazás                              |
| ----------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------- |
| **kvantum-számítástechnika**                    | qubitek: egyszerre több állapot (szuperpozíció)                      | gyógyszerkutatás, optimalizálás, titkosítás törése |
| **kiterjesztett / virtuális valóság** (AR / VR) | digitális tartalom a valós világ fölött, vagy teljesen virtuális tér | távoli karbantartás, oktatás, tervezés             |
| **blokklánc**                                   | elosztott, utólag nem módosítható főkönyv                            | ellátási lánc követése, digitális azonosítás       |
| **autonóm rendszerek**                          | önvezető járművek, drónok, robotok                                   | logisztika, mezőgazdaság                           |
| **fenntartható („zöld”) IT**                    | energiahatékony adatközpontok, kisebb szén-dioxid-kibocsátás         | felhő CO₂-lábnyomának mérése, újrahasznosítás      |

> A **kvantumszámítógép** egyik veszélye, hogy a mai nyilvános kulcsú titkosítások (pl. RSA) egy részét feltörheti. Erre készül a **posztkvantum-kriptográfia**.

## A Gartner-féle hype-ciklus

A **Gartner** elemzőcég 1995 óta minden évben megjelenteti, hogyan változik az új technológiák körüli **várakozás** az idő függvényében. Öt szakasza:

```text
 várakozás
    ▲        2
    │       /\
    │      /  \                       5
    │     /    \               4 ___________
    │    /      \          ___/
    │   /        \     ___/
    │  /          \___/
    │ 1             3
    └──────────────────────────────────────▶ idő
```

1. **Technológiai kiváltó ok** (_Innovation Trigger_): egy áttörés vagy bemutató felkelti a figyelmet.
2. **A felfokozott várakozások csúcsa** (_Peak of Inflated Expectations_): túlzó ígéretek, sok sajtó, néhány siker és sok kudarc.
3. **A kiábrándulás mélypontja** (_Trough of Disillusionment_): a kísérletek nem hozzák az ígértet, az érdeklődés csökken.
4. **A megvilágosodás lejtője** (_Slope of Enlightenment_): kiderül, mire jó igazán, megjelennek a második-harmadik generációs termékek.
5. **A termelékenység fennsíkja** (_Plateau of Productivity_): széles körű, mindennapi használat.

**Tanulság**: a csúcson nem érdemes vakon beruházni, a mélyponton pedig nem érdemes végleg leírni egy technológiát.

## A technológiai S-görbe

Egy technológia **teljesítménye** a ráfordított fejlesztési erőfeszítés függvényében S alakú görbét ír le:

- **kezdet**: lassú fejlődés, sok kísérletezés,
- **növekedés**: gyors javulás, a technológia beérik,
- **érettség**: a fizikai korlátok miatt egyre kisebb a javulás.

Az érettség szakaszában jelenik meg az **új S-görbe** (egy új technológia), amely először gyengébb, de végül túlnő a réginek – ez a technológiaváltás (pl. HDD → SSD, 4G → 5G).

## Moore törvénye

**Gordon Moore** (az Intel egyik alapítója) 1965-ben megfigyelte, hogy az integrált áramkörökön lévő tranzisztorok száma rendszeresen megduplázódik; 1975-ös pontosítása szerint **kétévente**. Ez évtizedekig a számítástechnikai fejlődés ütemét adta. Ma a fizikai korlátok miatt lassul, ezért a teljesítmény egyre inkább **párhuzamosításból** (több mag, GPU, specializált MI-gyorsítók) jön.

**Számolási példa**: ha egy chipen ma 10 milliárd tranzisztor van, és a szám kétévente duplázódik, akkor 6 év múlva 10 · 2³ = **80 milliárd** lesz.

## Összefoglalás

- Feltörekvő technológiák: kvantum-számítástechnika, AR/VR, blokklánc, autonóm rendszerek, zöld IT.
- Hype-ciklus: kiváltó ok → csúcs → mélypont → lejtő → fennsík.
- S-görbe: lassú kezdet, gyors növekedés, érettség; az érettségnél jön az új technológia.
- Moore törvénye: a tranzisztorszám kb. kétévente duplázódik (ma lassul).

## A lecke feladata

```quiz required
? A hype-ciklus melyik szakaszában vannak a túlzó ígéretek és a legnagyobb sajtóérdeklődés?
- technológiai kiváltó ok
+ a felfokozott várakozások csúcsa
- a kiábrándulás mélypontja
- a termelékenység fennsíkja
! A csúcson a várakozás jóval nagyobb a valós teljesítménynél.

? Hány szakasza van a Gartner-féle hype-ciklusnak?
= 5
= öt
! Kiváltó ok, csúcs, mélypont, lejtő, fennsík.

? Egy chipen ma 10 milliárd tranzisztor van. Moore törvénye szerint (kétévente duplázódás) hány milliárd lesz **4 év** múlva?
= 40
= 40 milliárd
! 4 év = 2 duplázás: 10 · 2 · 2.

? Mit jelez, ha egy technológia az S-görbe **érettségi** szakaszában van?
- most fejlődik a leggyorsabban
+ egyre kisebb a javulás, és várható egy új technológia megjelenése
- még senki sem használja
- a hype-ciklus csúcsán van
! A fizikai korlátok miatt lassul a fejlődés; ez a technológiaváltás ideje.

? Melyik mai titkosítást fenyegetheti a kvantumszámítógép?
+ RSA (nyilvános kulcsú titkosítás)
- a jelszó kisbetűs írása
- a HTML
- a ZIP-tömörítés
! Ezért fejlesztik a posztkvantum-kriptográfiát.
```

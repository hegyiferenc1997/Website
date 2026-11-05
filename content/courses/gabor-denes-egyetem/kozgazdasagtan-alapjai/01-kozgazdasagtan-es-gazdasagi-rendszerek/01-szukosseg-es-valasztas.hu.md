---
title: Szűkösség, választás és alternatív költség
summary: Miért kell egyáltalán választanunk? A szűkösség, a termelési tényezők, az alternatív költség és a termelési lehetőségek határa egy mérnökinformatikus hétköznapi példáin.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mivel foglalkozik a **közgazdaságtan**,
- mit jelent a **szűkösség**, és miért ebből indul minden,
- mik a **termelési tényezők**,
- mi az **alternatív költség** (haszonáldozat),
- hogyan ábrázolja a döntéseket a **termelési lehetőségek határa**.

## Mi a közgazdaságtan?

A **közgazdaságtan** azt vizsgálja, hogyan döntenek az emberek, a vállalatok és az állam arról, hogy a **szűkös erőforrásaikat** mire használják fel, és ezek a döntések hogyan hatnak egymásra.

Nem csak a pénzről szól: az is gazdasági döntés, hogy a vizsgaidőszakban egy estét tanulásra, alvásra vagy egy hackathonra fordítasz.

## Szűkösség

**Szűkösség**: az igényeink korlátlanok, az erőforrásaink viszont korlátozottak. Ezért **választanunk kell**.

| Erőforrás | Miért szűkös?                                     |
| --------- | ------------------------------------------------- |
| idő       | egy napban 24 óra van                             |
| pénz      | a fizetés, az ösztöndíj véges                     |
| GPU-idő   | a felhőben óradíjat fizetünk érte                 |
| figyelem  | egyszerre csak kevés dologra tudunk koncentrálni  |
| munkaerő  | kevés a tapasztalt fejlesztő, a bérük ezért magas |

> A „szűkös” nem azt jelenti, hogy „ritka”. A levegő nem szűkös (mindenkinek jut ingyen), a szerverteremben a hűtési kapacitás viszont igen.

## A termelési tényezők

A javak és szolgáltatások előállításához a gazdaság négy fő **termelési tényezőt** használ:

1. **Munka** – az emberek fizikai és szellemi erőfeszítése (pl. a fejlesztők munkaórái).
2. **Tőke** – az ember által előállított termelőeszközök (szerverek, laptopok, irodák, szoftverek).
3. **Föld / természeti erőforrások** – telek, nyersanyag, energia, ritkaföldfémek a chipekhez.
4. **Vállalkozói képesség** – a tényezők kombinálása, kockázatvállalás, új ötletek megvalósítása.

Sokan ötödikként a **tudást és az adatot** is ide sorolják – a 12. témakörben visszatérünk rá.

## Alternatív költség (haszonáldozat)

Ha valamit választasz, lemondasz a **legjobb kihagyott lehetőségről**. Ennek az értéke az **alternatív költség**.

**Példa:** szombaton 8 órád van. Lehetőségeid:

- tanulsz a matekvizsgára,
- dolgozol diákmunkában óránként 2500 Ft-ért (összesen 20 000 Ft),
- elmész egy kirándulásra.

Ha a tanulást választod, és a második legjobb lehetőséged a munka lett volna, akkor a tanulás alternatív költsége **20 000 Ft** (a kirándulás nem számít bele, mert nem az volt a legjobb kihagyott lehetőség).

> Az egyetem alternatív költsége nem csak a tandíj és a könyvek ára, hanem az a fizetés is, amit közben teljes munkaidőben kereshetnél.

## A termelési lehetőségek határa

Egy egyszerű modell: egy kis fejlesztőcég egy hónap alatt **webalkalmazást** vagy **mobilalkalmazást** fejleszthet. A **termelési lehetőségek határa** (TLH, angolul _PPF_) megmutatja, hogy az adott erőforrásokkal a két termékből legfeljebb milyen kombinációkat lehet előállítani.

```plot
title: Termelési lehetőségek határa
x: 0, 12
y: 0, 12
param: t = 10, 6, 11, 0.5
f: sqrt(t^2 - x^2) # TLH
point: 6, 8 # hatékony pont
point: 4, 4 # nem hatékony
```

- A **görbén lévő** pontok **hatékonyak**: az egyikből csak úgy lehet többet készíteni, ha a másikból kevesebbet.
- A görbe **alatti** pont **nem hatékony**: kihasználatlan erőforrás (pl. a fejlesztők fele nem dolgozik).
- A görbe **feletti** pont jelenleg **elérhetetlen**.
- A **t** csúszka a **gazdasági növekedést** mutatja: több erőforrás vagy jobb technológia kifelé tolja a határt.

A görbe **kifelé hajló** (homorú), mert az erőforrások nem egyformán jók mindkét feladatra: ha egyre több webes fejlesztőt teszünk át mobilfejlesztésre, egyre kevésbé alkalmasakat kell áttennünk, így egy újabb mobilalkalmazás egyre több webalkalmazásba „kerül”. Ez a **növekvő alternatív költség** elve.

## Összefoglalás

- A közgazdaságtan a szűkös erőforrások felhasználásáról szóló döntéseket vizsgálja.
- Termelési tényezők: munka, tőke, föld, vállalkozói képesség (és egyre inkább a tudás).
- Az alternatív költség a legjobb kihagyott lehetőség értéke.
- A TLH-n lévő pontok hatékonyak, alatta pazarlás van, felette (egyelőre) elérhetetlen tartomány.
- A növekedés kifelé tolja a TLH-t.

## A lecke feladata

```quiz required
? Mit jelent a közgazdaságtanban a **szűkösség**?
- hogy egy termék ritkán kapható a boltban
+ hogy az igények korlátlanok, az erőforrások viszont korlátozottak
- hogy az állam korlátozza a termelést
- hogy a pénz elfogyott
! Ezért kell választani.

? Melyik termelési tényező egy cég **szerverparkja**?
- munka
+ tőke
- föld
- vállalkozói képesség
! Ember által előállított termelőeszköz.

? Esténként 3 órát tanulhatsz, vagy dolgozhatsz óránként 3000 Ft-ért (ez a második legjobb lehetőséged). Hány forint a 3 óra tanulás alternatív költsége?
= 9000
= 9000 Ft
! 3 · 3000 Ft – a kihagyott fizetés.

? Hol van a termelési lehetőségek határához képest egy olyan pont, amelynél a fejlesztők egy része munka nélkül ül?
- a görbén
+ a görbe alatt
- a görbe fölött
- a tengelyen
! Kihasználatlan erőforrás = nem hatékony pont.

? Mi tolja **kifelé** a termelési lehetőségek határát?
- ha a két termék közül csak az egyiket gyártjuk
- ha nő a munkanélküliség
+ ha jobb technológia vagy több erőforrás áll rendelkezésre
- ha emelkednek az árak
! Ez a gazdasági növekedés.
```

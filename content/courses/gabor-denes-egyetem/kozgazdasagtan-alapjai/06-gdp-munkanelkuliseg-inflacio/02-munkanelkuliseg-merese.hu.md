---
title: A munkanélküliség mérése
summary: Ki számít munkanélkülinek? A népesség felosztása (foglalkoztatott, munkanélküli, inaktív), az ILO-definíció, a munkanélküliségi, az aktivitási és a foglalkoztatási ráta kiszámítása és csapdái.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan osztja fel a statisztika a **népességet**,
- ki számít **munkanélkülinek** az ILO-definíció szerint,
- hogyan számolod ki a **munkanélküliségi**, az **aktivitási** és a **foglalkoztatási rátát**,
- miért lehet félrevezető egyedül a munkanélküliségi ráta.

## A népesség felosztása

A KSH a **munkaerő-felmérés** (egy nagy, rendszeres lakossági kérdőív) alapján a **15–74 éves** népességet három csoportra osztja:

```text
               15–74 éves népesség
              ┌───────────┴───────────┐
       gazdaságilag aktívak        inaktívak
        (munkaerő)          (tanulók, nyugdíjasok,
     ┌──────┴──────┐         gyesen lévők, akik nem
 foglalkoztatottak  munkanélküliek    keresnek munkát)
```

- **Foglalkoztatott:** a vizsgált héten legalább **1 órát** dolgozott pénzért (vagy csak átmenetileg volt távol a munkájától, pl. szabadság).
- **Munkanélküli** (ILO-definíció): **nincs munkája**, az elmúlt **4 hétben aktívan keresett** munkát, és **2 héten belül munkába tudna állni**.
- **Inaktív:** se nem dolgozik, se nem keres munkát – pl. a nappali tagozatos egyetemisták többsége, a nyugdíjasok.

## A ráták

$$ \text{munkanélküliségi ráta} = \frac{\text{munkanélküliek}}{\text{aktívak}} \cdot 100 $$

$$ \text{aktivitási ráta} = \frac{\text{aktívak}}{\text{15–74 éves népesség}} \cdot 100 $$

$$ \text{foglalkoztatási ráta} = \frac{\text{foglalkoztatottak}}{\text{15–74 éves népesség}} \cdot 100 $$

Figyelem: a munkanélküliségi ráta nevezője az **aktívak** száma, nem a teljes népesség!

**Példa** (ezer fő): népesség 15–74 évesen 7000, foglalkoztatott 4750, munkanélküli 250.

- aktívak: $4750 + 250 = 5000$,
- munkanélküliségi ráta: $250 / 5000 = 5\%$,
- aktivitási ráta: $5000 / 7000 \approx 71{,}4\%$,
- foglalkoztatási ráta: $4750 / 7000 \approx 67{,}9\%$.

Magyarországon a munkanélküliségi ráta az elmúlt években **4–5% körül** alakult, ami uniós összevetésben alacsony.

## Regisztrált munkanélküliek

A munkaerő-felmérés mellett létezik a **regisztrált álláskeresők** száma is (akik a kormányhivatalnál nyilvántartásba vették magukat). A kettő nem ugyanaz: van, aki keres munkát, de nem regisztrál, és van, aki regisztrált, de nem keres aktívan. Nemzetközi összehasonlításra az ILO szerinti adat a jó.

## Miért félrevezető egyedül a ráta?

- **Elbátortalanodott munkavállalók:** aki feladta a keresést, átkerül az **inaktívak** közé – a munkanélküliségi ráta **csökken**, pedig senki sem kapott munkát.
- **Alulfoglalkoztatottság:** aki heti 10 órát dolgozik, de többet szeretne, foglalkoztatottnak számít.
- **Közfoglalkoztatás:** a közmunkások foglalkoztatottnak számítanak, pedig sokszor nem a piaci munkaerőpiacon dolgoznak.
- **Rejtett munkanélküliség:** a túlméretezett szervezetekben dolgozók munkájára valójában nincs szükség.

Ezért a **foglalkoztatási ráta** gyakran jobban mutatja a munkaerőpiac helyzetét. A munkanélküliség fajtáiról és okairól a 8. témakörben lesz szó.

## Összefoglalás

- 15–74 évesek: foglalkoztatott + munkanélküli = aktív; a többi inaktív.
- ILO-munkanélküli: nincs munkája, 4 hétben keresett, 2 héten belül munkába állhat.
- Munkanélküliségi ráta = munkanélküli / aktív.
- Az elbátortalanodott munkavállalók és a közfoglalkoztatás torzítja a rátát.

## A lecke feladata

```quiz required
? Egy nappali tagozatos egyetemista nem dolgozik és nem keres munkát. Melyik csoportba tartozik?
- foglalkoztatott
- munkanélküli
+ inaktív
! Se nem dolgozik, se nem keres.

? Foglalkoztatott 4600, munkanélküli 200 (ezer fő). Mennyi a munkanélküliségi ráta (%)? Egy tizedesre.
= 4,2
= 4.2
! 200 / 4800 = 4,17%.

? Ugyanitt a 15–74 éves népesség 6400 ezer fő. Mennyi az aktivitási ráta (%)?
= 75
= 75%
! 4800 / 6400.

? Egy munkanélküli feladja a keresést. Mi történik a munkanélküliségi rátával (minden más változatlan)?
- nő
+ csökken
- nem változik
! Átkerül az inaktívak közé – csökken a számláló és a nevező is.

? Ki számít foglalkoztatottnak a munkaerő-felmérésben?
- csak aki teljes munkaidőben dolgozik
+ aki a vizsgált héten legalább 1 órát dolgozott pénzért
- aki regisztrált a kormányhivatalnál
- aki diák
! Nagyon tág definíció.
```

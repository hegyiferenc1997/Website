---
title: A kínálat
summary: A kínálat törvénye, a kínálati görbe, és mi tolja el (költségek, technológia, eladók száma, várakozások, adók és támogatások).
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **kínálat** és a **kínálat törvénye**,
- hogyan néz ki a **kínálati görbe**,
- mely tényezők **tolják el** a kínálati görbét,
- mi a **piaci kínálat**.

## A kínálat

A **kínálat** megmutatja, hogy az eladók különböző árak mellett **mennyit akarnak és tudnak** eladni egy termékből egy adott időszakban.

**A kínálat törvénye:** ceteris paribus, ha egy termék ára **nő**, a kínált mennyiség is **nő**. Miért?

- magasabb ár mellett **nagyobb a profit**, megéri többet gyártani,
- a drágábban termelő vállalatok is **belépnek** a piacra,
- a termelés bővítése általában egyre drágább (növekvő határköltség – 4. témakör), ezt csak magasabb ár fedezi.

## A kínálati görbe

A kínálati görbe **emelkedő**. Egy lineáris példa: $P = c + Q$, ahol **c** az a legalacsonyabb ár, amely mellett még bárki kínál.

```plot
title: Kínálati görbe
x: 0, 60
y: 0, 150
param: c = 10, 0, 60, 5
f: c + x # kínálat
dash: 10 + x # eredeti
```

Ha a **c** nő (pl. drágul az alapanyag), a görbe **felfelé/balra** tolódik: minden ár mellett kevesebbet kínálnak.

## Mozgás a görbén vagy eltolódás?

Mint a keresletnél:

- a **saját ár** változása → mozgás a kínálati görbe mentén (a **kínált mennyiség** változik),
- **más tényező** változása → a görbe eltolódik (a **kínálat** változik).

| Tényező                                                 | Hatás a kínálatra                         |
| ------------------------------------------------------- | ----------------------------------------- |
| drágulnak a **termelési tényezők** (bér, energia, chip) | csökken (balra tolódik)                   |
| jobb **technológia**, automatizálás                     | nő (jobbra tolódik)                       |
| nő az **eladók száma** (új gyártók lépnek be)           | nő                                        |
| **adó** a termékre                                      | csökken                                   |
| **támogatás** (szubvenció)                              | nő                                        |
| az eladók **drágulásra számítanak**                     | a mostani kínálat csökken (visszatartják) |
| **természeti csapás**, ellátási lánc zavara             | csökken                                   |

**Példa:** 2020–2022-ben a chiphiány miatt az autó- és a videókártyagyártók kínálata balra tolódott – kevesebb termék, magasabb árak.

## Egyéni és piaci kínálat

A **piaci kínálat** az egyes eladók kínálatának **vízszintes összege**: minden ár mellett összeadjuk, ki mennyit kínál.

| Ár (Ft) | A cég | B cég | Piaci kínálat |
| ------- | ----- | ----- | ------------- |
| 100     | 10    | 0     | 10            |
| 200     | 20    | 15    | 35            |
| 300     | 30    | 30    | 60            |

Ugyanígy kapjuk a piaci keresletet az egyéni keresletekből.

## A kínálat rugalmassága

A kínálat is lehet rugalmas vagy rugalmatlan. A **szoftverek** kínálata nagyon rugalmas (egy újabb példány szinte ingyen előállítható), a **lakásoké** rövid távon rugalmatlan (egy ház megépítése évekig tart), a **koncertjegyeké** teljesen rugalmatlan (a terem befogadóképessége adott).

## Összefoglalás

- Kínálat törvénye: magasabb ár → nagyobb kínált mennyiség.
- A kínálati görbe emelkedő.
- Eltolja: tényezőárak, technológia, eladók száma, adó/támogatás, várakozások.
- Piaci kínálat = az egyéni kínálatok összege adott ár mellett.

## A lecke feladata

```quiz required
? Mit mond ki a kínálat törvénye?
- magasabb ár mellett kevesebbet kínálnak
+ magasabb ár mellett többet kínálnak
- az ár nem hat a kínálatra
- a kínálat mindig egyenlő a kereslettel
! Az emelkedő kínálati görbe.

? Drágul az energia egy adatközpontokat üzemeltető cég számára. Mi történik a kínálati görbével?
- jobbra tolódik
+ balra tolódik
- nem mozdul
! Drágább termelési tényező → kisebb kínálat.

? Új, olcsóbb gyártási technológia jelenik meg. Mi történik?
+ a kínálati görbe jobbra tolódik
- a kínálati görbe balra tolódik
- a keresleti görbe balra tolódik
- mozgás a kínálati görbén
! Minden ár mellett többet tudnak kínálni.

? A táblázatban 200 Ft-os árnál mennyi a piaci kínálat?
= 35
! 20 + 15.

? Melyik termék kínálata a legrugalmatlanabb rövid távon?
- egy mobilalkalmazás letöltése
- egy e-könyv
+ jegyek egy adott koncertre
- egy streamelt film
! A terem befogadóképessége rögzített.
```

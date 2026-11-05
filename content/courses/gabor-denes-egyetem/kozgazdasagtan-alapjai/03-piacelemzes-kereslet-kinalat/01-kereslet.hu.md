---
title: A kereslet és az árrugalmasság
summary: A kereslet törvénye, a keresleti görbe, mi tolja el a görbét (jövedelem, helyettesítők, kiegészítők, várakozások), és mennyire érzékeny a vevő az árra.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **kereslet** és a **kereslet törvénye**,
- hogyan rajzolunk **keresleti görbét**,
- mi a különbség a **görbe menti mozgás** és a **görbe eltolódása** között,
- mit mutat a **kereslet árrugalmassága**.

## A kereslet

A **kereslet** megmutatja, hogy a vevők különböző árak mellett **mennyit akarnak és tudnak** megvásárolni egy termékből egy adott időszakban.

**A kereslet törvénye:** ceteris paribus, ha egy termék ára **nő**, a keresett mennyiség **csökken** (és fordítva). Okai:

- **helyettesítési hatás**: a drágább termék helyett mást veszünk (Spotify helyett ingyenes rádió),
- **jövedelemhatás**: a drágulás miatt „szegényebbek” lettünk, kevesebbet tudunk venni.

## A keresleti görbe

Közgazdaságtanban hagyományosan a **függőleges tengelyen az ár (P)**, a **vízszintesen a mennyiség (Q)** van. Egy lineáris keresleti görbe: $P = a - 2Q$.

```plot
title: Keresleti görbe
x: 0, 60
y: 0, 150
param: a = 100, 60, 140, 5
f: a - 2x # kereslet
dash: 100 - 2x # eredeti
```

Az **a** csúszkával a teljes görbe eltolható: ha **a** nő, minden ár mellett többet keresnek (a görbe **jobbra/felfelé** tolódik).

## Mozgás a görbén vagy a görbe eltolódása?

- Ha **maga a termék ára** változik → **mozgás a görbe mentén** (a keresett mennyiség változik).
- Ha **más tényező** változik → **a görbe eltolódik** (a kereslet változik).

A görbét eltoló tényezők:

| Tényező                                            | Hatás a keresletre                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| a vevők **jövedelme** nő                           | normál jószágnál nő (laptop), alsóbbrendűnél csökken (legolcsóbb tészta) |
| a **helyettesítő** termék drágul (pl. PlayStation) | az Xbox kereslete nő                                                     |
| a **kiegészítő** termék drágul (pl. a játékok)     | a konzol kereslete csökken                                               |
| a **várakozások**: drágulásra számítanak           | a mostani kereslet nő                                                    |
| az **ízlés, divat** (egy influencer ajánlja)       | nő                                                                       |
| a **vevők száma** nő (több diák a városban)        | nő                                                                       |

## A kereslet árrugalmassága

Mennyire reagál a keresett mennyiség az árra?

$$ E = \frac{\text{a keresett mennyiség \%-os változása}}{\text{az ár \%-os változása}} $$

Az előjel a kereslet törvénye miatt negatív; az **abszolút értéket** szokás nézni:

| &#124;E&#124; | Elnevezés              | Példa                                         |
| ------------- | ---------------------- | --------------------------------------------- |
| > 1           | **rugalmas**           | egy adott márkájú üdítő, éttermi étel         |
| = 1           | egységnyi rugalmasságú | –                                             |
| < 1           | **rugalmatlan**        | benzin rövid távon, inzulin, villamos energia |

Mitől rugalmas a kereslet? Sok **helyettesítő** van, a termék a költségvetés **nagy része**, nem létszükséglet, és **hosszabb idő** áll rendelkezésre alkalmazkodni.

**Árbevétel és rugalmasság:** az árbevétel $P \cdot Q$.

- Rugalmatlan keresletnél az **áremelés növeli** az árbevételt (a mennyiség alig csökken).
- Rugalmas keresletnél az **áremelés csökkenti** az árbevételt.

**Példa:** egy app ára 1000 Ft-ról 1100 Ft-ra nő (+10%), a letöltések 500-ról 400-ra csökkennek (−20%). $E = -20/10 = -2$, rugalmas. Az árbevétel 500 000 Ft-ról 440 000 Ft-ra **csökken**.

## Összefoglalás

- Kereslet törvénye: magasabb ár → kisebb keresett mennyiség.
- Saját ár változása: mozgás a görbén; más tényező: a görbe eltolódik.
- Normál / alsóbbrendű jószág; helyettesítő / kiegészítő termék.
- Rugalmasság: |E| > 1 rugalmas, < 1 rugalmatlan; ettől függ, hogyan hat az áremelés az árbevételre.

## A lecke feladata

```quiz required
? Drágul a kávé. Mi történik a kávé keresleti görbéjén?
+ mozgás a görbe mentén, kisebb keresett mennyiség
- a görbe jobbra tolódik
- a görbe balra tolódik
- semmi
! A saját ár változása görbe menti mozgás.

? Drágulnak a videójátékok. Mi történik a játékkonzolok keresleti görbéjével?
- jobbra tolódik
+ balra tolódik
- nem változik
! A játék és a konzol kiegészítő termékek.

? A diákok jövedelme nő, és kevesebb legolcsóbb instant tésztát vesznek. Milyen jószág az instant tészta?
- normál
+ alsóbbrendű
- luxus
- közjószág
! Jövedelem nő → kereslet csökken.

? Egy termék ára 5%-kal nő, a keresett mennyiség 15%-kal csökken. Mennyi az árrugalmasság abszolút értéke?
= 3
! 15 / 5 = 3 – rugalmas.

? Rugalmatlan keresletnél (|E| < 1) mi történik az árbevétellel áremelés után?
+ nő
- csökken
- nem változik
! A mennyiség arányaiban kevésbé csökken, mint amennyire az ár nő.
```

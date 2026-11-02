---
title: Logikai változók és igazságtábla
summary: Logikai változó és érték, ponált és negált alak, szöveges feladat átírása logikai kifejezéssé, igazságtábla felírása.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **logikai változó** és milyen értékei lehetnek,
- mit jelent a **ponált** és a **negált** alak,
- hogyan írsz át egy **szöveges feladatot** logikai kifejezéssé,
- hogyan készül az **igazságtábla**.

## Logikai változó

A **logikai változó** olyan mennyiség, amelynek csak **két értéke** lehet. Ugyanazt a két értéket sokféleképpen nevezik:

| 1         | 0       |
| --------- | ------- |
| igaz      | hamis   |
| igen      | nem     |
| be        | ki      |
| magas (H) | alacsony (L) |
| ponált    | negált  |

A változókat általában **nagybetűvel** jelöljük (A, B, C …). Egy változó **ponált** alakja maga a változó (A), **negált** alakja az ellentéte (A̅, más jelöléssel A', ¬A, !A).

## Három alapművelet a hétköznapokban

- **ÉS:** *Ha esik az eső ÉS hideg van → kabátot veszek.* Csak akkor igaz, ha mindkét feltétel igaz.
- **VAGY:** *Ha van jegyem VAGY bérletem → felszállhatok.* Akkor igaz, ha legalább az egyik igaz.
- **NEM:** *Ha NEM zöld a lámpa → megállok.* Az ellentétére fordítja a feltételt.

## Szövegből logikai kifejezés

**Feladat:** *A riasztó megszólal, ha az ajtó nyitva van, és nem adták meg a nyitókódot.*

1. **Változók kijelölése:**
   A = az ajtó nyitva van, K = a kódot megadták, R = a riasztó megszólal.
2. **Logikai kifejezés:** R = A ÉS NEM K, vagyis **R = A · K̅**.
3. **Igazságtábla:** minden bemeneti kombinációra kiszámoljuk a kimenetet.

| A | K | R |
| - | - | - |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | **1** |
| 1 | 1 | 0 |

## Az igazságtábla

Az **igazságtábla** (igazságtáblázat) egy logikai függvény **teljes leírása**: minden lehetséges bemeneti kombinációhoz megadja a kimenet értékét.

- *n* bemenet esetén **2<sup>n</sup> sor** van (2 → 4, 3 → 8, 4 → 16).
- A sorokat a bemenetek **bináris számlálási sorrendjében** írjuk (000, 001, 010, …), így egyik kombináció sem marad ki.
- A sor sorszáma (tízesben) a bemeneti kombináció bináris értéke – erre épül a **minterm-jelölés** (4. témakör).

**Három bemenetű példa:** *A gép csak akkor indul (Y), ha a védőajtó zárva van (Z), és vagy a jobb (J), vagy a bal (B) kezes indítógombot nyomják.* → **Y = Z · (J + B)**

| Z | J | B | Y |
| - | - | - | - |
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 |

```python run
# Igazságtábla generálása: Y = Z ÉS (J VAGY B)
from itertools import product

print("Z J B | Y")
for z, j, b in product((0, 1), repeat=3):   # 000, 001, ... 111 sorrendben
    y = z and (j or b)
    print(z, j, b, "|", int(y))
```

> **Jelölés ebben a tárgyban:** ÉS = `·` (vagy egymás mellé írás: AB), VAGY = `+`, NEM = felülvonás (A̅) vagy aposztróf (A'). A feladatlapokon begépeléskor az aposztróf a legkényelmesebb: `A·K'`.

## Összefoglalás

- A logikai változónak két értéke van (0/1); ponált: A, negált: A̅.
- Szöveges feladat: változók kijelölése → kifejezés → igazságtábla.
- *n* bemenet → 2<sup>n</sup> sor, bináris sorrendben.

## A lecke feladata

```quiz required
? Töltsd ki a riasztó igazságtábláját: R = A · K̅
table: A, K -> R = A·K'
! R csak akkor 1, ha A = 1 és K = 0.

? Hány sora van egy 4 bemenetű függvény igazságtáblájának?
= 16
! 2<sup>n</sup>.

? Töltsd ki: Y = Z · (J + B)
table: Z, J, B -> Y = Z·(J + B)
! Y csak a Z = 1 sorokban lehet 1, és ott is csak, ha J vagy B 1.

? *A lámpa (L) akkor ég, ha éjszaka van (E) és mozgást érzékel a szenzor (M), vagy ha kézzel bekapcsolják (K).* Írd fel L kifejezését!
expr: E, M, K -> E·M + K
! ÉS: `·`, VAGY: `+`.

? *A kazán (Y) akkor indul, ha hideg van (H), és nincs nyitva az ablak (A).* Írd fel Y kifejezését!
expr: H, A -> H·A'
! A „nincs nyitva” a negált alak: A'.
```

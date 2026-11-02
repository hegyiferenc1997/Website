---
title: Flip-flopok – D, JK és T
summary: Élvezérelt D flip-flop és master–slave felépítés, JK és T flip-flop, karakterisztikus egyenletek, vezérlési (gerjesztési) táblák, átalakítások és frekvenciaosztás.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan lesz két tárolóból **élvezérelt** flip-flop (**master–slave**),
- a **D**, a **JK** és a **T** flip-flop működését és **karakterisztikus egyenletét**,
- a **vezérlési** (gerjesztési) **táblát**, amely a tervezéshez kell,
- hogyan **alakítasz át** egyik flip-flopot a másikba,
- a flip-flopok alkalmazásait (frekvenciaosztó, számláló, regiszter).

## Élvezérelt D flip-flop

Két D tárolót sorba kötünk; az első (**master**) a CLK = 0, a második (**slave**) a CLK = 1 szintnél átlátszó. Amikor a CLK **felfut**, a master „bezár” (megjegyzi D-t), a slave pedig kiadja ezt az értéket. Kívülről nézve a kimenet **csak a felfutó élnél** változik:

**Q<sup>+</sup> = D** (a következő aktív élnél)

| CLK | D | Q<sup>+</sup> |
| --- | - | ------------- |
| ↑   | 0 | 0             |
| ↑   | 1 | 1             |
| egyéb | X | Q (tart)    |

A D flip-flop **egy órajelnyi késleltetés** (ezért a „D” = delay/data). Ez a modern digitális tervezés alapeleme: minden regiszter, FPGA-cella és processzor-pipeline D flip-flopokból áll. Ismert IC: **7474** (két D flip-flop, PRE̅ és CLR̅ bemenettel).

## JK flip-flop

A **JK** flip-flop az SR továbbfejlesztése, amelynek **nincs tiltott állapota**: J = K = 1 esetén **átbillen** (toggle). A J és K betűt feltalálója, **Jack Kilby** tiszteletére kapta.

| J | K | Q<sup>+</sup> | művelet  |
| - | - | ------------- | -------- |
| 0 | 0 | Q             | tart     |
| 0 | 1 | 0             | töröl    |
| 1 | 0 | 1             | beír     |
| 1 | 1 | Q̅             | billen   |

**Q<sup>+</sup> = J·Q̅ + K̅·Q**

A régi, szintvezérelt JK tárolónál J = K = 1 és hosszú órajel esetén a kimenet **körbe-körbe** billegett (race-around). Ezt a **master–slave** felépítés vagy az élvezérlés szünteti meg. Ismert IC: **74112**, **7476**.

## T flip-flop

A **T** (toggle, billenő) flip-flopnak egy vezérlő bemenete van: T = 1 esetén minden aktív élnél **átbillen**, T = 0 esetén **tart**.

| T | Q<sup>+</sup> |
| - | ------------- |
| 0 | Q             |
| 1 | Q̅             |

**Q<sup>+</sup> = T ⊕ Q**

Készen ritkán kapható: JK flip-flopból készül, **J = K = T** bekötéssel.

## Vezérlési (gerjesztési) táblák

A karakterisztikus tábla megmondja, **mi lesz** a következő állapot. Tervezéskor fordítva kérdezünk: adott **Q → Q<sup>+</sup> átmenethez milyen vezérlés kell?** Erre való a **vezérlési tábla** (X = közömbös):

| Q → Q<sup>+</sup> | D | T | J | K | S | R |
| ----------------- | - | - | - | - | - | - |
| 0 → 0             | 0 | 0 | 0 | X | 0 | X |
| 0 → 1             | 1 | 1 | 1 | X | 1 | 0 |
| 1 → 0             | 0 | 1 | X | 1 | 0 | 1 |
| 1 → 1             | 1 | 0 | X | 0 | X | 0 |

A JK sok **X**-e miatt JK flip-floppal gyakran a legegyszerűbb a vezérlő logika – ezt a következő témakörben, a számlálóknál használjuk ki.

## Átalakítások

| ebből     | ezt          | bekötés                       |
| --------- | ------------ | ----------------------------- |
| JK        | D            | J = D, K = D̅                  |
| JK        | T            | J = K = T                     |
| D         | T            | D = T ⊕ Q                     |
| D         | JK           | D = J·Q̅ + K̅·Q                 |
| SR        | D            | S = D, R = D̅                  |

Általános módszer: a cél flip-flop karakterisztikus táblájának minden sorához a meglévő flip-flop vezérlési táblájából kiolvassuk a szükséges bemeneteket, majd K-táblával egyszerűsítünk.

## Frekvenciaosztás

Egy T = 1-re kötött T flip-flop (vagy Q̅ → D visszacsatolású D flip-flop) minden **második** élnél ad ki egy teljes periódust: a kimeneti frekvencia **f/2**, 50 %-os kitöltéssel. n darab sorba kötött billenő fokozat **f / 2<sup>n</sup>**-re oszt – így lesz a 32 768 Hz-es órakvarcból 15 osztással pontosan **1 Hz**.

**Alkalmazások:** számlálók, frekvenciaosztók, léptetőregiszterek, adattároló regiszterek, prell-mentesítés, memória.

```python run
# JK flip-flop: egy órajel-sorozat szimulációja
def jk(j, k, q):
    return (j & (1 - q)) | ((1 - k) & q)    # Q+ = J·Q̅ + K̅·Q

q = 0
for j, k in [(1, 0), (0, 0), (1, 1), (1, 1), (0, 1), (1, 1)]:
    q = jk(j, k, q)
    print(f"J={j} K={k} → Q={q}")
```

## Összefoglalás

- Élvezérelt D flip-flop: Q<sup>+</sup> = D, master–slave felépítés.
- JK: Q<sup>+</sup> = JQ̅ + K̅Q, J = K = 1 → billen; T: Q<sup>+</sup> = T ⊕ Q.
- A vezérlési tábla a Q → Q<sup>+</sup> átmenethez szükséges bemeneteket adja (JK-nál sok X).
- Egy billenő fokozat felezi a frekvenciát; n fokozat 2<sup>n</sup>-nel oszt.

## A lecke feladata

```quiz required
? Írd fel a JK flip-flop karakterisztikus egyenletét!
expr: J, K, Q -> J·Q' + K'·Q
! J = K = 1 esetén billen, J = K = 0 esetén tart.

? Töltsd ki a JK flip-flop állapottábláját (Q: jelenlegi, QN: következő állapot)!
table: J, K, Q -> QN = J·Q' + K'·Q

? Írd fel a T flip-flop karakterisztikus egyenletét!
expr: T, Q -> T ⊕ Q
! T = 1: billen, T = 0: tart.

? Milyen J és K vezérlés kell a JK flip-flopon a 0 → 1 átmenethez?
- J = 0, K = 1
+ J = 1, K = X
- J = X, K = 0
- J = 1, K = 1
! Beírással (J = 1, K = 0) vagy billentéssel (J = 1, K = 1) is 1 lesz.

? Hogyan kötöd be a JK flip-flopot, hogy D flip-flopként működjön?
+ J = D, K = D̅
- J = K = D
- J = D̅, K = D
- J = 1, K = D

? Egy 16 MHz-es órajel három sorba kötött, T = 1-re kötött T flip-flopon megy át. Hány MHz a kimeneti frekvencia?
= 2
= 2MHz
! Minden fokozat felez: 16 / 2³.
```

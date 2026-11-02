---
title: Összeadók – fél-, teljes és több bites összeadó
summary: Félösszeadó, teljes összeadó, soros átvitelű (ripple-carry) és előrelátó átvitelű (carry-lookahead) összeadó, kivonás kettes komplemenssel, túlcsordulás.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- a **félösszeadó** és a **teljes összeadó** igazságtábláját és képletét,
- hogyan épül fel egy **több bites** összeadó teljes összeadókból,
- mi az **átvitel terjedési ideje**, és hogyan gyorsít rajta a **carry-lookahead**,
- hogyan lesz az összeadóból **kivonó** (kettes komplemens),
- hogyan jelezzük a **túlcsordulást**.

## Félösszeadó (half adder)

Két egybites számot ad össze: kimenete az **összeg** (S) és az **átvitel** (C, carry).

| A | B | S | C |
| - | - | - | - |
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

**S = A ⊕ B**, **C = A · B** – egy XOR és egy ÉS kapu.

A neve azért „fél”, mert **nem tud bejövő átvitelt** fogadni, így csak a legalsó helyiértéken használható.

## Teljes összeadó (full adder)

Három bitet ad össze: A, B és a bejövő átvitel **C<sub>in</sub>**. Kimenetei: S és C<sub>out</sub>.

| A | B | C<sub>in</sub> | S | C<sub>out</sub> |
| - | - | -------------- | - | --------------- |
| 0 | 0 | 0              | 0 | 0               |
| 0 | 0 | 1              | 1 | 0               |
| 0 | 1 | 0              | 1 | 0               |
| 0 | 1 | 1              | 0 | 1               |
| 1 | 0 | 0              | 1 | 0               |
| 1 | 0 | 1              | 0 | 1               |
| 1 | 1 | 0              | 0 | 1               |
| 1 | 1 | 1              | 1 | 1               |

- **S = A ⊕ B ⊕ C<sub>in</sub>** – az összeg 1, ha páratlan számú bemenet 1.
- **C<sub>out</sub> = A·B + C<sub>in</sub>·(A ⊕ B)** – vagy K-táblával egyszerűsítve a **többségi függvény**: C<sub>out</sub> = AB + AC<sub>in</sub> + BC<sub>in</sub>.

Felépíthető **két félösszeadóból és egy VAGY kapuból**: az első félösszeadó A-t és B-t adja össze, a második az eredményhez hozzáadja C<sub>in</sub>-t, a két átvitelt pedig VAGY kapu egyesíti.

## Több bites, soros átvitelű összeadó (ripple-carry)

n bites számokhoz **n darab teljes összeadót** kötünk sorba: az i. fokozat C<sub>out</sub> kimenete az (i+1). fokozat C<sub>in</sub> bemenete. A legalsó fokozat C<sub>in</sub>-je 0 (vagy ott félösszeadó áll).

**Példa:** 0111 + 0101

```text
átvitel:   1 1 1 0
           0 1 1 1   (7)
         + 0 1 0 1   (5)
         ---------
           1 1 0 0   (12)
```

**Hátrány:** az átvitel fokozatról fokozatra **végigfut** (ripple = hullámzik). Ha egy fokozat átviteli késleltetése t<sub>c</sub>, akkor a legrosszabb esetben az n bites összeadó kb. **n · t<sub>c</sub>** idő után ad helyes eredményt. 32–64 bitnél ez már túl lassú.

## Előrelátó átvitel (carry-lookahead, CLA)

Minden fokozatra két segédjelet képzünk:

- **G<sub>i</sub> = A<sub>i</sub> · B<sub>i</sub>** – **generate**: ez a fokozat mindenképp átvitelt *állít elő*;
- **P<sub>i</sub> = A<sub>i</sub> ⊕ B<sub>i</sub>** – **propagate**: ez a fokozat a bejövő átvitelt *továbbadja*.

Ekkor C<sub>i+1</sub> = G<sub>i</sub> + P<sub>i</sub>·C<sub>i</sub>, és ezt kifejtve minden átvitel **közvetlenül** a bemenetekből számolható:

C<sub>2</sub> = G<sub>1</sub> + P<sub>1</sub>G<sub>0</sub> + P<sub>1</sub>P<sub>0</sub>C<sub>0</sub>

A kétszintű logika miatt az átvitel ideje **nem nő** a bitszámmal (csak a kapuk bemenetszáma). A gyakorlatban 4 bites CLA blokkokat kaszkádosítanak (pl. 74283 – 4 bites gyors összeadó, a 74182 – átvitel-előrejelző).

## Kivonás: összeadó-kivonó

A kettes komplemens miatt **A − B = A + B̅ + 1**. Egy vezérlőjellel (M) az összeadóból kivonó lesz:

- B minden bitje egy **XOR kapun** megy át: B<sub>i</sub> ⊕ M (M = 1 esetén negál),
- és **C<sub>in</sub> = M** (ez a „+1”).

M = 0 → A + B; M = 1 → A − B.

**Példa:** 0110 − 0011 = 0110 + 1100 + 1 = **1 0011** → az átvitelt elhagyva **0011** (6 − 3 = 3).

## Túlcsordulás (overflow)

Előjeles (kettes komplemens) számoknál túlcsordulás akkor van, ha **két azonos előjelű szám összege ellenkező előjelű**. Hardveresen: **V = C<sub>n</sub> ⊕ C<sub>n−1</sub>** (az előjelbitbe érkező és az onnan kimenő átvitel eltér). Előjel nélküli számoknál az utolsó átvitel (C<sub>n</sub>) jelzi a túlcsordulást.

Ez az a „flag”, amelyet a processzorok **ALU**-ja (aritmetikai-logikai egység) a carry (C) és overflow (V) jelzőbitbe ír.

```python run
# Teljes összeadó és 4 bites ripple-carry összeadó bitenként
def teljes_osszeado(a, b, c):
    s = a ^ b ^ c
    c_ki = (a & b) | (c & (a ^ b))
    return s, c_ki

def ripple(a_bitek, b_bitek):
    # a bitek listája a legalsó helyiértéktől kezdve
    c, osszeg = 0, []
    for a, b in zip(a_bitek, b_bitek):
        s, c = teljes_osszeado(a, b, c)
        osszeg.append(s)
    return osszeg, c

a = [1, 1, 1, 0]   # 0111 = 7 (fordított sorrendben)
b = [1, 0, 1, 0]   # 0101 = 5
s, c = ripple(a, b)
print("összeg:", "".join(map(str, reversed(s))), "átvitel:", c)
```

## Összefoglalás

- Félösszeadó: S = A ⊕ B, C = AB. Teljes összeadó: S = A ⊕ B ⊕ C<sub>in</sub>, C<sub>out</sub> = AB + C<sub>in</sub>(A ⊕ B).
- A ripple-carry összeadó egyszerű, de az átvitel végigfut rajta (n · t<sub>c</sub>).
- A carry-lookahead G = AB és P = A ⊕ B jelekkel párhuzamosan számolja az átviteleket.
- Kivonás: A + B̅ + 1; túlcsordulás: V = C<sub>n</sub> ⊕ C<sub>n−1</sub>.

## A lecke feladata

```quiz required
? Töltsd ki a félösszeadó igazságtábláját (S: összeg, C: átvitel)!
table: A, B -> S = A ⊕ B; C = A·B
! Az átvitel csak 1 + 1 esetén 1.

? Töltsd ki a teljes összeadó igazságtábláját! (A harmadik bemenet, C a bejövő átvitel; Co a kimenő átvitel.)
table: A, B, C -> S = A ⊕ B ⊕ C; Co = A·B + C·(A ⊕ B)
! S akkor 1, ha páratlan számú bemenet 1; Co akkor, ha legalább kettő.

? Egyszerűsítsd a kimenő átvitelt kétszintű ÉS–VAGY alakra: Co = AB + C(A ⊕ B)!
expr: A, B, C -> AB + AC + BC
limit: 6
same: A·B + C·(A ⊕ B)
! Ez a többségi függvény.

? Mennyi 0111 + 0101 négy biten (binárisan)?
= 1100
! 7 + 5 = 12.

? Számold ki kettes komplemenssel, négy biten: 0110 − 0011 (binárisan)!
= 0011
! 0110 + 1100 + 1, a kilépő átvitelt elhagyjuk.

? A carry-lookahead összeadóban mi a „generate” jel?
+ G = A·B
- G = A + B
- G = A ⊕ B
- G = A̅·B̅
! A fokozat akkor állít elő átvitelt, ha mindkét bit 1.

? Egy 16 bites ripple-carry összeadóban egy fokozat átviteli késleltetése 3 ns. Legrosszabb esetben hány ns alatt fut végig az átvitel?
= 48
= 48ns
! n · t_c
```

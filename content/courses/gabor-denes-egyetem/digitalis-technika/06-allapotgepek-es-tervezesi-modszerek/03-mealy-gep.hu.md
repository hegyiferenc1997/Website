---
title: Mealy-gép – kimenet a bemenettől is
summary: A lámpavezérlő módosítása Mealy-géppé, egy átlapolódó „101” sorozatfelismerő tervezése Mealy- és Moore-modellel, a két modell összevetése.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- mikor lesz egy gép **Mealy-gép**,
- hogyan módosul a lámpavezérlő, ha a kimenet a **gomboktól is** függ,
- hogyan tervezel **sorozatfelismerőt** (101) Mealy- és Moore-modellel,
- mik a Mealy-gép **előnyei és veszélyei**.

## A lámpavezérlő módosítása

Az előző lecke feladatát egészítsük ki: **amíg valamelyik nyomógomb nyomva van, egyik lámpa se világítson.**

Az állapotgép (D<sup>+</sup> = PZ̅ + DZ̅ + DP) **nem változik** – csak a kimeneti logika:

- **piros lámpa = D · (P + Z)̅ = D · P̅ · Z̅**
- **zöld lámpa = D̅ · (P + Z)̅ = D̅ · P̅ · Z̅**

A kimenet most már az állapottól **és a bemenetektől** is függ – ez egy **Mealy-gép**. Gombnyomáskor a lámpa **azonnal** kialszik, nem vár a következő órajelre.

## Sorozatfelismerő: „101”

Feladat: egy soros bemeneten (x) bitenként, órajelenként érkezik az adat. A kimenet (y) legyen 1, amikor az **utolsó három bit 101** volt. A felismerések **átlapolódhatnak**: a 10101 sorozatban kétszer is felismerünk.

### Mealy-megoldás – 3 állapot

Az állapot azt tárolja, **mennyit láttunk már** a keresett mintából:

- **A** – semmi (kezdőállapot),
- **B** – „1” jött,
- **C** – „10” jött.

| állapot | x = 0     | x = 1     |
| ------- | --------- | --------- |
| A       | A / 0     | B / 0     |
| B       | C / 0     | B / 0     |
| C       | A / 0     | **B / 1** |

(A „/” után a kimenet.) A C állapotban érkező 1 teljesíti a mintát: y = 1, és mivel ez az 1 egy új minta eleje is lehet, B-be lépünk – így lesz átlapolódó.

**Kódolás:** A = 00, B = 01, C = 10 (Q1 Q0); a 11 nem használt (közömbös). A táblából:

- **Q0<sup>+</sup> = x** (x = 1 esetén mindig B-be lépünk),
- **Q1<sup>+</sup> = Q0 · x̅** (C-be csak B-ből, x = 0-val),
- **y = Q1 · x** – a kimenetben ott van az x bemenet: Mealy-gép.

Bemenet 1, 0, 1, 0, 1 → kimenet **0, 0, 1, 0, 1**.

### Moore-megoldás – 4 állapot

Moore-gépben a kimenet csak az állapottól függhet, ezért kell egy külön „**megtaláltam**” állapot:

| állapot / kimenet | x = 0 | x = 1 |
| ----------------- | ----- | ----- |
| A / 0             | A     | B     |
| B / 0             | C     | B     |
| C / 0             | A     | D     |
| **D / 1**         | C     | B     |

A D állapotból a „01”-et már „10”-ként (C) vagy „1”-ként (B) folytatjuk. A kimenet **egy órajellel később**, de **tisztán, órajelhez igazítva** jelenik meg.

## Mealy vagy Moore?

| szempont              | Mealy                                         | Moore                                   |
| --------------------- | --------------------------------------------- | --------------------------------------- |
| állapotok száma       | kevesebb (itt 3)                              | több (itt 4)                            |
| reakció               | azonnal, ugyanabban az ütemben                | egy órajellel később                    |
| kimenet               | a bemenet tüskéi, zaja **átjuthat** a kimenetre | stabil, csak órajel élen változik     |
| időzítés              | hosszabb kombinációs út (bemenet → kimenet)   | rövidebb, könnyebb időzíteni            |

A gyakorlatban gyakran a Mealy-gép kimenetét is egy flip-floppal **regisztrálják** – így tiszta lesz, de egy ütemmel késik, mint a Moore-gép.

```python run
# A "101" Mealy-felismerő a kódolt egyenletekkel
def lepes(q1, q0, x):
    return q0 & (1 - x), x, q1 & x        # Q1+, Q0+, y

q1 = q0 = 0
bemenet = [1, 0, 1, 0, 1, 1, 0, 1]
kimenet = []
for x in bemenet:
    q1, q0, y = lepes(q1, q0, x)
    kimenet.append(y)
print("be: ", bemenet)
print("ki: ", kimenet)
```

## Összefoglalás

- Mealy-gép: a kimenet az állapot és a bemenet függvénye; azonnal reagál.
- Lámpavezérlő Mealy-kimenettel: piros = D·P̅·Z̅, zöld = D̅·P̅·Z̅.
- 101-felismerő: Mealy 3 állapot (Q0<sup>+</sup> = x, Q1<sup>+</sup> = Q0x̅, y = Q1x), Moore 4 állapot.
- Mealy: kevesebb állapot, gyorsabb, de a bemenet zaja a kimenetre juthat.

## A lecke feladata

```quiz required
? Írd fel a módosított lámpavezérlő piros lámpájának kimeneti függvényét (gombnyomás közben nem világít)!
expr: D, P, Z -> D·P'·Z'
! A lámpa csak akkor ég, ha az állapot piros, és egyik gomb sincs nyomva.

? Hány állapot kell az átlapolódó „101” felismerőhöz Mealy-géppel?
= 3

? És Moore-géppel?
= 4
! Kell egy külön állapot, amelynek kimenete 1.

? A Mealy-felismerő bemenetére sorban 1, 0, 1, 0, 1 érkezik. Mi a kimeneti sorozat? (Írd egybe, pl. 01010)
= 00101
! Átlapolódás: a második 101 az első utolsó 1-esével kezdődik.

? A Mealy-felismerő kódolása A = 00, B = 01, C = 10 (Q1 Q0), a 11 nem használt. Add meg az y kimenet függvényét!
expr: Q1, Q0, X -> Q1·X
limit: 2
dc: 6, 7
! A kimenet akkor 1, ha a C állapotban 1 érkezik.

? Ugyanebben a kódolásban add meg a Q1 következő állapotát!
expr: Q1, Q0, X -> Q0·X'
limit: 2
dc: 6, 7
! A C állapotba csak B-ből, 0 bemenettel lépünk.

? Mi a Mealy-gép egyik veszélye a Moore-géppel szemben?
- Több flip-flop kell hozzá.
+ A bemenet tüskéi és zaja közvetlenül a kimenetre juthatnak.
- Egy órajellel később reagál.
- Nem lehet D flip-floppal megvalósítani.
```

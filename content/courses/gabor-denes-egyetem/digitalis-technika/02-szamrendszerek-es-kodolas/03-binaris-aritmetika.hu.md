---
title: Bináris aritmetika
summary: Összeadás átvitellel, kivonás áthozattal, szorzás és osztás kettes számrendszerben, túlcsordulás előjel nélküli számoknál.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a bináris **összeadás** szabályait és az **átvitelt** (carry),
- a bináris **kivonást** és az **áthozatot** (borrow),
- a **szorzást** (eltolás + összeadás) és az osztás elvét,
- mikor van **túlcsordulás** előjel nélküli számoknál.

A kettes számrendszerbeli műveletek ugyanúgy működnek, mint a tízesben – csak két számjegyünk van.

## Összeadás

| A   | B   | összeg | átvitel |
| --- | --- | ------ | ------- |
| 0   | 0   | 0      | 0       |
| 0   | 1   | 1      | 0       |
| 1   | 0   | 1      | 0       |
| 1   | 1   | 0      | **1**   |

Vagyis 1 + 1 = 10<sub>2</sub>: leírjuk a 0-t, és 1-et viszünk tovább. Három egyes összege: 1 + 1 + 1 = 11<sub>2</sub> (leírunk 1-et, viszünk 1-et).

```text
   átvitel:  1 1 1
             1 0 1 1      (11)
           + 0 1 1 0      ( 6)
           ─────────
           1 0 0 0 1      (17)
```

> Figyeld meg: a bit-összeg pontosan az **XOR**, az átvitel pedig az **ÉS** művelet. Ebből épül fel a félösszeadó és a teljes összeadó (4. témakör).

## Kivonás

| A   | B   | különbség | áthozat |
| --- | --- | --------- | ------- |
| 0   | 0   | 0         | 0       |
| 1   | 0   | 1         | 0       |
| 1   | 1   | 0         | 0       |
| 0   | 1   | 1         | **1**   |

0 − 1-nél „kölcsönkérünk” a következő helyiértékről (az ott 2-t ér): 10<sub>2</sub> − 1 = 1, és a következő helyen eggyel többet vonunk le.

```text
             1 1 0 0      (12)
           − 0 1 0 1      ( 5)
           ─────────
             0 1 1 1      ( 7)
```

A számítógépek a kivonást a gyakorlatban **kettes komplemens hozzáadásával** végzik – erről a következő leckében lesz szó.

## Szorzás

A bináris szorzótábla nagyon rövid: 0·0 = 0, 0·1 = 0, 1·0 = 0, 1·1 = 1 (ez az **ÉS** művelet). A szorzás **eltolásokból és összeadásokból** áll: ahol a szorzó bitje 1, ott a szorzandót a megfelelő helyre tolva hozzáadjuk.

```text
         1 1 0 1      (13)
       ×   1 0 1      ( 5)
       ─────────
         1 1 0 1      ← 1 · 1101
       0 0 0 0        ← 0 · 1101, egy hellyel balra
   + 1 1 0 1          ← 1 · 1101, két hellyel balra
   ─────────────
     1 0 0 0 0 0 1    (65)
```

**Hasznos trükk:** 2-vel szorozni = egy hellyel **balra** tolni (`x << 1`), 2-vel osztani = egy hellyel **jobbra** tolni (`x >> 1`, a maradék elvész).

## Osztás

Az osztás az írásbeli osztás mintáját követi: minden lépésben eldöntjük, hogy az osztó „belefér-e” (ekkor 1 a hányados bitje, és kivonunk), vagy nem (0). Pl. 1101<sub>2</sub> : 11<sub>2</sub> = 100<sub>2</sub>, maradék 1 (13 : 3 = 4, maradék 1).

## Túlcsordulás előjel nélküli számoknál

Ha az eredmény nem fér el a rendelkezésre álló biteken, **túlcsordulás** (_overflow_) történik. Előjel nélküli összeadásnál ezt a **legfelső helyiértékből kilépő átvitel** jelzi: 4 biten 1011 + 0110 = 1 0001 → a 4 bites eredmény 0001 (1), ami hibás, az 5. bit (carry) jelzi a túlcsordulást.

```python run
# Bináris műveletek Pythonban, 4 bites korlátozással
a, b = 0b1011, 0b0110
osszeg = a + b
print(format(osszeg, "b"), "=", osszeg)
print("4 biten:", format(osszeg & 0b1111, "04b"), "túlcsordulás:", osszeg > 0b1111)
print(format(0b1101 * 0b101, "b"))          # szorzás: 13 · 5 = 65
print(0b1101 << 1, 0b1101 >> 1)             # eltolások: ·2 és :2
```

## Összefoglalás

- 1 + 1 = 10<sub>2</sub> (összeg = XOR, átvitel = ÉS).
- 0 − 1 → áthozat a következő helyiértékről.
- Szorzás = eltolások és összeadások; balra tolás = ·2.
- Előjel nélküli túlcsordulás: kilépő átvitel a legfelső bitből.

## A lecke feladata

```quiz required
? Mennyi 1011<sub>2</sub> + 0111<sub>2</sub>? (kettesben)
= 10010
! 11 + 7 = 18.

? Mennyi 10010<sub>2</sub> − 00111<sub>2</sub>? (kettesben, vezető nullák nélkül)
= 1011
! 18 − 7 = 11.

? Mennyi 1101<sub>2</sub> · 11<sub>2</sub>? (kettesben)
= 100111
! 13 · 3 = 39: 1101 + 11010.

? Mennyi 1 + 1 + 1 kettes számrendszerben?
= 11
! Összeg 1, átvitel 1.

? 4 bites, előjel nélküli összeadásnál melyik okoz túlcsordulást?
- 0011 + 0100
- 0111 + 0001
+ 1001 + 1000
- 0101 + 0101
! 4 biten a legnagyobb érték 15; nézd meg, melyik összeg nagyobb ennél.

? Mennyi lesz 00010110<sub>2</sub> két hellyel balra tolva (8 biten, kettesben)?
= 01011000
= 1011000
! Két hellyel balra tolás = szorzás 4-gyel: 22 · 4 = 88.
```

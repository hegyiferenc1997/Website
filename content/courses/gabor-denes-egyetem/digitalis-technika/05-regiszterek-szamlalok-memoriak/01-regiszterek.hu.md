---
title: Regiszterek – tároló- és léptetőregiszterek
summary: Párhuzamos tárolóregiszter, léptetőregiszter (SISO, SIPO, PISO, PIPO), kétirányú léptetés, gyűrűs és Johnson-számláló, soros–párhuzamos átalakítás.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi a **regiszter**, és hogyan épül fel D flip-flopokból,
- a **tárolóregiszter** és a **léptetőregiszter** működését,
- a négy léptetési módot: **SISO, SIPO, PISO, PIPO**,
- hogyan lesz léptetésből **szorzás és osztás kettővel**,
- a **gyűrűs** és a **Johnson-számlálót**.

## Mi a regiszter?

A **regiszter** n darab, **közös órajelű** flip-flop, amely egy n bites szót tárol. A processzor regiszterei a leggyorsabb tárolók: itt vannak az éppen feldolgozott adatok, címek és az utasításszámláló.

## Tárolóregiszter (párhuzamos regiszter)

Minden bit egy D flip-flop; az órajel élénél **egyszerre** veszik át a D<sub>0</sub>…D<sub>n−1</sub> bemenetek értékét. Egy **LOAD** (vagy engedélyező) jellel szabályozzuk, hogy az adott élnél betöltsön-e:

**Q<sub>i</sub><sup>+</sup> = LOAD·D<sub>i</sub> + LOAD̅·Q<sub>i</sub>**

(Ez egy 2:1 multiplexer minden flip-flop előtt: vagy az új adatot, vagy a saját kimenetét tölti vissza.) Gyakori kiegészítés a **törlés** (CLR) és a **háromállapotú kimenet**, hogy a regiszter buszra köthető legyen.

## Léptetőregiszter (shift register)

A flip-flopok **láncba** vannak kötve: mindegyik D bemenete az előző Q kimenete. Minden órajelnél minden bit **egy hellyel arrébb lép**, az első flip-flopba a **soros bemenet** (SI) értéke kerül.

**Példa** – 4 bites regiszter, a soros bemenet a bal szélső bitbe lép, a tartalom jobbra tolódik. Kezdetben 0000, a bemenetre sorban 1, 1, 0, 1 érkezik:

| él | SI | tartalom |
| -- | -- | -------- |
| –  | –  | 0000     |
| 1  | 1  | 1000     |
| 2  | 1  | 1100     |
| 3  | 0  | 0110     |
| 4  | 1  | 1011     |

### A négy működési mód

| mód      | bemenet    | kimenet    | felhasználás                                  |
| -------- | ---------- | ---------- | --------------------------------------------- |
| **SISO** | soros      | soros      | késleltetés n órajellel                       |
| **SIPO** | soros      | párhuzamos | soros → párhuzamos (pl. UART vevő, **74HC595**) |
| **PISO** | párhuzamos | soros      | párhuzamos → soros (pl. UART adó, **74HC165**) |
| **PIPO** | párhuzamos | párhuzamos | tárolóregiszter                               |

A **74HC595** népszerű az Arduino-s projektekben: három vezetékkel 8 (kaszkádosítva akár 16, 24 …) kimenetet vezérel.

**Kétirányú (univerzális) léptetőregiszter:** egy vezérlőjellel választható a balra vagy jobbra léptetés, a párhuzamos betöltés és a tartás (pl. **74194**).

## Léptetés = szorzás és osztás

Bináris számnál egy hellyel **balra** léptetés **2-vel szoroz**, **jobbra** léptetés **2-vel oszt** (egészrészt képez):

- 0011 (3) ← balra → 0110 (6)
- 0110 (6) → jobbra → 0011 (3)

Előjeles számnál jobbra léptetéskor az előjelbitet meg kell ismételni (**aritmetikai** léptetés). A processzorok ezért gyorsan szoroznak 2 hatványaival (`x << 3` = 8x).

## Gyűrűs számláló és Johnson-számláló

Ha a léptetőregiszter kimenetét **visszacsatoljuk** a bemenetére, számlálót kapunk:

- **Gyűrűs számláló** (ring counter): Q<sub>n−1</sub> → D<sub>0</sub>. Egyetlen 1-est léptet körbe: 1000 → 0100 → 0010 → 0001 → 1000. n flip-flop → **n állapot**. Kimenete dekódolás nélkül használható (pl. léptetőmotor fázisai).
- **Johnson-számláló** (csavart gyűrű): Q̅<sub>n−1</sub> → D<sub>0</sub>. 0000 → 1000 → 1100 → 1110 → 1111 → 0111 → 0011 → 0001 → 0000. n flip-flop → **2n állapot**, és egyszerre mindig csak **egy bit változik** (nincs dekódolási tüske).

**Kitekintés – LFSR:** ha a visszacsatolás néhány bit XOR-ja, **lineárisan visszacsatolt léptetőregisztert** kapunk, amely ál-véletlen sorozatot állít elő (CRC-számítás, titkosítás, tesztminták).

```python run
# 4 bites léptetőregiszter, gyűrűs és Johnson-számláló szimulációja
def leptet(reg, be):
    return [be] + reg[:-1]          # a soros bemenet balra lép be, minden bit jobbra tolódik

reg = [0, 0, 0, 0]
for be in [1, 1, 0, 1]:
    reg = leptet(reg, be)
print("léptetőregiszter:", "".join(map(str, reg)))

gyuru, johnson = [1, 0, 0, 0], [0, 0, 0, 0]
for _ in range(8):
    print("gyűrűs:", "".join(map(str, gyuru)), " Johnson:", "".join(map(str, johnson)))
    gyuru = leptet(gyuru, gyuru[-1])
    johnson = leptet(johnson, 1 - johnson[-1])
```

## Összefoglalás

- Regiszter: n közös órajelű D flip-flop; tárolóregiszter LOAD jellel.
- Léptetőregiszter: SISO, SIPO, PISO, PIPO; soros ↔ párhuzamos átalakítás.
- Balra léptetés ×2, jobbra léptetés ÷2.
- Gyűrűs számláló: n állapot; Johnson-számláló: 2n állapot.

## A lecke feladata

```quiz required
? Egy 4 bites léptetőregiszter kezdetben 0000; a soros bemenet a bal szélső bitbe lép, minden él jobbra tolja a tartalmat. A bemenetre sorban 1, 0, 1, 1 érkezik. Mi a tartalom a 4. él után?
= 1101
! 1000 → 0100 → 1010 → 1101.

? Melyik mód alakít át soros adatot párhuzamossá?
- SISO
+ SIPO
- PISO
- PIPO
! Soros bemenet, párhuzamos kimenet.

? A 0101 (5) bináris számot egy hellyel balra léptetjük (4 biten). Mennyi az eredmény tízes számrendszerben?
= 10
! Balra léptetés = szorzás 2-vel.

? Hány különböző állapota van egy 4 flip-flopos gyűrűs számlálónak?
= 4

? Hány különböző állapota van egy 4 flip-flopos Johnson-számlálónak?
= 8
! 2n állapot.

? Egy LOAD jellel vezérelt tárolóregiszter egy bitje: mi a következő állapot (Q: jelenlegi, L: LOAD, D: adat)?
expr: L, D, Q -> L·D + L'·Q
! LOAD = 1: betölt, LOAD = 0: tart.
```

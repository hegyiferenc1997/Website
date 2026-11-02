---
title: Multiplexer és demultiplexer
summary: Adatválasztó (MUX) és adatelosztó (DEMUX) felépítése, kiválasztó és engedélyező bemenetek, 4:1 MUX és 1:4 DEMUX, logikai függvény megvalósítása multiplexerrel.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi a **multiplexer** (MUX, adatválasztó) és a **demultiplexer** (DEMUX, adatelosztó),
- hogyan működik a **kiválasztó** (select) és az **engedélyező** (enable) bemenet,
- a **2:1, 4:1** MUX és az **1:4** DEMUX függvényét,
- hogyan valósítasz meg **tetszőleges logikai függvényt** multiplexerrel,
- hol használják ezeket a gyakorlatban.

## A multiplexer

A **multiplexer** több adatbemenet közül **egyet kapcsol a kimenetre** – azt, amelyiknek a sorszámát a **kiválasztó bemenetek** binárisan megadják. Olyan, mint egy forgókapcsoló, csak elektronikusan.

- 2<sup>n</sup> adatbemenethez **n kiválasztó** bemenet kell: 2:1 → 1, 4:1 → 2, 8:1 → 3, 16:1 → 4.
- Sokszor van **engedélyező** (enable, E̅, gyakran aktív alacsony) bemenete: tiltott állapotban a kimenet 0.

### 2:1 multiplexer

| S   | Y   |
| --- | --- |
| 0   | D0  |
| 1   | D1  |

**Y = S̅·D0 + S·D1**

### 4:1 multiplexer

| S1 S0 | Y   |
| ----- | --- |
| 0 0   | D0  |
| 0 1   | D1  |
| 1 0   | D2  |
| 1 1   | D3  |

**Y = S̅1·S̅0·D0 + S̅1·S0·D1 + S1·S̅0·D2 + S1·S0·D3**

Minden adatbemenethez tartozik egy ÉS kapu, amely csak a „saját” kiválasztó kombinációjánál enged át; a négy ÉS kaput egy VAGY kapu gyűjti össze. Az ÉS kapukat valójában egy **2→4 dekóder** vezérli (következő lecke).

## A demultiplexer

A **demultiplexer** fordítva működik: **egy** adatbemenetet a kiválasztó bemenetek szerint **több kimenet egyikére** irányít; a többi kimenet 0.

### 1:4 demultiplexer

| S1 S0 | Y0  | Y1  | Y2  | Y3  |
| ----- | --- | --- | --- | --- |
| 0 0   | D   | 0   | 0   | 0   |
| 0 1   | 0   | D   | 0   | 0   |
| 1 0   | 0   | 0   | D   | 0   |
| 1 1   | 0   | 0   | 0   | D   |

Y0 = D·S̅1·S̅0, Y1 = D·S̅1·S0, **Y2 = D·S1·S̅0**, Y3 = D·S1·S0

Ha a D bemenetet engedélyezőnek tekintjük, a demultiplexer egy **dekóder engedélyezéssel** – ezért a katalógusok gyakran „dekóder/demultiplexer” néven adják (pl. 74139, 74155).

## Logikai függvény multiplexerrel

Egy multiplexer **univerzális függvénygenerátor**:

**1. módszer – 2<sup>n</sup>:1 MUX, n változó:** a változók a kiválasztó bemenetekre kerülnek, az adatbemenetekre pedig az igazságtábla kimeneti oszlopa (0 vagy 1 konstans). Egy 8:1 MUX bármelyik háromváltozós függvényt megvalósítja.

**2. módszer – 2<sup>n−1</sup>:1 MUX, n változó:** az első n−1 változó a kiválasztó, az utolsó változó (vagy negáltja, 0, 1) az adatbemenet. Ez a **Shannon-kifejtés**: F = A̅·F(A=0) + A·F(A=1).

**Példa – többségi függvény 4:1 MUX-szal** (kiválasztó: A, B; adat: C-ből):

| A B | F a C függvényében | adatbemenet |
| --- | ------------------ | ----------- |
| 0 0 | 0 (mindig)         | D0 = 0      |
| 0 1 | 1, ha C = 1        | D1 = C      |
| 1 0 | 1, ha C = 1        | D2 = C      |
| 1 1 | 1 (mindig)         | D3 = 1      |

Az FPGA-k logikai cellái (**LUT**, look-up table) pontosan így működnek: egy kis memória tárolja az igazságtáblát, és egy multiplexer választja ki a bemenetek szerinti sort.

## Felhasználás

- **Adatút-választás:** a processzor ALU-ja elé MUX választja ki, honnan jön az operandus (regiszter vagy konstans).
- **Párhuzamos → soros átalakítás:** a kiválasztó bemeneteket egy számláló lépteti, így a párhuzamos bitek egymás után jelennek meg a kimeneten.
- **Időosztásos átvitel** (TDM): több jel egy vezetéken; a vevő oldalon DEMUX osztja szét.
- **Kijelző-multiplexelés:** több 7 szegmenses számjegy felváltva kap adatot.

Ismert IC-k: **74157** (4× 2:1), **74153** (2× 4:1), **74151** (8:1), **74139** (2× 1:4 DEMUX / 2→4 dekóder).

```python run
# 4:1 multiplexer és a többségi függvény megvalósítása vele
def mux4(s1, s0, d):
    return d[2 * s1 + s0]          # a kiválasztó bitek binárisan adják a sorszámot

for a in (0, 1):
    for b in (0, 1):
        for c in (0, 1):
            f = mux4(a, b, [0, c, c, 1])
            print(a, b, c, "→", f)
```

## Összefoglalás

- MUX: 2<sup>n</sup> adatbemenet, n kiválasztó, 1 kimenet; DEMUX: 1 bemenet, n kiválasztó, 2<sup>n</sup> kimenet.
- 4:1 MUX: Y = S̅1S̅0D0 + S̅1S0D1 + S1S̅0D2 + S1S0D3.
- Multiplexerrel bármely logikai függvény megvalósítható (Shannon-kifejtés, FPGA LUT).

## A lecke feladata

```quiz required
? Töltsd ki a 2:1 multiplexer igazságtábláját!
table: S, D0, D1 -> Y = S'·D0 + S·D1
! S = 0 esetén D0, S = 1 esetén D1 jut a kimenetre.

? Hány kiválasztó bemenete van egy 8:1 multiplexernek?
= 3
! 2^3 = 8.

? Egy 4:1 multiplexeren S1 S0 = 10. Melyik adatbemenet (D-sorszám) jut a kimenetre?
= 2
= D2
! 10 binárisan 2.

? Egy 4:1 multiplexer adatbemenetei: D0 = 0, D1 = 1, D2 = 1, D3 = 0. Milyen függvényét valósítja meg a kiválasztó bemeneteknek (S1, S0)? Írd fel kifejezésként!
expr: S1, S0 -> S1 ⊕ S0
! A kimenet akkor 1, ha S1 S0 = 01 vagy 10.

? Add meg az 1:4 demultiplexer Y2 kimenetét!
expr: D, S1, S0 -> D·S1·S0'
! Y2 akkor kapja meg D-t, ha S1 S0 = 10.

? A háromváltozós többségi függvényt 4:1 MUX-szal valósítjuk meg (kiválasztó: A, B). Mi kerül a D0, D1, D2, D3 bemenetekre?
- 0, 0, 0, 1
+ 0, C, C, 1
- C, 0, 0, C
- 1, C, C, 0
! AB = 00: sosem többség; 11: mindig; 01 és 10: C dönt.
```

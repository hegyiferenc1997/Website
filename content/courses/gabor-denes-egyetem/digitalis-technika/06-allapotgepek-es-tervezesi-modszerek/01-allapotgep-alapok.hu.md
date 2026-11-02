---
title: A véges állapotú gép (FSM)
summary: Az állapotgép fogalma, állapotgráf és állapottábla, a szinkron állapotgép három része (következőállapot-logika, állapotregiszter, kimeneti logika), Moore- és Mealy-modell.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **véges állapotú gép** (FSM, finite state machine),
- hogyan írod le **állapotgráffal** és **állapottáblával**,
- a szinkron állapotgép **három építőelemét**,
- a **Moore-** és a **Mealy-gép** közti különbséget.

## Mi az állapotgép?

Az előző témakör számlálói az órajelre mindig ugyanabban a sorrendben léptek. Az **állapotgép** ennek általánosítása: a következő állapot a jelenlegi állapottól **és a bemenetektől** függ, és a gép **kimeneteket** is előállít. Szinte minden vezérlés ilyen: közlekedési lámpa, italautomata, lift, soros protokoll (UART) vevője, a processzor vezérlőegysége.

Egy véges állapotú gépet öt dolog határoz meg:

1. az **állapotok** véges halmaza (S0, S1, …),
2. a **bemenetek** halmaza,
3. a **kimenetek** halmaza,
4. az **átmenetfüggvény**: (jelenlegi állapot, bemenet) → következő állapot,
5. a **kimeneti függvény**,

valamint a **kezdőállapot** (ahová reset után kerül).

## Állapotgráf és állapottábla

Az **állapotgráfban** a körök az állapotok, a nyilak az átmenetek; a nyilakra írjuk, milyen bemenetre következik be az átmenet.

**Példa** – egy háromállapotú „léptető”: x = 1 esetén a következő állapotba lép (S0 → S1 → S2 → S0), x = 0 esetén helyben marad.

```text
       x=1          x=1
 ┌──► (S0) ───────► (S1) ───────► (S2) ──┐
 │     ↺ x=0        ↺ x=0         ↺ x=0  │
 └──────────────────── x=1 ──────────────┘
```

Ugyanez **állapottáblával**:

| jelenlegi | x = 0 | x = 1 |
| --------- | ----- | ----- |
| S0        | S0    | S1    |
| S1        | S1    | S2    |
| S2        | S2    | S0    |

Ha S0-ból indulva sorban 1, 1, 0, 1, 1 érkezik: S0 → S1 → S2 → S2 → S0 → **S1**.

## A szinkron állapotgép felépítése

```text
            ┌──────────────────┐   ┌──────────────┐   ┌──────────────┐
bemenet ───►│ következőállapot-├──►│ állapot-     ├─┬►│ kimeneti     ├──► kimenet
        ┌──►│ logika           │   │ regiszter    │ │ │ logika       │
        │   └──────────────────┘   └──────▲───────┘ │ └──────────────┘
        │                                 │ CLK     │
        └─────────────────────────────────┴─────────┘ (jelenlegi állapot)
```

- **Következőállapot-logika** (next state logic): kombinációs hálózat, amely a jelenlegi állapotból és a bemenetekből kiszámolja a következő állapot kódját.
- **Állapotregiszter**: flip-flopok (jellemzően D), amelyek **minden órajel élén** átveszik a következő állapotot – ez a gép memóriája.
- **Kimeneti logika** (output logic): kombinációs hálózat, amely a kimeneteket állítja elő.

k darab flip-floppal legfeljebb 2<sup>k</sup> állapot kódolható, tehát N állapothoz **legalább ⌈log₂ N⌉** flip-flop kell (pl. 5 állapot → 3 flip-flop).

## Moore- és Mealy-gép

A kimeneti logika bemenete szerint két modellt különböztetünk meg:

|                         | **Moore-gép**                                    | **Mealy-gép**                                       |
| ----------------------- | ------------------------------------------------ | --------------------------------------------------- |
| a kimenet függ          | **csak az állapottól**                           | az állapottól **és a bemenetektől**                 |
| jelölés a gráfon        | az állapot körébe írjuk: S1 / 1                  | a nyílra írjuk: x = 1 / y = 1                       |
| kimenet változása       | csak órajel élen (állapotváltáskor) – stabil     | a bemenettel azonnal változhat                      |
| állapotok száma         | általában több                                   | általában kevesebb                                  |
| reakcióidő              | egy órajellel később reagál                      | ugyanabban az ütemben reagál                        |

Mindkettő ugyanazt tudja – minden Mealy-gép átalakítható Moore-géppé és fordítva –, a választás a feladattól függ.

## Összefoglalás

- Az FSM állapotokból, bemenetekből, kimenetekből, átmenet- és kimeneti függvényből áll.
- Leírás: állapotgráf vagy állapottábla.
- Felépítés: következőállapot-logika + állapotregiszter + kimeneti logika; N állapothoz ⌈log₂ N⌉ flip-flop.
- Moore: kimenet = f(állapot); Mealy: kimenet = f(állapot, bemenet).

## A lecke feladata

```quiz required
? Mitől függ a Moore-gép kimenete?
+ Csak a jelenlegi állapottól.
- Csak a bemenetektől.
- Az állapottól és a bemenetektől.
- Az órajel frekvenciájától.

? Mitől függ a Mealy-gép kimenete?
- Csak a jelenlegi állapottól.
- Csak a bemenetektől.
+ Az állapottól és a bemenetektől.
- Csak a kezdőállapottól.

? Legalább hány flip-flop kell egy 5 állapotú állapotgéphez (bináris kódolással)?
= 3
! 2^2 = 4 < 5 ≤ 8 = 2^3.

? A leckebeli léptetőgép (x = 1: következő állapot, x = 0: helyben marad) S1-ből indul, és sorban 1, 0, 1, 1 érkezik. Melyik állapotban lesz? (Pl. S0)
= S1
! S1 → S2 → S2 → S0 → S1.

? Melyik része tárolja az állapotgép jelenlegi állapotát?
- a következőállapot-logika
+ az állapotregiszter (flip-flopok)
- a kimeneti logika
- az órajel-generátor
```

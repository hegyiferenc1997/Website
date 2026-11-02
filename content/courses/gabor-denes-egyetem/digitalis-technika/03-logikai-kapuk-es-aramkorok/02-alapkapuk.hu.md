---
title: Az alapkapuk
summary: NEM, ÉS, VAGY, NAND, NOR, XOR és XNOR kapu – jelölésük, igazságtáblájuk, rajzjelük és a hozzájuk tartozó IC-k.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a hét alapkapu működését és **igazságtábláját**,
- a műveletek különböző **jelöléseit**,
- a kapuk **rajzjeleit** (amerikai ANSI és európai IEC szabvány),
- a több bemenetű kapuk viselkedését és a gyakori **74-es sorozatú IC-ket**.

A **logikai kapu** egy logikai műveletet megvalósító áramkör. A kapukból – mint legókockákból – épül fel minden digitális rendszer.

## A hét alapkapu

| Kapu     | Művelet neve              | Kifejezés           | Mikor 1 a kimenet?             | IEC jel    | IC (4 kapu) |
| -------- | ------------------------- | ------------------- | ------------------------------ | ---------- | ----------- |
| **NEM**  | negáció, inverter         | Y = A̅               | ha A = 0                       | `1` + kör  | 7404 (6 db) |
| **ÉS**   | konjunkció                | Y = A · B           | ha **minden** bemenet 1        | `&`        | 7408        |
| **VAGY** | diszjunkció               | Y = A + B           | ha **legalább egy** bemenet 1  | `≥1`       | 7432        |
| **NAND** | Sheffer-függvény          | Y = (A · B)̅         | ha **nem mind** 1              | `&` + kör  | 7400        |
| **NOR**  | Pierce-függvény           | Y = (A + B)̅         | ha **mind** 0                  | `≥1` + kör | 7402        |
| **XOR**  | kizáró VAGY, antivalencia | Y = A ⊕ B           | ha a bemenetek **különböznek** | `=1`       | 7486        |
| **XNOR** | ekvivalencia              | Y = (A ⊕ B)̅ = A ⊙ B | ha a bemenetek **egyeznek**    | `=1` + kör | 74266       |

A kimeneten rajzolt **kis kör** mindig **negálást** jelent.

### Igazságtáblák egyben

| A   | B   | ÉS  | VAGY | NAND | NOR | XOR | XNOR |
| --- | --- | --- | ---- | ---- | --- | --- | ---- |
| 0   | 0   | 0   | 0    | 1    | 1   | 0   | 1    |
| 0   | 1   | 0   | 1    | 1    | 0   | 1   | 0    |
| 1   | 0   | 0   | 1    | 1    | 0   | 1   | 0    |
| 1   | 1   | 1   | 1    | 0    | 0   | 0   | 1    |

### Rajzjelek

```text
 ANSI (amerikai, „formás”)            IEC (európai, téglalap)

 ÉS:    A ─┤‾‾╲                        A ─┤ & ├─ Y
        B ─┤__╱── Y                    B ─┤   │

 VAGY:  A ─╲‾‾╲                        A ─┤≥1 ├─ Y
        B ─╱__╱── Y                    B ─┤   │

 NEM:   A ──|▷o── Y                    A ─┤ 1 ├o─ Y
```

> Az ANSI jelek a legtöbb angol nyelvű szakirodalomban és szimulátorban (pl. Logisim) használatosak, az IEC jelek az európai szabványos rajzokon.

## Jelölések

| Művelet | Jelölések                      |
| ------- | ------------------------------ |
| NEM     | A̅, A', ¬A, !A, ~A              |
| ÉS      | A · B, AB, A ∧ B, A & B, A * B |
| VAGY    | A + B, A ∨ B, A \| B           |
| XOR     | A ⊕ B, A ^ B                   |
| XNOR    | A ⊙ B, (A ⊕ B)̅                 |

Programozásban: C/Java/Python bitművelet `&`, `|`, `^`, `~`; logikai művelet `&&`, `||`, `!` (Pythonban `and`, `or`, `not`).

## Több bemenetű kapuk

- **ÉS:** csak akkor 1, ha _minden_ bemenet 1. **VAGY:** 1, ha _bármelyik_ 1.
- **NAND / NOR:** a több bemenetű ÉS / VAGY negáltja.
- **XOR:** több bemenetnél akkor 1, ha **páratlan sok** bemenet 1 – ezért ez a **paritásgenerátor** (2. témakör).

## XOR – a „vezérelhető inverter”

A ⊕ 0 = A, A ⊕ 1 = A̅. Az egyik bemenettel tehát eldönthetjük, hogy a másikat átengedjük vagy negáljuk. Ezt használja a kivonó áramkör (4. témakör), a titkosítás (_one-time pad_), és a Gray-kód átalakító.

```python run
# Az alapkapuk mint Python függvények (bitműveletekkel)
NEM = lambda a: 1 - a
ES = lambda a, b: a & b
VAGY = lambda a, b: a | b
NAND = lambda a, b: 1 - (a & b)
NOR = lambda a, b: 1 - (a | b)
XOR = lambda a, b: a ^ b
XNOR = lambda a, b: 1 - (a ^ b)

print("A B | ÉS VAGY NAND NOR XOR XNOR")
for a in (0, 1):
    for b in (0, 1):
        print(a, b, "|", ES(a, b), " ", VAGY(a, b), "  ", NAND(a, b), "  ",
              NOR(a, b), " ", XOR(a, b), "  ", XNOR(a, b))
```

## Összefoglalás

- ÉS: mind 1 → 1; VAGY: bármelyik 1 → 1; NEM: negál.
- NAND, NOR, XNOR = ÉS, VAGY, XOR + negálás (kis kör a kimeneten).
- XOR: különbözőek → 1; több bemenetnél páratlan számú 1 → 1.

## A lecke feladata

```quiz required
? Töltsd ki a NAND és a NOR kapu igazságtábláját!
table: A, B -> NAND = (A·B)'; NOR = (A+B)'
! NAND: csak 1·1-re 0. NOR: csak 0+0-ra 1.

? Töltsd ki a háromváltozós XOR (paritás) igazságtábláját!
table: A, B, C -> Y = A⊕B⊕C
! Akkor 1, ha páratlan sok bemenet 1.

? Melyik kapu kimenete 1, ha a két bemenet **egyenlő**?
- XOR
- NAND
+ XNOR
- VAGY
! Ekvivalencia.

? Mi az IEC szabvány szerinti jele a VAGY kapunak a téglalapban?
- &
+ ≥1
- =1
- 1
! „Legalább egy” bemenet legyen 1.

? Mennyi A ⊕ 1? (Írd fel kifejezésként!)
expr: A -> A'
! Az XOR egyik bemenetére 1-et adva a másikat negálja.

? Melyik IC tartalmaz négy darab kétbemenetű NAND kaput?
+ 7400
- 7404
- 7432
- 7486
! A 74-es sorozat „00” tagja.
```

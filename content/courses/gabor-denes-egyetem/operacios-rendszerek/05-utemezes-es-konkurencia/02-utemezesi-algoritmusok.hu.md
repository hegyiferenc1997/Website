---
title: Ütemezési algoritmusok
summary: FCFS, SJF, SRTF, Round Robin, prioritásos és többszintű ütemezés – Gantt-diagramokkal és kiszámolt példákkal.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan működik az **FCFS**, az **SJF**, az **SRTF**, a **Round Robin** és a **prioritásos** ütemezés,
- hogyan rajzolsz **Gantt-diagramot**, és számolsz **átlagos várakozási időt**,
- mi a **kiéheztetés**, és hogyan segít az **öregítés**.

## A közös példa

Mindhárom folyamat a **0. ms**-ban érkezik, ebben a sorrendben:

| Folyamat | CPU-löket |
| -------- | --------- |
| P1       | 9 ms      |
| P2       | 3 ms      |
| P3       | 3 ms      |

## FCFS – aki előbb jön, előbb fut

_First Come, First Served_: egyszerű sor (FIFO), **nem megszakítható**.

```text
| P1                         | P2      | P3      |
0                            9         12        15
```

Várakozás: P1 = 0, P2 = 9, P3 = 12 → átlag **(0 + 9 + 12) / 3 = 7 ms**.

Hátránya a **konvojhatás**: egy hosszú folyamat mögött a rövidek sokat várnak.

## SJF – a legrövidebb előbb

_Shortest Job First_: a **legrövidebb löketű** kész folyamatot választja (nem megszakítható).

```text
| P2      | P3      | P1                         |
0         3         6                            15
```

Várakozás: P2 = 0, P3 = 3, P1 = 6 → átlag **(0 + 3 + 6) / 3 = 3 ms**.

Az SJF adja a **legkisebb átlagos várakozási időt** – de a gyakorlatban a löket hosszát nem ismerjük előre, csak **becsülni** lehet a korábbiak alapján.

## SRTF – a legrövidebb hátralévő idő

Az SJF **megszakítható** változata (_Shortest Remaining Time First_): ha új folyamat érkezik, amelynek rövidebb a lökete, mint a futó folyamat **hátralévő** ideje, elveszi tőle a CPU-t.

Példa: P1 (érkezik 0, löket 7), P2 (érkezik 2, löket 4), P3 (érkezik 4, löket 1).

```text
| P1    | P2    | P3 | P2    | P1                |
0       2       4    5       7                   12
```

- 2-kor P2 (4) < P1 hátralévő (5) → P2 fut. 4-kor P3 (1) < P2 hátralévő (2) → P3 fut.
- Várakozás: P1 = 12 − 0 − 7 = 5, P2 = 7 − 2 − 4 = 1, P3 = 5 − 4 − 1 = 0 → átlag **2 ms**.

## Round Robin – körbe forgó

Minden folyamat legfeljebb egy **időszeletet** (_kvantum_, _q_) futhat, utána a kész sor **végére** kerül. **Megszakítható**, és a válaszidő kicsi – az időosztásos rendszerek alapja.

A közös példa **q = 3 ms**-mal:

```text
| P1      | P2      | P3      | P1                 |
0         3         6         9                    15
```

Befejezés: P1 = 15, P2 = 6, P3 = 9. Várakozás = befejezés − löket: P1 = 6, P2 = 3, P3 = 6 → átlag **5 ms**.

Futtasd a szimulációt, és próbáld ki más kvantummal vagy löketekkel!

```python run
# Round Robin ütemezés szimulációja: mindenki 0-kor érkezik, a sorrend a lista sorrendje.
from collections import deque

folyamatok = {"P1": 9, "P2": 3, "P3": 3}   # név: CPU-löket (ms)
kvantum = 3

sor = deque(folyamatok)          # kész sor
hatra = dict(folyamatok)         # hátralévő idő
ido = 0
befejezes = {}
while sor:
    p = sor.popleft()
    fut = min(kvantum, hatra[p])
    print(f"{ido:2}–{ido + fut:2} ms: {p}")
    ido += fut
    hatra[p] -= fut
    if hatra[p] > 0:
        sor.append(p)            # vissza a sor végére
    else:
        befejezes[p] = ido

for p, loket in folyamatok.items():
    print(p, "befejezés:", befejezes[p], "várakozás:", befejezes[p] - loket)
atlag = sum(befejezes[p] - folyamatok[p] for p in folyamatok) / len(folyamatok)
print("átlagos várakozási idő:", atlag, "ms")
```

A kvantum megválasztása kényes: **túl nagy** → FCFS-sé válik; **túl kicsi** → a sok környezetváltás elviszi az időt.

## Prioritásos és többszintű ütemezés

- **Prioritásos**: minden folyamatnak van egy prioritása, a legmagasabb fut. Veszélye a **kiéheztetés** (_starvation_): az alacsony prioritású folyamat sosem kerül sorra. Megoldás az **öregítés** (_aging_): ami sokat vár, annak fokozatosan nő a prioritása.
- **Többszintű sorok**: külön sor az interaktív (előtér) és a háttérfolyamatoknak, saját algoritmussal (pl. előtér: RR, háttér: FCFS).
- **Többszintű visszacsatolt sorok** (_MLFQ_): a folyamat sorok között **vándorol** – aki elhasználja a teljes kvantumot (CPU-igényes), lejjebb kerül; az I/O-igényes fent marad. Így a gép interaktív marad.

## Összefoglalás

- FCFS: egyszerű, de konvojhatás. SJF: minimális átlagos várakozás, de ismerni kell a löketet. SRTF: az SJF preemptív változata.
- Round Robin: kvantumonként forog, jó válaszidő; a kvantum mérete fontos.
- Prioritásnál kiéheztetés fenyeget, az öregítés segít; az MLFQ a gyakorlati rendszerek alapja.

## A lecke feladata

Három folyamat érkezik a 0. ms-ban, ebben a sorrendben: **P1 = 5 ms**, **P2 = 2 ms**, **P3 = 1 ms**.

```quiz required
? Mennyi az átlagos várakozási idő (ms) FCFS ütemezéssel?
= 4
! Várakozás: 0, 5, 7 → 12 / 3 = 4.

? SJF ütemezésnél melyik folyamat fut elsőként?
- P1
- P2
+ P3
- egyszerre mind
! A legrövidebb löketű: P3 (1 ms).

? Mennyi az összes (nem átlagos!) várakozási idő (ms) SJF ütemezéssel?
= 4
! Sorrend: P3 (0–1), P2 (1–3), P1 (3–8). Várakozás: 0 + 1 + 3 = 4.

? Mennyi az átlagos várakozási idő (ms) Round Robin ütemezéssel, q = 2 ms kvantummal?
= 3
! P1 0–2, P2 2–4, P3 4–5, P1 5–8. Várakozás: P1 = 8 − 5 = 3, P2 = 4 − 2 = 2, P3 = 5 − 1 = 4 → 9 / 3 = 3.

? Melyik technika előzi meg a kiéheztetést prioritásos ütemezésnél?
+ öregítés (aging)
- konvojhatás
- környezetváltás
- kötegelés
! A sokat váró folyamat prioritása fokozatosan nő.
```

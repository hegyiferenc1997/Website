---
title: Ítéletlogika
summary: Állítások, logikai műveletek, igazságtáblák, implikáció és ekvivalencia, tautológiák és a logikai azonosságok.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi az **állítás** (ítélet), és milyen **logikai műveletek** vannak,
- hogyan készítünk **igazságtáblát**,
- hogyan működik az **implikáció** („ha…, akkor…”), és mi az ellentétes irányú állítás,
- mi a **tautológia**, és melyek a legfontosabb **azonosságok**.

## Állítások és műveletek

Az **állítás** (ítélet) olyan kijelentés, amely vagy igaz (**i**, $1$), vagy hamis (**h**, $0$). Például „A $7$ prímszám.” igaz, „$2 + 2 = 5$” hamis, a „Hány óra van?” viszont nem állítás.

Állításokból műveletekkel újabb állításokat képzünk:

| Művelet      | Jel                 | Kiolvasás              | Mikor igaz?                          |
| ------------ | ------------------- | ---------------------- | ------------------------------------ |
| negáció      | $\neg P$            | nem $P$                | ha $P$ hamis                         |
| konjunkció   | $P \land Q$         | $P$ és $Q$             | ha mindkettő igaz                    |
| diszjunkció  | $P \lor Q$          | $P$ vagy $Q$           | ha legalább az egyik igaz            |
| implikáció   | $P \rightarrow Q$   | ha $P$, akkor $Q$      | **kivéve**, ha $P$ igaz és $Q$ hamis |
| ekvivalencia | $P \leftrightarrow Q$ | $P$ pontosan akkor, ha $Q$ | ha egyforma az értékük        |

Az igazságtáblában minden lehetséges bemenetet felsorolunk. $n$ változóhoz $2^n$ sor tartozik.

| $P$ | $Q$ | $\neg P$ | $P \land Q$ | $P \lor Q$ | $P \rightarrow Q$ | $P \leftrightarrow Q$ |
| --- | --- | -------- | ----------- | ---------- | ----------------- | --------------------- |
| 0   | 0   | 1        | 0           | 0          | 1                 | 1                     |
| 0   | 1   | 1        | 0           | 1          | 1                 | 0                     |
| 1   | 0   | 0        | 0           | 1          | 0                 | 0                     |
| 1   | 1   | 0        | 1           | 1          | 1                 | 1                     |

## Az implikáció

A $P \rightarrow Q$ csak akkor hamis, ha az előtag igaz, az utótag hamis. **Hamis előtagból bármi következik**: a „Ha esik a hó júliusban Budapesten, akkor megeszem a kalapom” állítás igaz, ha nem esik a hó.

Fontos átírás: $P \rightarrow Q \equiv \neg P \lor Q$.

Egy implikáció és a rokonai:

- **megfordítás** (konverz): $Q \rightarrow P$, ez **nem** egyenértékű az eredetivel,
- **kontrapozíció**: $\neg Q \rightarrow \neg P$, ez **egyenértékű** az eredetivel (az indirekt bizonyítás alapja).

Például: „Ha egy szám osztható $4$-gyel, akkor páros.” igaz, a megfordítása („ha páros, akkor osztható $4$-gyel”) hamis ($6$), a kontrapozíciója („ha nem páros, akkor nem osztható $4$-gyel”) igaz.

## Tautológia és azonosságok

Egy formula **tautológia**, ha minden értékadásra igaz (pl. $P \lor \neg P$), és **kielégíthetetlen** (ellentmondás), ha mindig hamis (pl. $P \land \neg P$). Két formula **ekvivalens** ($\equiv$), ha az igazságtáblájuk megegyezik.

A legfontosabb azonosságok ugyanazok, mint a halmazalgebrában ($\land \leftrightarrow \cap$, $\lor \leftrightarrow \cup$, $\neg \leftrightarrow$ komplementer):

- kommutativitás, asszociativitás, disztributivitás: $P \land (Q \lor R) \equiv (P \land Q) \lor (P \land R)$,
- **De Morgan:** $\neg(P \land Q) \equiv \neg P \lor \neg Q$, $\neg(P \lor Q) \equiv \neg P \land \neg Q$,
- elnyelés: $P \lor (P \land Q) \equiv P$,
- kettős tagadás: $\neg\neg P \equiv P$.

Ezek a digitális áramkörök tervezésének is alapjai: az ÉS, VAGY, NEM kapuk pontosan ezeket a műveleteket valósítják meg.

```python run
from itertools import product
# Igazságtábla és tautológia-ellenőrzés: (P → Q) ∧ P → Q (modus ponens)
def impl(a, b):
    return (not a) or b

print(" P  Q | eredmény")
mind_igaz = True
for P, Q in product([False, True], repeat=2):
    ertek = impl(impl(P, Q) and P, Q)
    mind_igaz = mind_igaz and ertek
    print(f" {int(P)}  {int(Q)} |    {int(ertek)}")
print("Tautológia?", mind_igaz)
```

## Összefoglalás

- Művelet és igazságtábla: $n$ változó, $2^n$ sor.
- $P \rightarrow Q$ csak „igaz → hamis” esetén hamis; $P \rightarrow Q \equiv \neg P \lor Q \equiv \neg Q \rightarrow \neg P$.
- Tautológia: mindig igaz; ekvivalens formulák: azonos igazságtábla.
- De Morgan: a tagadás „átfordítja” az ÉS-t VAGY-ra és fordítva.

## A lecke feladata

A feladatokban a beírásnál $P'$ a tagadás, $P \cdot Q$ (vagy $PQ$) az ÉS, $P + Q$ a VAGY.

```quiz required
? Töltsd ki az implikáció ($Y = P \rightarrow Q$) és az ekvivalencia ($Z = P \leftrightarrow Q$) igazságtábláját!
table: P, Q -> Y = P' + Q; Z = P'·Q' + P·Q

? Melyik egyenértékű a $P \rightarrow Q$ implikációval?
- $Q \rightarrow P$
- $\neg P \rightarrow \neg Q$
+ $\neg Q \rightarrow \neg P$
- $P \land \neg Q$
! A kontrapozíció.

? Melyik tautológia?
- $P \land \neg P$
- $P \rightarrow \neg P$
+ $(P \land Q) \rightarrow P$
- $P \lor Q$

? Hány sora van egy $4$ változós formula igazságtáblájának?
= 16

? Írd fel a De Morgan-azonossággal egyszerűsítve, tagadás csak a változókon: $\neg(P \lor \neg Q)$.
expr: P, Q -> P'·Q
limit: 2
same: (P + Q')'

? Töltsd ki: $Y = (P \rightarrow Q) \land (Q \rightarrow R)$, és $Z = P \rightarrow R$.
table: P, Q, R -> Y = (P' + Q)·(Q' + R); Z = P' + R
! Ahol $Y = 1$, ott $Z$ is $1$: ez a láncszabály (tranzitivitás).
```

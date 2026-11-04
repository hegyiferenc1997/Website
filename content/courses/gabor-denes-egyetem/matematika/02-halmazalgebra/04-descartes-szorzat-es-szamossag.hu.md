---
title: Descartes-szorzat, relációk és számosság
summary: Rendezett párok, Descartes-szorzat, relációk, a szitaformula, és a végtelen halmazok számossága.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **rendezett pár** és a **Descartes-szorzat**,
- mi a **reláció**, és melyek a fontos tulajdonságai,
- hogyan számoljuk ki az unió elemszámát a **szitaformulával**,
- hogy a végtelen halmazok között is van „nagyobb” és „kisebb” (**megszámlálható** és **kontinuum**).

## Descartes-szorzat

A **rendezett pár** $(a, b)$: itt a sorrend számít, $(1, 2) \neq (2, 1)$. Az $A$ és $B$ **Descartes-szorzata**:

$$
A \times B = \{ (a, b) : a \in A,\ b \in B \}, \qquad \lvert A \times B \rvert = \lvert A \rvert \cdot \lvert B \rvert.
$$

Példa: $\{1, 2\} \times \{x, y, z\} = \{(1,x), (1,y), (1,z), (2,x), (2,y), (2,z)\}$, $6$ elem. A sík pontjai: $\mathbb{R} \times \mathbb{R} = \mathbb{R}^2$. Egy adatbázis-tábla sorai is egy Descartes-szorzat részhalmazai (az SQL `CROSS JOIN` pontosan ez).

## Relációk

Az $A$ halmazon értelmezett **reláció** az $A \times A$ egy $R$ részhalmaza; $a\,R\,b$, ha $(a, b) \in R$. Fontos tulajdonságok:

- **reflexív:** minden $a$-ra $a\,R\,a$ (pl. $\leq$),
- **szimmetrikus:** $a\,R\,b \Rightarrow b\,R\,a$ (pl. „ugyanabban az évben született”),
- **antiszimmetrikus:** $a\,R\,b$ és $b\,R\,a \Rightarrow a = b$ (pl. $\leq$),
- **tranzitív:** $a\,R\,b$ és $b\,R\,c \Rightarrow a\,R\,c$ (pl. $<$).

A reflexív, szimmetrikus és tranzitív reláció az **ekvivalenciareláció** (pl. „ugyanazt a maradékot adja $3$-mal osztva”); osztályokra bontja a halmazt. A reflexív, antiszimmetrikus és tranzitív a **részbenrendezés** (pl. $\subseteq$, oszthatóság).

## Szitaformula

Két halmaz uniójának elemszáma:

$$
\lvert A \cup B \rvert = \lvert A \rvert + \lvert B \rvert - \lvert A \cap B \rvert,
$$

mert a metszet elemeit kétszer számoltuk. Háromra:

$$
\lvert A \cup B \cup C \rvert = \lvert A \rvert + \lvert B \rvert + \lvert C \rvert - \lvert A \cap B \rvert - \lvert A \cap C \rvert - \lvert B \cap C \rvert + \lvert A \cap B \cap C \rvert.
$$

**Példa.** 1-től 100-ig hány szám osztható $2$-vel vagy $3$-mal? $\lvert A \rvert = 50$, $\lvert B \rvert = 33$, a $6$-tal oszthatók $\lvert A \cap B \rvert = 16$. Tehát $50 + 33 - 16 = 67$.

```python run
# A szitaformula ellenőrzése: 1..100, osztható 2-vel vagy 3-mal vagy 5-tel.
szamok = range(1, 101)
A = {n for n in szamok if n % 2 == 0}
B = {n for n in szamok if n % 3 == 0}
C = {n for n in szamok if n % 5 == 0}
kozvetlen = len(A | B | C)
szita = (len(A) + len(B) + len(C) - len(A & B) - len(A & C) - len(B & C)
         + len(A & B & C))
print(kozvetlen, szita)   # 74 74
```

## Végtelen halmazok számossága

Két halmaz **egyenlő számosságú**, ha elemeik kölcsönösen egyértelműen párba állíthatók. Meglepő következmények:

- A páros számok ugyanannyian vannak, mint a természetes számok ($n \leftrightarrow 2n$).
- $\mathbb{Z}$ és $\mathbb{Q}$ is **megszámlálható** (felsorolható sorozatba), számosságuk $\aleph_0$.
- $\mathbb{R}$ viszont **nem** megszámlálható (Cantor átlós módszere): ez a **kontinuum** számosság. A valós számok „többen vannak”.

Informatikai következmény: a programok (véges karaktersorozatok) megszámlálhatóan sokan vannak, a $\mathbb{N} \to \{0, 1\}$ függvények viszont nem – ezért van olyan probléma, amelyet **semmilyen** program nem old meg.

## Összefoglalás

- $A \times B$ a rendezett párok halmaza, $\lvert A \times B \rvert = \lvert A \rvert \lvert B \rvert$.
- Reláció: $R \subseteq A \times A$; ekvivalencia = reflexív + szimmetrikus + tranzitív.
- Szitaformula: $\lvert A \cup B \rvert = \lvert A \rvert + \lvert B \rvert - \lvert A \cap B \rvert$.
- $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$ megszámlálható; $\mathbb{R}$ nem.

## A lecke feladata

```quiz required
? Hány eleme van $A \times B$-nek, ha $\lvert A \rvert = 4$ és $\lvert B \rvert = 7$?
= 28

? Egy 30 fős évfolyamon 18-an tanulnak Pythont, 15-en Javát, és 8-an mindkettőt. Hányan tanulnak legalább az egyiket?
= 25
! $18 + 15 - 8$

? Ugyanitt hányan nem tanulnak egyiket sem?
= 5

? 1-től 60-ig hány szám osztható $4$-gyel vagy $6$-tal?
= 20
! A mindkettővel oszthatók a $12$ többszörösei.

? Milyen reláció a „$3$-mal osztva ugyanazt a maradékot adja” az egész számokon?
+ ekvivalenciareláció
- részbenrendezés
- se nem reflexív, se nem szimmetrikus
! Reflexív, szimmetrikus és tranzitív.
```

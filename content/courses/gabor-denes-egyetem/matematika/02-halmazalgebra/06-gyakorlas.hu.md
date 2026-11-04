---
title: Gyakorlás – halmazalgebra
summary: Ellenőrző kérdések és összefoglaló feladatlap a halmazokhoz, a szitaformulához és az eseményalgebrához.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a különbség az ∈ és a ⊆ jel között?</summary>

Az $\in$ elem és halmaz kapcsolata ($2 \in \{1, 2\}$), a $\subseteq$ két halmazé ($\{2\} \subseteq \{1, 2\}$). A $2 \subseteq \{1,2\}$ és az $\{2\} \in \{1, 2\}$ is értelmetlen, illetve hamis.

</details>

<details>
<summary>2. Hogyan bizonyítjuk, hogy két halmaz egyenlő?</summary>

Kétirányú tartalmazással ($A \subseteq B$ és $B \subseteq A$), vagy tartalmazási táblával: ha minden lehetséges esetben (az elem benne van / nincs benne az egyes halmazokban) a két oldal ugyanazt adja.

</details>

<details>
<summary>3. Miért kell kivonni a metszetet a szitaformulában?</summary>

Mert $\lvert A \rvert + \lvert B \rvert$-ben a mindkét halmazban lévő elemek kétszer szerepelnek; egyszer le kell vonni őket.

</details>

<details>
<summary>4. Mit jelent az ellentett esemény, és mire jó?</summary>

$\overline{A}$ akkor következik be, ha $A$ nem. Mivel $P(\overline{A}) = 1 - P(A)$, a „legalább egy” típusú kérdéseknél sokszor egyszerűbb az ellentett eseményt („egy sem”) kiszámolni.

</details>

## Összefoglaló feladatlap

```quiz required
? $U = \{1, \dots, 12\}$, $A$ = a páros számok, $B$ = a $3$ többszörösei. Hány eleme van $\overline{A \cup B}$-nek?
= 4
! $\{1, 5, 7, 11\}$

? Ugyanitt hány eleme van $A \triangle B$-nek?
= 6
! $\lvert A \rvert = 6$, $\lvert B \rvert = 4$, $\lvert A \cap B \rvert = 2$.

? Töltsd ki a tartalmazási táblát: $Y = \overline{A} \cap (B \cup C)$.
table: A, B, C -> Y = A'·(B + C)

? Hány részhalmaza van $\{a, b, c, d\}$-nek, amely tartalmazza az $a$ elemet?
= 8
! A többi három elemről szabadon döntünk: $2^3$.

? 1-től 100-ig hány szám **nem** osztható sem $2$-vel, sem $5$-tel?
= 40
! $100 - (50 + 20 - 10)$

? Három pénzérmét feldobunk. Mennyi a valószínűsége, hogy legalább egy fej lesz? (Törtként vagy tizedes törtként.)
= 7/8
! Az ellentett: mindhárom írás, $\frac{1}{8}$.

? Melyik reláció **nem** tranzitív?
- „kisebb, mint” a valós számokon
- „osztója” a pozitív egészeken
+ „merőleges” a sík egyenesein
- „részhalmaza” a halmazokon
! Ha $a \perp b$ és $b \perp c$, akkor $a \parallel c$.
```

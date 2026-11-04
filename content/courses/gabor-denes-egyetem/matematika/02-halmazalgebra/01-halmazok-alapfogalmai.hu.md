---
title: A halmazok alapfogalmai
summary: Halmaz, elem, megadási módok, részhalmaz, üres halmaz, hatványhalmaz és intervallumok.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **halmaz** és az **elem**, és hogyan adunk meg egy halmazt,
- mit jelent a **részhalmaz**, az **üres halmaz** és a halmazok **egyenlősége**,
- mi a **hatványhalmaz**, és hány eleme van,
- hogyan írjuk le a valós számok részhalmazait **intervallumokkal**.

## Halmaz és elem

A **halmaz** jól meghatározott, egymástól különböző dolgok összessége; ezek a halmaz **elemei**. Alapfogalom, nem definiáljuk, csak azt kell tudnunk, hogy bármiről eldönthető-e: eleme vagy sem. Jelölés: $a \in A$ ($a$ eleme $A$-nak), $b \notin A$.

**Megadási módok:**

- **felsorolással:** $A = \{2, 3, 5, 7\}$ (a sorrend és az ismétlés nem számít: $\{1, 2, 2\} = \{2, 1\}$),
- **tulajdonsággal:** $A = \{ x \in \mathbb{N} : x < 10,\ x \text{ prím} \}$.

Programozásban is ismerős: Pythonban a `set` pontosan ilyen, ismétlődés nélküli, rendezetlen gyűjtemény.

```python run
A = {2, 3, 5, 7}
B = {x for x in range(10) if x % 2 == 1}   # tulajdonsággal: páratlan számok 10 alatt
print(A, B)
print(3 in A, 4 in A)        # eleme-e?
print({1, 2, 2} == {2, 1})   # True: az ismétlés és a sorrend nem számít
```

## Részhalmaz, egyenlőség, üres halmaz

- $A \subseteq B$ ($A$ **részhalmaza** $B$-nek), ha $A$ minden eleme $B$-nek is eleme. Ha ráadásul $A \neq B$, akkor **valódi részhalmaz**: $A \subset B$.
- $A = B$, ha ugyanazok az elemeik, vagyis $A \subseteq B$ és $B \subseteq A$. (Így bizonyítunk halmazegyenlőséget!)
- Az **üres halmaz** $\emptyset$: nincs eleme. Minden halmaznak részhalmaza.
- Egy véges halmaz elemszáma (számossága): $\lvert A \rvert$, pl. $\lvert \{2, 3, 5, 7\} \rvert = 4$.

## Hatványhalmaz

$A$ **hatványhalmaza** $\mathcal{P}(A)$: $A$ összes részhalmazának halmaza. Például $A = \{a, b\}$ esetén

$$
\mathcal{P}(A) = \big\{ \emptyset, \{a\}, \{b\}, \{a, b\} \big\}.
$$

Ha $\lvert A \rvert = n$, akkor $\lvert \mathcal{P}(A) \rvert = 2^n$, mert minden elemnél két döntés van: benne van a részhalmazban vagy nincs. Ez pontosan egy $n$ bites szám: a részhalmazokat **bitmaszkokkal** lehet kódolni.

## Intervallumok

A valós számok „összefüggő” részhalmazai ($a < b$):

| Jelölés                    | Jelentés            | Végpontok          |
| -------------------------- | ------------------- | ------------------ |
| $[a; b]$                   | $a \leq x \leq b$   | zárt               |
| $\left]a; b\right[$        | $a < x < b$         | nyílt              |
| $[a; b[$                  | $a \leq x < b$      | balról zárt        |
| $\left]-\infty; b\right]$  | $x \leq b$          | végtelen           |

(Más könyvekben a nyílt intervallum jele $(a; b)$.) A $\infty$ nem szám, ezért ott mindig nyílt a zárójel.

## Összefoglalás

- Halmaz: különböző elemek összessége; $a \in A$; felsorolással vagy tulajdonsággal adjuk meg.
- $A \subseteq B$: $A$ minden eleme $B$-ben van; $A = B \iff A \subseteq B$ és $B \subseteq A$; $\emptyset$ mindennek részhalmaza.
- $\lvert \mathcal{P}(A) \rvert = 2^{\lvert A \rvert}$.
- Intervallumok: $[a; b]$ zárt, $]a; b[$ nyílt; a végtelennél mindig nyílt.

## A lecke feladata

```quiz required
? Hány eleme van az $\{x \in \mathbb{N} : 3 \leq x < 9\}$ halmaznak?
= 6
! $3, 4, 5, 6, 7, 8$

? Hány részhalmaza van egy $5$ elemű halmaznak (az üres halmazt és önmagát is beleértve)?
= 32

? Igaz-e, hogy $\emptyset \subseteq \{1, 2\}$?
+ igaz, az üres halmaz minden halmaznak részhalmaza
- hamis, mert az üres halmaz nem eleme
- csak akkor, ha a halmaz is üres
! Részhalmaz ≠ elem: az üres halmaznak nincs olyan eleme, amely ne lenne benne.

? Hány egész szám van a $\left]-2; 3\right]$ intervallumban?
= 5
! $-1, 0, 1, 2, 3$

? Melyik állítás **hamis**?
- $\{1, 2, 3\} = \{3, 1, 2\}$
- $\{1, 1, 2\} = \{1, 2\}$
+ $\{1, 2\} \in \{1, 2, 3\}$
- $\{1, 2\} \subseteq \{1, 2, 3\}$
! Az $\{1, 2\}$ részhalmaza, de nem eleme a halmaznak.
```

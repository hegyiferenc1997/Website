---
title: Logikai függvények algebrai egyszerűsítése
summary: Lépésről lépésre kidolgozott példák: kiemelés, komplementer, abszorpció, De Morgan; mintermes és maxtermes alakok egyszerűsítése.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- **miért** egyszerűsítünk,
- egy bevált **lépéssort** az algebrai egyszerűsítéshez,
- sok **kidolgozott példát**, mindegyik lépésnél a felhasznált azonossággal.

## Miért egyszerűsítünk?

Ugyanazt a függvényt sokféle kifejezés írhatja le. Minél **kevesebb a literál** (változó-előfordulás) és a tag, annál **kevesebb kapu** kell: olcsóbb, kisebb, gyorsabb és kevesebbet fogyaszt az áramkör.

## A bevált lépéssor

1. **Zárójelek felbontása** (disztributivitás): A(B + C) = AB + AC.
2. **Nullás tagok** törlése: X·X̅ = 0, és ami 0-val szorzódik, eltűnik.
3. **Ismétlődések** összevonása: X + X = X, X·X = X.
4. **Kiemelés** a közös tényezőre, majd **komplementer**: XY + XY̅ = X(Y + Y̅) = X.
5. **Abszorpció**: X + XY = X, és X + X̅Y = X + Y.
6. Szükség esetén **De Morgan**, hogy a negálás csak a változókon legyen.

Minden lépés után érdemes ellenőrizni egy-két bemeneti kombinációval!

## Kidolgozott példák

### 1. példa: F = A·B + A(B + C) + B(B + C)

| Lépés | Kifejezés              | Azonosság                           |
| ----- | ---------------------- | ----------------------------------- |
| 1     | AB + AB + AC + BB + BC | zárójelek felbontása                |
| 2     | AB + AC + B + BC       | idempotencia (AB + AB = AB, BB = B) |
| 3     | AB + AC + B            | abszorpció (B + BC = B)             |
| 4     | **B + AC**             | abszorpció (B + AB = B)             |

### 2. példa: F = A + A̅·C

Elosztott abszorpció: X + X̅Y = X + Y → **F = A + C**.
_Bizonyítás más úton:_ A = A(C + C̅) → F = AC + AC̅ + A̅C = AC + AC̅ + AC + A̅C = A(C + C̅) + C(A + A̅) = **A + C**.

### 3. példa: F = A·B̅·C + A + A̅·B·C

| Lépés | Kifejezés  | Azonosság                             |
| ----- | ---------- | ------------------------------------- |
| 1     | A + A̅BC    | abszorpció (A + AB̅C = A)              |
| 2     | **A + BC** | elosztott abszorpció (X + X̅Y = X + Y) |

### 4. példa: F = A(B + C(AB + AC))

| Lépés | Kifejezés          | Azonosság                            |
| ----- | ------------------ | ------------------------------------ |
| 1     | A(B + ABC + AC)    | a belső zárójel felbontása (C·C = C) |
| 2     | A(B + AC)          | abszorpció (B + ABC = B)             |
| 3     | AB + AAC = AB + AC | felbontás, idempotencia              |
| 4     | **A(B + C)**       | kiemelés                             |

### 5. példa: F = W·X·Y̅ + W·X·Y + W̅·X·Y + W·X̅·Y + W·X̅·Y̅

| Lépés | Kifejezés                   | Azonosság                |
| ----- | --------------------------- | ------------------------ |
| 1     | WX(Y̅ + Y) + W̅XY + WX̅(Y + Y̅) | kiemelés                 |
| 2     | WX + W̅XY + WX̅               | komplementer (Y + Y̅ = 1) |
| 3     | W(X + X̅) + W̅XY = W + W̅XY    | kiemelés, komplementer   |
| 4     | **W + XY**                  | elosztott abszorpció     |

### 6. példa: F = (A + B)(A + B + D)·D̅

| Lépés | Kifejezés     | Azonosság                                 |
| ----- | ------------- | ----------------------------------------- |
| 1     | (A + B)·D̅     | abszorpció: X·(X + D) = X, ahol X = A + B |
| 2     | **A·D̅ + B·D̅** | disztributivitás                          |

### 7. példa: mintermes alak – F(A, B, C) = Σm(0, 1, 6, 7)

A 0, 1, 6, 7 sorszámú sorokban 1 a kimenet: 000, 001, 110, 111.

| Lépés | Kifejezés             | Azonosság               |
| ----- | --------------------- | ----------------------- |
| 1     | A̅B̅C̅ + A̅B̅C + ABC̅ + ABC | a mintermek felírása    |
| 2     | A̅B̅(C̅ + C) + AB(C̅ + C) | kiemelés                |
| 3     | **A̅B̅ + AB** = A ⊙ B   | komplementer, identitás |

Az eredmény az A és B **ekvivalenciája** (XNOR) – C-től egyáltalán nem függ!

### 8. példa: maxtermes alak – F(A, B, C) = ΠM(2, 3, 4, 5)

A 2, 3, 4, 5 sorokban 0 a kimenet. Egy maxterm a sor bitjeinek **negáltjait** VAGY-olja (0 → ponált, 1 → negált): 010 → (A + B̅ + C).

| Lépés | Kifejezés                                    | Azonosság                   |
| ----- | -------------------------------------------- | --------------------------- |
| 1     | (A + B̅ + C)(A + B̅ + C̅)(A̅ + B + C)(A̅ + B + C̅) | a maxtermek felírása        |
| 2     | (A + B̅)(A̅ + B)                               | (X + Y)(X + Y̅) = X, kétszer |
| 3     | **A·B + A̅·B̅** = A ⊙ B                        | beszorzás (AA̅ = BB̅ = 0)     |

Ez ugyanaz a függvény, mint a 7. példa – hiszen a Σm(0, 1, 6, 7) és a ΠM(2, 3, 4, 5) ugyanazt az igazságtáblát írja le!

```python run
# Ellenőrzés: az eredeti és az egyszerűsített alak minden bemenetre egyezik-e?
from itertools import product

def egyezik(f, g, n):
    return all(f(*v) == g(*v) for v in product((0, 1), repeat=n))

N = lambda x: 1 - x
eredeti = lambda w, x, y: (w & x & N(y)) | (w & x & y) | (N(w) & x & y) | (w & N(x) & y) | (w & N(x) & N(y))
egyszeru = lambda w, x, y: w | (x & y)
print("5. példa:", egyezik(eredeti, egyszeru, 3))

eredeti7 = lambda a, b, c: (a, b, c) in {(0, 0, 0), (0, 0, 1), (1, 1, 0), (1, 1, 1)}
print("7. példa:", egyezik(lambda a, b, c: int(eredeti7(a, b, c)), lambda a, b, c: 1 - (a ^ b), 3))
```

## Összefoglalás

- Cél: kevesebb literál és tag → kevesebb kapu.
- Lépések: felbontás → nullás tagok → ismétlődések → kiemelés + komplementer → abszorpció → De Morgan.
- Mindig ellenőrizd az eredményt igazságtáblával vagy néhány behelyettesítéssel.
- Nagyobb függvényeknél a grafikus (Karnaugh-tábla) módszer gyorsabb – ez a 4. témakörben jön.

## A lecke feladata

```quiz required
? Egyszerűsítsd: F = A·B + A·B'
expr: A, B -> A
limit: 1
same: A·B + A·B'
! Kiemelés, majd B + B̅ = 1.

? Egyszerűsítsd: F = A'·B'·C + A'·B·C + A·B'·C + A·B·C
expr: A, B, C -> C
limit: 1
same: A'·B'·C + A'·B·C + A·B'·C + A·B·C
! Emeld ki C-t; a maradék az összes AB kombináció.

? Egyszerűsítsd: F = A'·B·C + A·B'·C + A·B·C' + A·B·C
expr: A, B, C -> A·B + A·C + B·C
limit: 6
same: A'·B·C + A·B'·C + A·B·C' + A·B·C
! Az ABC tagot háromszor is felhasználhatod (X + X = X), mindegyik szomszédjával összevonva.

? Egyszerűsítsd: F = (A + B)·(A + B')
expr: A, B -> A
limit: 1
same: (A + B)·(A + B')
! (X + Y)(X + Y̅) = X.

? Egyszerűsítsd: F = A·B + A·(B + C) + B·(B + C)
expr: A, B, C -> B + A·C
limit: 3
same: A·B + A·(B + C) + B·(B + C)
! Ez az 1. kidolgozott példa – próbáld meg puskázás nélkül!

? Egyszerűsítsd: F = (A·B + C)'·A (a negálás a végén csak változókon legyen)
expr: A, B, C -> A·B'·C'
limit: 3
same: (A·B + C)'·A
! De Morgan: (AB + C)̅ = (A̅ + B̅)·C̅, majd szorozd be A-val.
```

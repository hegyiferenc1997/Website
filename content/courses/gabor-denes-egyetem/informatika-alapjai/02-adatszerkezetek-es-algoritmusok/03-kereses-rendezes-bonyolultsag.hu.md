---
title: Keresés, rendezés, futási idő
summary: Lineáris és bináris keresés, buborék- és beépített rendezés, az O-jelölés alapjai.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a **lineáris** és a **bináris** keresést,
- egy egyszerű rendezést (**buborékrendezés**),
- hogyan becsüljük egy algoritmus futási idejét (**O-jelölés**).

## Lineáris keresés

Végignézzük az elemeket sorban, amíg meg nem találjuk a keresettet. `n` elemnél legrosszabb esetben `n` összehasonlítás kell. Rendezetlen listán is működik.

## Bináris keresés

Ha a lista **rendezett**, mindig a középső elemet nézzük meg: ha a keresett kisebb, a bal felében folytatjuk, ha nagyobb, a jobb felében. Minden lépés **felezi** a keresési tartományt, így 1000 elemnél kb. 10, egymillió elemnél kb. 20 lépés elég (mert 2¹⁰ ≈ 1000, 2²⁰ ≈ 1 000 000).

```python run
# Bináris keresés rendezett listában; a lépéseket is számoljuk
def binaris_kereses(lista, cel):
    bal, jobb, lepes = 0, len(lista) - 1, 0
    while bal <= jobb:
        lepes += 1
        kozep = (bal + jobb) // 2
        if lista[kozep] == cel:
            return kozep, lepes
        if lista[kozep] < cel:
            bal = kozep + 1
        else:
            jobb = kozep - 1
    return -1, lepes

szamok = list(range(0, 2000, 2))   # 1000 páros szám
print(binaris_kereses(szamok, 1234))
```

## Rendezés: buborékrendezés

A **buborékrendezés** újra és újra végigmegy a listán, és minden **szomszédos** párt megcserél, ha rossz sorrendben vannak. Egy menet után a legnagyobb elem a végére „buborékol”.

```python run
# Buborékrendezés
def buborek(lista):
    a = lista[:]
    for vege in range(len(a) - 1, 0, -1):
        for i in range(vege):
            if a[i] > a[i + 1]:
                a[i], a[i + 1] = a[i + 1], a[i]
    return a

print(buborek([5, 1, 4, 2, 8]))
print(sorted([5, 1, 4, 2, 8]))   # a beépített, sokkal gyorsabb rendezés
```

A buborékrendezés egyszerű, de lassú. A valóságban gyorsabb módszereket használunk (gyorsrendezés, összefésülő rendezés; a Python `sorted` a Timsortot).

## Futási idő: O-jelölés

Az **O-jelölés** azt írja le, hogyan **nő** a lépések száma, ha a bemenet `n` mérete nő. A konstansokat elhagyjuk, csak a növekedés jellege számít.

| Jelölés    | Neve         | Példa                               | n = 1000 esetén |
| ---------- | ------------ | ----------------------------------- | --------------- |
| O(1)       | konstans     | tömb elemének elérése index szerint | 1               |
| O(log n)   | logaritmikus | bináris keresés                     | ≈ 10            |
| O(n)       | lineáris     | lineáris keresés                    | 1000            |
| O(n log n) | –            | jó rendezések (összefésülő)         | ≈ 10 000        |
| O(n²)      | négyzetes    | buborékrendezés                     | 1 000 000       |

## Összefoglalás

- Lineáris keresés: O(n), bármilyen listán; bináris keresés: O(log n), csak rendezett listán.
- A buborékrendezés O(n²); a jó rendezések O(n log n).
- Az O-jelölés a növekedés ütemét méri, nem a pontos időt.

## A lecke feladata

```quiz required
? Mi a feltétele a bináris keresésnek?
- A lista legyen rövid.
+ A lista legyen rendezett.
- A lista csak számokat tartalmazhat.
- A keresett elem legyen a lista közepén.
! Csak rendezett listán tudjuk eldönteni, melyik felében folytassuk.

? Legfeljebb hány lépés kell bináris kereséssel egy 1024 elemű rendezett listában (a sikeres találatot is lépésnek számolva)?
= 11
! 1024 = 2¹⁰, a tartomány 10 felezés után 1 elemű, a 11. lépés ezt nézi meg.

? Melyik a buborékrendezés futási ideje?
- O(1)
- O(log n)
- O(n)
+ O(n²)
! Két egymásba ágyazott ciklus fut végig a listán.

? Mi lesz a `[3, 1, 2]` lista az első buborékmenet után? (vesszővel, szóköz nélkül)
= 1,2,3
! 3↔1 → [1,3,2], majd 3↔2 → [1,2,3].
```

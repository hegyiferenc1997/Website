---
title: Klasszikus rekurzív algoritmusok
summary: Oszd meg és uralkodj: bináris keresés, Hanoi tornyai, összefésülő rendezés, egymásba ágyazott adatok bejárása.
minutes: 22
---

## Amit ebben a leckében megtanulsz

- mi az **„oszd meg és uralkodj”** módszer,
- a **bináris keresést** rekurzívan és iteratívan,
- a **Hanoi tornyai** feladatot,
- az **összefésülő rendezést** (merge sort),
- egymásba ágyazott adatok rekurzív bejárását.

## Oszd meg és uralkodj

Sok hatékony algoritmus így működik:

1. **Felosztás:** a feladatot kisebb, hasonló részfeladatokra bontjuk.
2. **Uralkodás:** a részfeladatokat rekurzívan megoldjuk (a legkisebbeket közvetlenül).
3. **Összevonás:** a részmegoldásokból összerakjuk az egészet.

## Bináris keresés

**Rendezett** listában keresünk: megnézzük a középső elemet; ha kisebb a keresettnél, a jobb felében keresünk tovább, ha nagyobb, a bal felében. Minden lépés megfelezi a tartományt → **O(log n)**.

```python run
def binaris_rekurziv(lista, keresett, bal=0, jobb=None):
    if jobb is None:
        jobb = len(lista) - 1
    if bal > jobb:                       # alapeset: üres tartomány → nincs meg
        return -1
    kozep = (bal + jobb) // 2
    if lista[kozep] == keresett:         # alapeset: megtaláltuk
        return kozep
    if lista[kozep] < keresett:
        return binaris_rekurziv(lista, keresett, kozep + 1, jobb)
    return binaris_rekurziv(lista, keresett, bal, kozep - 1)


def binaris_iterativ(lista, keresett):
    bal, jobb = 0, len(lista) - 1
    while bal <= jobb:
        kozep = (bal + jobb) // 2
        if lista[kozep] == keresett:
            return kozep
        if lista[kozep] < keresett:
            bal = kozep + 1
        else:
            jobb = kozep - 1
    return -1


szamok = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binaris_rekurziv(szamok, 23), binaris_iterativ(szamok, 23))   # 5 5
print(binaris_rekurziv(szamok, 7), binaris_iterativ(szamok, 7))     # -1 -1
```

## Hanoi tornyai

Három rúd van, az elsőn `n` korong csökkenő méretben. Át kell rakni őket a harmadik rúdra úgy, hogy egyszerre csak egy korongot mozgatunk, és nagyobb korong sosem kerülhet kisebbre.

A rekurzív gondolat: ahhoz, hogy `n` korongot átrakjunk A-ról C-re,

1. rakjunk át `n − 1` korongot A-ról B-re (C segítségével),
2. a legnagyobbat tegyük át A-ról C-re,
3. rakjuk át az `n − 1` korongot B-ről C-re (A segítségével).

```python run
def hanoi(n, honnan="A", hova="C", seged="B"):
    if n == 0:
        return 0
    lepesek = hanoi(n - 1, honnan, seged, hova)
    print(f"{n}. korong: {honnan} → {hova}")
    lepesek += 1
    lepesek += hanoi(n - 1, seged, hova, honnan)
    return lepesek

print("Lépések száma:", hanoi(3))   # 2³ − 1 = 7
```

Iteratívan ez sokkal nehezebb lenne – ez az a feladat, ahol a rekurzió igazán elegáns. A lépésszám `2ⁿ − 1`, tehát 64 korongnál több mint 18 trillió.

## Összefésülő rendezés (merge sort)

1. Ha a lista 0 vagy 1 elemű, már rendezett (alapeset).
2. Különben felezzük meg, és **rekurzívan rendezzük** mindkét felét.
3. A két rendezett felet **fésüljük össze**: mindig a kisebbik elejét vesszük ki.

```python run
def osszefesul(bal, jobb):
    eredmeny = []
    i = j = 0
    while i < len(bal) and j < len(jobb):
        if bal[i] <= jobb[j]:
            eredmeny.append(bal[i])
            i += 1
        else:
            eredmeny.append(jobb[j])
            j += 1
    eredmeny.extend(bal[i:])     # a maradék (az egyik már üres)
    eredmeny.extend(jobb[j:])
    return eredmeny


def merge_sort(lista):
    if len(lista) <= 1:
        return lista
    kozep = len(lista) // 2
    return osszefesul(merge_sort(lista[:kozep]), merge_sort(lista[kozep:]))


print(merge_sort([38, 27, 43, 3, 9, 82, 10]))
```

```text
[38 27 43 3 9 82 10]
[38 27 43]      [3 9 82 10]
[38] [27 43]    [3 9] [82 10]
     [27][43]   [3][9] [82][10]
[38] [27 43]    [3 9] [10 82]      ← összefésülés felfelé
[27 38 43]      [3 9 10 82]
[3 9 10 27 38 43 82]
```

Az összefésülő rendezés mindig **O(n log n)** lépést tesz – sokkal gyorsabb, mint a buborékrendezés O(n²)-e. A Python beépített `sorted()` függvénye (Timsort) is részben összefésülésen alapul.

## Egymásba ágyazott adatok bejárása

A rekurzió akkor is természetes, ha az adat maga rekurzív szerkezetű: listában listák, mappában mappák.

```python run
def lapit(adat):
    """Tetszőleges mélységben egymásba ágyazott listát egyszintűvé alakít."""
    eredmeny = []
    for elem in adat:
        if isinstance(elem, list):
            eredmeny.extend(lapit(elem))   # rekurzió a belső listára
        else:
            eredmeny.append(elem)
    return eredmeny

print(lapit([1, [2, [3, 4], 5], [[6]], 7]))
```

## Összefoglalás

- **Oszd meg és uralkodj:** felosztás → rekurzív megoldás → összevonás.
- **Bináris keresés:** rendezett listában O(log n).
- **Hanoi tornyai:** `2ⁿ − 1` lépés, rekurzívan néhány sor.
- **Összefésülő rendezés:** O(n log n).
- Rekurzív szerkezetű adat (fa, egymásba ágyazott lista) → rekurzív bejárás.

## A lecke feladata: Összefésülő rendezés

Írd meg az **összefésülő rendezést** (merge sort) rekurzívan: `osszefesulo_rendezes(lista)` egy új, növekvő sorrendű listát ad vissza – a `sort()` és `sorted()` használata nélkül.

1. Alapeset: a legfeljebb egyelemű lista már rendezett (adj vissza róla másolatot).
2. Oszd meg: vágd ketté a listát a közepén.
3. Uralkodj: rendezd a két felet rekurzívan.
4. Fésüld össze a két rendezett felet (mint az Adatszerkezetek témakör listás feladatában).

```python starter required
def osszefesul(a, b):
    # két rendezett lista összefésülése
    pass


def osszefesulo_rendezes(lista):
    pass


print(osszefesulo_rendezes([5, 2, 9, 1, 5, 6]))   # [1, 2, 5, 5, 6, 9]
```

<details>
<summary>Megoldás</summary>

```python solution
def osszefesul(a, b):
    i = j = 0
    eredmeny = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            eredmeny.append(a[i])
            i += 1
        else:
            eredmeny.append(b[j])
            j += 1
    return eredmeny + a[i:] + b[j:]


def osszefesulo_rendezes(lista):
    if len(lista) <= 1:
        return list(lista)
    kozep = len(lista) // 2
    bal = osszefesulo_rendezes(lista[:kozep])
    jobb = osszefesulo_rendezes(lista[kozep:])
    return osszefesul(bal, jobb)


print(osszefesulo_rendezes([5, 2, 9, 1, 5, 6]))   # [1, 2, 5, 5, 6, 9]
```

</details>

```python test
import random
assert osszefesulo_rendezes([5, 2, 9, 1, 5, 6]) == [1, 2, 5, 5, 6, 9], "A példa rendezése nem stimmel."
assert osszefesulo_rendezes([]) == [], "Üres lista."
assert osszefesulo_rendezes([3]) == [3], "Egyelemű lista."
random.seed(1)
for _ in range(20):
    adat = [random.randint(-50, 50) for _ in range(random.randint(0, 40))]
    masolat = list(adat)
    assert osszefesulo_rendezes(adat) == sorted(adat), f"Rossz rendezés: {adat}"
    assert adat == masolat, "Az eredeti lista nem változhat meg."
```

---
title: Alapvető adatszerkezetek
summary: Tömb, lista, verem, sor, fa, gráf és hasítótábla – mire való melyik?
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi az **adatszerkezet**, és miért számít, melyiket választod,
- a **lineáris** adatszerkezeteket: tömb, lista, verem, sor,
- a **nemlineárisakat**: fa, gráf, valamint a **hasítótáblát**.

## Mi az adatszerkezet?

Az **adatszerkezet** az adatok tárolásának és elérésének módja. Ugyanazt az adatot többféleképpen tárolhatjuk, és a választás eldönti, mely műveletek lesznek gyorsak.

## Lineáris szerkezetek

- **Tömb**: azonos típusú elemek egymás után a memóriában. Az `i`-edik elem **azonnal** elérhető (index), de a közepére beszúrni lassú, mert a többit el kell tolni.
- **Láncolt lista**: minden elem tárolja a következő címét. Beszúrni gyors, de az `i`-edik elemhez végig kell lépkedni.
- **Verem (stack)**: **LIFO** – az utoljára betett elem jön ki először (mint egy tányérkupac). Műveletei: `push` (betesz), `pop` (kivesz). Ilyen a böngésző „vissza” gombja és a függvényhívások kezelése.
- **Sor (queue)**: **FIFO** – az elsőként betett elem jön ki először (mint a pénztári sor). Ilyen a nyomtatási sor.

```python run
# Verem és sor Pythonban
verem = []
verem.append("A"); verem.append("B"); verem.append("C")
print(verem.pop())        # C – az utolsó jön ki elsőként

from collections import deque
sor = deque()
sor.append("A"); sor.append("B"); sor.append("C")
print(sor.popleft())      # A – az első jön ki elsőként
```

## Nemlineáris szerkezetek

- **Fa**: hierarchia egy **gyökérrel**; minden elemnek egy szülője van (a gyökérnek nincs). Ilyen a mappaszerkezet vagy egy cég szervezeti ábrája. A **bináris keresőfában** minden csúcs bal oldalán kisebb, jobb oldalán nagyobb értékek vannak, így gyorsan lehet keresni.
- **Gráf**: **csúcsok** és köztük **élek**, tetszőleges kapcsolatokkal. Ilyen az úthálózat, a közösségi háló vagy az internet.

```text
      fa                       gráf
      (8)                  Győr ─── Budapest
     /   \                   │     /    │
   (3)   (10)              Pécs ──┘   Szeged
   / \      \
 (1) (6)   (14)
```

## Hasítótábla (hash table)

A **hasítótábla** kulcs–érték párokat tárol. Egy **hasítófüggvény** a kulcsból kiszámolja, hová kerüljön az érték, így a keresés átlagosan **egy lépés**. A Python `dict`-je ilyen.

```python run
# Szótár: kulcs → érték
telefonkonyv = {"Anna": "+36 30 111 2222", "Béla": "+36 20 333 4444"}
print(telefonkonyv["Anna"])
telefonkonyv["Cili"] = "+36 70 555 6666"
print(len(telefonkonyv))
```

## Összefoglalás

| Szerkezet   | Erőssége                   | Tipikus használat          |
| ----------- | -------------------------- | -------------------------- |
| tömb        | gyors elérés index alapján | táblázatok, képek          |
| verem       | LIFO                       | visszavonás, „vissza” gomb |
| sor         | FIFO                       | nyomtatási sor, ütemezés   |
| fa          | hierarchia, gyors keresés  | mappák, adatbázis-index    |
| gráf        | tetszőleges kapcsolatok    | térkép, közösségi háló     |
| hasítótábla | keresés kulcs szerint      | szótár, gyorsítótár        |

## A lecke feladata

```quiz required
? Melyik adatszerkezet működik **LIFO** elven?
+ verem
- sor
- tömb
- gráf
! Last In, First Out: az utoljára betett jön ki először.

? A sorba ebben a sorrendben teszünk be: 1, 2, 3. Melyik elem jön ki először?
= 1
! A sor FIFO: az elsőként betett jön ki elsőként.

? A verembe ebben a sorrendben teszünk be: 1, 2, 3. Melyik elem jön ki először?
= 3
! A verem LIFO.

? Melyik adatszerkezet illik legjobban egy város úthálózatához?
- verem
- sor
- tömb
+ gráf
! A kereszteződések a csúcsok, az utak az élek.
```

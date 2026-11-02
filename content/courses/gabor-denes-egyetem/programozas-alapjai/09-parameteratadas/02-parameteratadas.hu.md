---
title: Paraméterátadás – érték és hivatkozás szerint
summary: Érték szerinti, cím szerinti és megosztás szerinti átadás; mutable és immutable objektumok Pythonban.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi az **érték szerinti** és a **cím (hivatkozás) szerinti** paraméterátadás,
- hogyan adja át a Python a paramétereket (**objektum-megosztás szerinti** átadás),
- mi a különbség a **megváltoztatható** (mutable) és **megváltoztathatatlan** (immutable) objektumok között,
- hogyan kerülöd el a váratlan mellékhatásokat.

## Érték szerinti átadás (call by value)

A függvény az argumentum **másolatát** kapja. Bármit csinál vele, az eredeti változó nem változik. Így működnek a primitív típusok C-ben, Javában, C#-ban.

```c
void novel(int x) { x = x + 1; }   /* a másolatot növeli */

int a = 5;
novel(a);
/* a értéke továbbra is 5 */
```

## Cím szerinti átadás (call by reference)

A függvény az eredeti változó **címét** kapja, így módosíthatja azt. C++-ban `&`, C#-ban `ref` kulcsszóval kérhető, C-ben mutatóval érhető el.

```c
void novel(int *x) { *x = *x + 1; }   /* a cím alapján az eredetit növeli */

int a = 5;
novel(&a);
/* a értéke most 6 */
```

## Pythonban: megosztás szerinti átadás (call by sharing)

Pythonban minden változó egy **objektumra mutató hivatkozás**. Híváskor a paraméter **ugyanarra az objektumra** fog mutatni, mint az argumentum. Hogy ennek mi a következménye, az attól függ, **módosítható-e** az objektum.

| Megváltoztathatatlan (immutable) | Megváltoztatható (mutable) |
| --- | --- |
| `int`, `float`, `bool`, `str`, `tuple`, `None` | `list`, `dict`, `set`, saját osztályok példányai |

### Megváltoztathatatlan objektum: úgy viselkedik, mint az érték szerinti

```python run
def novel(x):
    x = x + 1        # új int objektum jön létre, x mostantól arra mutat
    print("belül:", x)

a = 5
novel(a)
print("kívül:", a)   # 5 – az eredeti nem változott
```

### Megváltoztatható objektum: a módosítás kívül is látszik

```python run
def hozzaad(lista):
    lista.append(99)   # a KÖZÖS listát módosítjuk helyben

szamok = [1, 2, 3]
hozzaad(szamok)
print(szamok)          # [1, 2, 3, 99] – a hívó listája is megváltozott!
```

### De az új érték hozzárendelése nem látszik kívül

```python run
def csere(lista):
    lista = [0, 0, 0]  # a lokális név egy ÚJ listára mutat, az eredeti érintetlen
    print("belül:", lista)

szamok = [1, 2, 3]
csere(szamok)
print("kívül:", szamok)   # [1, 2, 3]
```

> **Ökölszabály:** a függvény a kapott objektumot **módosíthatja** (ha az mutable), de a hívó **változóját** nem tudja átállítani egy másik objektumra.

## Hogyan kerüld el a nem kívánt módosítást?

1. **Készíts másolatot** a függvényben, ha nem akarod módosítani a bemenetet:

```python run
def rendezett(lista):
    masolat = lista.copy()   # vagy: list(lista), lista[:]
    masolat.sort()
    return masolat

eredeti = [3, 1, 2]
print(rendezett(eredeti), eredeti)   # [1, 2, 3] [3, 1, 2]
```

2. **Adj vissza új értéket** módosítás helyett (funkcionális stílus): `sorted(lista)` a `lista.sort()` helyett.

3. Dokumentáld, ha a függvény **szándékosan** módosítja a paraméterét (pl. a `list.sort()` helyben rendez, és `None`-t ad vissza).

## Sekély és mély másolat

A `copy()` csak a **külső** listát másolja; ha a lista listákat tartalmaz, a belső listák közösek maradnak.

```python run
import copy

matrix = [[1, 2], [3, 4]]
sekely = matrix.copy()
mely = copy.deepcopy(matrix)

matrix[0].append(99)
print(sekely)   # [[1, 2, 99], [3, 4]] – a belső lista közös!
print(mely)     # [[1, 2], [3, 4]]     – teljesen független
```

## Összefoglalás

- **Érték szerinti** átadás: másolat; **cím szerinti**: az eredeti módosítható.
- Python: **megosztás szerinti** átadás – a paraméter ugyanarra az objektumra mutat.
- Immutable objektumnál ez úgy hat, mint az érték szerinti; mutable objektumnál a helyben módosítás kívül is látszik.
- Nem kívánt mellékhatás ellen: másolat (`copy()`, `deepcopy()`), vagy új érték visszaadása.

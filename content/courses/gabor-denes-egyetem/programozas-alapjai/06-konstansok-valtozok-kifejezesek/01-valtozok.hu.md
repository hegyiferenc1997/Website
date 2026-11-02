---
title: Változók deklarálása és használata
summary: Értékadás, elnevezési szabályok, többszörös értékadás és csere – és mi történik a memóriában.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **változó**, és hogyan adsz neki értéket,
- mi a különbség a **deklaráció** és az **értékadás** között más nyelvekben és Pythonban,
- az **elnevezési szabályokat** és szokásokat,
- hogyan működik a változó a memóriában (név → objektum).

## Mi a változó?

A **változó** egy **név**, amely egy értékre hivatkozik. Olyan, mint egy felcímkézett doboz: a címke a név, a tartalom az érték, és a tartalom a program futása során **változhat**.

```python run
pont = 10          # értékadás: a pont nevű változó értéke 10
print(pont)
pont = pont + 5    # az új érték a régiből számolódik
print(pont)        # 15
```

> Az `=` itt **nem egyenlőség**, hanem **értékadás**: „a jobb oldal értéke kerüljön a bal oldali névhez”. A `pont = pont + 5` matematikailag értelmetlen lenne, programban viszont teljesen szokásos.

## Deklaráció és értékadás

Statikusan típusos nyelvekben a változót **deklarálni** kell: meg kell adni a nevét és a típusát, mielőtt használjuk.

```c
int pont;        /* deklaráció: létrejön egy int típusú változó */
pont = 10;       /* értékadás */
int kor = 20;    /* deklaráció kezdeti értékkel (inicializálás) */
```

Pythonban nincs külön deklaráció: a változó az **első értékadáskor jön létre**. Ha egy még nem létező változót használsz, `NameError` keletkezik:

```python
print(eredmeny)   # NameError: name 'eredmeny' is not defined
```

## Elnevezési szabályok

**Kötelező szabályok** (különben `SyntaxError`):

- betűvel vagy `_` jellel kezdődhet, számmal nem,
- csak betűt, számjegyet és `_` jelet tartalmazhat (szóközt, kötőjelet nem),
- nem lehet foglalt szó (`if`, `for`, `class`, `True`, `None` …),
- a kis- és nagybetű számít: `nev` és `Nev` két különböző változó.

| Név                                 | Helyes?                            |
| ----------------------------------- | ---------------------------------- |
| `atlag`, `max_pont`, `_belso`, `x2` | ✅                                 |
| `2x`                                | ❌ számmal kezdődik                |
| `max-pont`                          | ❌ kötőjel (kivonásnak értelmezné) |
| `class`                             | ❌ foglalt szó                     |

**Szokások (PEP 8 stílusirányelv):**

- változók és függvények: `kis_betu_alahuzassal` (snake_case),
- konstansok: `NAGY_BETUVEL`,
- osztályok: `NagyKezdobetuvel` (PascalCase),
- **beszédes nevek**: `hallgatok_szama` jobb, mint `hsz` vagy `x`.

## Többszörös értékadás és csere

```python run
# Több változó egy sorban.
a, b, c = 1, 2, 3
print(a, b, c)

# Ugyanaz az érték több változónak.
x = y = 0
print(x, y)

# Két változó cseréje – Pythonban segédváltozó nélkül.
a, b = b, a
print(a, b)   # 2 1
```

Más nyelvekben a cseréhez segédváltozó kell:

```python run
a, b = 1, 2
seged = a
a = b
b = seged
print(a, b)   # 2 1
```

## Rövidített értékadás

```python run
szamlalo = 0
szamlalo += 1    # ugyanaz, mint szamlalo = szamlalo + 1
szamlalo *= 10   # szamlalo = szamlalo * 10
szamlalo -= 3    # szamlalo = szamlalo - 3
print(szamlalo)  # 7
```

Pythonban nincs `++` és `--` operátor (C-ben és Javában van).

## Mi történik a memóriában?

Pythonban a változó egy **hivatkozás** egy objektumra. Az `id()` függvény megmutatja az objektum azonosítóját.

```python run
a = [1, 2, 3]
b = a              # b ugyanarra a listára mutat, NEM másolat!
b.append(4)
print(a)           # [1, 2, 3, 4] – a is megváltozott
print(a is b)      # True – ugyanaz az objektum

c = a.copy()       # valódi másolat
c.append(5)
print(a, c)
```

Ez a viselkedés nagyon fontos a **paraméterátadásnál**, amivel külön témakörben foglalkozunk.

## Összefoglalás

- A változó egy név, ami egy értékre hivatkozik; az `=` értékadás.
- Pythonban nincs külön deklaráció, a változó az első értékadáskor jön létre.
- Nevek: betűvel kezdődnek, `snake_case`, beszédesek.
- A `b = a` nem másol, csak egy újabb nevet ad ugyanannak az objektumnak.

## A lecke feladata: Változók cseréje és körbeforgatása

Adott három változó: `a`, `b` és `c`. Forgasd el körbe az értéküket úgy, hogy `a` megkapja `b` régi értékét, `b` a `c`-ét, `c` pedig az `a`-ét – **egyetlen többszörös értékadással**, segédváltozó nélkül. Utána a rövidített értékadással (`+=`) növeld meg `c` értékét 10-zel.

Végül írd ki a három változót egy sorban, szóközzel elválasztva.

```python starter required
a = 1
b = 2
c = 3

# 1. körbeforgatás egyetlen sorban: a, b, c = ...
# 2. c növelése 10-zel
# 3. kiírás
```

<details>
<summary>Megoldás</summary>

```python solution
a = 1
b = 2
c = 3

a, b, c = b, c, a
c += 10
print(a, b, c)
```

</details>

```python test
assert (a, b, c) == (2, 3, 11), "A forgatás után a = 2, b = 3, c = 1, majd c += 10 → 11."
assert kimenet.strip() == "2 3 11", "A kiírt sor: 2 3 11"
```

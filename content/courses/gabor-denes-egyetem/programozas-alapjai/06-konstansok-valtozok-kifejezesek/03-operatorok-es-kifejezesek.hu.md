---
title: Operátorok és kifejezések
summary: Összehasonlító és logikai operátorok, rövidzár kiértékelés, precedencia és a kifejezések kiértékelése.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi a **kifejezés**, és hogyan **értékelődik ki**,
- az **összehasonlító** és **logikai** operátorokat,
- mi a **rövidzár kiértékelés**,
- az operátorok **precedenciáját** (erősorrendjét).

## Kifejezés és utasítás

- A **kifejezés** (expression) olyan kódrészlet, aminek **értéke van**: `3 + 4`, `x * 2`, `nev.upper()`, `a > b`.
- Az **utasítás** (statement) egy **cselekvés**: `x = 5`, `if …:`, `print(…)` hívása.

A kifejezés **operandusokból** (értékek, változók) és **operátorokból** (`+`, `>`, `and` …) áll.

## Összehasonlító operátorok

Az eredményük mindig `bool` (`True` vagy `False`).

| Operátor | Jelentés | Példa |
| --- | --- | --- |
| `==` | egyenlő | `5 == 5` → `True` |
| `!=` | nem egyenlő | `5 != 3` → `True` |
| `<`, `>` | kisebb, nagyobb | `3 < 5` → `True` |
| `<=`, `>=` | kisebb-egyenlő, nagyobb-egyenlő | `5 >= 5` → `True` |
| `in` | tartalmazás | `"a" in "alma"` → `True` |
| `is` | ugyanaz az objektum-e | `x is None` |

```python run
kor = 19
print(kor >= 18)            # True
print(18 <= kor < 26)       # True – Pythonban láncolható!
print("alma" == "Alma")     # False – számít a kis- és nagybetű
```

> **Gyakori hiba:** az `=` értékadás, az `==` összehasonlítás. A `None`-nal való összehasonlításhoz `is`-t használunk: `if x is None:`.

## Logikai operátorok

| Operátor | Jelentés | Igaz, ha … |
| --- | --- | --- |
| `and` | és | mindkét oldal igaz |
| `or` | vagy | legalább az egyik igaz |
| `not` | nem | az operandus hamis |

Igazságtábla:

| A | B | A and B | A or B | not A |
| --- | --- | --- | --- | --- |
| True | True | True | True | False |
| True | False | False | True | False |
| False | True | False | True | True |
| False | False | False | False | True |

```python run
kor = 20
van_jogsi = False
print(kor >= 18 and van_jogsi)       # False – vezethet-e?
print(kor < 14 or kor > 65)          # False – kedvezményes jegy?
print(not van_jogsi)                 # True
```

## Rövidzár kiértékelés

Az `and` és az `or` balról jobbra értékelődik ki, és **megáll, amint az eredmény eldőlt**:

- `A and B`: ha `A` hamis, `B`-t már ki sem értékeli (az eredmény úgyis hamis),
- `A or B`: ha `A` igaz, `B`-t már ki sem értékeli.

Ez hasznos a hibák elkerülésére:

```python run
lista = []
# Ha a lista üres, a lista[0] hibát okozna – de a rövidzár miatt ki sem értékelődik.
if len(lista) > 0 and lista[0] == 5:
    print("Az első elem 5.")
else:
    print("Üres a lista, vagy nem 5 az első elem.")

oszto = 0
print(oszto != 0 and 10 / oszto > 1)   # False, nincs ZeroDivisionError
```

Az `or` gyakran alapértelmezett érték megadására szolgál:

```python run
nev = ""
megjelenitett = nev or "Névtelen"
print(megjelenitett)   # Névtelen
```

## Precedencia (erősorrend)

Erősebbtől a gyengébbig (a fentiek kötnek erősebben):

| Szint | Operátorok |
| --- | --- |
| 1. | `()` zárójel |
| 2. | `**` |
| 3. | `-x` (előjel) |
| 4. | `*`, `/`, `//`, `%` |
| 5. | `+`, `-` |
| 6. | `<`, `<=`, `>`, `>=`, `==`, `!=`, `in`, `is` |
| 7. | `not` |
| 8. | `and` |
| 9. | `or` |

```python run
print(2 + 3 * 4 > 10 and not False)   # (2 + 12 > 10) and True → True
print(True or False and False)        # az and erősebb: True or (False and False) → True
```

> **Tipp:** ha nem vagy biztos a sorrendben, **tegyél zárójelet**. A zárójeles kód olvashatóbb is.

## A kiértékelés lépései

Kövessük végig a `3 + 4 * 2 ** 2 - 1` kiértékelését:

1. `2 ** 2` → `4` (hatványozás) → `3 + 4 * 4 - 1`
2. `4 * 4` → `16` (szorzás) → `3 + 16 - 1`
3. `3 + 16` → `19` (balról jobbra) → `19 - 1`
4. `19 - 1` → `18`

```python run
print(3 + 4 * 2 ** 2 - 1)   # 18
```

## Feltételes kifejezés

Egy kétirányú döntés egy kifejezésben is leírható:

```python run
pont = 64
eredmeny = "sikeres" if pont >= 50 else "sikertelen"
print(eredmeny)
```

## Összefoglalás

- A **kifejezésnek értéke van**, az utasítás cselekvés.
- Összehasonlítás: `== != < > <= >=`, láncolható; `None`-hoz `is`.
- Logikai: `and`, `or`, `not`; **rövidzár**: a jobb oldal csak szükség esetén értékelődik ki.
- Kétség esetén **zárójelezz**.

---
title: Ciklusok – while és do-while
summary: Elöltesztelő és hátultesztelő ciklus, végtelen ciklus, és hogyan írunk do-while-t Pythonban.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mire való a **ciklus**, és melyek a részei,
- hogyan működik az **elöltesztelő** `while` ciklus,
- mi a **hátultesztelő** (do-while) ciklus, és hogyan valósítod meg Pythonban,
- hogyan kerülöd el a **végtelen ciklust**.

## A ciklus részei

A **ciklus** utasítások ismételt végrehajtása. Minden ciklusnak van:

- **ciklusfeltétele** – amíg igaz, a ciklus fut,
- **ciklusmagja** – az ismételt utasítások,
- és a magban valaminek **változnia kell**, különben a feltétel sosem lesz hamis.

## Elöltesztelő ciklus: while

A feltételt **minden kör előtt** ellenőrzi. Ha már az elején hamis, a mag **egyszer sem** fut le.

```python run
szamlalo = 1
while szamlalo <= 5:        # ciklusfeltétel
    print(szamlalo)         # ciklusmag
    szamlalo += 1           # a változó, ami előbb-utóbb hamissá teszi a feltételt
print("Vége")
```

Pszeudokóddal:

```text
Ciklus amíg feltétel
    utasítások
Ciklus vége
```

A `while` akkor jó választás, ha **nem tudjuk előre**, hányszor kell ismételni:

```python run
# Hány év alatt duplázódik meg a pénz évi 7%-os kamattal?
osszeg = 100_000
cel = 200_000
ev = 0
while osszeg < cel:
    osszeg *= 1.07
    ev += 1
print(ev, "év alatt:", round(osszeg), "Ft")
```

## Végtelen ciklus

Ha a feltétel soha nem lesz hamis, a ciklus **végtelen**. A program „lefagy” (terminálban **Ctrl + C**-vel állítható le).

```python
i = 0
while i < 10:
    print(i)
    # elfelejtettük: i += 1  → végtelen ciklus!
```

Szándékos végtelen ciklust `while True:` formában írunk, és `break`-kel lépünk ki belőle (lásd a vezérlő utasításokról szóló leckét).

## Hátultesztelő ciklus: do-while

A **hátultesztelő** ciklus a feltételt a kör **végén** ellenőrzi, ezért a mag **legalább egyszer** biztosan lefut. C-ben, Javában, C#-ban erre a `do-while` szolgál:

```java
// Java
int szam;
do {
    szam = beolvas();
} while (szam < 1 || szam > 10);   // addig kérdez, amíg nem jó a szám
```

Pythonban nincs `do-while`, de `while True` + `break` szerkezettel ugyanez megírható:

```python run
# Addig kérünk számot, amíg 1 és 10 közé nem esik – legalább egyszer biztosan kérdezünk.
while True:
    szam = int(input("Adj meg egy számot 1 és 10 között: "))
    if 1 <= szam <= 10:
        break
    print("Nem jó, próbáld újra!")
print("Köszönöm:", szam)
```

## Összehasonlítás

|                      | Elöltesztelő (while)      | Hátultesztelő (do-while)                 |
| -------------------- | ------------------------- | ---------------------------------------- |
| feltétel ellenőrzése | a kör elején              | a kör végén                              |
| minimum lefutás      | 0-szor                    | 1-szer                                   |
| tipikus használat    | ismeretlen számú ismétlés | beolvasás ellenőrzése, menü              |
| Pythonban            | `while feltetel:`         | `while True:` … `if not feltetel: break` |

## Összefoglalás

- A ciklus feltételből és magból áll; a magban változnia kell valaminek.
- A `while` **elöltesztelő**: lehet, hogy egyszer sem fut le.
- A **do-while** hátultesztelő, legalább egyszer lefut; Pythonban `while True` + `break`.

## A lecke feladata: Mennyi idő alatt gyűlik össze?

Írj `hany_ev(megtakaritas, cel, kamat_szazalek)` függvényt **`while` ciklussal**: hány év kell ahhoz, hogy a megtakarítás évi kamatos kamattal elérje (vagy meghaladja) a célt? Minden évben a pénz `kamat_szazalek` százalékkal nő.

- Ha a megtakarítás már kezdetben eléri a célt, 0 a válasz.
- Ha a kamat 0 (vagy negatív) és a cél még nincs meg, sosem gyűlne össze: ilyenkor `-1` legyen az eredmény (különben végtelen ciklus lenne!).

```python starter required
def hany_ev(megtakaritas, cel, kamat_szazalek):
    evek = 0
    # while ... : megtakaritas növelése, evek += 1
    return evek


print(hany_ev(100000, 150000, 10))   # 5
```

<details>
<summary>Megoldás</summary>

```python solution
def hany_ev(megtakaritas, cel, kamat_szazalek):
    if megtakaritas >= cel:
        return 0
    if kamat_szazalek <= 0:
        return -1
    evek = 0
    while megtakaritas < cel:
        megtakaritas *= 1 + kamat_szazalek / 100
        evek += 1
    return evek


print(hany_ev(100000, 150000, 10))   # 5
```

</details>

```python test
assert hany_ev(100000, 150000, 10) == 5, "100 000 Ft évi 10%-kal 5 év alatt éri el a 150 000-et."
assert hany_ev(1000, 2000, 100) == 1, "100% kamattal egy év alatt duplázódik."
assert hany_ev(5000, 5000, 3) == 0, "Ha már megvan a cél: 0 év."
assert hany_ev(1000, 2000, 0) == -1, "0% kamattal sosem gyűlik össze: -1."
assert hany_ev(1000, 1001, 0.5) == 1, "Tört kamatlábbal is működjön."
```

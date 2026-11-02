---
title: Szövegek (stringek)
summary: Indexelés, szeletelés, szövegműveletek, hasznos metódusok és az f-string formázás.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan éred el egy szöveg karaktereit **indexeléssel** és **szeleteléssel**,
- a leggyakoribb **szövegmetódusokat**,
- hogyan formázol szöveget **f-stringgel**,
- mit jelent, hogy a string **megváltoztathatatlan**.

## Indexelés

A szöveg karakterek sorozata. Minden karakternek van egy **indexe**, ami **0-tól** indul. Negatív indexszel a végéről számolunk.

```text
 P   y   t   h   o   n
 0   1   2   3   4   5
-6  -5  -4  -3  -2  -1
```

```python run
szo = "Python"
print(szo[0])     # P – az első karakter
print(szo[5])     # n – az utolsó
print(szo[-1])    # n – az utolsó, a végéről számolva
print(len(szo))   # 6 – a hossz
```

## Szeletelés (slicing)

A `szoveg[kezdet:vég:lépés]` alak egy részszöveget ad. A **kezdet** benne van, a **vég már nincs**.

```python run
szo = "Programozás"
print(szo[0:4])    # Prog
print(szo[:4])     # Prog – a kezdet elhagyható
print(szo[4:])     # ramozás – a vég is
print(szo[-3:])    # zás – az utolsó 3 karakter
print(szo[::2])    # Pormzs – minden második
print(szo[::-1])   # sázomargorP – megfordítva
```

## Műveletek szövegekkel

```python run
print("alma" + "fa")       # almafa – összefűzés
print("ha" * 3)            # hahaha – ismétlés
print("ma" in "alma")      # True – tartalmazás
print("a" < "b")           # True – ábécé szerinti összehasonlítás (karakterkód alapján)
```

## Hasznos metódusok

| Metódus                        | Mit csinál                             | Példa → eredmény                         |
| ------------------------------ | -------------------------------------- | ---------------------------------------- |
| `upper()`, `lower()`           | nagy- / kisbetűssé alakít              | `"Alma".upper()` → `"ALMA"`              |
| `strip()`                      | levágja a szóközöket a széleiről       | `"  hi  ".strip()` → `"hi"`              |
| `split(sep)`                   | darabolás listává                      | `"a,b,c".split(",")` → `["a", "b", "c"]` |
| `join(lista)`                  | lista összefűzése                      | `"-".join(["a", "b"])` → `"a-b"`         |
| `replace(a, b)`                | csere                                  | `"alma".replace("a", "o")` → `"olmo"`    |
| `find(x)`                      | első előfordulás indexe (−1, ha nincs) | `"alma".find("m")` → `2`                 |
| `count(x)`                     | előfordulások száma                    | `"banana".count("a")` → `3`              |
| `startswith(x)`, `endswith(x)` | így kezdődik / végződik-e              | `"kép.png".endswith(".png")` → `True`    |
| `isdigit()`                    | csak számjegyekből áll-e               | `"2026".isdigit()` → `True`              |

```python run
mondat = "  A Python egy jó első nyelv.  "
tiszta = mondat.strip()
print(tiszta)
print(tiszta.split())          # szavakra bontás szóközök mentén
print(len(tiszta.split()))     # szavak száma: 6
print(tiszta.lower().count("e"))
```

## F-string formázás

Az **f-string** (`f"..."`) a legkényelmesebb módja annak, hogy értékeket illesszünk a szövegbe. A kapcsos zárójelbe bármilyen kifejezés írható.

```python run
nev = "Anna"
atlag = 4.6667
pont = 87

print(f"{nev} átlaga: {atlag:.2f}")      # 2 tizedesre kerekítve
print(f"Pontszám: {pont}/100 ({pont / 100:.0%})")   # százalék
print(f"|{nev:<10}|{nev:>10}|{nev:^10}|")   # balra, jobbra, középre igazítás 10 karakteren
print(f"{1234567:,}")                    # ezres elválasztó
print(f"{nev=}")                         # hibakereséshez: kiírja a nevet és az értéket is
```

## Speciális karakterek

| Jelölés | Jelentés                  |
| ------- | ------------------------- |
| `\n`    | új sor                    |
| `\t`    | tabulátor                 |
| `\\`    | egy darab `\`             |
| `\"`    | idézőjel a szövegen belül |

```python run
print("Első sor\nMásodik sor")
print("Név:\tAnna")
print("C:\\Users\\anna")
print(r"C:\Users\anna")   # r"..." = nyers szöveg, a \ nem speciális
```

## A string megváltoztathatatlan

Egy meglévő stringet nem lehet módosítani, csak újat létrehozni belőle.

```python
szo = "alma"
szo[0] = "A"   # TypeError: 'str' object does not support item assignment
```

```python run
szo = "alma"
szo = "A" + szo[1:]   # új stringet hozunk létre
print(szo)            # Alma
```

## Összefoglalás

- Az indexelés 0-tól indul, a negatív index a végéről számol; a szeletelésnél a vég nincs benne.
- Fontos metódusok: `strip`, `split`, `join`, `replace`, `upper`, `lower`, `find`, `count`.
- Formázáshoz használj **f-stringet**: `f"{ertek:.2f}"`.
- A string **megváltoztathatatlan** (immutable).

## A lecke feladata: Névkártya szövegműveletekkel

Írj `nevkartya(nev)` függvényt, amely egy kusza formában megadott névből szép névkártya-szöveget készít:

- a fölösleges szóközöket eltávolítja (az elejéről, a végéről és a szavak közül),
- minden névrészt nagy kezdőbetűvel, a többit kisbetűvel ír,
- a végére zárójelben a monogramot teszi: a névrészek kezdőbetűi ponttal.

Például `nevkartya("  kovács   ANNA ")` → `"Kovács Anna (K.A.)"`.

Tipp: `split()`, `capitalize()`, `" ".join(...)`, indexelés és f-string.

```python starter required
def nevkartya(nev):
    reszek = nev.split()    # a split() paraméter nélkül a több szóközt is kezeli
    # szép névrészek, monogram, majd f-string
    pass


print(nevkartya("  kovács   ANNA "))   # Kovács Anna (K.A.)
```

<details>
<summary>Megoldás</summary>

```python solution
def nevkartya(nev):
    reszek = [resz.capitalize() for resz in nev.split()]
    monogram = "".join(resz[0] + "." for resz in reszek)
    return f"{' '.join(reszek)} ({monogram})"


print(nevkartya("  kovács   ANNA "))   # Kovács Anna (K.A.)
```

</details>

```python test
assert nevkartya("  kovács   ANNA ") == "Kovács Anna (K.A.)", "nevkartya(\"  kovács   ANNA \") → \"Kovács Anna (K.A.)\""
assert nevkartya("nagy béla józsef") == "Nagy Béla József (N.B.J.)", "Háromrészes névnél is működjön."
assert nevkartya("ÉVA") == "Éva (É.)", "Egyetlen névrésznél is működjön (ékezetes betűvel is)."
```

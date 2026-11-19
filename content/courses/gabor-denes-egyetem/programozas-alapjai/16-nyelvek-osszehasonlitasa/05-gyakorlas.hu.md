---
title: Gyakorlás – nyelvek összehasonlítása
summary: Ellenőrző kérdések és kód „fordítása” Javából, C#-ból és Rubyból Pythonra.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

**1. Melyik nyelvek fordulnak közvetlenül gépi kódra, és melyek futnak virtuális gépen?**

<details>
<summary>Válasz</summary>

Gépi kódra fordul: C, C++, Go, Rust. Bájtkódra fordul és virtuális gépen fut: Java (JVM), C# (.NET CLR). A Python is bájtkódot készít, amit a saját virtuális gépe (interpretere) hajt végre.

</details>

**2. Melyik nyelvet választanád egy 32 KB memóriájú mikrovezérlőhöz, és miért?**

<details>
<summary>Válasz</summary>

C-t (esetleg C++-t): kis erőforrás-igényű, közvetlenül hozzáfér a hardverhez, és nincs szüksége futtatókörnyezetre vagy szemétgyűjtőre.

</details>

**3. Miért fut csak a JavaScript natívan a böngészőben, és mi a TypeScript szerepe?**

<details>
<summary>Válasz</summary>

A böngészők JavaScript-motort tartalmaznak (történelmi okból ez lett a web szabványos nyelve). A TypeScript statikus típusokat ad a JavaScripthez, és JavaScriptre fordul, így a böngészőben ugyanúgy fut, de a típushibák már fordításkor kiderülnek.

</details>

**4. Mi a fő kompromisszum a Python és a C között?**

<details>
<summary>Válasz</summary>

A Pythonban sokkal gyorsabban lehet fejleszteni (rövidebb, olvashatóbb kód, automatikus memóriakezelés), de a program lassabban fut. A C-ben a program nagyon gyors, de a fejlesztés lassabb és hibalehetőségekkel teli (kézi memóriakezelés).

</details>

**5. Mi felel meg a Python `self.nev` kifejezésének Rubyban, Javában és C#-ban?**

<details>
<summary>Válasz</summary>

Rubyban `@nev`, Javában és C#-ban `this.nev` (amit általában el is lehet hagyni).

</details>

## Feladatok

### 1. feladat: Javából Pythonra

Írd át Pythonra az alábbi Java metódust! A függvény neve legyen `faktorialis(n)`.

```java
static long faktorialis(int n) {
    long eredmeny = 1;
    for (int i = 2; i <= n; i++) {
        eredmeny *= i;
    }
    return eredmeny;
}
```

```python starter
def faktorialis(n):
    # TODO: a Java kód Python megfelelője
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def faktorialis(n):
    """n! kiszámolása ciklussal (a Java kód szó szerinti megfelelője)."""
    eredmeny = 1
    for i in range(2, n + 1):  # a Java i <= n feltétele miatt n + 1
        eredmeny *= i
    return eredmeny
```

</details>

```python test
assert faktorialis(0) == 1
assert faktorialis(1) == 1
assert faktorialis(5) == 120
assert faktorialis(20) == 2432902008176640000
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Rubyból Pythonra

Írd át Pythonra a Ruby kódot! A `hosszu_szavak(szoveg, min_hossz)` függvény adja vissza a legalább `min_hossz` hosszú szavakat **nagybetűsítve**, listában.

```ruby
def hosszu_szavak(szoveg, min_hossz)
  szoveg.split.select { |szo| szo.length >= min_hossz }.map(&:upcase)
end
```

```python starter
def hosszu_szavak(szoveg, min_hossz):
    # TODO
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def hosszu_szavak(szoveg, min_hossz):
    """A Ruby select + map lánc Pythonban egy listaértelmezés."""
    return [szo.upper() for szo in szoveg.split() if len(szo) >= min_hossz]
```

</details>

```python test
assert hosszu_szavak("a programozás nagyon jó móka", 4) == ["PROGRAMOZÁS", "NAGYON", "MÓKA"]
assert hosszu_szavak("", 3) == []
assert hosszu_szavak("egy két", 10) == []
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: C#-ból Pythonra (osztály)

Írd át Pythonra a C# osztályt! A `Termek` osztálynak legyen `nev` és `ar` attribútuma, és egy `akcios_ar(szazalek)` metódusa, amely a kedvezményes árat adja vissza egészre kerekítve. Negatív árnál dobjon `ValueError`-t.

```csharp
public class Termek
{
    public string Nev { get; }
    public int Ar { get; }

    public Termek(string nev, int ar)
    {
        if (ar < 0) throw new ArgumentException("Az ár nem lehet negatív.");
        Nev = nev;
        Ar = ar;
    }

    public int AkciosAr(int szazalek) => (int)Math.Round(Ar * (100 - szazalek) / 100.0);
}
```

```python starter
class Termek:
    # TODO: __init__ és akcios_ar
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
class Termek:
    """Egy termék névvel és árral (a C# osztály megfelelője)."""

    def __init__(self, nev: str, ar: int):
        if ar < 0:
            raise ValueError("Az ár nem lehet negatív.")  # C# ArgumentException → ValueError
        self.nev = nev
        self.ar = ar

    def akcios_ar(self, szazalek: int) -> int:
        """A kedvezményes ár egészre kerekítve."""
        return round(self.ar * (100 - szazalek) / 100)
```

</details>

```python test
t = Termek("Laptop", 200_000)
assert t.nev == "Laptop" and t.ar == 200_000
assert t.akcios_ar(10) == 180_000
assert t.akcios_ar(0) == 200_000
try:
    Termek("Hibás", -1)
    assert False, "ValueError-t vártunk"
except ValueError:
    pass
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Gondolkodtató – melyik nyelv?

Válassz nyelvet a következő feladatokhoz, és indokold egy mondatban!

1. Egy interaktív térkép egy weboldalon.
2. Egy szenzoradatokat gyűjtő, elemmel működő eszköz szoftvere.
3. Egy egyetemi kutatás adatainak statisztikai elemzése.
4. Egy 3D-s mobiljáték.

<details>
<summary>Lehetséges válasz</summary>

1. **JavaScript/TypeScript** – csak ez fut natívan a böngészőben.
2. **C** – kevés memória és energia, közvetlen hardverelérés.
3. **Python** – pandas, NumPy, matplotlib: kész eszközök az elemzéshez.
4. **C# (Unity)** vagy **C++ (Unreal)** – a játékmotorok nyelvei, több platformra is exportálnak.

</details>

## Összefoglaló feladat: Szövegstatisztika Rubyból Pythonra

Fordítsd le Pythonra az alábbi Ruby függvényt `szo_statisztika(szoveg)` néven!

```ruby
def szo_statisztika(szoveg)
  szavak = szoveg.downcase.scan(/[[:alpha:]]+/)        # csak betűkből álló szavak
  db = szavak.tally                                     # szó => darabszám
  top = db.sort_by { |szo, n| [-n, szo] }.first(3)      # a 3 leggyakoribb
  atlag = szavak.empty? ? 0.0 : (szavak.sum(&:length).to_f / szavak.size).round(2)
  { szavak: szavak.size, egyedi: db.size, leggyakoribb: top, atlagos_hossz: atlag }
end
```

A Python változat szótárat adjon vissza `"szavak"`, `"egyedi"`, `"leggyakoribb"` és `"atlagos_hossz"` kulcsokkal; a `"leggyakoribb"` értéke `(szó, darab)` **tuple-ök listája** legyen.

Segítség a megfeleltetéshez:

- `scan(/[[:alpha:]]+/)` → `re.findall(r"[^\W\d_]+", ...)` (betűk, ékezetesek is),
- `tally` → `collections.Counter`,
- `sort_by { [-n, szo] }` → `sorted(..., key=lambda p: (-p[1], p[0]))`.

```python starter required
import re
from collections import Counter


def szo_statisztika(szoveg):
    szavak = szoveg.split()
    return {"szavak": len(szavak)}


print(szo_statisztika("Alma, körte, alma! A körte érett, az alma piros."))
```

<details>
<summary>Megoldás</summary>

```python solution
import re
from collections import Counter


def szo_statisztika(szoveg):
    # Csak betűkből álló szavak, kisbetűsítve (a Ruby scan megfelelője)
    szavak = re.findall(r"[^\W\d_]+", szoveg.lower())
    db = Counter(szavak)
    # Csökkenő darabszám, egyenlőségnél ábécérend – az első három
    top = sorted(db.items(), key=lambda p: (-p[1], p[0]))[:3]
    atlag = round(sum(len(sz) for sz in szavak) / len(szavak), 2) if szavak else 0.0
    return {"szavak": len(szavak), "egyedi": len(db), "leggyakoribb": top, "atlagos_hossz": atlag}


print(szo_statisztika("Alma, körte, alma! A körte érett, az alma piros."))
```

</details>

```python test
e = szo_statisztika("Alma, körte, alma! A körte érett, az alma piros.")
assert e["szavak"] == 9 and e["egyedi"] == 6, "9 szó, ebből 6 különböző (írásjelek nélkül, kisbetűsítve)."
assert e["leggyakoribb"] == [("alma", 3), ("körte", 2), ("a", 1)], "A leggyakoribb három: alma 3, körte 2, majd ábécérendben az első egyszeri szó."
assert e["atlagos_hossz"] == 3.89, "Az átlagos szóhossz 35 / 9 ≈ 3.89."
e = szo_statisztika("R2D2 és C-3PO 2024-ben")
assert e["szavak"] == 6 and e["egyedi"] == 6, "Számjegyek nem részei a szavaknak: r, d, és, c, po, ben."
assert szo_statisztika("") == {"szavak": 0, "egyedi": 0, "leggyakoribb": [], "atlagos_hossz": 0.0}, "Üres szövegnél 0, 0, [], 0.0."
assert szo_statisztika("b a b a c")["leggyakoribb"] == [("a", 2), ("b", 2), ("c", 1)], "Egyenlő darabszámnál ábécérend."
```

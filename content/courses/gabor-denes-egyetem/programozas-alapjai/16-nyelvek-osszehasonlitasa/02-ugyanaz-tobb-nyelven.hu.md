---
title: Ugyanaz a program több nyelven
summary: Hello World, ciklus, függvény és osztály Pythonban, Javában, C#-ban, Rubyban, C-ben és JavaScriptben.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- hogyan néz ki **ugyanaz a feladat** különböző nyelveken,
- mik a **közös elemek** és mik a **különbségek** (típusok, blokkok, pontosvessző),
- hogyan „fordítsd le” a Python-tudásodat más nyelvre.

## 1. Hello World

A legegyszerűbb program is jól mutatja a nyelvek „körítését”.

```python run
print("Helló, világ!")
```

```java
// Java: minden kód osztályban van, a belépési pont a main metódus.
public class Hello {
    public static void main(String[] args) {
        System.out.println("Helló, világ!");
    }
}
```

```csharp
// C#: a modern változat (top-level statements) már egy sor is lehet.
Console.WriteLine("Helló, világ!");
```

```ruby
# Ruby: a puts kiír és sort emel.
puts "Helló, világ!"
```

```c
/* C: a stdio.h könyvtár kell a kiíráshoz, a main int-et ad vissza. */
#include <stdio.h>
int main(void) {
    printf("Helló, világ!\n");
    return 0;
}
```

```javascript
// JavaScript (böngésző vagy Node.js)
console.log("Helló, világ!");
```

**Megfigyelés:** a Python, a Ruby és a JavaScript szkriptnyelvként azonnal futtat egy sort; a Java és a C egy kötelező szerkezetet (osztály, `main`) vár.

## 2. Ciklus és elágazás: páros számok összege 1-től 10-ig

```python run
osszeg = 0
for i in range(1, 11):
    if i % 2 == 0:
        osszeg += i
print(osszeg)  # 30
```

```java
int osszeg = 0;
for (int i = 1; i <= 10; i++) {   // a változó típusát meg kell adni
    if (i % 2 == 0) {
        osszeg += i;
    }
}
System.out.println(osszeg);
```

```csharp
int osszeg = 0;
for (int i = 1; i <= 10; i++)
{
    if (i % 2 == 0) osszeg += i;
}
Console.WriteLine(osszeg);
```

```ruby
osszeg = 0
(1..10).each do |i|        # tartomány + blokk
  osszeg += i if i.even?   # utótagos if
end
puts osszeg
```

```c
int osszeg = 0;
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) osszeg += i;
}
printf("%d\n", osszeg);
```

```javascript
let osszeg = 0;
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) osszeg += i;   // === szigorú egyenlőség
}
console.log(osszeg);
```

| | Python | Java / C# / C / JS | Ruby |
| --- | --- | --- | --- |
| blokk jelölése | behúzás + `:` | `{ }` | `do … end` |
| utasítás vége | sorvége | `;` (JS-ben opcionális) | sorvége |
| számlálós ciklus | `for i in range(1, 11)` | `for (int i = 1; i <= 10; i++)` | `(1..10).each` |

A **funkcionális stílus** is mindenhol elérhető:

```python run
print(sum(i for i in range(1, 11) if i % 2 == 0))
```

```java
// Java Stream API
int osszeg = java.util.stream.IntStream.rangeClosed(1, 10).filter(i -> i % 2 == 0).sum();
```

```csharp
// C# LINQ
int osszeg = Enumerable.Range(1, 10).Where(i => i % 2 == 0).Sum();
```

```ruby
osszeg = (1..10).select(&:even?).sum
```

```javascript
const osszeg = [...Array(10).keys()].map(i => i + 1).filter(i => i % 2 === 0).reduce((a, b) => a + b, 0);
```

## 3. Függvény: a legnagyobb elem megkeresése

```python run
def maximum(szamok: list[int]) -> int:
    legnagyobb = szamok[0]
    for szam in szamok[1:]:
        if szam > legnagyobb:
            legnagyobb = szam
    return legnagyobb

print(maximum([3, 8, 1, 6]))  # 8
```

```java
static int maximum(int[] szamok) {          // paraméter- és visszatérési típus kötelező
    int legnagyobb = szamok[0];
    for (int szam : szamok) {               // "for-each" ciklus
        if (szam > legnagyobb) legnagyobb = szam;
    }
    return legnagyobb;
}
```

```csharp
static int Maximum(int[] szamok)            // C#-ban a metódusnév nagybetűs (PascalCase)
{
    int legnagyobb = szamok[0];
    foreach (int szam in szamok)
        if (szam > legnagyobb) legnagyobb = szam;
    return legnagyobb;
}
```

```ruby
def maximum(szamok)
  legnagyobb = szamok[0]
  szamok.each { |szam| legnagyobb = szam if szam > legnagyobb }
  legnagyobb                                # az utolsó kifejezés a visszatérési érték
end
```

```c
/* C-ben a tömb nem tudja a saját hosszát, ezért külön paraméterben adjuk át. */
int maximum(const int szamok[], int n) {
    int legnagyobb = szamok[0];
    for (int i = 1; i < n; i++)
        if (szamok[i] > legnagyobb) legnagyobb = szamok[i];
    return legnagyobb;
}
```

## 4. Osztály: egy hallgató

```python run
class Hallgato:
    def __init__(self, nev: str, kreditek: int = 0):
        self.nev = nev
        self.kreditek = kreditek

    def teljesit(self, kredit: int) -> None:
        self.kreditek += kredit

    def __str__(self) -> str:
        return f"{self.nev} ({self.kreditek} kredit)"

h = Hallgato("Anna")
h.teljesit(8)
print(h)  # Anna (8 kredit)
```

```java
public class Hallgato {
    private final String nev;     // private: kívülről nem érhető el (egységbezárás)
    private int kreditek;

    public Hallgato(String nev) { // konstruktor: ugyanaz a neve, mint az osztálynak
        this.nev = nev;
    }

    public void teljesit(int kredit) { kreditek += kredit; }

    @Override
    public String toString() { return nev + " (" + kreditek + " kredit)"; }
}
```

```csharp
public class Hallgato
{
    public string Nev { get; }               // tulajdonság (property)
    public int Kreditek { get; private set; }

    public Hallgato(string nev) => Nev = nev;

    public void Teljesit(int kredit) => Kreditek += kredit;

    public override string ToString() => $"{Nev} ({Kreditek} kredit)";
}
```

```ruby
class Hallgato
  attr_reader :nev, :kreditek     # automatikus "getter" metódusok

  def initialize(nev, kreditek = 0)
    @nev = nev                    # @ = példányváltozó (Pythonban self.)
    @kreditek = kreditek
  end

  def teljesit(kredit)
    @kreditek += kredit
  end

  def to_s
    "#{@nev} (#{@kreditek} kredit)"
  end
end
```

**Megfigyelés:** a Python `self.` előtagja Rubyban `@`, Javában/C#-ban `this.` (amely általában el is hagyható). A Python nem ismeri a `private` kulcsszót – konvenció szerint az `_`-sal kezdődő nevet tekintjük belsőnek.

## Összefoglalás

- Az alapszerkezetek (változó, ciklus, elágazás, függvény, osztály) **minden nyelvben megvannak**.
- A különbségek főleg: **típusmegadás** (statikus vs. dinamikus), **blokkjelölés** (`{}` vs. behúzás vs. `end`), **körítés** (`main`, osztály).
- Ha egy nyelvet jól ismersz, a következőt sokkal gyorsabban tanulod meg.

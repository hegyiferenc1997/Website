---
title: Mélyebben – függvények mint értékek
summary: A függvény is érték – átadható paraméterként és visszaadható eredményként: numerikus integrálás tetszőleges függvényre, zárványok (closure) és a nonlocal, a hatókörök LEGB-szabálya, és egy saját gyorsítótárazó dekorátor, amely a rekurzív Fibonaccit ezerszer gyorsabbá teszi.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- hogy Pythonban a függvény is **érték**: változóba tehető, paraméterként átadható, eredményként visszaadható,
- mi a **zárvány** (closure), és hogyan „emlékszik” egy függvény a létrehozásakori változókra,
- hogyan keres a Python egy nevet (**LEGB-szabály**), és mire való a `global` és a `nonlocal`,
- mi a **dekorátor**, és hogyan gyorsít a **memoizáció**.

## 1. Függvény paraméterként: numerikus integrálás

Az alapleckében láttuk, hogy a függvény egy névvel ellátott, újrahasznosítható kódrész. A függvény neve valójában egy változó, amely egy függvény-objektumra mutat – így egy függvényt **át is adhatunk** egy másiknak. Ezzel írhatunk például olyan integráló függvényt, amely **bármilyen** függvény görbe alatti területét kiszámolja (trapézszabállyal):

```python run
# Függvény paraméterként: trapézszabályos integrálás tetszőleges f függvényre
import math

def integral(f, a, b, lepesek=1000):
    h = (b - a) / lepesek
    osszeg = (f(a) + f(b)) / 2
    for i in range(1, lepesek):
        osszeg += f(a + i * h)               # itt hívjuk meg a kapott függvényt
    return osszeg * h

def negyzet(x):
    return x * x

print("∫₀¹ x² dx      ≈", round(integral(negyzet, 0, 1), 6), " (pontosan 1/3)")
print("∫₀^π sin x dx  ≈", round(integral(math.sin, 0, math.pi), 6), " (pontosan 2)")
print("∫₁² 1/x dx     ≈", round(integral(lambda x: 1 / x, 1, 2), 6), " (pontosan ln 2 =", round(math.log(2), 6), ")")
```

Az `integral` nem tudja, és nem is kell tudnia, mit integrál: csak annyit vár, hogy `f`-et meg lehessen hívni egy számmal. A harmadik sorban a `lambda` egy **névtelen** függvény, amelyet helyben írunk meg. Ugyanez az ötlet van a `sorted(..., key=...)`, a `max(..., key=...)` és a gombkattintásra meghívott függvények (eseménykezelők) mögött is.

## 2. Függvény eredményként: zárványok

Egy függvény **létrehozhat és visszaadhat** egy másik függvényt. A belső függvény ilyenkor „magával viszi” a külső függvény változóit – ez a **zárvány** (closure):

```python run
# Zárvány: a belső függvény emlékszik a külső függvény változóira
def szorzo(k):
    def szoroz(x):
        return k * x                         # a k a külső függvényből jön
    return szoroz

duplaz = szorzo(2)
triplaz = szorzo(3)
print(duplaz(10), triplaz(10))

# állapotot is tárolhat: a nonlocal engedi módosítani a külső változót
def szamlalo():
    db = 0
    def novel():
        nonlocal db                          # nélküle a db helyi változó lenne, és hibát kapnánk
        db += 1
        return db
    return novel

latogatok = szamlalo()
letoltesek = szamlalo()
for _ in range(3):
    latogatok()
letoltesek()
print("látogatók:", latogatok(), "| letöltések:", letoltesek())
```

A `duplaz` és a `triplaz` ugyanabból a kódból készült, de mindegyik a saját `k` értékét őrzi. A két számláló is független egymástól – mindegyik a saját `db` változóját látja. Ez egy könnyűsúlyú alternatíva az osztályokra, ha csak egyetlen műveletre és egy kis állapotra van szükség.

## 3. Hatókörök: a LEGB-szabály

Amikor a Python egy nevet keres, négy helyen néz meg sorban: **L**ocal (a függvényen belül), **E**nclosing (a körülvevő függvényben), **G**lobal (a modul szintjén), **B**uilt-in (a beépített nevek, pl. `len`, `print`). Az első találat nyer:

```python run
# A LEGB-szabály: Local → Enclosing → Global → Built-in
x = "globális"

def kulso():
    x = "körülvevő"
    def belso():
        x = "helyi"
        print("belső függvényben:  ", x)     # L: helyi
    belso()
    print("külső függvényben:  ", x)         # E-ből nézve ez a "helyi"
kulso()
print("modul szintjén:     ", x)             # G

print("beépített len:      ", len("alma"))   # B
len = lambda s: 42                           # ROSSZ ÖTLET: eltakarjuk a beépítettet
print("eltakart len:       ", len("alma"))
del len                                      # visszaállítjuk
print("visszaállított len: ", len("alma"))
```

Két tanulság. Egy függvényen belüli értékadás mindig **helyi** változót hoz létre, még ha kint van azonos nevű is – ezért kell a `global`/`nonlocal`, ha mégis a külsőt akarod módosítani (de a `global` használata többnyire rossz tervezésre utal: add át paraméterként, és add vissza az eredményt). És soha ne nevezz el változót `list`-nek, `len`-nek vagy `sum`-nak: eltakarod vele a beépített függvényt.

## 4. Dekorátor és memoizáció

A **dekorátor** egy olyan függvény, amely egy másik függvényt kap, és egy „feljavított” változatot ad vissza. A legismertebb haszna a **memoizáció**: a már kiszámolt eredményeket megjegyezzük, és nem számoljuk újra. A naiv rekurzív Fibonacci ugyanis rengetegszer számolja ki ugyanazt:

```python run
# Saját gyorsítótárazó dekorátor: a rekurzív Fibonacci hívásszámának összehasonlítása
def memoizal(fuggveny):
    tar = {}
    def burkolo(n):
        if n not in tar:
            tar[n] = fuggveny(n)                 # csak akkor számolunk, ha még nem tudjuk
        return tar[n]
    return burkolo

hivasok = {"naiv": 0, "memo": 0}

def fib_naiv(n):
    hivasok["naiv"] += 1
    return n if n < 2 else fib_naiv(n - 1) + fib_naiv(n - 2)

@memoizal
def fib_memo(n):
    hivasok["memo"] += 1
    return n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)

print("fib(25) naivan:      ", fib_naiv(25), f"({hivasok['naiv']:,} hívás)".replace(",", " "))
print("fib(25) memoizálva:  ", fib_memo(25), f"({hivasok['memo']} hívás)")
print("fib(200) memoizálva: ", fib_memo(200))
```

A naiv változat a fib(25)-höz negyedmillió hívást végez, a memoizált 26-ot – és a fib(200) is azonnal megvan, amit a naiv változat a világegyetem élettartama alatt sem számolna ki. A `@memoizal` sor ugyanazt jelenti, mint a `fib_memo = memoizal(fib_memo)`. A Pythonban kész változat is van: `@functools.cache`.

| Nézőpont         | Mit nyer a függvényekkel?                                                           |
| ---------------- | ----------------------------------------------------------------------------------- |
| **programozó**   | újrahasznosítás: egyszer megírt integrálás, rendezés, gyorsítótár                   |
| **olvasó**       | jó névvel a függvényhívás egy mondat: `atlag(jegyek)` – nem kell a belsejét olvasni |
| **tesztelő**     | a kis, egyetlen dolgot végző függvény külön tesztelhető                             |
| **teljesítmény** | a memoizáció ismétlődő számításoknál nagyságrendeket gyorsít                        |

## Összefoglalás

- A függvény érték: paraméterként átadható (pl. `integral(f, …)`, `key=`), és eredményként visszaadható.
- A zárvány a létrehozásakori változókat őrzi; a `nonlocal` engedi módosítani őket.
- A nevek feloldása LEGB sorrendben történik; ne takard el a beépített neveket.
- A dekorátor becsomagol egy függvényt; a memoizáció a már kiszámolt eredményeket újrahasznosítja.

## A lecke feladata: függvény ismétlése

Írd meg az `ismetel(f, n)` függvényt, amely egy **új függvényt** ad vissza! Ez az új függvény egy `x` értékre `n`-szer egymás után alkalmazza `f`-et: `f(f(…f(x)…))`. Ha `n` = 0, az új függvény változatlanul adja vissza `x`-et. Például `ismetel(lambda x: x * 2, 3)(1)` értéke `8`.

```python starter required
def ismetel(f, n):
    def uj(x):
        # alkalmazd f-et n-szer x-re
        return x
    return f


duplaz = lambda x: x * 2
print(ismetel(duplaz, 3)(1))
```

<details>
<summary>Megoldás</summary>

```python solution
def ismetel(f, n):
    def uj(x):
        for _ in range(n):
            x = f(x)
        return x
    return uj


duplaz = lambda x: x * 2
print(ismetel(duplaz, 3)(1))
```

</details>

```python test
assert ismetel(lambda x: x * 2, 3)(1) == 8, "1 háromszor duplázva 8"
assert ismetel(lambda x: x + 5, 4)(0) == 20, "0-hoz négyszer 5-öt adva 20"
assert ismetel(lambda x: x * 2, 0)(7) == 7, "n = 0 esetén x változatlan"
assert ismetel(str.upper, 1)("alma") == "ALMA", "bármilyen függvénnyel működik"
```

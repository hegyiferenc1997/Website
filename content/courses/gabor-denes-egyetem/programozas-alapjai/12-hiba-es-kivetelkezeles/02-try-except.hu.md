---
title: Kivételkezelés – try, except, else, finally
summary: A try–catch blokk Pythonban: kivételek elkapása, több except ág, az else és a finally szerepe.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- hogyan **kapsz el** egy kivételt a `try`–`except` szerkezettel (más nyelvekben `try`–`catch`),
- hogyan kezelsz **többféle** kivételt,
- mire való az `else` és a `finally` ág,
- hogyan éred el a kivétel **üzenetét**.

## Az alapszerkezet

```python run
try:
    szam = int("abc")          # itt kivétel keletkezik
    print("Ez már nem fut le.")
except ValueError:
    print("Ez nem szám!")      # a vezérlés ide ugrik
print("A program folytatódik.")
```

Működése:

1. A Python végrehajtja a `try` blokkot.
2. Ha nem történik kivétel, az `except` blokkot **átugorja**.
3. Ha kivétel történik, a `try` blokk **hátralévő része kimarad**, és a vezérlés az első illeszkedő `except` ágra ugrik.
4. Ha egyik `except` sem illeszkedik, a kivétel továbbmegy a hívó felé (és ha senki nem kapja el, a program leáll).

## Ugyanez más nyelveken

```java
// Java / C#
try {
    int szam = Integer.parseInt("abc");
} catch (NumberFormatException e) {
    System.out.println("Ez nem szám!");
} finally {
    System.out.println("Mindig lefut.");
}
```

A gondolat ugyanaz, csak Pythonban a `catch` neve `except`.

## Biztonságos beolvasás

A tipikus felhasználás: addig kérünk adatot, amíg helyeset nem kapunk.

```python run
def szamot_kerek(uzenet):
    while True:
        try:
            return int(input(uzenet))
        except ValueError:
            print("Kérlek, egész számot adj meg!")

kor = szamot_kerek("Hány éves vagy? ")
print("Jövőre", kor + 1, "leszel.")
```

## Több except ág

```python run
def oszt(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        print("Nullával nem lehet osztani.")
    except TypeError:
        print("Csak számokat lehet osztani.")
    return None

print(oszt(10, 2))
print(oszt(10, 0))
print(oszt("10", 2))
```

Több kivételt egy ágban is elkaphatsz: `except (ValueError, TypeError):`

> Az `except` ágak **sorban** értékelődnek ki. A specifikusabb (leszármazott) kivételt írd előre, az általánosabbat hátra – különben az általános elnyeli a specifikusat.

## A kivétel üzenete: as

```python run
try:
    {"a": 1}["b"]
except KeyError as hiba:
    print("Hiányzó kulcs:", hiba)
    print("Típus:", type(hiba).__name__)
```

## else – ha nem volt kivétel

Az `else` ág akkor fut le, ha a `try` blokkban **nem** történt kivétel. Ide azt a kódot érdemes tenni, ami a sikeres művelet után jön, de aminek a hibáit már nem akarjuk ugyanazzal az `except`-tel kezelni.

```python run
szoveg = "42"
try:
    szam = int(szoveg)
except ValueError:
    print("Hibás szám.")
else:
    print("Sikeres átalakítás, a duplája:", szam * 2)
```

## finally – mindig lefut

A `finally` ág **mindig** lefut: ha nem volt kivétel, ha volt és elkaptuk, sőt akkor is, ha nem kaptuk el, vagy ha `return` történt. Erőforrások felszabadítására (fájl bezárása, kapcsolat lezárása) használjuk.

```python run
def feldolgoz(adat):
    print("Erőforrás megnyitva.")
    try:
        return 100 / adat
    except ZeroDivisionError:
        print("Hiba: nullával osztás.")
        return None
    finally:
        print("Erőforrás lezárva.")   # mindkét esetben lefut

print(feldolgoz(4))
print(feldolgoz(0))
```

Fájloknál a `with` utasítás automatikusan elvégzi ezt (lásd a **Fájlkezelés** témakört).

## A teljes szerkezet

```text
try:
    kockázatos kód
except KonkretHiba as e:
    hiba kezelése
except (MasikHiba, HarmadikHiba):
    ...
else:
    ha nem volt kivétel
finally:
    mindig lefut (takarítás)
```

## Összefoglalás

- `try`: a kockázatos kód; `except Típus`: a kezelés; `as e`: a kivétel objektum.
- Több `except` ág lehet; a specifikusabb kerüljön előre.
- `else`: ha nem volt kivétel; `finally`: mindig lefut.

## A lecke feladata: Biztonságos osztás

Írj `biztonsagos_osztas(a, b)` függvényt, amely két **szövegként** kapott számot (pl. `"10"`, `"2.5"`) valós számmá alakít és eloszt egymással. A hibákat `try – except` blokkal kezeld, és ilyenkor szöveges üzenetet adj vissza:

- ha valamelyik nem szám (`ValueError`): `"Hibás szám"`,
- ha nullával osztanál (`ZeroDivisionError`): `"Nullával nem lehet osztani"`,
- egyébként az eredményt (`float`) – ezt az `else` ágban add vissza.

Több `except` ágat használj, ne egy általános `except`-et!

```python starter required
def biztonsagos_osztas(a, b):
    try:
        pass
    except ValueError:
        pass
    # további ágak: ZeroDivisionError, else


print(biztonsagos_osztas("10", "4"))   # 2.5
```

<details>
<summary>Megoldás</summary>

```python solution
def biztonsagos_osztas(a, b):
    try:
        eredmeny = float(a) / float(b)
    except ValueError:
        return "Hibás szám"
    except ZeroDivisionError:
        return "Nullával nem lehet osztani"
    else:
        return eredmeny


print(biztonsagos_osztas("10", "4"))   # 2.5
```

</details>

```python test
assert biztonsagos_osztas("10", "4") == 2.5, "10 / 4 = 2.5"
assert biztonsagos_osztas("-3", "1.5") == -2.0, "-3 / 1.5 = -2.0"
assert biztonsagos_osztas("tíz", "2") == "Hibás szám", "Nem szám bemenet: Hibás szám"
assert biztonsagos_osztas("1", "") == "Hibás szám", "Üres szöveg sem szám."
assert biztonsagos_osztas("1", "0") == "Nullával nem lehet osztani", "Nullával osztás: Nullával nem lehet osztani"
```

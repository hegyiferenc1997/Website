---
title: Előnyök, hátrányok és a nyelvválasztás szempontjai
summary: Teljesítmény, fejlesztési sebesség, biztonság, ökoszisztéma – hogyan válassz nyelvet egy feladathoz.
minutes: 12
---

## Amit ebben a leckében megtanulsz

- milyen **szempontok** szerint hasonlíthatók össze a nyelvek,
- milyen **kompromisszumok** vannak (sebesség ↔ fejlesztési idő),
- hogyan válassz nyelvet egy **konkrét feladathoz**.

## Az összehasonlítás szempontjai

| Szempont                       | Kérdés                                               | Példa                                                 |
| ------------------------------ | ---------------------------------------------------- | ----------------------------------------------------- |
| **Teljesítmény**               | Milyen gyorsan fut, mennyi memóriát használ?         | C, C++, Rust ≫ Java, C#, Go > Python, Ruby            |
| **Fejlesztési sebesség**       | Milyen gyorsan készül el a működő program?           | Python, Ruby ≫ C, C++                                 |
| **Biztonság, megbízhatóság**   | Hány hibát szűr ki a fordító futtatás előtt?         | Rust, statikus típusos nyelvek                        |
| **Olvashatóság, tanulhatóság** | Mennyire könnyű megérteni és megtanulni?             | Python kiemelkedő                                     |
| **Ökoszisztéma**               | Vannak-e kész könyvtárak, keretrendszerek, eszközök? | Python (adat, MI), JavaScript (web), Java (vállalati) |
| **Hordozhatóság**              | Mely platformokon fut?                               | Java/JVM, Python, JavaScript (böngésző)               |
| **Közösség, munkaerőpiac**     | Van-e segítség, dokumentáció, álláslehetőség?        | Python, JavaScript, Java, C#                          |

## A nagy kompromisszum: futási idő vs. fejlesztési idő

A gépidő olcsó, a programozó ideje drága. Ezért sok helyen megéri a lassabban futó, de gyorsabban megírható nyelvet választani – **hacsak** a sebesség nem kritikus (pl. játékmotor, valós idejű vezérlés, nagy terhelésű szerver).

Gyakori megoldás a **kombináció**: a Python könyvtárainak (pl. NumPy) gyors része C-ben készült, a Python csak a „ragasztó”. Így egyszerre kapunk kényelmet és sebességet.

```python run
# Ugyanaz a számítás tisztán Pythonban és a C-ben írt beépített sum()-mal.
import time

szamok = list(range(1_000_000))

kezdet = time.perf_counter()
osszeg = 0
for szam in szamok:      # Python ciklus: minden lépést az interpreter hajt végre
    osszeg += szam
python_ido = time.perf_counter() - kezdet

kezdet = time.perf_counter()
osszeg2 = sum(szamok)    # a sum() belül C-ben fut
c_ido = time.perf_counter() - kezdet

print(osszeg == osszeg2)
print(f"Python ciklus: {python_ido:.4f} s, beépített sum(): {c_ido:.4f} s")
```

## Statikus vs. dinamikus típusosság a gyakorlatban

- **Statikus** (Java, C#, C++, Rust, Go, TypeScript): a hibák egy része már fordításkor kiderül, a fejlesztőkörnyezet jobban segít (automatikus kiegészítés, átnevezés). Nagy, sokszereplős projekteknél előnyös.
- **Dinamikus** (Python, Ruby, JavaScript): kevesebb gépelés, rugalmasabb, gyorsabb prototípus. A tesztek és a típusjelölések pótolják a hiányzó ellenőrzést.

## Melyik nyelvet mire?

| Feladat                                 | Jó választás                           | Miért                                  |
| --------------------------------------- | -------------------------------------- | -------------------------------------- |
| adatelemzés, gépi tanulás               | **Python**                             | NumPy, pandas, scikit-learn, PyTorch   |
| weboldal (kliens oldal)                 | **JavaScript / TypeScript**            | csak ez fut natívan a böngészőben      |
| web-backend                             | Python, Java, C#, JavaScript, Go, Ruby | mindegyikhez van érett keretrendszer   |
| Android-alkalmazás                      | Kotlin, Java                           | a platform hivatalos nyelvei           |
| iOS-alkalmazás                          | Swift                                  | az Apple hivatalos nyelve              |
| játék                                   | C# (Unity), C++ (Unreal)               | a játékmotorok nyelvei                 |
| mikrovezérlő, beágyazott rendszer       | **C**, C++, (MicroPython)              | kevés memória, közvetlen hardverelérés |
| operációs rendszer, driver              | C, C++, Rust                           | teljesítmény, hardverközeliség         |
| automatizálás, rendszergazdai szkriptek | Python, Bash, PowerShell               | gyorsan megírható                      |
| nagyvállalati rendszer                  | Java, C#                               | stabilitás, típusbiztonság, támogatás  |

## Döntési lépések

1. **Mi a platform?** Böngésző → JavaScript; mikrovezérlő → C; Android → Kotlin.
2. **Mennyire kritikus a sebesség?** Ha nagyon, fordított nyelv (C++, Rust, Go).
3. **Vannak kész könyvtárak?** Ne írd meg újra, ami már létezik.
4. **Mit ismer a csapat?** Egy ismert nyelv gyakran többet ér, mint egy elméletben jobb, de ismeretlen.
5. **Ki fogja karbantartani?** Az olvasható, elterjedt nyelv hosszú távon olcsóbb.

## Miért Python az első nyelv?

- egyszerű, olvasható szintaxis – a **gondolkodásra** lehet figyelni, nem a körítésre,
- azonnal futtatható (interaktív mód), gyors visszajelzés,
- a későbbi tárgyakban (adatbázisok, MI, adatelemzés, robotika) is hasznos,
- a megszerzett alapfogalmak bármely nyelvre átvihetők.

## Összefoglalás

- A nyelveket **teljesítmény, fejlesztési sebesség, biztonság, ökoszisztéma és hordozhatóság** szerint hasonlítjuk össze.
- A legfontosabb kompromisszum: **gyors futás ↔ gyors fejlesztés**.
- A nyelvet **a feladathoz és a platformhoz** választjuk, nem divat alapján.

## A lecke feladata: Súlyozott nyelvválasztás

Egy projekthez nyelvet választunk. Minden nyelvet szempontonként 1–5 pontra értékeltünk, és a szempontoknak súlyuk van. Írd meg a `rangsor(pontszamok, sulyok)` függvényt:

- `pontszamok`: `{nyelv: {szempont: pont}}` szótár, `sulyok`: `{szempont: súly}` szótár,
- egy nyelv összpontszáma a **súlyozott átlag**: `Σ(pont · súly) / Σ súly`, 2 tizedesre kerekítve; ha egy nyelvnél hiányzik egy szempont, az 0 pontnak számít,
- az eredmény `(nyelv, pontszám)` párok listája, **csökkenő** pontszám szerint, egyenlőségnél ábécérendben,
- ha a súlyok összege 0 (vagy nincs súly), dobjon `ValueError`-t.

```python starter required
def rangsor(pontszamok, sulyok):
    eredmeny = []
    for nyelv, pontok in pontszamok.items():
        eredmeny.append((nyelv, sum(pontok.values())))
    return eredmeny


pontok = {
    "Python": {"tanulhatóság": 5, "sebesség": 2, "könyvtárak": 5},
    "C++": {"tanulhatóság": 2, "sebesség": 5, "könyvtárak": 4},
}
print(rangsor(pontok, {"tanulhatóság": 2, "sebesség": 1, "könyvtárak": 1}))
```

<details>
<summary>Megoldás</summary>

```python solution
def rangsor(pontszamok, sulyok):
    ossz_suly = sum(sulyok.values())
    if ossz_suly == 0:
        raise ValueError("A súlyok összege nem lehet 0.")
    eredmeny = []
    for nyelv, pontok in pontszamok.items():
        # Hiányzó szempont 0 pontot ér
        osszeg = sum(pontok.get(szempont, 0) * suly for szempont, suly in sulyok.items())
        eredmeny.append((nyelv, round(osszeg / ossz_suly, 2)))
    # Csökkenő pontszám, egyenlőségnél ábécérend
    return sorted(eredmeny, key=lambda par: (-par[1], par[0]))


pontok = {
    "Python": {"tanulhatóság": 5, "sebesség": 2, "könyvtárak": 5},
    "C++": {"tanulhatóság": 2, "sebesség": 5, "könyvtárak": 4},
}
print(rangsor(pontok, {"tanulhatóság": 2, "sebesség": 1, "könyvtárak": 1}))
```

</details>

```python test
pontok = {
    "Python": {"tanulhatóság": 5, "sebesség": 2, "könyvtárak": 5},
    "C++": {"tanulhatóság": 2, "sebesség": 5, "könyvtárak": 4},
}
assert rangsor(pontok, {"tanulhatóság": 2, "sebesség": 1, "könyvtárak": 1}) == [("Python", 4.25), ("C++", 3.25)], "A súlyozott átlag vagy a sorrend hibás."
assert rangsor(pontok, {"sebesség": 1}) == [("C++", 5.0), ("Python", 2.0)], "Csak a súllyal rendelkező szempontok számítanak."
e = rangsor({"Go": {"a": 3}, "C": {"a": 3}, "Rust": {}}, {"a": 1})
assert e == [("C", 3.0), ("Go", 3.0), ("Rust", 0.0)], "Egyenlőségnél ábécérend; a hiányzó szempont 0 pont."
assert rangsor({"X": {"a": 1, "b": 2}}, {"a": 1, "b": 2}) == [("X", 1.67)], "Kerekíts 2 tizedesre."
for rossz in ({}, {"a": 0}):
    try:
        rangsor(pontok, rossz)
        assert False, "0 összsúlynál ValueError kell."
    except ValueError:
        pass
```

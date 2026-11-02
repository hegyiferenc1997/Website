---
title: Az első Python programod
summary: Kiírás, megjegyzések, a behúzás szerepe és az első hibaüzenetek értelmezése.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- hogyan írsz ki szöveget és számokat a `print()` függvénnyel,
- mire valók a **megjegyzések** (kommentek),
- miért fontos a Pythonban a **behúzás**,
- hogyan olvasd el az első **hibaüzenetedet**.

## Kiírás

```python run
print("Szia!")                      # szöveg idézőjelek között
print(42)                           # szám
print("A válasz:", 42)              # több érték vesszővel elválasztva (szóközzel jelennek meg)
print("egy", "kettő", sep=" | ")    # az elválasztó megadható
print("nincs sortörés", end=" ")    # a sor vége is megadható
print("ugyanabban a sorban")
```

A szöveget (string) idézőjelek közé kell tenni: `"így"` vagy `'így'`. Idézőjel nélkül a Python változónévnek tekintené.

## Megjegyzések

A `#` jel utáni rész a sor végéig **megjegyzés**: a gép figyelmen kívül hagyja, az embernek szól. Írd le benne, *miért* csinálsz valamit.

```python run
# Ez a program kiszámolja egy kör területét.
sugar = 3
terulet = 3.14159 * sugar ** 2   # ** a hatványozás
print(terulet)
```

## Behúzás (indentáció)

Sok nyelv kapcsos zárójelekkel `{ }` jelöli, mi tartozik egy blokkba. A Python a **behúzással** (4 szóköz) teszi ezt. A kettőspont `:` utáni sorokat be kell húzni.

```python run
homerseklet = 28
if homerseklet > 25:
    print("Meleg van.")        # ez a sor az if-hez tartozik
    print("Igyál sok vizet!")  # ez is
print("Ez mindig lefut.")      # ez már nem tartozik az if-hez
```

## Az első hibaüzenet

Hibázni teljesen normális. A Python pontosan megmondja, hol és mi a gond:

```python
print("Szia)
```

```text
  File "program.py", line 1
    print("Szia)
          ^
SyntaxError: unterminated string literal (detected at line 1)
```

Hogyan olvasd:

1. **Melyik sor?** – `line 1`
2. **Hol a sorban?** – a `^` jel mutatja.
3. **Mi a hiba típusa?** – `SyntaxError`, vagyis nyelvtani hiba: lemaradt a záró idézőjel.

> **Tipp:** a hibaüzenetet mindig **alulról felfelé** olvasd: az utolsó sor mondja meg a hiba típusát, fölötte látod, hol történt.

## Hogyan futtass Python kódot?

- **Ezen az oldalon:** hamarosan közvetlenül a böngészőben futtathatod a „futtatható példa” jelölésű kódokat.
- **Saját gépen:** telepítsd a Pythont a [python.org](https://www.python.org/downloads/) oldalról, írd a kódot egy `program.py` fájlba, majd futtasd: `python program.py`.
- **Interaktív mód (REPL):** a terminálban a `python` parancs után soronként próbálhatsz ki utasításokat.

A futtatási lehetőségekről a **Futtatási környezetek** témakörben bővebben is lesz szó.

## Összefoglalás

- A `print()` kiírja az értékeket; a szöveg idézőjelek közé kerül.
- A `#` utáni rész megjegyzés.
- A Pythonban a **behúzás** jelöli a blokkokat.
- A hibaüzenetet alulról felfelé olvasd: típus, hely, sor.

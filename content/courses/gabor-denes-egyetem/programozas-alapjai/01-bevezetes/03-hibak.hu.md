---
title: Hibák és hibaüzenetek
summary: Szintaktikai és futási hibák, és hogyan olvassuk a hibaüzenetet.
minutes: 10
---

Minden programozó hibázik; a lényeg, hogy gyorsan megtaláld a hibát. Két fő fajta van:

- **Szintaktikai hiba** (`SyntaxError`): a kód nem felel meg a nyelv szabályainak, ezért el sem indul.
- **Futási hiba** (pl. `ZeroDivisionError`, `NameError`): a program elindul, de egy ponton elakad.

```python
print("Szia"     # hiányzó zárójel → SyntaxError
x = 10 / 0       # nullával osztás → ZeroDivisionError
print(nev)       # nem létező változó → NameError
```

A hibaüzenet (_traceback_) alulról olvasandó: az utolsó sor mondja meg a hiba típusát, fölötte pedig a fájl és a sor száma látszik.

---
title: Beolvasás és kiírás
summary: Az input() és a print(), formázott szövegek.
minutes: 15
---

Adatot a felhasználótól az `input()` függvénnyel kérünk. Ez **mindig szöveget** ad vissza, ezért számításhoz át kell alakítani:

```python
nev = input("Hogy hívnak? ")
kor = int(input("Hány éves vagy? "))
print(f"Szia {nev}, jövőre {kor + 1} éves leszel!")
```

Az `f"..."` (f-string) kapcsos zárójelei közé tett kifejezések értéke beíródik a szövegbe. Tizedesjegyek: `f"{3.14159:.2f}"` → `3.14`.

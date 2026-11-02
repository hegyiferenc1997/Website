---
title: Statikus és dinamikus, erős és gyenge típusosság
summary: Mikor derül ki a típushiba, és mennyire „enged” a nyelv – a típusrendszerek két fő szempontja.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mit jelent a **statikus** és a **dinamikus** típusosság,
- mit jelent az **erős** és a **gyenge** típusosság,
- hová tartozik a Python, a Java, a C, a JavaScript,
- mit értünk „nem típusos” nyelv alatt.

## Két független szempont

A típusrendszereket két kérdés mentén szokás csoportosítani:

1. **Mikor** ellenőrzi a nyelv a típusokat? → statikus vagy dinamikus
2. **Mennyire szigorúan** kezeli a típusokat? → erős vagy gyenge

## Statikus típusosság

A változó típusa **fordításkor** ismert, és nem változhat. Általában a programozó adja meg (deklarálja), de a fordító ki is következtetheti.

```java
// Java: a típust meg kell adni, és a fordító ellenőrzi.
int kor = 20;
kor = "húsz";   // fordítási hiba: incompatible types
```

- ✅ a típushibák már fordításkor kiderülnek
- ✅ a fejlesztőkörnyezet jobban segít (kiegészítés, átnevezés)
- ✅ gyorsabb futás (a fordító tudja, mekkora a változó)
- ❌ több gépelés, kevésbé rugalmas

Példák: C, C++, Java, C#, Go, Rust, TypeScript.

## Dinamikus típusosság

A típus az **értékhez** tartozik, nem a változóhoz; ellenőrzése **futás közben** történik. Ugyanaz a változó különböző típusú értékekre mutathat.

```python run
x = 20          # most int
print(type(x))
x = "húsz"      # most str – Pythonban ez megengedett
print(type(x))
```

- ✅ rövidebb, rugalmasabb kód, gyors prototípus-készítés
- ❌ a típushiba csak akkor derül ki, amikor az adott sor lefut
- ❌ nagy programoknál nehezebb átlátni, mi milyen típusú

Példák: Python, JavaScript, Ruby, PHP.

```python run
def duplaz(x):
    return x * 2

print(duplaz(5))       # 10
print(duplaz("ha"))    # haha – ugyanaz a függvény szövegre is működik
# duplaz(None) csak futáskor dobna TypeError-t.
```

## Erős és gyenge típusosság

- **Erős típusosság:** a nyelv nem keveri össze a típusokat magától; ha nem illenek össze, hibát jelez.
- **Gyenge típusosság:** a nyelv automatikusan átalakítja a típusokat, akár meglepő eredménnyel.

A Python **erősen** típusos:

```python run
try:
    print("5" + 3)
except TypeError as hiba:
    print("TypeError:", hiba)
```

A JavaScript **gyengén** típusos:

```javascript
"5" + 3    // "53"   – a számot szöveggé alakítja
"5" - 3    // 2      – a szöveget számmá alakítja
[] + {}    // "[object Object]"
```

## Összesítő táblázat

| | Erős | Gyenge |
| --- | --- | --- |
| **Statikus** | Java, C#, Rust, Go | C, C++ (sok implicit konverzió, pointerek) |
| **Dinamikus** | Python, Ruby | JavaScript, PHP |

## „Nem típusos” nyelvek

Szigorú értelemben **típus nélküli (untyped)** nyelvben minden adat csak bitminta, és a nyelv egyáltalán nem tartja nyilván a típust. Ilyen az **assembly** vagy a régi **BCPL**: ugyanazt a memóriaszót kezelheted számként, címként vagy karakterként. A köznyelvben a „nem típusos” kifejezést gyakran (pontatlanul) a dinamikusan típusos nyelvekre használják, mert ott nem kell a típust kiírni.

## Összefoglalás

- **Statikus:** a típus fordításkor ismert és ellenőrzött; **dinamikus:** futáskor, az értékhez tartozik.
- **Erős:** nincs meglepő automatikus átalakítás; **gyenge:** van.
- A Python **dinamikusan és erősen** típusos.
- A valóban típus nélküli nyelvek (assembly) csak bitmintákkal dolgoznak.

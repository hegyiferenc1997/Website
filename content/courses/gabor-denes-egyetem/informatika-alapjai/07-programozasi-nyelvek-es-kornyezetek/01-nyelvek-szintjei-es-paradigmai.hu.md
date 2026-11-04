---
title: Nyelvek szintjei és paradigmái
summary: Gépi kód, assembly, magas szintű nyelvek; imperatív, objektumorientált, funkcionális és deklaratív programozás.
minutes: 16
---

## Amit ebben a leckében megtanulsz

- mi a **gépi kód**, az **assembly** és a **magas szintű** nyelv,
- mik a nagy **paradigmák**,
- melyik ismert nyelv mire való.

## A nyelvek szintjei

A processzor csak **gépi kódot** ért: bináris utasításokat, pl. `10110000 01100001`. Ezt embernek írni szinte lehetetlen.

```text
 magas szintű (Python)    osszeg = a + b
        │  fordító / értelmező
        ▼
 assembly (x86)           mov eax, [a]
                          add eax, [b]
                          mov [osszeg], eax
        │  assembler
        ▼
 gépi kód                 8B 05 … 03 05 … 89 05 …
```

- **Alacsony szintű** nyelv (assembly): egy utasítás ≈ egy gépi utasítás; processzorfüggő, gyors, de hosszadalmas.
- **Magas szintű** nyelv (Python, Java, C#…): az ember gondolkodásához közelebb, **hordozható** (több processzoron is fut), egy sor sok gépi utasítást jelent.

## Paradigmák

A **paradigma** a programozás „szemlélete”: hogyan bontjuk részekre a feladatot.

| Paradigma                    | Alapgondolat                                                  | Példanyelvek                                |
| ---------------------------- | ------------------------------------------------------------- | ------------------------------------------- |
| **imperatív / procedurális** | lépésről lépésre megmondjuk, _hogyan_; eljárásokra bontjuk    | C, Pascal, Python                           |
| **objektumorientált**        | adatok és műveletek **objektumokba** zárva (osztály, öröklés) | Java, C#, C++, Python                       |
| **funkcionális**             | függvények kompozíciója, változó állapot nélkül               | Haskell, F#, Elixir (és részben JS, Python) |
| **deklaratív**               | azt mondjuk meg, _mit_ akarunk, nem azt, hogyan               | SQL, HTML, Prolog                           |

Ugyanaz a feladat két szemlélettel – a páros számok összege:

```python run
# Imperatív: lépésről lépésre
osszeg = 0
for x in [1, 2, 3, 4, 5, 6]:
    if x % 2 == 0:
        osszeg += x
print(osszeg)

# Funkcionális stílus: szűrés + összegzés egy kifejezésben
print(sum(filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5, 6])))
```

```sql
-- Deklaratív (SQL): csak azt mondjuk meg, MIT kérünk
SELECT SUM(ertek) FROM szamok WHERE ertek % 2 = 0;
```

## Melyik nyelv mire jó?

| Nyelv                   | Tipikus terület                                        |
| ----------------------- | ------------------------------------------------------ |
| Python                  | kezdés, adatelemzés, MI, szkriptek, web-backend        |
| JavaScript / TypeScript | weboldalak, webalkalmazások (böngésző és szerver)      |
| Java, Kotlin            | vállalati rendszerek, Android                          |
| C#                      | Windows, vállalati rendszerek, Unity-játékok           |
| C, C++                  | operációs rendszer, beágyazott rendszer, játékmotor    |
| Rust, Go                | biztonságos rendszerprogramozás, felhős szolgáltatások |
| SQL                     | adatbázis-lekérdezés                                   |

## Összefoglalás

- Gépi kód → assembly → magas szintű nyelv; a magas szintű nyelv hordozható és olvasható.
- Paradigmák: imperatív, objektumorientált, funkcionális, deklaratív.
- A nyelvet a feladathoz választjuk.

## A lecke feladata

```quiz required
? Melyik nyelvet érti közvetlenül a processzor?
- Python
- assembly
+ gépi kód
- SQL
! Az assemblyt is le kell fordítani gépi kódra (assemblerrel).

? Melyik paradigmába tartozik az SQL?
- imperatív
- objektumorientált
+ deklaratív
- funkcionális
! Azt mondjuk meg, mit kérünk, nem azt, hogyan.

? Mit ír ki a lecke első Python-példája?
= 12
! 2 + 4 + 6 = 12.

? Melyik nyelv a weboldalak böngészőben futó programozási nyelve?
- C
+ JavaScript
- Kotlin
- SQL
! A böngésző JavaScriptet futtat (TypeScriptből is JS lesz).
```

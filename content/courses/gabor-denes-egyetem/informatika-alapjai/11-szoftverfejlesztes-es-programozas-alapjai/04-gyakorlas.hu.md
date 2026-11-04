---
title: Gyakorlás – szoftverfejlesztés
summary: Ellenőrző kérdések és összefoglaló feladatlap az életciklusról, a fejlesztési modellekről és a tesztelésről.
minutes: 20
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Írj két funkcionális és két nem funkcionális követelményt egy egyetemi menza rendelőalkalmazásához!</summary>

Funkcionális: „A hallgató előre megrendelheti a heti ebédjét.” „A menza dolgozója láthatja a napi rendelések listáját.” Nem funkcionális: „Délben 2000 egyidejű felhasználót kiszolgál.” „Mobilon és asztali gépen is használható, akadálymentes.”

</details>

<details>
<summary>2. Miért nem jó a vízesésmodell egy új mobilalkalmazáshoz, amelynek a piaca még bizonytalan?</summary>

Mert a felhasználói igények menet közben derülnek ki és változnak; a vízesésnél csak a végén látnák a terméket. Agilis módszerrel kéthetente kipróbálható változat készül, és a visszajelzés alapján lehet irányt váltani.

</details>

<details>
<summary>3. Milyen határeseteket tesztelnél egy `atlag(lista)` függvénynél?</summary>

Üres lista, egyelemű lista, negatív számok, tört számok, nagyon hosszú lista, és hogy nem módosítja-e a bemeneti listát.

</details>

```python run
# Teszteljük a lista legnagyobb elemét kereső függvényt határesetekkel is
def legnagyobb(lista):
    if not lista:
        return None
    m = lista[0]
    for x in lista:
        if x > m:
            m = x
    return m

assert legnagyobb([3, 9, 2]) == 9
assert legnagyobb([-5, -2, -8]) == -2   # csak negatívak
assert legnagyobb([7]) == 7             # egy elem
assert legnagyobb([]) is None           # üres lista
print("Minden teszt átment.")
```

## Összefoglaló feladatlap

```quiz required
? Mi az SDLC második fázisa a követelmények után?
- tesztelés
+ tervezés
- karbantartás
- üzembe helyezés
! Követelmények → tervezés → megvalósítás → tesztelés → üzembe helyezés → karbantartás.

? Hogy hívják a Scrum egy 1–4 hetes fejlesztési ciklusát?
= sprint
! A végén egy kipróbálható termékváltozat van.

? Melyik tesztszintet végzi a megrendelő?
- egységteszt
- integrációs teszt
- rendszerteszt
+ elfogadási teszt
! Azt nézi, azt kapta-e, amit kért.

? Mit ad vissza a fenti `legnagyobb` függvény a `[-5, -2, -8]` listára?
= -2
! A negatív számok közül a −2 a legnagyobb.

? Melyik felhasználói történet formája helyes?
+ Hallgatóként szeretném letölteni a jegyzeteket, hogy offline is tanulhassak.
- Az adatbázis legyen PostgreSQL.
- A gomb legyen kék.
- Írjunk sok kódot.
! Szerep – igény – cél.

? Mi a CD a CI/CD-ben?
+ folyamatos szállítás/telepítés (Continuous Delivery/Deployment)
- kompaktlemez
- kódáttekintés
- központi dokumentáció
! A tesztelt változat automatikusan kiadható.
```

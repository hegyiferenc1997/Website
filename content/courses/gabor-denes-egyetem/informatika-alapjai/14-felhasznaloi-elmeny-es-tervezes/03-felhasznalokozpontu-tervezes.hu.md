---
title: Felhasználóközpontú tervezés
summary: A tervezési folyamat (megértés, ötletelés, prototípus, tesztelés), persona, felhasználói út, drótváz, Figma, felhasználói teszt, A/B teszt.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- a **felhasználóközpontú tervezés** lépéseit,
- mi a **persona** és a **felhasználói út**,
- hogyan készül **drótváz** és **prototípus**, és hogyan **teszteled** felhasználókkal.

## A folyamat

A **felhasználóközpontú tervezés** (UCD) lényege: nem azt építjük, amit _mi_ gondolunk jónak, hanem megfigyeljük a valódi felhasználókat, és **iterálunk**.

```text
  1. megértés ──► 2. meghatározás ──► 3. ötletelés ──► 4. prototípus ──► 5. tesztelés
       ▲                                                                    │
       └──────────────────────── tanulságok, újra ◄─────────────────────────┘
```

1. **Megértés** – interjúk, megfigyelés, kérdőív: ki a felhasználó, mi a gondja?
2. **Meghatározás** – a probléma pontos megfogalmazása, personák.
3. **Ötletelés** – sok lehetséges megoldás vázlatban, a legjobbak kiválasztása.
4. **Prototípus** – gyorsan elkészíthető, kipróbálható modell.
5. **Tesztelés** – valódi felhasználók próbálják ki; a tanulságokkal vissza az elejére.

## Persona és felhasználói út

A **persona** egy tipikus felhasználó kitalált, de kutatáson alapuló leírása:

> **Kata, 19 éves elsőéves mérnökinformatikus.** Busszal jár, a telefonján tanul útközben. Célja: gyorsan átnézni a heti anyagot. Frusztrálja: az apró betű és ha a videó mobilnetről akadozik.

A **felhasználói út** (user journey) lépésről lépésre leírja, hogyan ér el a persona egy célt (pl. „feliratkozik egy tárgyra”), és hol vannak a **fájdalompontok**.

## Drótváz és prototípus

- **Drótváz** (wireframe): egyszerű, szürke vázlat a képernyő **elrendezéséről** – hol van a menü, a cím, a fő gomb. Szín és díszítés nélkül, hogy a szerkezetről szóljon a vita.
- **Mockup**: a végleges kinézet (szín, betű, kép), de még nem működik.
- **Prototípus**: kattintható modell, amelyen végig lehet menni egy folyamaton.

```text
 ┌───────────────────────────┐
 │ ☰  Logo          [Belépés]│
 ├───────────────────────────┤
 │  Nagy cím                 │
 │  Rövid leírás ........... │
 │  [ Kezdjük el ]           │  ← fő művelet
 ├─────────┬─────────┬───────┤
 │ kártya  │ kártya  │ kártya│
 └─────────┴─────────┴───────┘
```

Eszközök: **Figma** (a legelterjedtebb, böngészőben, közös szerkesztéssel), Penpot (nyílt forráskódú), papír és ceruza (a leggyorsabb!).

## Tesztelés felhasználókkal

**Használhatósági teszt:** adj egy valódi feladatot („Keresd meg a jövő heti órarendedet”), és figyeld meg, hogyan oldja meg a felhasználó; kérd, hogy **hangosan gondolkodjon**. Ne segíts, ne magyarázz – a nehézség az adat. Nielsen szerint már **5 felhasználó** megtalálja a problémák nagy részét.

**A/B teszt:** élesben a felhasználók egyik fele az A, másik fele a B változatot látja (pl. más gombszöveg), és mérik, melyik vezet több sikeres művelethez.

```python run
# A/B teszt egyszerű összevetése: konverziós arány
a_latogato, a_vasarlas = 2400, 96
b_latogato, b_vasarlas = 2350, 141
print("A:", round(a_vasarlas / a_latogato * 100, 1), "%")
print("B:", round(b_vasarlas / b_latogato * 100, 1), "%")
```

(A valóságban azt is ellenőrizni kell statisztikailag, hogy a különbség nem a véletlen műve-e.)

## Összefoglalás

- UCD: megértés → meghatározás → ötletelés → prototípus → tesztelés, iterálva.
- Persona = tipikus felhasználó leírása; felhasználói út = lépések és fájdalompontok.
- Drótváz → mockup → prototípus (Figma); használhatósági teszt kb. 5 felhasználóval; A/B teszt élesben.

## A lecke feladata

```quiz required
? Mi a **drótváz** (wireframe)?
+ egyszerű, szín nélküli vázlat a képernyő elrendezéséről
- a végleges, színes látványterv
- a működő program forráskódja
- a szerver hálózati kábelezése
! A szerkezetre összpontosít.

? Nielsen szerint nagyjából hány felhasználó elég egy használhatósági teszthez, hogy a problémák nagy része kiderüljön?
= 5
! Utána érdemes javítani és újra tesztelni.

? Hány százalék a B változat konverziós aránya a lecke példájában (egy tizedesre)?
= 6.0
= 6
! 141 / 2350 · 100 = 6,0%.

? Mit csinálsz egy használhatósági teszt közben, ha a felhasználó elakad?
- azonnal megmutatod a helyes gombot
+ figyelsz és jegyzetelsz, megkéred, hogy mondja ki hangosan, mit gondol
- befejezed a tesztet
- elmagyarázod, hogyan kellett volna
! Az elakadás az értékes adat.
```

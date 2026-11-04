---
title: Robotok programozása és alkalmazásai
summary: Mikrovezérlő és az Arduino-program szerkezete, egy akadálykerülő robot logikája, ipari, szolgáltató és autonóm robotok.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- hogyan néz ki egy **mikrovezérlős** robotprogram (Arduino, MicroPython),
- hogyan működik egy **akadálykerülő** robot logikája,
- hol használnak robotokat: **ipar**, **szolgáltatás**, **autonóm járművek**, **cobotok**.

## Mikrovezérlő

A **mikrovezérlő** egy chipen lévő kis számítógép (processzor, memória, ki- és bemenetek). Az **Arduino** és az **ESP32** a legnépszerűbb hobbi- és oktatási platform; C/C++-szerű nyelven (Arduino) vagy **MicroPythonnal** programozható. A program két részből áll: egyszer lefutó **beállításból** és egy végtelenül ismétlődő **ciklusból**.

```cpp
// Arduino: LED villogtatása a 13-as lábon
void setup() {
  pinMode(13, OUTPUT);      // a 13-as láb kimenet
}

void loop() {               // örökké ismétlődik
  digitalWrite(13, HIGH);   // LED be
  delay(500);               // 0,5 s várakozás
  digitalWrite(13, LOW);    // LED ki
  delay(500);
}
```

## Egy akadálykerülő robot logikája

Az elv: mérj → dönts → cselekedj, újra és újra. Itt egy egyszerű Python-szimuláció, amelyben a távolságmérő értékei egy listából jönnek:

```python run
# Akadálykerülő robot szimulációja: a mért távolságok cm-ben
meresek = [80, 60, 35, 18, 12, 40, 90]

def dontes(tavolsag):
    if tavolsag < 15:
        return "tolat és fordul"
    if tavolsag < 30:
        return "lassít és fordul"
    return "egyenesen előre"

for t in meresek:
    print(f"{t:3d} cm → {dontes(t)}")
```

A valódi robotokon a **ROS 2** (Robot Operating System) a szabványos szoftverkeret: kész modulokat ad az érzékelők kezeléséhez, a térképezéshez és az útvonaltervezéshez.

## Alkalmazások

| Terület                      | Példa                                                          |
| ---------------------------- | -------------------------------------------------------------- |
| **ipari robotok**            | hegesztés, festés, összeszerelés az autógyárakban              |
| **cobotok** (kollaboratív)   | az emberrel közös térben, biztonságosan dolgozó kis robotkarok |
| **logisztika**               | raktári robotok, amelyek a polcokat viszik a dolgozóhoz        |
| **szolgáltató robotok**      | robotporszívó, fűnyíró robot, kiszolgáló robot                 |
| **orvosi robotok**           | sebészeti robot (pl. da Vinci), rehabilitáció                  |
| **autonóm járművek, drónok** | önvezető autó, szállító drón, mezőgazdasági drón               |
| **humanoid robotok**         | ember alakú robotok gyárakba és otthonokba (kísérleti fázis)   |

A robotok a **monoton, veszélyes vagy nagy pontosságot** igénylő munkát veszik át. A tervezésnél mindig első a **biztonság**: vészleállító gomb, védőkerítés vagy (cobotoknál) erőkorlátozás.

## Összefoglalás

- A mikrovezérlős program: `setup()` egyszer, `loop()` örökké.
- Akadálykerülés: mérés → küszöbértékek alapján döntés → mozgás.
- Alkalmazások: ipar, cobotok, logisztika, szolgáltatás, orvoslás, autonóm járművek.

## A lecke feladata

```quiz required
? Melyik Arduino-függvény ismétlődik **végtelenül**?
- setup()
+ loop()
- main()
- start()
! A setup() egyszer fut, a loop() örökké.

? Mit dönt a lecke szimulált robotja 25 cm-es mért távolságnál?
- egyenesen előre
+ lassít és fordul
- tolat és fordul
- megáll és kikapcsol
! 15 ≤ 25 < 30.

? Hogy hívják az emberrel közös munkatérben, biztonságosan dolgozó robotkarokat?
= cobot
= cobotok
= kollaboratív robot
! collaborative robot.

? Melyik a robotok szabványos, nyílt forráskódú szoftverkerete?
- Excel
+ ROS 2
- Photoshop
- winget
! Robot Operating System.
```

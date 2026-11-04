---
title: Mi a robot, és miből áll?
summary: A robot fogalma, az érzékelés–döntés–cselekvés ciklus, érzékelők, beavatkozók, vezérlő.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **robot**, és miben különbözik egy egyszerű géptől,
- mi az **érzékel → dönt → cselekszik** ciklus,
- melyek a robot fő részei: **érzékelők**, **beavatkozók**, **vezérlő**.

## Mi a robot?

A **robot** olyan programozható gép, amely **érzékeli** a környezetét, a beérkező adatok alapján **dönt**, és fizikailag **cselekszik** – legalább részben önállóan. Egy mosógép egy rögzített programot követ; egy robotporszívó viszont érzékeli a falat és a lépcsőt, és ennek megfelelően fordul.

A szó Karel Čapek 1920-as _R.U.R._ című színdarabjából származik (cseh _robota_ = robot, kényszermunka).

## Az érzékel–dönt–cselekszik ciklus

```text
        ┌──────────────┐
        │  KÖRNYEZET   │◄────────────┐
        └──────┬───────┘             │
               │ mérés               │ mozgás
        ┌──────▼───────┐      ┌──────┴───────┐
        │  érzékelők   │      │ beavatkozók  │
        └──────┬───────┘      └──────▲───────┘
               │ adat                │ parancs
               └──────► vezérlő ─────┘
                      (program, döntés)
```

A ciklus másodpercenként sokszor fut le.

## A robot részei

**Érzékelők (szenzorok)** – a robot „érzékszervei”:

| Érzékelő                              | Mit mér?                         |
| ------------------------------------- | -------------------------------- |
| ultrahangos / infravörös távolságmérő | akadály távolsága                |
| ütközésérzékelő (mikrokapcsoló)       | hozzáért-e valamihez             |
| kamera                                | kép (felismerés, követés)        |
| LIDAR                                 | 3D távolságtérkép lézerrel       |
| giroszkóp, gyorsulásmérő (IMU)        | elfordulás, gyorsulás, egyensúly |
| enkóder                               | hányat fordult a kerék / motor   |
| hőmérséklet-, fény-, nyomásérzékelő   | a környezet jellemzői            |

**Beavatkozók (aktuátorok)** – amivel a robot hat a világra: **egyenáramú motor** (kerék), **szervomotor** (pontos szögbe áll), **léptetőmotor** (pontos lépések, 3D-nyomtató), pneumatikus/hidraulikus henger, megfogó, hangszóró, LED.

**Vezérlő** – a robot „agya”: egy **mikrovezérlő** (Arduino, ESP32, Raspberry Pi Pico), egy kis számítógép (Raspberry Pi) vagy ipari vezérlő (**PLC**). Ezen fut a program.

**Energiaellátás** – akkumulátor vagy hálózati táp; **mechanika** – váz, kerekek, csuklók.

## Szabadságfok

Egy robotkar **szabadságfoka** (DoF, degrees of freedom) azt mutatja, hány független irányban tud mozogni. Egy tipikus ipari robotkar 6 szabadságfokú: így tetszőleges helyre és tetszőleges szögben tudja vinni a megfogót.

## Összefoglalás

- Robot = programozható gép, amely érzékel, dönt és cselekszik.
- Részei: érzékelők, beavatkozók, vezérlő, energiaellátás, mechanika.
- A szabadságfok a független mozgásirányok száma (ipari kar: 6).

## A lecke feladata

```quiz required
? Melyik a robot működésének helyes ciklusa?
+ érzékel → dönt → cselekszik
- cselekszik → érzékel → kikapcsol
- dönt → tárol → nyomtat
- tölt → vár → érzékel
! A ciklus folyamatosan ismétlődik.

? Melyik **beavatkozó** (aktuátor)?
- ultrahangos távolságmérő
- kamera
+ szervomotor
- giroszkóp
! A beavatkozók hatnak a környezetre, az érzékelők mérnek.

? Melyik érzékelő méri, hányat fordult egy kerék?
= enkóder
= encoder
! Ebből számolható a megtett út.

? Hány szabadságfokú egy tipikus ipari robotkar?
= 6
! Három a helyzethez, három a szöghöz.
```

---
title: A felhő fogalma és modelljei
summary: Mi a felhő, IaaS, PaaS, SaaS, nyilvános, privát és hibrid felhő, előnyök és kockázatok.
minutes: 16
---

## Amit ebben a leckében megtanulsz

- mit jelent a **felhőszolgáltatás** (cloud computing),
- mi a különbség az **IaaS**, a **PaaS** és a **SaaS** között,
- mi a **nyilvános**, a **privát** és a **hibrid** felhő, és mik az előnyök és kockázatok.

## Mi a felhő?

A **felhő** azt jelenti, hogy a számítási kapacitást, a tárhelyet vagy a szoftvert **nem a saját gépeden futtatod**, hanem egy szolgáltató adatközpontjában, és **az interneten keresztül**, **igény szerint**, **használat alapján fizetve** veszed igénybe. Olyan, mint az áram: nem építesz erőművet, csak bedugod a konnektorba, és fizetsz a fogyasztásért.

A legnagyobb szolgáltatók: **Amazon Web Services (AWS)**, **Microsoft Azure**, **Google Cloud**.

## Szolgáltatási modellek

Minél feljebb megyünk, annál többet intéz a szolgáltató, és annál kevesebbet kell nekünk kezelni.

```text
                 saját gép   IaaS        PaaS        SaaS
 alkalmazás         TE        TE          TE        szolgáltató
 adatok             TE        TE          TE        szolgáltató*
 futtatókörnyezet   TE        TE       szolgáltató  szolgáltató
 operációs rendszer TE        TE       szolgáltató  szolgáltató
 virtualizáció      TE     szolgáltató szolgáltató  szolgáltató
 hardver, hálózat   TE     szolgáltató szolgáltató  szolgáltató
```

\* az adatok a tieid, de a szolgáltató tárolja őket.

| Modell   | Mit kapsz?                                       | Példa                               |
| -------- | ------------------------------------------------ | ----------------------------------- |
| **IaaS** | virtuális gépet, tárhelyet, hálózatot            | AWS EC2, Azure Virtual Machines     |
| **PaaS** | kész futtatókörnyezetet: csak a kódot töltöd fel | Heroku, Vercel, Google App Engine   |
| **SaaS** | kész, böngészőből használható szoftvert          | Gmail, Microsoft 365, Canva, Trello |

## Telepítési modellek

- **Nyilvános felhő**: a szolgáltató infrastruktúráját sok ügyfél használja közösen (AWS, Azure).
- **Privát felhő**: csak egy szervezeté, a saját adatközpontjában vagy elkülönítve.
- **Hibrid felhő**: a kettő kombinációja; pl. az érzékeny adatok helyben, a webes rész nyilvános felhőben.

## Előnyök és kockázatok

| Előny                                      | Kockázat                                     |
| ------------------------------------------ | -------------------------------------------- |
| nincs nagy kezdeti beruházás               | a havi díj hosszú távon sok lehet            |
| **skálázható**: percek alatt több gép      | függés a szolgáltatótól (**vendor lock-in**) |
| bárhonnan elérhető                         | internet nélkül nem működik                  |
| a szolgáltató intézi a mentést, frissítést | adatvédelem: hol tárolják az adatot (GDPR)?  |

## Összefoglalás

- Felhő = informatikai erőforrás az interneten, igény szerint, használat alapján fizetve.
- IaaS: virtuális gép; PaaS: futtatókörnyezet; SaaS: kész szoftver.
- Nyilvános, privát, hibrid felhő; fő kockázat a szolgáltatófüggés és az adatvédelem.

## A lecke feladata

```quiz required
? Melyik szolgáltatási modellbe tartozik a Gmail?
- IaaS
- PaaS
+ SaaS
! Kész, böngészőből használható szoftver.

? Melyik modellben bérelsz **virtuális gépet**, amelyre magad telepíted az operációs rendszert?
+ IaaS
- PaaS
- SaaS
! Infrastructure as a Service.

? Hogy hívják azt a felhőt, amely nyilvános és privát részeket kombinál?
= hibrid
= hibrid felhő
! Pl. érzékeny adatok helyben, a weboldal a nyilvános felhőben.

? Mit jelent a **vendor lock-in**?
- a szolgáltató lezárja a fiókodat
+ nehéz és drága átköltözni egy másik szolgáltatóhoz
- a felhő csak egy országban érhető el
- a szoftvert nem lehet frissíteni
! A szolgáltató saját szolgáltatásaira épülő rendszert nehéz máshová vinni.
```

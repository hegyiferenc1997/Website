---
title: Jelenlegi technológiai trendek
summary: Mesterséges intelligencia, felhő, IoT és peremszámítás, 5G, kiberbiztonság, adatvezérelt működés – mi hajtja ma az informatikai innovációt?
minutes: 20
---

## Amit ebben a leckében megtanulsz

- melyek ma a legfontosabb **technológiai trendek** az informatikában,
- mit jelentenek az **IaaS / PaaS / SaaS** felhőmodellek,
- hogyan kapcsolódnak egymáshoz a trendek, és mit jelentenek egy mérnökinformatikus számára.

## Mi a technológiai trend?

**Technológiai trend** egy olyan fejlődési irány, amely **tartósan** (több éven át) és **széles körben** (sok iparágban) alakítja a termékeket, a folyamatokat és az üzleti modelleket. Nem azonos a divattal: a trend mögött mérhető beruházások, piaci növekedés és új szabványok állnak.

## A legfontosabb mai trendek

### Mesterséges intelligencia (MI)

- **Gépi tanulás** (_machine learning_): a rendszer adatokból tanul szabályokat ahelyett, hogy kézzel programoznánk.
- **Mélytanulás** (_deep learning_): sokrétegű neurális hálók, pl. kép- és beszédfelismerés.
- **Generatív MI** és **nagy nyelvi modellek** (LLM): szöveget, képet, kódot állítanak elő; programozási asszisztensek, ügyfélszolgálati csevegőrobotok.

### Felhőszámítástechnika

Az erőforrásokat (szerver, tárhely, szoftver) igény szerint, interneten keresztül béreljük, és **használat alapján fizetünk**.

| Modell   | Mit kapunk?                                     | Példa                             |
| -------- | ----------------------------------------------- | --------------------------------- |
| **IaaS** | infrastruktúra: virtuális gép, hálózat, tárhely | AWS EC2, Azure Virtual Machines   |
| **PaaS** | futtatókörnyezet: mi csak a kódot hozzuk        | Heroku, Google App Engine, Vercel |
| **SaaS** | kész alkalmazás böngészőben                     | Gmail, Microsoft 365, Jira        |

### Dolgok internete (IoT) és peremszámítás

Érzékelőkkel és hálózattal ellátott eszközök (okosotthon, ipari gépek, okosórák) gyűjtenek adatot. A **peremszámítás** (_edge computing_) az adatot az eszköz közelében dolgozza fel, így kisebb a késleltetés és a hálózati forgalom. Az **5G** nagy sávszélességgel és kis késleltetéssel köti össze őket.

### Kiberbiztonság

Minél több eszköz és adat kerül hálózatra, annál nagyobb a támadási felület. Trendek: **zéró bizalom** (_zero trust_) – senkiben sem bízunk meg automatikusan, minden hozzáférést ellenőrzünk; többfaktoros hitelesítés; MI-alapú támadásészlelés.

### Adatvezérelt működés és automatizálás

- **Big data** és adatelemzés: a döntések mérésekre épülnek.
- **RPA** (robotizált folyamatautomatizálás): szoftverrobotok végzik az ismétlődő irodai feladatokat.
- **Ipar 4.0**: összekapcsolt, adatvezérelt gyártás (IoT + felhő + MI + robotika), **digitális iker** (egy fizikai rendszer valós idejű virtuális mása).

## Hogyan kapcsolódnak?

A trendek erősítik egymást: az IoT eszközök adatot gyűjtenek → az 5G továbbítja → a felhő tárolja → az MI elemzi → a kiberbiztonság védi. Ezért a legnagyobb innovációk gyakran **több trend összekapcsolásából** születnek (architekturális innováció, 1. témakör).

## Összefoglalás

- A technológiai trend tartós és széles körű fejlődési irány, nem rövid divat.
- Mai fő trendek: MI (gépi tanulás, generatív MI), felhő (IaaS, PaaS, SaaS), IoT + peremszámítás + 5G, kiberbiztonság (zero trust), adatvezérelt működés és automatizálás.
- A trendek egymásra épülnek; az innováció gyakran ezek kombinációja.

## A lecke feladata

```quiz required
? Egy cég a Microsoft 365-öt használja böngészőből, telepítés nélkül. Melyik felhőmodell ez?
- IaaS
- PaaS
+ SaaS
- egyik sem, ez helyi szoftver
! SaaS = kész alkalmazás szolgáltatásként.

? Egy fejlesztő csak a kódját tölti fel, a szervert és a futtatókörnyezetet a szolgáltató kezeli. Melyik modell ez?
- IaaS
+ PaaS
- SaaS
! PaaS = platform szolgáltatásként.

? Mi a **peremszámítás** (edge computing) fő előnye?
+ az adat az eszköz közelében dolgozódik fel, így kisebb a késleltetés
- minden adatot egyetlen központi szerverre küld
- nem igényel hálózatot
- olcsóbbá teszi a felhőtárhelyet
! Az adat nem utazik el a távoli adatközpontig.

? Melyik elv szerint **senkiben sem bízunk meg automatikusan**, minden hozzáférést ellenőrzünk?
= zero trust
= zéró bizalom
= zerotrust
! Angolul „zero trust”.

? Mit nevezünk **digitális ikernek**?
- egy weboldal tükörszerverét
+ egy fizikai rendszer valós idejű virtuális mását
- két egyforma processzormagot
- egy biztonsági másolatot
! Pl. egy gyártósor szimulációja, amely az érzékelők adatai alapján frissül.
```

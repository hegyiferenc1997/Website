---
title: Hálózatok fajtái és eszközei
summary: PAN, LAN, WAN; csillag- és egyéb topológiák; switch, router, hozzáférési pont; vezetékes és vezeték nélküli kapcsolat.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **számítógépes hálózat**, és mekkora lehet (**PAN**, **LAN**, **WAN**),
- milyen **topológiák** léteznek,
- mire való a **switch**, a **router** és a **hozzáférési pont**.

## Mi a hálózat?

A **számítógépes hálózat** egymással adatot cserélő eszközök (számítógépek, telefonok, nyomtatók, szerverek) összessége. Haszna: közös erőforrások (nyomtató, fájlok), kommunikáció, internet-hozzáférés.

## Méret szerint

| Típus   | Kiterjedés            | Példa                                                        |
| ------- | --------------------- | ------------------------------------------------------------ |
| **PAN** | néhány méter          | telefon + fülhallgató Bluetooth-on                           |
| **LAN** | egy épület, lakás     | otthoni Wi-Fi, irodai hálózat                                |
| **MAN** | egy város             | városi optikai gerinchálózat                                 |
| **WAN** | országok, kontinensek | egy cég telephelyeit összekötő hálózat; maga az **internet** |

Az **internet** a hálózatok hálózata: milliónyi LAN és WAN, amelyek közös protokollokkal (TCP/IP) kommunikálnak.

## Topológiák

```text
   csillag                 busz                 gyűrű
     (B)              (A)─(B)─(C)─(D)        (A)───(B)
      │                                       │     │
 (A)─[S]─(C)                                 (D)───(C)
      │
     (D)
```

A mai LAN-ok szinte mind **csillag** topológiájúak: minden eszköz egy központi **switchhez** csatlakozik. Ha egy kábel elszakad, csak az az egy gép esik ki.

## Eszközök

| Eszköz                    | Feladata                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| **hálózati kártya (NIC)** | a gép csatlakozása; egyedi hardvercíme a **MAC-cím** (pl. `3C:52:82:1A:2B:3C`)            |
| **switch** (kapcsoló)     | a LAN-on belül a MAC-cím alapján a megfelelő portra továbbítja a keretet                  |
| **router** (útválasztó)   | **hálózatok között** továbbít az IP-cím alapján, pl. az otthoni LAN és az internet között |
| **hozzáférési pont (AP)** | vezeték nélküli (Wi-Fi) eszközöket kapcsol a hálózatra                                    |
| **modem**                 | a szolgáltató vonalához illeszt (kábel, DSL, optika: ONT)                                 |

Az otthoni „router” általában mindezt egyben tartalmazza: router + switch + Wi-Fi AP (+ modem).

## Átviteli közegek

- **réz kábel** (UTP, RJ45 csatlakozó): olcsó, 1–10 Gbit/s, legfeljebb 100 m,
- **optikai kábel**: fényimpulzusok, nagy sebesség, kilométeres távolság, nem zavarja az elektromágneses tér,
- **vezeték nélküli**: Wi-Fi (Wi-Fi 6/6E/7), Bluetooth, mobilhálózat (4G, 5G).

## Összefoglalás

- Méret szerint: PAN < LAN < MAN < WAN; az internet a hálózatok hálózata.
- A mai LAN-ok csillag topológiájúak, középen switch.
- Switch: LAN-on belül (MAC); router: hálózatok között (IP); AP: Wi-Fi.

## A lecke feladata

```quiz required
? Milyen hálózat az otthoni Wi-Fi?
- PAN
+ LAN
- MAN
- WAN
! Local Area Network: egy lakás, épület.

? Melyik eszköz továbbít **hálózatok között** az IP-cím alapján?
- switch
+ router
- hozzáférési pont
- hálózati kártya
! A router köti össze az otthoni hálózatot az internettel.

? Hogy hívják a hálózati kártya egyedi hardvercímét?
= MAC-cím
= MAC
= MAC address
! Pl. 3C:52:82:1A:2B:3C.

? Legfeljebb hány méter lehet egy UTP réz hálózati kábelszakasz?
= 100
! Nagyobb távolságra optikai kábelt használnak.
```

---
title: Mi a szerver?
summary: Kliens–szerver modell, szervertípusok, fizikai, virtuális és felhős szerver, szerverhardver, RAID és redundancia.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **szerver**, és hogyan működik a **kliens–szerver** modell,
- milyen **szolgáltatásokat** nyújtanak a szerverek,
- miben más a **szerverhardver**, és mi a **RAID**.

## Kliens–szerver modell

A **szerver** olyan számítógép (vagy program), amely **szolgáltatást nyújt** más gépeknek, a **klienseknek**, a hálózaton keresztül. A böngésződ kliens, amely kéréseket küld; a webszerver válaszol. A szerver általában **éjjel-nappal** fut, monitor és billentyűzet nélkül, és távolról kezelik.

| Szerverfajta           | Mit szolgáltat?                        | Példa szoftver                |
| ---------------------- | -------------------------------------- | ----------------------------- |
| **webszerver**         | weboldalak, API-k                      | nginx, Apache, IIS            |
| **adatbázis-szerver**  | adatok tárolása, lekérdezés            | PostgreSQL, MySQL, SQL Server |
| **fájlszerver**        | közös mappák                           | Samba, Windows fájlmegosztás  |
| **levelezőszerver**    | e-mail küldése és fogadása             | Postfix, Exchange             |
| **DNS-, DHCP-szerver** | névfeloldás, címkiosztás               | BIND, Windows Server          |
| **címtárszerver**      | felhasználók, jogosultságok egy helyen | Active Directory, LDAP        |

## Fizikai, virtuális, felhős

- **Fizikai szerver** (bare metal): saját vas a cég szervertermében vagy egy bérelt rack-helyen. Teljes kontroll, de a hardverről is neked kell gondoskodni.
- **Virtuális gép** (VM): egy erős fizikai gépen több elkülönített virtuális szerver fut (VMware, Hyper-V, Proxmox, KVM). Jobb kihasználtság, gyors létrehozás, pillanatkép.
- **Felhős szerver** (IaaS): virtuális gép bérelve egy szolgáltatótól (AWS EC2, Azure VM, Hetzner, DigitalOcean), percek alatt, óradíjjal.
- **Konténer**: még könnyebb, mint a VM: egy alkalmazás a függőségeivel, közös kernelen (Docker) – lásd a 3. leckét.

## Szerverhardver

A szerver nem „erős PC”, hanem **megbízhatóságra** tervezett gép:

- **rack** kivitel (19 colos szekrénybe szerelve, 1U = 1,75 hüvelyk magas egység),
- **ECC memória**: felismeri és kijavítja a memóriahibákat,
- **redundáns táp** és ventilátorok: ha egy elromlik, a másik viszi tovább,
- **távfelügyeleti kártya** (iDRAC, iLO, IPMI): akkor is el lehet érni, ha az operációs rendszer lefagyott,
- **RAID**: több lemez együtt, a biztonság vagy a sebesség kedvéért.

| RAID    | Működése                                | Lemezhiba esetén       | Kapacitás (4 × 4 TB) |
| ------- | --------------------------------------- | ---------------------- | -------------------- |
| RAID 0  | csíkozás: az adat felosztva a lemezeken | **minden adat elvész** | 16 TB                |
| RAID 1  | tükrözés: két lemezen ugyanaz           | a tükör viszi tovább   | (2 lemezzel) 4 TB    |
| RAID 5  | csíkozás + paritás                      | 1 lemez kieshet        | 12 TB                |
| RAID 10 | tükrözött párok csíkozva                | páronként 1 kieshet    | 8 TB                 |

**A RAID nem mentés!** Ha véletlenül törölsz egy fájlt, vagy zsarolóvírus titkosítja, a RAID azonnal minden lemezen „hűségesen” törli vagy titkosítja.

## Összefoglalás

- Szerver = szolgáltatást nyújt a klienseknek a hálózaton; web-, adatbázis-, fájl-, levelező-, DNS-szerver.
- Fizikai, virtuális, felhős szerver és konténer.
- Szerverhardver: rack, ECC, redundáns táp, távfelügyelet, RAID – de a RAID nem mentés.

## A lecke feladata

```quiz required
? Melyik szerepet tölti be a böngésződ, amikor megnyitsz egy weboldalt?
+ kliens
- szerver
- router
- DNS
! A kliens kér, a szerver kiszolgál.

? Melyik RAID-szintnél vész el **minden adat**, ha egyetlen lemez elromlik?
= RAID 0
= 0
! Csíkozás redundancia nélkül.

? Mekkora a hasznos kapacitás RAID 5-ben 4 db 4 TB-os lemezzel (TB-ban)?
= 12
! (4 − 1) · 4 TB: egy lemeznyi hely a paritásé.

? Igaz-e, hogy a RAID helyettesíti a mentést?
- Igen, mert több lemezen van az adat.
+ Nem, mert a törlés vagy a zsarolóvírus minden lemezen azonnal megjelenik.
! Mentés kell a RAID mellé is.
```

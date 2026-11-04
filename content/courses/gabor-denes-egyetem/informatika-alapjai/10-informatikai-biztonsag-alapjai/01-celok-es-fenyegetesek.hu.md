---
title: Célok és fenyegetések
summary: A CIA-hármas, a kártevők fajtái, a zsarolóvírus, az adathalászat és a social engineering.
minutes: 16
---

## Amit ebben a leckében megtanulsz

- mi az informatikai biztonság három célja (**CIA-hármas**),
- milyen **kártevők** vannak, és mit csinál a **zsarolóvírus**,
- hogyan ismered fel az **adathalászatot** és a **social engineeringet**.

## A CIA-hármas

| Cél                     | Angolul         | Jelentése                                       | Megsértése, példa                  |
| ----------------------- | --------------- | ----------------------------------------------- | ---------------------------------- |
| **bizalmasság**         | Confidentiality | csak az férhet hozzá, akinek joga van           | kiszivárgott jelszóadatbázis       |
| **sértetlenség**        | Integrity       | az adatot senki nem módosította jogtalanul      | megváltoztatott utalási számlaszám |
| **rendelkezésre állás** | Availability    | az adat és a szolgáltatás elérhető, amikor kell | túlterheléses (DDoS) támadás       |

## Kártevők (malware)

| Típus                         | Mit csinál?                                                    |
| ----------------------------- | -------------------------------------------------------------- |
| **vírus**                     | más programokhoz csatolva terjed, ha azokat elindítják         |
| **féreg**                     | magától terjed a hálózaton, emberi közreműködés nélkül         |
| **trójai**                    | hasznos programnak álcázza magát, de kártékony részt rejt      |
| **kémprogram**                | titokban figyel: billentyűleütések, jelszavak, böngészés       |
| **zsarolóvírus** (ransomware) | titkosítja a fájlokat, és váltságdíjat kér a kulcsért          |
| **botnet**                    | megfertőzött gépek hálózata, amelyet a támadó távolról irányít |

A **zsarolóvírus** ma a cégek egyik legnagyobb veszélye: kórházak, gyárak állhatnak le miatta. A legjobb védekezés ellene a **jó mentés** (lásd a harmadik leckét).

## Adathalászat (phishing)

Az **adathalász** levél vagy üzenet egy megbízható szereplőnek (bank, futárcég, egyetem, Microsoft) adja ki magát, és arra vesz rá, hogy kattints egy linkre, és add meg a jelszavadat vagy kártyaadatodat.

Árulkodó jelek:

- **sürgetés** vagy fenyegetés: „24 órán belül zároljuk a fiókját!”,
- a **feladó címe** vagy a link **domainje** furcsa (`neptun-gde.login-secure.xyz`),
- általános megszólítás, helyesírási hibák (bár az MI-vel írt levelek már hibátlanok lehetnek),
- váratlan csatolmány (`szamla.zip`, `.exe`, makrós Office-fájl).

**Szabály:** ne a levélben lévő linkre kattints, hanem írd be magad a jól ismert címet, vagy hívd fel a céget a hivatalos számán.

## Social engineering

A **social engineering** (pszichológiai manipuláció) az embert támadja, nem a gépet: a támadó telefonál „a rendszergazdától”, és elkéri a jelszót; vagy belép egy dolgozó mögött a beléptetőkapun. A támadó a segítőkészségre, a tekintélyre és a sietségre épít. Egy rendszergazda **soha** nem kéri el a jelszavadat.

## Összefoglalás

- CIA: bizalmasság, sértetlenség, rendelkezésre állás.
- Kártevők: vírus, féreg, trójai, kémprogram, zsarolóvírus, botnet.
- Adathalászat: sürgetés, gyanús link, váratlan csatolmány; a social engineering az embert támadja.

## A lecke feladata

```quiz required
? A CIA-hármas melyik elemét sérti egy túlterheléses (DDoS) támadás, amely elérhetetlenné teszi a weboldalt?
- bizalmasság
- sértetlenség
+ rendelkezésre állás
! Availability.

? Melyik kártevő **titkosítja** a fájlokat, és váltságdíjat kér?
- féreg
- kémprogram
+ zsarolóvírus
- trójai
! Ransomware.

? Melyik kártevő terjed **magától** a hálózaton, emberi közreműködés nélkül?
= féreg
= worm
! A vírushoz el kell indítani egy fertőzött programot.

? Melyik a legbiztosabb teendő egy „azonnal erősítse meg banki adatait” levélre?
- a levél linkjére kattintva belépni
- válaszolni a levélre a jelszóval
+ a bank címét magad beírni vagy a hivatalos számon telefonálni
- továbbítani az ismerőseidnek
! A levél linkje egy hamis oldalra vihet.
```

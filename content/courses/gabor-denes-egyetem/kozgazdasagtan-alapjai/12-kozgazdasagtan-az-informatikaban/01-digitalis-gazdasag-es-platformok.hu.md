---
title: A digitális gazdaság és a platformok
summary: Miért lesznek a technológiai cégek ilyen nagyok? Az információs javak, a nulla határköltség, a hálózati hatás, a kétoldalú platformok, a bezártság, az adat és a figyelem gazdaságtana, valamint a platformok szabályozása.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- miben különböznek az **információs javak** a hagyományos termékektől,
- mi a **hálózati hatás**, és miért vezet „**a győztes mindent visz**” piacokhoz,
- hogyan működnek a **kétoldalú platformok**,
- mi a **bezártság** (lock-in) és a **váltási költség**,
- miért érték az **adat** és a **figyelem**, és hogyan **szabályozzák** a nagy platformokat.

## Információs javak

A szoftver, a zene, a film, az e-könyv **információs jószág**. Különlegességeik:

- **Magas fix, közel nulla határköltség** (4. témakör): az első példány milliókba kerül, a többi szinte ingyen másolható. → óriási méretgazdaságosság.
- **Nem rivális fogyasztás:** ha te használod, attól nekem is ugyanúgy megmarad (mint a közjavaknál – 1. témakör).
- **Kizárhatóság csak technikai és jogi eszközzel** (licenc, másolásvédelem, szerzői jog) – különben a „potyautasság” miatt senki sem fizetne.
- **Tapasztalati jószág:** csak kipróbálás után tudod, mennyit ér – ezért terjedt el az ingyenes próbaidőszak és a freemium (2. lecke).

## Hálózati hatás

**Hálózati hatás** (hálózati externália): egy termék annál értékesebb, minél többen használják.

- **Közvetlen:** egy üzenetküldő app csak akkor jó, ha a barátaid is használják.
- **Közvetett:** egy operációs rendszer azért értékes, mert sok alkalmazás készül rá – és azért készül rá sok alkalmazás, mert sokan használják.

**Metcalfe törvénye:** egy $n$ felhasználós hálózatban a lehetséges kapcsolatok száma $\dfrac{n(n-1)}{2}$, tehát a hálózat értéke a felhasználók számánál **gyorsabban** nő. 10 felhasználónál 45, 100-nál már 4950 kapcsolat lehetséges.

### „A győztes mindent visz”

A hálózati hatás és a méretgazdaságosság együtt **pozitív visszacsatolást** okoz: aki előnybe kerül, egyre több felhasználót vonz, a többiek lemaradnak. Ezért jellemző a digitális piacokon néhány domináns szereplő (keresők, közösségi média, mobil operációs rendszerek, felhőszolgáltatók) – **oligopólium** vagy majdnem **monopólium** (4. témakör).

A **kritikus tömeg** elérése előtt viszont nehéz a helyzet: egy új közösségi oldal üresen nem vonzó. Ezért a startupok gyakran veszteségesen, ingyen vagy nagy kedvezménnyel indulnak.

## Kétoldalú platformok

A **platform** két (vagy több) felhasználói csoportot köt össze, és mindkét oldal annál értékesebbnek tartja, minél többen vannak a másik oldalon:

| Platform                | Egyik oldal  | Másik oldal |
| ----------------------- | ------------ | ----------- |
| alkalmazásbolt          | felhasználók | fejlesztők  |
| fuvarmegosztó app       | utasok       | sofőrök     |
| webáruház-piactér       | vevők        | eladók      |
| kereső, közösségi média | felhasználók | hirdetők    |

A platform gyakran az egyik oldalt **ingyen** szolgálja ki (vagy támogatja), a másiktól szedi be a bevételt – a felhasználók ingyen keresnek, a hirdetők fizetnek.

## Bezártság és váltási költség

**Váltási költség:** amibe a szolgáltató cseréje kerül – az adatok átköltöztetése, az új rendszer megtanulása, a kompatibilitás elvesztése, a meglévő kapcsolatok. Ha magas, a felhasználó **bezáródik** (lock-in).

- Példák: egy cég teljes infrastruktúrája egy felhőszolgáltató saját szolgáltatásaira épül; a fotóid egy adott ökoszisztémában vannak.
- A szolgáltató ezt kihasználhatja (áremelés), ezért fontosak a **nyílt szabványok** és az **adathordozhatóság** (a GDPR szerint jogod van a saját adataidhoz géppel olvasható formában).

## Adat és figyelem

- Az **adat** termelési tényezővé vált: javítja a szolgáltatást (ajánlórendszerek), a gépi tanulási modelleket, és lehetővé teszi a célzott hirdetést. Az adatnak is van **hálózati hatása**: több felhasználó → több adat → jobb termék → több felhasználó.
- **Figyelemgazdaság:** az „ingyenes” szolgáltatásoknál a felhasználó a figyelmével és az adataival fizet – ha nem fizetsz a termékért, gyakran **te vagy a termék**.
- Ez externáliákat okozhat: a magánszféra sérülése, függőséget okozó tervezés, félretájékoztatás terjedése.

## A platformok szabályozása

A piaci erő és az externáliák miatt az EU külön szabályokat alkotott:

- **GDPR** (2018): adatvédelem, hozzájárulás, adathordozhatóság.
- **Digitális piacokról szóló rendelet (DMA)**: a legnagyobb „kapuőr” platformoknak tilos például a saját szolgáltatásaikat előnyben részesíteni, és lehetővé kell tenniük más alkalmazásboltokat, szolgáltatásokat.
- **Digitális szolgáltatásokról szóló rendelet (DSA)**: az illegális tartalmak kezelése, az algoritmusok átláthatósága.
- A **versenyjog** (4. témakör) hagyományos eszközei: bírságok a piaci erővel való visszaélésért, összefonódások vizsgálata.

## Összefoglalás

- Információs javak: magas fix, közel nulla határköltség, nem rivális, tapasztalati jószág.
- Hálózati hatás: több felhasználó → értékesebb termék; „a győztes mindent visz”.
- Kétoldalú platformok: két csoportot kötnek össze; gyakran az egyik oldal ingyenes.
- Bezártság: magas váltási költség; ellenszer a nyílt szabvány és az adathordozhatóság.
- Az adat termelési tényező; a nagy platformokat a GDPR, a DMA és a DSA szabályozza.

## A lecke feladata

```quiz required
? Miért közel nulla egy szoftver határköltsége?
- mert a fejlesztése ingyenes
+ mert egy újabb példány szinte ingyen előállítható
- mert az állam támogatja
- mert senki nem fizet érte
! A fix költség magas, a határköltség alacsony.

? Metcalfe törvénye szerint hány kapcsolat lehetséges egy 20 felhasználós hálózatban?
= 190
! 20 · 19 / 2.

? Melyik a **közvetett** hálózati hatás példája?
- egy telefonhálózat értékesebb, ha több barátod van rajta
+ egy játékkonzol értékesebb, mert sok játék készül rá
- egy kávézó zsúfolt lesz
- egy laptop gyorsabb lesz
! A másik oldal (fejlesztők) nagysága számít.

? Mi a **váltási költség**?
- egy termék gyártási költsége
+ amibe a szolgáltató lecserélése kerül (adatköltöztetés, tanulás, kompatibilitás)
- a termék ára
- az adó
! Ha magas, bezártság alakul ki.

? Melyik uniós rendelet szabályozza kifejezetten a legnagyobb „kapuőr” platformok piaci magatartását?
- GDPR
+ DMA
- MiCA
- Bázel III
! Digitális piacokról szóló rendelet.
```

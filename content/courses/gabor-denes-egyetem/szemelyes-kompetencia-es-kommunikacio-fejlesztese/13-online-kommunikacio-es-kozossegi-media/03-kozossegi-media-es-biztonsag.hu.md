---
title: Közösségi média és biztonságos online jelenlét
summary: Hogyan működnek az ajánlóalgoritmusok és a véleménybuborékok, hogyan ismerd fel az álhíreket, az adathalászatot és a social engineeringet, és hogyan védd az adataidat.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan működnek az **ajánlóalgoritmusok**, és mi a **véleménybuborék**,
- hogyan **ellenőrizz** egy hírt vagy állítást,
- hogyan ismerd fel az **adathalászatot** és a **social engineeringet**,
- hogyan védd a **fiókjaidat**.

## Algoritmusok és véleménybuborék

A közösségi oldalak **ajánlóalgoritmusai** azt mutatják, ami a legvalószínűbben **leköti** a figyelmedet (kattintás, megosztás, a nézés ideje). Ennek következményei:

- **Véleménybuborék** (filter bubble): egyre inkább csak a meglévő nézeteidet megerősítő tartalmakat látod.
- **Visszhangkamra**: a hasonló gondolkodásúak egymást erősítik, a más véleményt kiszorítják.
- Az **érzelmes**, felháborító tartalmak gyorsabban terjednek, mint a pontos, de unalmasabb információk.

Mérnökinformatikusként különösen érdemes érteni ezt – lehet, hogy egyszer te is ilyen rendszert fejlesztesz.

## Álhírek felismerése

Mielőtt megosztasz valamit, kérdezd meg:

1. **Ki a forrás?** Ismert, megbízható? Van szerzője, dátuma?
2. **Mit mondanak más források?** Ha egy szenzációt csak egyetlen oldal hoz, gyanús.
3. **Mikor készült?** Lehet, hogy egy régi hírt osztanak meg újként.
4. **A cím egyezik a tartalommal?** A kattintásvadász cím gyakran túloz.
5. **Valódi a kép vagy a videó?** Fordított képkereséssel kiderítheted, honnan származik; MI-vel generált vagy manipulált (deepfake) tartalom is lehet.
6. **Milyen érzést kelt?** Ha nagyon felháborít vagy megijeszt, állj meg – ez a cél.

## Adathalászat (phishing)

Az **adathalászat** megtévesztő üzenet (e-mail, SMS, chat), amely jelszó, bankkártyaadat vagy más érzékeny adat megadására, illetve kártevő letöltésére próbál rávenni.

Gyanús jelek:

- **sürgetés vagy fenyegetés**: „24 órán belül törlődik a fiókod!”,
- **furcsa feladó**: `support@neptun-login-hu.co` a hivatalos domain helyett,
- a link **mást mutat**, mint amire valójában visz (vidd fölé az egeret!),
- **váratlan csatolmány** (pl. „szamla.zip”, „.exe”),
- jelszót vagy kódot **kérnek** – egy hivatalos szolgáltató soha nem kéri el a jelszavadat.

## Social engineering

A **social engineering** (pszichológiai manipuláció) az embert támadja, nem a gépet. A támadó bizalmat épít, vagy tekintélyre, sürgetésre, segítőkészségre épít (lásd Cialdini elvei az 5. témakörben).

Példák:

- egy „informatikus” felhív, és elkéri a jelszavadat „karbantartás miatt”,
- valaki egy kolléga nevében, chatben sürgősen pénzátutalást kér,
- egy idegen követ téged a beléptetőkapun át („elfelejtettem a kártyámat”).

Védekezés: **ellenőrizd másik csatornán** (hívd fel az ismert számon), és soha ne add meg a jelszavadat senkinek.

## A fiókjaid védelme

- **Erős, egyedi jelszó** minden szolgáltatáshoz – használj **jelszókezelőt**.
- Kapcsold be a **kétlépcsős azonosítást** (2FA), lehetőleg hitelesítő alkalmazással vagy biztonsági kulccsal.
- Nézd át az **adatvédelmi beállításokat**: ki látja a bejegyzéseidet, a telefonszámodat, a helyadataidat?
- Ne ossz meg **túl sokat** (lakcím, utazás időpontja, személyi okmányok képe).
- Nyilvános Wi-Fi-n légy óvatos az érzékeny ügyekkel.

## Összefoglalás

- Az algoritmus a figyelmedet optimalizálja – ez véleménybuborékhoz vezethet.
- Álhír-ellenőrzés: forrás, más források, dátum, cím vs. tartalom, kép, érzelmek.
- Adathalászat: sürgetés, furcsa feladó, megtévesztő link, váratlan csatolmány, jelszókérés.
- Social engineering: ellenőrizd másik csatornán; a jelszó senkié.
- Erős, egyedi jelszó, jelszókezelő, 2FA, átgondolt adatvédelmi beállítások.

## A lecke feladata

```quiz required
? Mi a **véleménybuborék**?
- egy közösségi média alkalmazás
+ amikor az algoritmus miatt egyre inkább csak a nézeteidet megerősítő tartalmakat látod
- egy biztonsági funkció
- egy videóhívási effekt
! Filter bubble.

? E-mailt kapsz: „A Neptun-fiókod 24 órán belül törlődik! Jelentkezz be itt:” és egy furcsa link. Mi ez valószínűleg?
- fontos hivatalos értesítés
+ adathalászat
- hírlevél
- egy kolléga üzenete
! Sürgetés + gyanús link.

? Egy magát informatikusnak mondó ember felhív, és elkéri a jelszavadat. Mit teszel?
- megadod, hiszen informatikus
+ nem adod meg, és a hivatalos, ismert elérhetőségen ellenőrzöd
- megadod, de utána megváltoztatod
- elküldöd neki e-mailben
! A jelszavadat soha senkinek.

? Melyik növeli leginkább a fiókod biztonságát?
- ugyanaz a jelszó mindenhol, hogy ne felejtsd el
+ egyedi jelszó jelszókezelővel és kétlépcsős azonosítás
- a születési dátum jelszóként
- a jelszó felírása a monitorra
! Egyedi jelszó + 2FA.
```

---
title: Anomáliák és funkcionális függőség
summary: Miért rossz egy „mindent egy táblába” megoldás – beszúrási, módosítási és törlési anomália –, és a normalizálás alapfogalma, a funkcionális függőség (teljes, részleges, tranzitív).
minutes: 20
---

## Amit ebben a leckében megtanulsz

- milyen **anomáliák** jelentkeznek egy rosszul tervezett táblában,
- mi a **funkcionális függőség**, és hogyan ismered fel,
- mi a **részleges** és a **tranzitív** függőség (ezekre épülnek a normálformák).

## A „mindent egy táblába” csapda

Egy kezdő fejlesztő így tárolja a jelentkezéseket – egyetlen, kényelmesnek tűnő táblában:

| neptun | nev       | szak        | kod  | targy_nev           | kredit | jegy |
| ------ | --------- | ----------- | ---- | ------------------- | ------ | ---- |
| ABC123 | Kiss Anna | mérnökinf   | ADB  | Adatbázisok         | 5      | 5    |
| ABC123 | Kiss Anna | mérnökinf   | DIG  | Digitális technika  | 5      | 4    |
| CDE345 | Tóth Cili | gazdinfo    | ADB  | Adatbázisok         | 5      | 4    |
| DEF456 | Szabó Dani| mérnökinf   | ADB  | Adatbázisok         | 5      | 3    |

Első ránézésre minden rendben. De nézd meg, mi történik a használat során:

- **Módosítási anomália**: az Adatbázisok kreditszáma 6-ra változik. Három sorban kell átírni; ha egyet kihagysz, az adatbázis ellentmondásos lesz.
- **Beszúrási anomália**: indul egy új tárgy (Hálózatok), de még senki nem vette fel. Nem tudod felvenni, mert nincs hozzá Neptun-kód (és az a kulcs része).
- **Törlési anomália**: Szabó Dani lemond az Adatbázisokról. Ha ez volt az egyetlen sora, vele együtt az is eltűnik, hogy ő létezik és melyik szakra jár.

Mindhárom gond oka ugyanaz: **egy táblában több dolog** (hallgató, tárgy, jelentkezés) adatai keverednek, ezért ugyanaz az információ **többször** szerepel. A **normalizálás** a módszer, amellyel ezt rendszerezetten szétszedjük.

## Funkcionális függőség

A normalizálás kulcsfogalma. Azt mondjuk, hogy **A funkcionálisan meghatározza B-t** (jelölés: **A → B**), ha A értéke **egyértelműen meghatározza** B értékét. Ha két sorban A ugyanaz, akkor B is ugyanaz kell legyen.

Példák a fenti táblából:

- `neptun → nev, szak` – egy Neptun-kódhoz mindig ugyanaz a név és szak tartozik.
- `kod → targy_nev, kredit` – egy tárgykódhoz mindig ugyanaz a tárgynév és kredit.
- `(neptun, kod) → jegy` – a jegyhez **mindkettő** kell: Anna az ADB-ből 5-öst, a DIG-ből 4-est kapott.

Fordítva **nem** igaz: `nev → neptun` nem függőség (lehet két Kiss Anna), és `kredit → kod` sem (sok 5 kredites tárgy van).

Hétköznapi hasonlat: a **személyi szám → születési dátum** függőség (a számból kiderül a dátum), de a **születési dátum → személyi szám** nem (sokan születtek ugyanazon a napon).

## A függőségek fajtái

A tábla kulcsa itt `(neptun, kod)`. A függőségeket a kulcshoz képest vizsgáljuk:

- **Teljes függőség**: az attribútum a **teljes** kulcstól függ, annak egy részétől nem. `(neptun, kod) → jegy` – ez a jó.
- **Részleges függőség**: az attribútum a kulcsnak csak egy **részétől** függ. `kod → targy_nev` – a tárgy neve a Neptun-kódtól független. Ez okozza az ismétlődést!
- **Tranzitív függőség**: nem kulcs attribútum függ egy **másik, nem kulcs** attribútumtól. Ha például a hallgatónál tárolnánk a `szak` mellett a `szak_vezetoje` oszlopot is: `neptun → szak → szak_vezetoje`. A szak vezetője csak közvetve, a szakon keresztül függ a hallgatótól.

```text
  (neptun, kod) ──► jegy                  teljes függőség ✓
       │      └───► targy_nev, kredit      részleges (csak kod-tól) ✗
       └──────────► nev, szak              részleges (csak neptun-tól) ✗
  neptun ──► szak ──► szak_vezetoje        tranzitív ✗
```

A következő leckében a normálformák pontosan ezeket a hibás függőségeket tüntetik el, lépésről lépésre.

## Összefoglalás

- Anomáliák: módosítási (sok helyen kell javítani), beszúrási (nem lehet felvenni), törlési (információ vész el).
- A → B: A értéke egyértelműen meghatározza B-t.
- Teljes (jó), részleges (a kulcs egy részétől), tranzitív (nem kulcstól) függőség.

## A lecke feladata

```quiz required
? Egy tárgy átnevezésekor 300 sort kell módosítani, és egy kimarad. Melyik anomália ez?
+ módosítási anomália
- beszúrási anomália
- törlési anomália
! Ugyanaz az adat sok helyen szerepel.

? Nem tudsz felvenni egy új termékkategóriát, amíg nincs benne termék. Melyik anomália ez?
- módosítási anomália
+ beszúrási anomália
- törlési anomália
! Az adat nem tárolható önállóan.

? Melyik **valódi** funkcionális függőség?
- nev → neptun
- kredit → kod
+ neptun → szuletesi_datum
- jegy → neptun
! Egy Neptun-kódhoz mindig ugyanaz a születési dátum tartozik.

? A kulcs `(rendelesszam, termekkod)`. A `termek_neve` csak a `termekkod`-tól függ. Milyen függőség ez?
- teljes
+ részleges
- tranzitív
! A kulcs egy részétől függ.

? `dolgozo_id → reszleg_id → reszleg_neve`. Milyen függőség köti a `reszleg_neve`-t a `dolgozo_id`-hoz?
= tranzitív
! Közvetve, egy nem kulcs attribútumon keresztül.
```

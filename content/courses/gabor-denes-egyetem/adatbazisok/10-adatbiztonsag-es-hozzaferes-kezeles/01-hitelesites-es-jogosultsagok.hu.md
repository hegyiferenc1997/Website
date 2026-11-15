---
title: Hitelesítés és jogosultságok
summary: A biztonság három célja (bizalmasság, sértetlenség, rendelkezésre állás), a hitelesítés és a jogosultságkezelés különbsége, a legkisebb jogosultság elve, a felhasználók és szerepkörök, a hozzáférés-szabályozási modellek (DAC, RBAC, MAC) és a naplózás.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mit jelent, hogy egy adatbázis **biztonságos** (a CIA-hármas),
- mi a különbség a **hitelesítés** és a **jogosultságkezelés** között,
- mi a **legkisebb jogosultság elve**, és miért ez az aranyszabály,
- mik a **szerepkörök**, és milyen hozzáférés-szabályozási modellek vannak.

## Miért fontos ez?

Az adatbázisban van a cég „vagyona”: vásárlók, jelszó-lenyomatok, rendelések, fizetések, egészségügyi vagy tanulmányi adatok. Egy rosszul beállított jogosultság elég ahhoz, hogy egy gyakornok véletlenül kitöröljön egy táblát, vagy egy betörő mindent letöltsön. A jó hír: néhány egyszerű elvvel a legtöbb baj megelőzhető.

## A biztonság három célja: a CIA-hármas

| Cél                                             | Jelentése                                       | Példa a megsértésére                         |
| ----------------------------------------------- | ----------------------------------------------- | -------------------------------------------- |
| **Bizalmasság** (_Confidentiality_)             | csak az lássa az adatot, akinek szabad          | kiszivárog a vásárlók e-mail-címlistája      |
| **Sértetlenség** (_Integrity_)                  | az adat ne változzon meg jogosulatlanul         | valaki átírja a saját jegyét 2-esről 5-ösre  |
| **Rendelkezésre állás** (_Availability_)        | az adat elérhető legyen, amikor kell            | leáll a szerver a vizsgajelentkezés napján   |

Minden biztonsági intézkedés e három közül legalább egyet véd.

## Hitelesítés és jogosultságkezelés

Két különböző kérdés, amelyet gyakran összekevernek:

- **Hitelesítés** (_authentication_): **Ki vagy?** – a rendszer ellenőrzi a személyazonosságodat (jelszó, tanúsítvány, kétlépcsős azonosítás).
- **Jogosultságkezelés** (_authorization_): **Mit tehetsz?** – a rendszer eldönti, hogy a már azonosított felhasználó mit láthat és mit módosíthat.

> Hasonlat: egy irodaházban a portán megmutatod a belépőkártyádat (hitelesítés). A kártyád viszont csak bizonyos emeletekre enged be (jogosultság).

Egy DBMS-ben mindkettő megvan: a PostgreSQL például jelszóval vagy tanúsítvánnyal hitelesít, és a `GRANT` utasítással adott jogok alapján engedélyez (következő lecke).

## A legkisebb jogosultság elve

> Mindenki **pontosan annyi** jogot kapjon, amennyi a feladatához kell – és ne többet.

- A webshop alkalmazása olvashatja és írhatja a rendeléseket, de **nem törölhet táblát**, és nem hozhat létre új felhasználót.
- A riportkészítő elemző csak **olvashat**.
- A rendszergazdai (szuperfelhasználói) fiókkal **nem** fut a napi munka.

Miért? Mert ha egy fiók kompromittálódik (ellopják a jelszavát, vagy hibás a kód), a kár csak akkora lehet, amekkorát az a fiók okozhat.

## Felhasználók és szerepkörök

Ha 200 oktatónak egyenként kellene jogokat adni, és holnap változik a szabály, 200 helyen kellene átírni. Ehelyett a jogokat **szerepkörökhöz** (_role_) rendeljük, és a felhasználókat a szerepkörökbe tesszük:

```text
   felhasználók           szerepkörök             jogok
   ───────────            ───────────             ─────
   kovacs.anna ──┐
                 ├──►  oktato      ──►  SELECT minden táblán, UPDATE a jegyre
   szabo.peter ──┘
   nagy.eva    ────►  tanulmanyi   ──►  SELECT, INSERT, UPDATE a jelentkezésekre
   riport_app  ────►  elemzo       ──►  csak SELECT
```

Ha egy új oktató érkezik, csak a szerepkörbe kell tenni. A PostgreSQL-ben a felhasználó és a csoport ugyanaz a fogalom: **szerepkör**, legfeljebb az egyik be tud jelentkezni (`LOGIN`), a másik nem.

## Hozzáférés-szabályozási modellek

| Modell                                          | Ki dönt a jogokról?                                         | Hol találkozol vele?                        |
| ----------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| **DAC** – tetszés szerinti (_Discretionary_)    | az objektum **tulajdonosa** adhat jogot másoknak            | SQL `GRANT`, fájlrendszerek                 |
| **RBAC** – szerepköralapú (_Role-Based_)        | a jogok **szerepkörökhöz** tartoznak                        | szinte minden vállalati rendszer, DBMS-ek   |
| **MAC** – kötelező (_Mandatory_)                | központi szabály, **biztonsági címkék** (pl. titkos, szigorúan titkos) | katonai, kormányzati rendszerek  |

A relációs DBMS-ek a DAC-ot és az RBAC-ot kombinálják: a tábla tulajdonosa jogot adhat, és a jogokat szerepkörökön keresztül osztjuk ki. Sorszintű szabályokkal (3. lecke) a MAC-hoz hasonló finomhangolás is elérhető.

## Naplózás (audit)

A megelőzés mellett fontos az is, hogy **utólag kiderüljön**, ki mit csinált: ki lépett be, ki módosította a jegyeket, ki kérdezett le szokatlanul sok adatot. Ezt hívják **naplózásnak** (_auditing_). A naplót úgy kell tárolni, hogy az, akit naplóz, **ne tudja módosítani** – különben egy betörő eltüntethetné a nyomait.

## Összefoglalás

- CIA: bizalmasság, sértetlenség, rendelkezésre állás.
- Hitelesítés = ki vagy; jogosultságkezelés = mit tehetsz.
- Legkisebb jogosultság: csak annyi jog, amennyi a feladathoz kell.
- A jogokat szerepkörökhöz rendeljük, a felhasználókat szerepkörökbe tesszük (RBAC).
- Naplózással utólag is kideríthető, ki mit tett.

## A lecke feladata

```quiz required
? Egy hallgató bejelentkezik a Neptunba a jelszavával. Melyik lépés ez?
+ hitelesítés
- jogosultságkezelés
- naplózás
! A rendszer azt ellenőrzi, ki vagy.

? Valaki jogosulatlanul átírja a saját jegyét. A CIA-hármas melyik célja sérült?
- bizalmasság
+ sértetlenség
- rendelkezésre állás
! Az adat jogosulatlanul megváltozott.

? Egy riportkészítő alkalmazásnak csak olvasnia kell az adatokat. A legkisebb jogosultság elve szerint milyen jogot kapjon?
- szuperfelhasználói jogot, hogy biztosan működjön
- olvasási és törlési jogot
+ csak olvasási (SELECT) jogot
- semmilyet
! Pont annyit, amennyi a feladathoz kell.

? Melyik modellben tartoznak a jogok szerepkörökhöz, és a felhasználók a szerepkörökön keresztül kapják meg őket?
- DAC
+ RBAC
- MAC
! Role-Based Access Control.

? Miért fontos, hogy a naplót az ne tudja módosítani, akit naplóz?
- mert különben lassabb lenne az adatbázis
+ mert egy betörő eltüntethetné a nyomait
- mert a napló titkosítva van
- mert a napló a WAL része
! A napló csak akkor ér valamit, ha megbízható.
```

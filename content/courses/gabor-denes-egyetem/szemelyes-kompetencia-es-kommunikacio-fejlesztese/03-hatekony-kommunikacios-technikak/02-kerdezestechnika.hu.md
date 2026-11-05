---
title: Kérdezéstechnika
summary: Nyitott és zárt kérdések, tölcsértechnika, a rávezető kérdés csapdája és az „5 miért” módszer a probléma gyökerének megtalálására.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- a **nyitott** és a **zárt** kérdések szerepét,
- a **tölcsértechnikát**,
- miért kerüld a **rávezető** kérdéseket,
- hogyan használd az **„5 miért”** módszert.

## Nyitott és zárt kérdések

| Típus       | Jellemző                        | Példa                                      | Mire jó?                        |
| ----------- | ------------------------------- | ------------------------------------------ | ------------------------------- |
| **nyitott** | hogyan, miért, mit, mesélj…     | „Hogyan használod most az alkalmazást?”    | információgyűjtés, ötletek      |
| **zárt**    | igen/nem, vagy egy konkrét adat | „Chrome-ot használsz?” „Hány felhasználó?” | pontosítás, megerősítés, döntés |

Egyik sem jobb a másiknál – a helyzettől függ, melyik kell.

## Tölcsértechnika

A beszélgetést **tágan** kezded, és fokozatosan **szűkíted**:

```text
nyitott   „Mesélj, mi történt, amikor a hiba jelentkezett?”
   ▼
pontosító „Melyik oldalon voltál? Mit csináltál előtte?”
   ▼
zárt      „Tehát a Mentés gomb megnyomása után jött a hibaüzenet?”
```

Így nem hagysz ki fontos részletet, és a végén biztosan érted a lényeget. Felhasználói interjúnál, hibabejelentésnél és követelmények gyűjtésénél is működik.

## Kerülendő kérdések

- **Rávezető (szuggesztív)**: „Ugye te is úgy gondolod, hogy a React a legjobb?” – a kérdés sugallja a választ.
- **Többszörös kérdés**: „Mikor jött a hiba, milyen böngészőben és mit csináltál előtte?” – a másik csak az egyikre fog válaszolni.
- **Vádló „miért”**: „Miért nem teszteltél?” – védekezést vált ki. Helyette: „Mi akadályozott a tesztelésben?”

## Az „5 miért” módszer

A Toyota termelési rendszeréből származó technika: a probléma **gyökeréig** jutsz, ha (nagyjából) ötször megkérdezed, hogy „miért?”.

```text
Probléma: az éles oldal 20 percig nem volt elérhető.
1. Miért?  Mert a szerver memóriája elfogyott.
2. Miért?  Mert az új funkció minden kéréskor betöltötte a teljes adatbázist.
3. Miért?  Mert a lekérdezésből kimaradt a lapozás.
4. Miért?  Mert a kódátnézésnél senki nem vette észre.
5. Miért?  Mert nincs teszt nagy adatmennyiségre, és nincs ellenőrzőlista az átnézéshez.
→ Megoldás: terheléses teszt + ellenőrzőlista, nem csak a lekérdezés javítása.
```

> Az „5 miért” a **folyamatot** vizsgálja, nem a bűnöst keresi. Ha a válasz „mert Peti figyelmetlen volt”, kérdezz tovább: mi tette lehetővé, hogy ez a hiba átcsússzon?

## Összefoglalás

- Nyitott kérdés: információt gyűjt; zárt kérdés: pontosít.
- Tölcsértechnika: tágról szűkre.
- Kerüld a rávezető, a többszörös és a vádló kérdéseket.
- Az „5 miért” a probléma gyökeréig vezet.

## A lecke feladata

```quiz required
? Melyik **nyitott** kérdés?
- „Működik a bejelentkezés?”
- „Hány hibát találtál?”
+ „Hogyan szoktad használni az alkalmazást munka közben?”
- „Firefoxot használsz?”
! Hogyan, miért, mit, mesélj…

? Melyik sorrend írja le a **tölcsértechnikát**?
+ nyitott → pontosító → zárt
- zárt → nyitott → zárt
- zárt → pontosító → nyitott
- csak nyitott kérdések
! Tágról szűkre.

? „Ugye te is úgy látod, hogy ez a megoldás jobb?” Milyen kérdés ez?
- nyitott
- tisztázó
+ rávezető (szuggesztív)
- tölcsér
! A kérdés sugallja a választ.

? Nagyjából hányszor kérdezünk rá a „miért”-re a róla elnevezett módszerben?
= 5
! Öt „miért” – a probléma gyökeréig.
```

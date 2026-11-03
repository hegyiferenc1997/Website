---
title: Eszközválasztás és bevezetés
summary: Az eszközválasztás szempontjai és a súlyozott értékelő mátrix, integrációk, egy Jira-szerű munkafolyamat és a jegyek (issue) felépítése, hibakövetés, valamint a bevezetés lépései a pilottól a betanításig.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- milyen **szempontok** szerint válassz projektmenedzsment eszközt,
- hogyan döntsd el a választást egy **súlyozott értékelő mátrixszal**,
- hogyan épül fel egy **munkafolyamat** (workflow) és egy **jegy** (issue),
- hogyan **vezess be** egy új eszközt úgy, hogy használják is.

## Választási szempontok

- **módszertan**: vízesés, agilis vagy hibrid (11. témakör) – Gantt kell, vagy sprinttábla, vagy mindkettő?
- **csapatméret és skálázhatóság**: 5 fő vagy 500? Több projekt, portfólió?
- **funkciók**: függőségek, erőforrások, időkövetés, riportok, automatizálás.
- **használhatóság**: mennyi idő megtanulni? Van mobilalkalmazás?
- **integrációk**: Git (GitHub, GitLab), CI/CD, csevegő (Slack, Teams), naptár, dokumentáció.
- **biztonság és megfelelés**: jogosultságok, egyszeri bejelentkezés (SSO), adattárolás helye, GDPR.
- **költség**: licencdíj, bevezetés, betanítás, üzemeltetés – a **teljes birtoklási költség** (TCO).

## Súlyozott értékelő mátrix

A szempontokhoz **súlyt** rendelünk (összegük 1), minden eszközt 1–5 pontra értékelünk, és a pontokat a súlyokkal szorozva összeadjuk:

| Szempont       | Súly | „A” eszköz | „B” eszköz |
| -------------- | ---- | ---------- | ---------- |
| funkciók       | 0,4  | 4 → 1,6    | 5 → 2,0    |
| használhatóság | 0,3  | 5 → 1,5    | 3 → 0,9    |
| költség        | 0,2  | 3 → 0,6    | 4 → 0,8    |
| integrációk    | 0,1  | 4 → 0,4    | 5 → 0,5    |
| **összesen**   | 1,0  | **4,1**    | **4,2**    |

A „B” eszköz kissé jobb – de a különbség kicsi, ezért érdemes egy **próbaidőszakkal** (pilot) is ellenőrizni. Ugyanezt a technikát a projektek rangsorolására is használtuk (4. témakör).

## Jegyek és munkafolyamatok

Az agilis eszközökben (Jira, GitHub, Azure DevOps) a munka egysége a **jegy** (issue, ticket). Jellemző típusai:

- **epic** – nagy, több sprintre kiterjedő egység (pl. „Fizetés”),
- **story** – felhasználói történet (8. témakör: „Felhasználóként szeretnék…”),
- **task** – technikai feladat,
- **bug** – hiba,
- **subtask** – egy jegy kisebb része.

Egy jegy fontos mezői: **cím**, **leírás**, **elfogadási kritériumok**, **felelős** (assignee), **prioritás**, **becslés** (story pont), **sprint**, **címkék**, **kapcsolatok** (blokkolja, függ tőle).

### Munkafolyamat (workflow)

A munkafolyamat a jegy **állapotait** és a köztük engedélyezett **átmeneteket** határozza meg:

```text
 ┌────────┐   elkezdve   ┌──────────────┐  PR kész   ┌──────────────┐  jóváhagyva  ┌──────┐
 │ Teendő │ ───────────▶ │ Folyamatban  │ ─────────▶ │ Kódellenőrzés│ ───────────▶ │ Kész │
 └────────┘              └──────────────┘            └──────────────┘              └──────┘
                                ▲                           │
                                └──────── javítás kell ─────┘
```

> A munkafolyamatba építhetünk **szabályokat**: pl. „Kész”-be csak akkor kerülhet a jegy, ha a tesztek zöldek és van jóváhagyott kódellenőrzés – ez a **Definition of Done** (14. témakör) gépesítése.

### Hibakövetés

Egy jó **hibajegy** tartalmazza: a reprodukálás **lépéseit**, az **elvárt** és a **tényleges** viselkedést, a környezetet (böngésző, verzió), képernyőképet vagy naplót, valamint a **súlyosságot** (kritikus, magas, közepes, alacsony). Ebből a hibalistából készülhet a **Pareto-diagram** (14. témakör).

## Integrációk és automatizálás

- **Git-integráció**: ha a commit üzenetében vagy a branch nevében szerepel a jegy azonosítója (pl. `WEB-42`), az eszköz a jegyhez kapcsolja a kódot.
- **automatizálás**: pl. „ha a PR összeolvadt, a jegy kerüljön Kész állapotba”, „ha egy kritikus hiba 24 óráig gazdátlan, értesítsd a vezetőt”.
- **értesítések** csevegőbe, **irányítópultok** a vezetőségnek.

## Az eszköz bevezetése

Egy új eszköz bevezetése maga is **változás** – az ADKAR-modell (14. témakör) itt is érvényes:

1. **igények felmérése**: mi fáj most? Kik fogják használni?
2. **kiválasztás**: súlyozott mátrix, ajánlatok, demók.
3. **pilot**: egy csapat, egy projekt, néhány hét – tapasztalatok gyűjtése.
4. **konfigurálás**: munkafolyamatok, mezők, jogosultságok, sablonok – **egyszerűen** kezdve.
5. **betanítás**: rövid képzés, útmutató, kulcsfelhasználók (nagykövetek).
6. **bevezetés és támogatás**: fokozatos kiterjesztés, kérdések gyors megválaszolása.
7. **megerősítés**: a riportok, megbeszélések már az új eszközből dolgoznak; a régi táblázatokat lezárjuk.

> Gyakori hiba a **túlkonfigurálás**: 15 állapot és 40 kötelező mező után senki sem frissíti a jegyeket, és az eszköz a valóság helyett a múltat mutatja.

## Összefoglalás

- Szempontok: módszertan, méret, funkciók, használhatóság, integrációk, biztonság, teljes költség.
- Súlyozott mátrix: Σ súly · pontszám; kis különbségnél pilot.
- Jegytípusok: epic, story, task, bug, subtask; munkafolyamat = állapotok + átmenetek + szabályok.
- Bevezetés: igény → kiválasztás → pilot → konfigurálás → betanítás → kiterjesztés → megerősítés.

## A lecke feladata

```quiz required
? Súlyok: funkciók 0,5, használhatóság 0,3, költség 0,2. Egy eszköz pontjai: 4, 2, 5. Mennyi a súlyozott pontszáma?
= 3,6
= 3.6
! 0,5 · 4 + 0,3 · 2 + 0,2 · 5 = 2 + 0,6 + 1.

? Melyik jegytípus egy nagy, több sprintre kiterjedő munkaegység?
+ epic
- bug
- subtask
- task
! Pl. „Fizetés” epic, benne több story.

? Mit határoz meg egy munkafolyamat (workflow)?
- a csapat fizetését
+ a jegy állapotait és a köztük engedélyezett átmeneteket
- a projekt költségvetését
- a kódtároló szerkezetét
! Állapotok + átmenetek (+ szabályok).

? Melyik **nem** kell egy jó hibajegybe?
- a reprodukálás lépései
- az elvárt és a tényleges viselkedés
- a környezet (böngésző, verzió)
+ a hibát okozó fejlesztő minősítése
! A hibajegy tényeket rögzít, nem hibást keres.

? Mi a pilot szerepe az eszköz bevezetésénél?
- az összes csapat egyszerre áll át
+ egy csapat egy projekten kipróbálja, mielőtt kiterjesztjük
- a régi eszköz megtartása örökre
- a licencek megvásárlása
! Kis kockázattal gyűjtünk tapasztalatot.
```

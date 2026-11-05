---
title: Záró feladatsor – egy projekt kommunikációja az elejétől a végéig
summary: A tárgy vegyes, záró feladatsora egy egyetemi projektcsapat történetén keresztül, a kommunikációs modelltől a tárgyaláson, a csapatmunkán és az időbeosztáson át az incidenskezelésig.
minutes: 40
kind: practice
---

## Ellenőrző kérdések a témakörhöz

<details>
<summary>1. Írj felhasználói történetet elfogadási feltételekkel egy kollégiumi mosógép-foglaló alkalmazáshoz!</summary>

„Mint kollégista, szeretném látni, mikor szabad a mosógép, és lefoglalni egy időpontot, hogy ne kelljen lemennem megnézni.” Elfogadási feltételek: a mai és a következő 6 nap idősávjai látszanak; egy idősávot csak egy ember foglalhat le; a foglalás lemondható; a foglalásról értesítés jön 15 perccel előtte.

</details>

<details>
<summary>2. Miért fontos, hogy egy leállás alatt akkor is frissítsd az állapotoldalt, ha nincs új információ?</summary>

Mert a felhasználók a csendet úgy értelmezik, hogy senki nem foglalkozik a problémával (Watzlawick: nem lehet nem kommunikálni). A „még dolgozunk rajta, következő frissítés 30 perc múlva” üzenet csökkenti a bizonytalanságot és a panaszokat.

</details>

<details>
<summary>3. Fogalmazz meg egy kódátnézési megjegyzést arról, hogy egy függvény túl hosszú (120 sor)!</summary>

„Ez a függvény most három dolgot csinál (beolvasás, ellenőrzés, mentés), és kb. 120 sor. Mit szólnál, ha három kisebb függvényre bontanánk? Úgy könnyebb lenne tesztelni és olvasni. (Nem blokkoló, ha most sürgős, mehet egy külön issue-ba.)”

</details>

<details>
<summary>4. A tárgy témakörei közül melyik három segít leginkább egy állásinterjún, és miért?</summary>

Például: a prezentáció és az előadástechnika (magabiztos bemutatkozás, STAR-módszer), a személyes márkaépítés (önéletrajz, GitHub, LinkedIn), és a hatékony kommunikációs technikák (aktív hallgatás, kérdezés, asszertivitás). De ugyanígy érvelhetsz a nonverbális kommunikáció vagy az önreflexió mellett is – a lényeg az indoklás.

</details>

## A tárgy záró feladatsora

> Egy négyfős hallgatói csapat (Anna, Bence, Csilla és Dávid) egy szezonális munkát közvetítő webes alkalmazást fejleszt egy kisvállalkozásnak, 10 hét alatt. Kövesd végig a projektet!

```quiz required
? Az első megbeszélésen a megrendelő azt mondja: „Legyen modern és egyszerű.” Csilla visszakérdez: „Mit jelent önnek a modern? Tudna mutatni egy oldalt, ami tetszik?” Melyik zajt próbálja csökkenteni, és melyik technikával?
- fizikai zajt, félbeszakítással
+ szemantikai zajt, tisztázó kérdéssel
- fiziológiai zajt, csenddel
- pszichológiai zajt, ítélkezéssel
! A „modern” mindenkinek mást jelent (1. és 3. témakör).

? Az első két hétben a csapat sokat vitatkozik a keretrendszerről. Tuckman modellje szerint melyik szakaszban vannak?
- alakulás
+ viharzás
- normaképzés
- működés
! Storming (11. témakör).

? Dávid folyton új ötletekkel áll elő, de semmit nem fejez be. Melyik Belbin-szerep jellemző rá?
+ ötletgazda
- befejező
- megvalósító
- koordinátor
! Plant (10. témakör).

? A megrendelő legfeljebb 800 ezer Ft-ot szánt a projektre, a csapat legalább 500 ezret szeretne. Hány ezer Ft széles a ZOPA?
= 300
! 800 − 500 = 300 (7. témakör).

? A megrendelő az ár megbeszélésekor azzal nyit, hogy „egy másik csapat 200 ezerért megcsinálná”. Mi ez tárgyalástechnikai szempontból?
- BATNA a csapat részéről
+ horgonyzás (és a megrendelő esetleges BATNA-jára való hivatkozás)
- objektív kritérium
- ZOPA
! Az első szám kijelöli a kiindulópontot (7. témakör).

? Hány kétszemélyes kommunikációs csatorna van a 4 fős csapatban?
= 6
! 4 · 3 / 2 = 6 (11. témakör).

? Bence egy kódátnézésben ezt írja Annának: „Ez a kód borzalmas, nem tudsz programozni.” Mi a fő probléma?
- túl rövid
+ a személyt támadja a kód helyett (te-üzenet, személyeskedés)
- túl udvarias
- nem angolul írta
! A kódról, konkrétan, indokolva (3., 5. és 18. témakör).

? Csilla SBI-visszajelzést ad Bencének. Melyik a jó?
- „Bence, te mindig bántó vagy.”
+ „A tegnapi kódátnézésben (S) azt írtad Annának, hogy nem tud programozni (B); utána nem szólt a megbeszélésen (I). Beszéljünk arról, hogyan írjunk megjegyzéseket.”
- „Jó munka, Bence!”
- „Valami nem stimmel veled.”
! Helyzet, viselkedés, hatás (10. témakör).

? A csapat a 6. héten észreveszi, hogy nem fog elkészülni a teljes funkciókészlettel. Mit tegyenek?
- hallgassanak az utolsó napig
+ időben szóljanak a megrendelőnek, és ajánljanak lehetőségeket (pl. egy funkció későbbre halasztását)
- adjanak hozzá két új csapattagot a 9. héten
- titokban hagyjanak ki funkciókat
! Korai jelzés + lehetőségek; Brooks törvénye (11. és 18. témakör).

? Anna 8 pomodorót tervez a fizetési modulra. Hány perc munka ez (szünetek nélkül)?
= 200
! 8 · 25 = 200 perc (14. témakör).

? Az átadás napján a bejelentkezés 14:05 és 14:50 között nem működik. Melyik a jó üzenet a megrendelőnek 14:10-kor?
- nem írnak semmit, amíg nincs megoldás
+ „Tudunk róla, hogy a bejelentkezés most nem működik, vizsgáljuk az okát; 14:30-kor frissítünk.”
- „Biztosan a szerverük hibája.”
- „Bence rontotta el.”
! Korai, őszinte, konkrét, következő frissítés időponttal (18. témakör).

? Hány percig tartott a bejelentkezési hiba?
= 45
! 14:50 − 14:05 = 45 perc.

? A projekt után a csapat leül, és megbeszéli, mi ment jól, mi nem, és mit csinálnának másképp. Mi ez?
- sprinttervezés
+ retrospektív (és egyben hibáztatásmentes visszatekintés)
- napi standup
- tárgyalás
! 11. és 18. témakör.

? Anna utána tanulási naplójában Gibbs ciklusával feldolgozza az átadás napját. Melyik lépésben írja le, hogy „legközelebb az átadás előtt egy nappal befagyasztjuk a kódot”?
- leírás
- érzések
- elemzés
+ cselekvési terv
! 16. témakör.

? Bence a projektet a portfóliójába teszi. Melyik a jó leírás?
- „Egyedül fejlesztettem egy teljes webes alkalmazást.”
+ „Négyfős csapatban a backendért és az adatbázisért feleltem; a projektet 10 hét alatt adtuk át egy kisvállalkozásnak.”
- „Részt vettem valamiben.”
- nem írja bele, mert csapatmunka volt
! Pontosan a saját része (12. témakör).
```

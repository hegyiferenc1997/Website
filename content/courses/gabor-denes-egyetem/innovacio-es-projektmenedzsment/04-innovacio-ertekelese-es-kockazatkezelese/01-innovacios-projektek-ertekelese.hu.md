---
title: Innovációs projektek értékelése
summary: Hogyan válasszuk ki, melyik ötletbe érdemes pénzt és időt fektetni? Súlyozott pontozás, megtérülési idő, ROI, nettó jelenérték és a Stage-Gate döntési kapui.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- milyen **szempontok** szerint értékelünk egy innovációs ötletet,
- hogyan készíts **súlyozott pontozó** táblát,
- hogyan számold ki a **megtérülési időt**, a **ROI**-t és a **nettó jelenértéket** (NPV),
- hogyan működik a **Stage-Gate** folyamat.

## Miért kell értékelni?

Egy cégnek mindig **több ötlete van, mint pénze**. Az értékelés célja, hogy a korlátozott erőforrást a **legnagyobb várható hasznot** hozó, a stratégiához illő projektekre fordítsuk, és időben leállítsuk a reménytelen ötleteket.

Tipikus szempontok:

- **stratégiai illeszkedés** – támogatja-e a cég céljait?
- **piaci vonzerő** – mekkora a piac, mennyire égető a vevő problémája?
- **műszaki megvalósíthatóság** – mennyire érett a technológia (TRL, 2. témakör)?
- **pénzügyi megtérülés** – mennyit hoz, és mikor?
- **kockázat** – mi történik, ha nem sikerül?

## Súlyozott pontozás

Minden szempont kap egy **súlyt** (összegük 1, azaz 100%), az ötletek pedig minden szempontra egy **pontszámot** (pl. 1–5). Az összpontszám a súlyozott összeg:

| Szempont               | Súly | A ötlet | B ötlet |
| ---------------------- | ---- | ------- | ------- |
| stratégiai illeszkedés | 0,4  | 4       | 3       |
| piaci vonzerő          | 0,3  | 3       | 5       |
| megvalósíthatóság      | 0,3  | 5       | 2       |
| **összesen**           | 1,0  | **4,0** | **3,3** |

A ötlet: 0,4·4 + 0,3·3 + 0,3·5 = 1,6 + 0,9 + 1,5 = **4,0**. B ötlet: 1,2 + 1,5 + 0,6 = **3,3**. Az A ötlet a jobb.

## Pénzügyi mutatók

### Megtérülési idő (payback period)

Mennyi idő alatt hozza vissza a projekt a befektetett összeget?

> **Megtérülési idő = befektetés / éves nettó pénzbeáramlás** (egyenletes beáramlásnál)

Példa: 12 millió Ft befektetés, évi 4 millió Ft megtakarítás → **3 év**. Egyszerű, de nem veszi figyelembe a pénz időértékét és a megtérülés utáni hasznot.

### Megtérülési ráta (ROI)

> **ROI = (hozam − befektetés) / befektetés · 100%**

Példa: 10 millió Ft befektetés 15 millió Ft hozamot ad → ROI = (15 − 10) / 10 = **50%**.

### Nettó jelenérték (NPV)

A ma kapott 1 forint többet ér, mint az egy év múlva kapott (kamatozhat, és van kockázat). Ezért a jövőbeli pénzáramokat **diszkontáljuk** (leszámítoljuk) egy **r** kamatlábbal:

> **NPV = −C₀ + CF₁/(1+r) + CF₂/(1+r)² + … + CFₙ/(1+r)ⁿ**

ahol C₀ a kezdő befektetés, CFₜ a t-edik év pénzárama.

Példa: 1000 egység befektetés, három évig évi 500 egység beáramlás, r = 10%:

| Év  | Pénzáram | Diszkonttényező 1/(1,1)ᵗ | Jelenérték |
| --- | -------- | ------------------------ | ---------- |
| 0   | −1000    | 1                        | −1000      |
| 1   | 500      | 0,909                    | 454,5      |
| 2   | 500      | 0,826                    | 413,2      |
| 3   | 500      | 0,751                    | 375,7      |
|     |          | **NPV**                  | **≈ 243**  |

**Döntési szabály**: ha **NPV > 0**, a projekt a megadott kamatláb mellett megéri. A **belső megtérülési ráta** (IRR) az a kamatláb, amelynél az NPV éppen 0.

> Radikális innovációknál a pénzáramok nagyon bizonytalanok, ezért a pénzügyi mutatókat mindig **forgatókönyvekkel** (optimista, várható, pesszimista) és nem pénzügyi szempontokkal együtt használjuk.

## A Stage-Gate folyamat

**Robert G. Cooper** modelljében a fejlesztés **szakaszokra** (_stage_) bomlik, a szakaszok között **döntési kapuk** (_gate_) vannak. Minden kapunál egy döntőbizottság dönt: **tovább** (_go_), **leállít** (_kill_), **felfüggeszt** (_hold_) vagy **átdolgoz** (_recycle_).

```text
 ötlet → [K1] → 1. előzetes vizsgálat → [K2] → 2. üzleti eset → [K3]
       → 3. fejlesztés → [K4] → 4. tesztelés → [K5] → 5. bevezetés
```

Előnye, hogy a drága szakaszok előtt kiszűri a gyenge ötleteket; minél később állítunk le egy projektet, annál több pénz veszett el.

## Összefoglalás

- Értékelési szempontok: stratégia, piac, megvalósíthatóság, pénzügy, kockázat.
- Súlyozott pontozás: Σ súly · pontszám.
- Megtérülési idő = befektetés / éves beáramlás; ROI = (hozam − befektetés) / befektetés.
- NPV: diszkontált pénzáramok összege mínusz befektetés; NPV > 0 → megéri.
- Stage-Gate: szakaszok és döntési kapuk (go / kill / hold / recycle).

## A lecke feladata

```quiz required
? Egy projekt 8 millió Ft-ba kerül, és évi 2 millió Ft megtakarítást hoz. Hány év a megtérülési idő?
= 4
= 4 év
! 8 / 2.

? Egy 20 millió Ft-os befektetés 26 millió Ft hozamot ad. Hány százalék a ROI?
= 30
= 30%
! (26 − 20) / 20 · 100.

? Súlyok: 0,5 / 0,3 / 0,2. Egy ötlet pontjai rendre 4 / 2 / 5. Mennyi a súlyozott összpontszám?
= 3,6
= 3.6
! 0,5·4 + 0,3·2 + 0,2·5 = 2 + 0,6 + 1.

? 10%-os kamatláb mellett mennyi a jelenértéke az **egy év múlva** kapott 1100 egységnek?
= 1000
! 1100 / 1,1.

? Mit jelent, ha egy projekt NPV-je **negatív**?
- biztosan nagy nyereséget hoz
+ a megadott kamatláb mellett nem éri meg, kevesebbet hoz, mint egy azonos kockázatú alternatíva
- a megtérülési ideje nulla
- a ROI-ja végtelen
! NPV < 0 → a diszkontált hozam kisebb a befektetésnél.

? A Stage-Gate modellben mi történik egy **kapunál**?
- a csapat programot ír
+ egy döntőbizottság dönt a folytatásról (go / kill / hold / recycle)
- a terméket eladják
- a projektet automatikusan lezárják
! A kapuk a szakaszok közötti döntési pontok.
```

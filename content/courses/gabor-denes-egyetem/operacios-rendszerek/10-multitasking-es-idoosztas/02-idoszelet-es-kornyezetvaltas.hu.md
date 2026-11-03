---
title: Időszelet és környezetváltás
summary: Az időzítő megszakítás, a környezetváltás lépései és költsége, a kvantum megválasztása számolós példákkal.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan biztosítja az **időzítő** az időosztást,
- mi történik egy **környezetváltásnál**, és mennyibe kerül,
- hogyan hat a **kvantum** (időszelet) mérete a hatékonyságra és a válaszidőre.

## Az időzítő

A processzor mellett egy hardveres **időzítő** (_timer_) rendszeresen – például 4 ms-onként – **megszakítást** kér. A kernel ilyenkor megnézi, lejárt-e a futó folyamat időszelete, és ha igen, meghívja az ütemezőt. Linuxon az alapütem a `HZ` érték (pl. 250 Hz → 4 ms); a modern kernelek tétlenségkor „csendben” is tudnak maradni (_tickless_), ami laptopon akkut spórol.

## A környezetváltás

A **környezetváltás** (_context switch_) az egyik folyamat (szál) leállítása és egy másik elindítása:

1. a futó folyamat **regisztereit** (programszámláló, veremmutató, általános regiszterek) a kernel elmenti a **PCB**-be,
2. a folyamat állapotát átállítja (**kész** vagy **várakozó**),
3. az ütemező kiválasztja a következőt,
4. betölti annak a regisztereit, és – ha másik folyamatról van szó – átállítja a **memóriatérképet** (laptábla),
5. visszavált felhasználói módba, és a folyamat ott folytatja, ahol abbahagyta.

### A költség

A közvetlen költség néhány mikroszekundum, de van **rejtett költség** is: az új folyamat adatai nincsenek a **gyorsítótárban** és a **TLB**-ben, ezért az első pillanatokban lassabban fut. Szálak közötti váltás (ugyanabban a folyamatban) olcsóbb, mert a címtér marad.

## A kvantum megválasztása

Jelölje **q** a kvantumot és **s** egy környezetváltás idejét. Ha minden folyamat végigfuttatja a kvantumát:

- **hatékonyság** = q / (q + s) – a CPU-idő mekkora része megy hasznos munkára,
- **rezsi** (_overhead_) = s / (q + s).

Példa: q = 10 ms, s = 1 ms → hatékonyság 10 / 11 ≈ **91%**, rezsi ≈ **9%**.

A válaszidőre is hat: ha **n** folyamat váltakozik, egy folyamat két futása között legfeljebb **(n − 1) · q** idő telik el (a váltásokat elhanyagolva). 5 folyamatnál és 20 ms-os kvantumnál ez 4 · 20 = **80 ms** – még nem zavaró.

| Kvantum       | Hatás                                                         |
| ------------- | ------------------------------------------------------------- |
| **túl kicsi** | sok váltás, nagy rezsi, a CPU „csak váltogat”                  |
| **túl nagy**  | lassú reagálás, a rendszer FCFS-szerűvé válik                 |
| **jó**        | a CPU-löketek ~80%-a belefér egy kvantumba; tipikusan 1–100 ms |

## Nézd meg a gyakorlatban

```bash
vmstat 1 5                                  # cs oszlop: környezetváltások másodpercenként
grep ctxt_switches /proc/$$/status          # a shelled önkéntes és kényszerített váltásai
```

Az **önkéntes** váltás akkor történik, amikor a folyamat maga vár (I/O); a **kényszerített** (_nonvoluntary_), amikor lejárt az időszelete.

## Összefoglalás

- Az időzítő rendszeres megszakítása adja vissza a vezérlést az ütemezőnek.
- Környezetváltás: regiszterek mentése a PCB-be, új folyamat betöltése, memóriatérkép váltása; rejtett költsége a hideg cache és TLB.
- Hatékonyság = q / (q + s); a legnagyobb várakozás két futás között (n − 1) · q.

## A lecke feladata

```quiz required
? A kvantum 4 ms, egy környezetváltás 1 ms. Hány százalék a rezsi?
= 20
= 20%
! s / (q + s) = 1 / 5 = 20%.

? A kvantum 9 ms, egy környezetváltás 1 ms. Hány százalék a hatékonyság?
= 90
= 90%
! q / (q + s) = 9 / 10 = 90%.

? 6 folyamat váltakozik Round Robinnal, q = 10 ms. Legfeljebb hány ms telik el egy folyamat két futása között (a váltásokat elhanyagolva)?
= 50
! (n − 1) · q = 5 · 10 = 50 ms.

? Hová menti a kernel a futó folyamat regisztereit környezetváltáskor?
+ a folyamat PCB-jébe
- a lemezre, a lapozófájlba
- a TLB-be
- a felhasználó saját mappájába
! Process Control Block.

? Miért olcsóbb a váltás két szál között ugyanabban a folyamatban?
+ Mert a címtér (laptábla) marad, nem kell memóriatérképet váltani.
- Mert a szálaknak nincsenek regiszterei.
- Mert a szálak nem használják a CPU-t.
- Mert a szálakat a BIOS ütemezi.
! A cache és a TLB tartalma is részben hasznos marad.
```

---
title: Analóg és digitális információ
summary: Mi az információ, miben különbözik az analóg és a digitális jel, és miért nyert a digitális technika?
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mit jelent az **információ**, a **jel** és a **zaj**,
- mi a különbség az **analóg**, a **diszkrét idejű**, a **diszkrét amplitúdójú** és a **digitális** jel között,
- miért **zajtűrő** a digitális jel, és miért erre épül minden számítógép.

## Információ és jel

**Információ** minden olyan ismeret, tény vagy adat, amely értelmezhető és feldolgozható. A digitális technikában az információt **jelek** hordozzák: legtöbbször **feszültség**, ritkábban áram, fény (optikai kábel) vagy rádióhullám.

A jelet két tengely mentén vizsgáljuk:

- **idő** – minden pillanatban van-e értéke, vagy csak bizonyos időpontokban?
- **amplitúdó** (érték) – bármilyen értéket felvehet, vagy csak néhány kijelölt szintet?

## A négy jeltípus

| Jel                    | Idő          | Amplitúdó    | Példa                                         |
| ---------------------- | ------------ | ------------ | --------------------------------------------- |
| analóg (folytonos)     | folytonos    | folytonos    | mikrofon feszültsége, hőmérő                  |
| diszkrét idejű         | diszkrét     | folytonos    | óránként leolvasott hőmérséklet (tizedesekkel) |
| diszkrét amplitúdójú   | folytonos    | diszkrét     | lépcsős jel, pl. egy kapcsoló állásai          |
| **digitális**          | **diszkrét** | **diszkrét** | a számítógép bitjei, egy hangfájl mintái       |

- **Analóg** információ: a jel értéke folytonosan változhat, végtelen sok érték között (hangerő, hőmérséklet).
- **Digitális** információ: a jel csak meghatározott, **véges számú szintet** vehet fel – a kettes (bináris) rendszerben kettőt: **0** és **1** (LOW és HIGH).

> Egy analóg jelből két lépésben lesz digitális: **mintavételezés** (időben diszkrét lesz) és **kvantálás** (amplitúdóban diszkrét lesz). Ezt az A/D átalakítóknál (8. témakör) részletesen tárgyaljuk.

## A zaj

**Zaj** minden kéretlen, zavaró elektromos vagy elektromágneses jel, amely rárakódik a hasznos jelre, de nem hordoz információt. Lehet

- **külső** eredetű: villámlás, más készülékek zavarása, kozmikus sugárzás,
- **belső** eredetű: a vezetőben lévő elektronok hő okozta véletlenszerű mozgása (termikus zaj).

A jel minőségének legfontosabb mérőszáma a **jel-zaj viszony** (SNR, *Signal-to-Noise Ratio*): a hasznos jel és a zaj teljesítményének aránya, decibelben megadva. **Nagyobb SNR = jobb minőség.**

## Miért zajtűrő a digitális jel?

Analóg rendszerben a legkisebb zaj is **véglegesen** megváltoztatja a jel értékét (serceg a rádió, és ezt utólag nem lehet tökéletesen kiszűrni).

A digitális vevőnek viszont csak azt kell eldöntenie, hogy a beérkező feszültség **0-nak vagy 1-nek** felel-e meg. Amíg a zaj nem lépi át a döntési küszöböt, az információ **100%-osan, hibátlanul visszaállítható**. Ha mégis bithiba történik, **hibajelző és hibajavító kódok** (paritás, Hamming-kód, CRC – lásd 2. témakör) segítenek.

```text
 analóg:   zajos jel → zajos eredmény (a zaj megmarad)
 digitális: zajos jel → küszöb → tiszta 0/1 (a zaj eltűnik)
```

## A digitális technika további előnyei

- **Másolás veszteség nélkül** – a bitek ezredik másolata is ugyanolyan, mint az eredeti.
- **Egyszerű, olcsó építőelemek** – egy kapcsolónak (tranzisztornak) csak két állapotot kell biztosan megkülönböztetnie.
- **Programozhatóság** – ugyanaz a hardver más-más programmal más feladatot végez.
- **Tárolás és tömörítés** – az adatok számokként tárolhatók, kódolhatók, titkosíthatók.

A digitális technika **hátránya**, hogy a valós világ analóg: az érzékelők jeleit digitalizálni, a hangszóró, motor jeleit pedig visszaalakítani kell.

## Összefoglalás

- A jel lehet folytonos vagy diszkrét **időben** és **amplitúdóban**; a digitális jel mindkettőben diszkrét.
- A bináris digitális jel két szintet ismer: 0 és 1.
- A digitális jel zajtűrő: a küszöb alatti zaj nem változtatja meg az információt.
- A jel minőségét a jel-zaj viszony (SNR, dB) jellemzi.

## A lecke feladata

```quiz required
? Melyik jel **diszkrét időben és diszkrét amplitúdóban** is?
- a mikrofon kimeneti feszültsége
- óránként tizedes pontossággal leolvasott hőmérséklet
+ egy hangfájl egész számként tárolt mintái
- egy fényerő-szabályzó (potméter) feszültsége
! Digitális jel: csak bizonyos időpontokban van értéke, és csak véges sok értéket vehet fel.

? Hány különböző szintet ismer egy **bináris** digitális jel?
= 2
= kettő
! A „bináris” a kettes számrendszerre utal: 0 és 1.

? Mi a jel-zaj viszony szokásos rövidítése (angolul)?
= SNR
! Signal-to-Noise Ratio.

? Melyik állítás igaz?
- Az analóg jel zaja utólag mindig tökéletesen kiszűrhető.
+ A digitális jel a döntési küszöb alatti zaj esetén hibátlanul visszaállítható.
- A digitális jelet nem zavarhatja zaj.
- Minél kisebb az SNR, annál jobb a jel minősége.
! A digitális jelre is rakódik zaj, de amíg nem lépi át a küszöböt, a 0/1 döntés helyes marad.
```

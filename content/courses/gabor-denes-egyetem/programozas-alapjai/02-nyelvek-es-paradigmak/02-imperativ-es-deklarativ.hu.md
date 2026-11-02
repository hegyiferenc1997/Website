---
title: Imperatív és deklaratív nyelvek
summary: „Hogyan csináld” kontra „mit szeretnék” – a két alapvető szemléletmód összehasonlítása.
minutes: 12
---

## Amit ebben a leckében megtanulsz

- mit jelent az **imperatív** és a **deklaratív** programozás,
- mi az a **program állapota** és a **mellékhatás**,
- hogyan jelenik meg a két szemlélet Pythonban és SQL-ben.

## Imperatív: hogyan?

Az **imperatív** (parancsoló) programozásban lépésről lépésre megmondjuk a gépnek, mit tegyen. A program **állapotát** (a változók értékeit) utasításokkal folyamatosan módosítjuk.

```python run
# Imperatív: keressük meg a 18 évnél idősebbek nevét.
emberek = [("Anna", 21), ("Béla", 17), ("Csilla", 19)]
felnottek = []
for nev, kor in emberek:
    if kor >= 18:
        felnottek.append(nev)   # az állapot (a lista) lépésenként változik
print(felnottek)
```

A **procedurális** programozás az imperatív stílus rendezett formája: a kódot **eljárásokba (függvényekbe)** szervezzük, amelyeket többször meghívhatunk.

## Deklaratív: mit?

A **deklaratív** programozásban azt írjuk le, _mit_ szeretnénk megkapni, a „hogyan”-t a nyelvre vagy a rendszerre bízzuk.

```sql
-- SQL: nem mondjuk meg, hogyan keressen, csak azt, mit kérünk.
SELECT nev FROM emberek WHERE kor >= 18;
```

Pythonban a **listaértelmezés** (list comprehension) deklaratív jellegű:

```python run
emberek = [("Anna", 21), ("Béla", 17), ("Csilla", 19)]
# „Azok a nevek, ahol a kor legalább 18.”
felnottek = [nev for nev, kor in emberek if kor >= 18]
print(felnottek)
```

## Összehasonlítás

| Szempont     | Imperatív                                   | Deklaratív                                   |
| ------------ | ------------------------------------------- | -------------------------------------------- |
| mit írunk le | a lépéseket                                 | a kívánt eredményt                           |
| állapot      | változók folyamatos módosítása              | lehetőleg nincs módosítható állapot          |
| példák       | C, Pascal, Python ciklusokkal               | SQL, HTML, Prolog, Python comprehension      |
| előny        | teljes kontroll, könnyű követni lépésenként | rövidebb, kevesebb hibalehetőség             |
| hátrány      | hosszabb, könnyebb elrontani az állapotot   | a „motorháztető alatti” működés rejtve marad |

## Mellékhatás

**Mellékhatás** az, amikor egy utasítás a visszaadott értéken túl mást is megváltoztat: kiír valamit, módosít egy változót, fájlba ír. Az imperatív programok tele vannak mellékhatásokkal; a deklaratív és funkcionális stílus igyekszik ezeket minimalizálni, mert a mellékhatás nélküli kód könnyebben tesztelhető és érthető.

## Összefoglalás

- **Imperatív:** lépésenként módosítjuk az állapotot (a procedurális ennek függvényekre bontott formája).
- **Deklaratív:** a kívánt eredményt írjuk le (SQL, HTML, listaértelmezés).
- A **mellékhatások** csökkentése megbízhatóbb kódot eredményez.

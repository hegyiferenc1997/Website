---
title: A folyamat fogalma és állapotai
summary: Program kontra folyamat, a címtér részei, a PCB és az öt állapotú modell.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **program** és a **folyamat** között,
- milyen részekből áll egy folyamat **címtere**, és mit tárol a **PCB**,
- milyen **állapotokban** lehet egy folyamat, és mi váltja ki az átmeneteket.

## Program és folyamat

- A **program** egy **passzív** fájl a lemezen (pl. `/usr/bin/python3` vagy `notepad.exe`): utasítások és adatok.
- A **folyamat** (_process_) egy **futó** program **példánya**: van saját memóriája, regiszterállapota, megnyitott fájljai, és az OS egy egyedi azonosítót, **PID**-et ad neki.

Ugyanabból a programból több folyamat is futhat: ha három Jegyzettömböt nyitsz, az három folyamat ugyanabból a `notepad.exe`-ből.

## A folyamat címtere

Minden folyamat saját **címteret** (memóriaterületet) lát, mintha egyedül lenne a gépen:

```text
magas cím ┌──────────────────────┐
          │ verem (stack)        │ ← függvényhívások, helyi változók; lefelé nő
          │          ↓           │
          │                      │
          │          ↑           │
          │ kupac (heap)         │ ← dinamikus foglalás (malloc, new, Python objektumok); felfelé nő
          ├──────────────────────┤
          │ adat (data, bss)     │ ← globális és statikus változók
          ├──────────────────────┤
          │ kód (text)           │ ← a program utasításai, csak olvasható
alacsony  └──────────────────────┘
```

## A folyamatvezérlő blokk (PCB)

A **PCB** (_Process Control Block_) az a kernelbeli adatszerkezet, amelyben az OS **mindent nyilvántart** egy folyamatról:

| Mező             | Példa                                   |
| ---------------- | --------------------------------------- |
| azonosítók       | PID, a szülő PID-je (PPID), felhasználó |
| állapot          | futó, futásra kész, várakozó            |
| regiszterek      | programszámláló, veremmutató …          |
| ütemezési adatok | prioritás, eddig felhasznált CPU-idő    |
| memória          | a laptábla helye, a címtér határai      |
| erőforrások      | megnyitott fájlok, hálózati kapcsolatok |

Linuxon a PCB neve `task_struct`. Egy folyamat adatai a `/proc/<PID>/` mappában is látszanak:

```bash
echo $$                   # a saját shelled PID-je
cat /proc/$$/status | head -10
```

## Az öt állapotú modell

```text
           felvétel            ütemező kiválasztja
   ÚJ ──────────────► KÉSZ ──────────────────────► FUT ──────► BEFEJEZETT
                       ▲  ◄──────────────────────   │   kilépés
                       │   időszelet lejárt         │
                       │                            │ I/O-ra vagy eseményre vár
                       └──────── VÁRAKOZIK ◄────────┘
                         I/O kész / esemény bekövetkezett
```

- **Új** (_new_): most jön létre.
- **Kész / futásra kész** (_ready_): minden megvan, csak processzorra vár.
- **Fut** (_running_): éppen a CPU-n van. Egy magon egyszerre csak **egy** folyamat futhat.
- **Várakozik / blokkolt** (_waiting, blocked_): valamire vár (lemez, billentyű, hálózat) – processzort hiába kapna.
- **Befejezett** (_terminated_): lefutott, az OS felszabadítja az erőforrásait.

Fontos: a várakozó folyamat az esemény után **nem** közvetlenül fut tovább, hanem a **kész** sorba kerül.

## Összefoglalás

- A program passzív fájl, a folyamat a futó példánya saját PID-del és címtérrel.
- A címtér részei: kód, adat, kupac, verem.
- A PCB tárolja a folyamat állapotát, regisztereit, ütemezési és memóriaadatait.
- Állapotok: új, kész, fut, várakozik, befejezett.

## A lecke feladata

```quiz required
? Hogy hívjuk a futó program egy példányát?
= folyamat
= processz
= process
! A program a lemezen lévő passzív fájl.

? A címtér melyik részén vannak a függvények helyi változói?
+ verem (stack)
- kupac (heap)
- kód (text)
- adat (data)
! A verem a függvényhívásokkal nő és csökken.

? Mi a PCB rövidítés feloldása?
- Program Code Buffer
+ Process Control Block
- Processor Cache Bank
- Primary Control Bus
! A kernel ebben tartja nyilván a folyamat adatait.

? Egy folyamat befejezte a lemezolvasásra való várakozást. Melyik állapotba kerül?
- fut
+ kész (futásra kész)
- új
- befejezett
! Az ütemező majd később választja ki futásra.

? Egy 4 magos processzoron legfeljebb hány folyamat lehet egyszerre „fut” állapotban?
= 4
! Magonként egy.
```

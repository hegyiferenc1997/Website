---
title: Virtuális memória és lapcsere
summary: Igény szerinti lapozás, a laphiba lépései, lapcsere-algoritmusok (FIFO, LRU, optimális), a Bélády-anomália és a vergődés.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi a **virtuális memória** és az **igény szerinti lapozás**,
- mi történik egy **laphibánál**,
- hogyan működik a **FIFO**, az **LRU** és az **optimális** lapcsere, és mi a **vergődés**.

## Virtuális memória

A **virtuális memória** lehetővé teszi, hogy egy program **nagyobb** legyen, mint a szabad fizikai memória: csak a ténylegesen használt lapjai vannak a RAM-ban, a többi a lemezen, a **lapozófájlban** (Linux: _swap_ partíció vagy fájl, Windows: `pagefile.sys`).

Az **igény szerinti lapozás** (_demand paging_): egy lapot csak akkor töltünk be, amikor a program **először hivatkozik rá**. Ezért indul gyorsan egy nagy program is.

## A laphiba

Ha a program olyan lapra hivatkozik, amely nincs a memóriában (a laptáblában **érvénytelen**), az MMU **laphibát** (_page fault_) jelez:

1. A kernel ellenőrzi, hogy a hivatkozás jogos-e (ha nem: a folyamat leáll, pl. _Segmentation fault_).
2. Keres egy **szabad keretet**; ha nincs, egy **áldozat** lapot választ (lapcsere), és ha az módosult („piszkos”), kiírja a lemezre.
3. Beolvassa a kért lapot a lemezről a keretbe.
4. Frissíti a laptáblát (érvényes bit = 1).
5. **Újra végrehajtja** az utasítást, amely a hibát okozta.

A laphiba **drága**: egy lemezművelet ezerszer–milliószor lassabb egy memória-hozzáférésnél.

## Lapcsere-algoritmusok

Példa hivatkozási sorozat, **3 kerettel**: `7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2`

| Algoritmus   | Melyik lapot cseréli?                                      | Laphibák a példában |
| ------------ | ---------------------------------------------------------- | ------------------- |
| **FIFO**     | a **legrégebben betöltöttet**                              | 10                  |
| **LRU**      | a **legrégebben használtat** (_Least Recently Used_)       | 9                   |
| **optimális** (OPT) | azt, amelyikre **a legkésőbb** lesz szükség        | 7                   |

Az **optimális** algoritmus a legjobb, de a jövőt nem ismerjük, ezért csak **összehasonlítási alap**. Az **LRU** jól közelíti, a valódi rendszerek ennek olcsó közelítéseit használják (pl. **óra** / _second chance_ algoritmus a „használt” bittel).

Futtasd a szimulációt, és nézd meg lépésenként a kereteket!

```python run
# Lapcsere-algoritmusok összevetése: hány laphiba lesz FIFO és LRU stratégiával?
def fifo(hivatkozasok, keretszam):
    keretek, hibak = [], 0
    for lap in hivatkozasok:
        if lap not in keretek:
            hibak += 1
            if len(keretek) == keretszam:
                keretek.pop(0)          # a legrégebben betöltött lap megy ki
            keretek.append(lap)
        print(f"{lap}: {keretek}")
    return hibak

def lru(hivatkozasok, keretszam):
    keretek, hibak = [], 0          # a lista eleje a legrégebben használt lap
    for lap in hivatkozasok:
        if lap in keretek:
            keretek.remove(lap)         # most használtuk: a lista végére kerül
        else:
            hibak += 1
            if len(keretek) == keretszam:
                keretek.pop(0)          # a legrégebben használt lap megy ki
        keretek.append(lap)
    return hibak

hivatkozasok = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]
print("FIFO laphibák:", fifo(hivatkozasok, 3))
print("LRU laphibák:", lru(hivatkozasok, 3))
```

### A Bélády-anomália

Azt várnánk, hogy több keret = kevesebb laphiba. A **FIFO**-nál ez nem mindig igaz! Az `1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5` sorozatnál 3 kerettel **9**, 4 kerettel **10** laphiba lesz. Ezt **Bélády László** magyar származású informatikus írta le 1969-ben. Az LRU-nál és az OPT-nál ilyen anomália nem fordul elő.

## Vergődés (thrashing)

Ha túl sok folyamat fut túl kevés memóriával, mindegyik folyamatosan laphibázik: a rendszer szinte csak lapoz, a CPU-kihasználtság **leesik**, a gép „megáll”, a lemez folyamatosan dolgozik. Ez a **vergődés**.

Megoldás: a **munkahalmaz** (_working set_) – amennyi lapot egy folyamat éppen aktívan használ – biztosítása; ha nem fér el mindenki, néhány folyamatot fel kell függeszteni. A felhasználó oldaláról: kevesebb program egyszerre, vagy több RAM.

```bash
free -h          # Swap sor: mennyi lapozóterület van és mennyi használt
vmstat 1 5       # si/so oszlop: be- és kilapozás másodpercenként
```

## Összefoglalás

- Virtuális memória: csak a használt lapok vannak a RAM-ban, a többi a lapozófájlban.
- Laphiba: a kernel betölti a lapot (szükség esetén lapcserével), és újra végrehajtja az utasítást.
- FIFO, LRU, OPT: a példában 10, 9, 7 laphiba; FIFO-nál felléphet a Bélády-anomália.
- Vergődés: túl kevés memória → folyamatos lapozás → a rendszer szinte megáll.

## A lecke feladata

Hivatkozási sorozat **3 kerettel**, kezdetben üres keretekkel: `1, 2, 3, 1, 4, 1, 2, 5, 1, 2`

```quiz required
? Hány laphiba lesz FIFO lapcserével?
= 7
! 1, 2, 3 (3 hiba), 1 talál, 4 kiteszi az 1-et, 1 kiteszi a 2-t, 2 kiteszi a 3-at, 5 kiteszi a 4-et, 1 és 2 talál → 7.

? Hány laphiba lesz LRU lapcserével?
= 6
! 1, 2, 3, 4 (a 2 megy), 2 (a 3 megy), 5 (a 4 megy); a többi talál → 6.

? Hány laphiba lesz az optimális algoritmussal?
= 5
! 1, 2, 3, 4 (a 3 megy, arra nincs több hivatkozás), 5 (a 4 megy) → 5.

? Melyik algoritmusnál fordulhat elő, hogy több kerettel több laphiba lesz?
+ FIFO
- LRU
- optimális
- egyiknél sem
! Ez a Bélády-anomália.

? Hogy hívják azt az állapotot, amikor a rendszer szinte csak lapoz, és a CPU-kihasználtság leesik?
= vergődés
= thrashing
! Megoldás: kevesebb folyamat vagy több memória.
```

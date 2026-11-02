---
title: Szabályozás és útvonaltervezés
summary: Be-ki és arányos (P) szabályozó, vonalkövetés, valamint a legrövidebb út keresése szélességi kereséssel (BFS).
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **szabályozás**, és miben jobb az **arányos (P) szabályozó** a be-ki vezérlésnél,
- hogyan működik egy **vonalkövető** robot,
- hogyan tervez **útvonalat** a robot egy térképen a **szélességi keresés** (BFS) segítségével.

## Szabályozás: be-ki vagy arányos?

**Feladat:** a robot álljon meg pontosan 30 cm-re a faltól. A szabályozó minden lépésben a **hiba** (a kívánt és a mért érték különbsége) alapján dönti el a sebességet.

- **Be-ki szabályozó:** ha messze van, teljes sebesség, ha elérte, állj. Egyszerű, de a tehetetlenség miatt **túllő** a célon (és oda-vissza rángathat).
- **Arányos (P) szabályozó:** a sebesség **arányos a hibával** (`sebesség = Kp · hiba`). Messze gyorsan megy, a cél közelében egyre lassabban – finoman áll be.

```python run
# A robot 30 cm-re szeretne megállni a fal előtt. Kezdetben 100 cm-re van.
CEL = 30

def be_ki(tavolsag: float) -> float:
    """Be-ki szabályozó: teljes sebesség vagy állj."""
    return 10 if tavolsag > CEL else 0

def aranyos(tavolsag: float, kp: float = 0.3) -> float:
    """Arányos (P) szabályozó: a sebesség arányos a hibával, legfeljebb 10 cm/lépés."""
    hiba = tavolsag - CEL
    return max(-10, min(10, kp * hiba))

for nev, szabalyozo in [("be-ki", be_ki), ("arányos", aranyos)]:
    tavolsag = 100.0
    utvonal = []
    for _ in range(12):
        sebesseg = szabalyozo(tavolsag)
        tavolsag -= sebesseg * 1.1   # a valóságban a robot kicsit többet megy (tehetetlenség, csúszás)
        utvonal.append(round(tavolsag, 1))
    print(f"{nev:8}: {utvonal}")
```

A be-ki szabályozó 23 cm-nél áll meg (7 cm-rel túlment), az arányos szabályozó pedig fokozatosan közelít a 30 cm-hez. A gyakorlatban a **PID szabályozót** használják: az arányos (P) tag mellett az összegzett hibát (I, integráló) és a hiba változását (D, deriváló) is figyelembe veszi – így gyorsabb és pontosabb.

> A `Kp` értékét **hangolni** kell: ha túl kicsi, a robot lassan ér célba; ha túl nagy, túllő és oszcillál.

## Vonalkövetés

A vonalkövető robot alján fényérzékelők vannak, amelyek a padlón húzott sötét vonalat figyelik. Két érzékelővel az egyszerű szabály:

| Bal érzékelő | Jobb érzékelő | Teendő                    |
| ------------ | ------------- | ------------------------- |
| vonal        | vonal         | egyenesen                 |
| vonal        | nincs         | balra kanyarodik          |
| nincs        | vonal         | jobbra kanyarodik         |
| nincs        | nincs         | megáll / keresi a vonalat |

```python run
def vonalkoveto(bal: bool, jobb: bool) -> str:
    """Kétszenzoros vonalkövető döntési szabálya."""
    if bal and jobb:
        return "egyenesen"
    if bal:
        return "balra"
    if jobb:
        return "jobbra"
    return "keresés"

# Szimulált szenzorpárok egy kanyargós vonal mentén.
for bal, jobb in [(True, True), (True, False), (True, True), (False, True), (False, False)]:
    print(f"bal={bal!s:5} jobb={jobb!s:5} → {vonalkoveto(bal, jobb)}")
```

## Útvonaltervezés: legrövidebb út a térképen

Ha a robot ismeri a térképet, előre megtervezheti a legrövidebb utat. Rácsos térképen erre a **szélességi keresés** (_Breadth-First Search_, BFS) a legegyszerűbb módszer: a startból kiindulva először az 1 lépésre lévő mezőket nézi meg, aztán a 2 lépésre lévőket, és így tovább – ezért az első alkalom, amikor eléri a célt, biztosan a legrövidebb úton történik. A még megvizsgálandó mezőket egy **sorban** (_queue_, `deque`) tartja.

```python run
from collections import deque

PALYA = [
    "##########",
    "#S...#...#",
    "#.##.#.#.#",
    "#.#..#.#.#",
    "#.#.##.#.#",
    "#......#C#",
    "##########",
]

def keres(palya: list[str], jel: str) -> tuple[int, int]:
    """Megkeresi egy jel (S vagy C) helyét a pályán."""
    for s, sor in enumerate(palya):
        if jel in sor:
            return s, sor.index(jel)
    raise ValueError(f"Nincs {jel} a pályán")

def legrovidebb_ut(palya: list[str]) -> list[tuple[int, int]] | None:
    """Szélességi kereséssel (BFS) megkeresi a legrövidebb utat S-ből C-be."""
    start, cel = keres(palya, "S"), keres(palya, "C")
    elozo = {start: None}           # honnan értünk az adott mezőre
    sor = deque([start])
    while sor:
        mezo = sor.popleft()
        if mezo == cel:
            # Az út visszafejtése a célból a startig.
            ut = []
            while mezo is not None:
                ut.append(mezo)
                mezo = elozo[mezo]
            return ut[::-1]
        s, o = mezo
        for ds, do in [(-1, 0), (0, 1), (1, 0), (0, -1)]:
            szomszed = (s + ds, o + do)
            if palya[szomszed[0]][szomszed[1]] != "#" and szomszed not in elozo:
                elozo[szomszed] = mezo
                sor.append(szomszed)
    return None                     # nincs út

ut = legrovidebb_ut(PALYA)
print("Lépések száma:", len(ut) - 1)

# Az út berajzolása a pályába.
rajz = [list(sor) for sor in PALYA]
for s, o in ut[1:-1]:
    rajz[s][o] = "*"
print("\n".join("".join(sor) for sor in rajz))
```

A BFS a 10. témakör **sor** adatszerkezetére és a **szótárra** épül. A valódi robotok gyakran az **A\*** (A-csillag) algoritmust használják, amely egy becslés (pl. a céltól mért távolság) segítségével kevesebb mezőt vizsgál meg, de ugyanúgy a legrövidebb utat adja.

## Összefoglalás

- A **szabályozó** a hiba alapján dönt; az **arányos (P)** szabályozó finomabb, mint a be-ki, a gyakorlatban **PID**-et használnak.
- A **vonalkövetés** egyszerű szabálytáblával megoldható.
- Rácsos térképen a legrövidebb utat a **szélességi keresés** (BFS) adja; nagyobb térképen az **A\*** gyorsabb.

---
title: Robotvezérlés Pythonban – szimulált robot
summary: Rácson mozgó robot osztállyal, állapotgép robotporszívóhoz és a zajos szenzoradatok szűrése.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan modellezz egy robotot **osztállyal** (érzékelők = lekérdező metódusok, beavatkozók = parancs metódusok),
- mi az **állapotgép**, és miért ez a robotvezérlés egyik legfontosabb mintája,
- hogyan **szűrd** a zajos szenzoradatokat.

## Szimulált robot egy rácson

A pálya egy szöveglista: `#` a fal, `.` a szabad mező. A robotnak van **pozíciója** (sor, oszlop) és **iránya** (É, K, D, Ny). Az érzékelők lekérdezik a környezetet, a beavatkozók megváltoztatják a robot állapotát.

```python run
# Pálya: # = fal, . = szabad, a robot a koordinátarendszerben (sor, oszlop) mozog.
PALYA = [
    "#########",
    "#.......#",
    "#..##...#",
    "#.......#",
    "#########",
]

# Irányok az óramutató járása szerint: észak, kelet, dél, nyugat.
IRANYOK = ["É", "K", "D", "Ny"]
ELMOZDULAS = {"É": (-1, 0), "K": (0, 1), "D": (1, 0), "Ny": (0, -1)}


class Robot:
    """Egy rácson mozgó, szimulált robot."""

    def __init__(self, palya: list[str], sor: int, oszlop: int, irany: str = "K"):
        self.palya = palya
        self.sor = sor
        self.oszlop = oszlop
        self.irany = irany
        self.ut = [(sor, oszlop)]  # a bejárt mezők

    # --- érzékelők ---
    def elotte_fal(self) -> bool:
        """Ütközésérzékelő: fal van-e közvetlenül előtte?"""
        ds, do = ELMOZDULAS[self.irany]
        return self.palya[self.sor + ds][self.oszlop + do] == "#"

    def tavolsag(self) -> int:
        """Távolságmérő: hány szabad mező van előtte a falig?"""
        ds, do = ELMOZDULAS[self.irany]
        s, o, db = self.sor + ds, self.oszlop + do, 0
        while self.palya[s][o] != "#":
            db += 1
            s, o = s + ds, o + do
        return db

    # --- beavatkozók ---
    def elore(self) -> None:
        """Egy mezőt előre lép (falnak nem megy neki)."""
        if self.elotte_fal():
            raise RuntimeError("Ütközés! A robot falnak menne.")
        ds, do = ELMOZDULAS[self.irany]
        self.sor += ds
        self.oszlop += do
        self.ut.append((self.sor, self.oszlop))

    def jobbra(self) -> None:
        """90 fokkal jobbra fordul."""
        self.irany = IRANYOK[(IRANYOK.index(self.irany) + 1) % 4]

    def balra(self) -> None:
        """90 fokkal balra fordul."""
        self.irany = IRANYOK[(IRANYOK.index(self.irany) - 1) % 4]

    def __str__(self) -> str:
        return f"({self.sor}, {self.oszlop}) felé: {self.irany}"


robot = Robot(PALYA, 1, 1)
print("Indulás:", robot, "– szabad előtte:", robot.tavolsag())
while not robot.elotte_fal():
    robot.elore()
print("Fal előtt:", robot)
robot.jobbra()
robot.elore()
robot.elore()
print("Lefordult és lépett kettőt:", robot)
print("Bejárt mezők száma:", len(robot.ut))
```

**Megfigyelés:** a `Robot` osztály **egységbe zárja** a robot állapotát és műveleteit. Egy valódi robotnál ugyanezek a metódusok a hardvert vezérelnék – a robotot használó program (a `while` ciklus) változtatás nélkül maradhatna.

## Állapotgépek

A robot viselkedése gyakran **állapotokra** bontható: „halad”, „fordul”, „töltőhöz megy”, „tölt”. Minden állapotban más a teendő, és meghatározott **események** (szenzorjelek) váltják ki az **átmeneteket**. Ezt nevezzük **véges állapotgépnek** (_finite state machine_).

| Állapot       | Esemény            | Új állapot    |
| ------------- | ------------------ | ------------- |
| HALAD         | akadály előtte     | FORDUL        |
| HALAD         | akku ≤ 15%         | TÖLTŐHÖZ MEGY |
| FORDUL        | elfordult          | HALAD         |
| TÖLTŐHÖZ MEGY | töltőállomáson van | TÖLT          |
| TÖLT          | akku ≥ 50%         | HALAD         |

```python run
# Robotporszívó állapotgépe: minden állapotban más a viselkedés,
# és meghatározott események váltják ki az átmeneteket.
HALAD, FORDUL, TOLTOHOZ_MEGY, TOLT = "HALAD", "FORDUL", "TÖLTŐHÖZ MEGY", "TÖLT"

# Szimulált szenzoradatok lépésenként: (akadály előtte?, töltőállomáson van?)
szenzor = [
    (False, False), (False, False), (True, False), (False, False),
    (False, False), (False, False), (False, False), (False, True),
    (False, True), (False, True), (False, False),
]

allapot = HALAD
akku = 30  # százalék

for lepes, (akadaly, toltonel) in enumerate(szenzor):
    # --- gondolkodik: átmenetek ---
    if allapot == HALAD:
        if akku <= 15:
            allapot = TOLTOHOZ_MEGY
        elif akadaly:
            allapot = FORDUL
    elif allapot == FORDUL:
        allapot = HALAD            # egy lépés alatt elfordul, majd megy tovább
    elif allapot == TOLTOHOZ_MEGY:
        if toltonel:
            allapot = TOLT
    elif allapot == TOLT:
        if akku >= 50:
            allapot = HALAD

    # --- cselekszik: az állapothoz tartozó művelet ---
    if allapot in (HALAD, TOLTOHOZ_MEGY):
        akku -= 3
    elif allapot == FORDUL:
        akku -= 1
    elif allapot == TOLT:
        akku = min(100, akku + 20)

    print(f"{lepes:2}. lépés: {allapot:<14} akku: {akku}%")
```

Az állapotgép előnye, hogy **áttekinthető** (rajzolható), **könnyen bővíthető** (új állapot = új ág), és minden helyzetben egyértelmű, mit csinál a robot. Ipari robotoktól a játékok ellenfeleiig mindenhol használják.

## Zajos szenzoradatok szűrése

A valódi szenzorok néha **hibás értéket** adnak (visszaverődés, zavar). Ha a robot egyetlen hibás mérésre reagálna, rángatózna vagy feleslegesen megállna. Megoldás: több egymás utáni mérést együtt nézünk.

- **Mozgó átlag:** az utolsó _n_ mérés átlaga – simít, de a nagy hibák elhúzzák.
- **Mozgó medián:** az utolsó _n_ mérés mediánja – a kiugró értékeket teljesen kiszűri.

```python run
import statistics

# Egy távolságmérő nyers adatai: a 250 és a 0 hibás mérés (zaj, visszaverődés).
nyers = [52, 51, 250, 50, 49, 0, 48, 47, 47, 46]

def mozgo_median(adatok: list[int], ablak: int = 3) -> list[float]:
    """Minden pontot az utolsó `ablak` darab mérés mediánjával helyettesít."""
    szurt = []
    for i in range(len(adatok)):
        resz = adatok[max(0, i - ablak + 1): i + 1]
        szurt.append(statistics.median(resz))
    return szurt

def mozgo_atlag(adatok: list[int], ablak: int = 3) -> list[float]:
    """Az utolsó `ablak` darab mérés átlaga."""
    return [round(statistics.mean(adatok[max(0, i - ablak + 1): i + 1]), 1) for i in range(len(adatok))]

print("nyers:   ", nyers)
print("átlag:   ", mozgo_atlag(nyers))
print("medián:  ", mozgo_median(nyers))
```

Látszik, hogy az átlagot a 250-es hibás mérés három lépésen át elrontja, a medián viszont szinte észre sem veszi.

## Összefoglalás

- A robotot érdemes **osztállyal** modellezni: érzékelő- és beavatkozó metódusok.
- Az **állapotgép** a robotviselkedés áttekinthető leírása: állapotok + átmenetek.
- A szenzoradatokat **szűrni** kell; kiugró értékek ellen a **medián** a legjobb.

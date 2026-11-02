---
title: A robotok felépítése és működése
summary: Érzékelők, beavatkozók, vezérlő és az érzékel–gondolkodik–cselekszik ciklus.
minutes: 14
---

## Amit ebben a leckében megtanulsz

- milyen **részekből** áll egy robot,
- mi az **érzékel–gondolkodik–cselekszik** (_sense–think–act_) ciklus,
- milyen eszközökkel és nyelveken programozzák a robotokat,
- miért különleges a robotprogramozás (valós idő, zajos adatok, biztonság).

## Mi a robot?

A robot olyan gép, amely **érzékeli** a környezetét, a beérkező adatok alapján **döntést hoz**, és **mozgással vagy más módon beavatkozik** a világba. Lehet ipari robotkar, robotporszívó, drón, önvezető autó vagy egy oktatási robot (pl. LEGO, Arduino-alapú kisautó).

## A robot részei

| Rész                         | Feladata                                                     | Példák                                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Érzékelők** (szenzorok)    | adatot gyűjtenek a környezetről és a robot saját állapotáról | távolságmérő (ultrahang, lézer/LiDAR), kamera, fény- és vonalérzékelő, ütközésérzékelő, gyorsulásmérő, giroszkóp, kerékjeladó (enkóder) |
| **Vezérlő**                  | az „agy”: futtatja a programot                               | mikrovezérlő (Arduino), egylapos számítógép (Raspberry Pi), ipari PLC                                                                   |
| **Beavatkozók** (aktuátorok) | a döntést fizikai hatássá alakítják                          | egyenáramú motor, szervomotor, léptetőmotor, megfogó, LED, hangszóró                                                                    |
| **Energiaellátás**           | áramot ad                                                    | akkumulátor, tápegység                                                                                                                  |
| **Kommunikáció**             | kapcsolat más eszközökkel                                    | Wi-Fi, Bluetooth, soros port                                                                                                            |

## Az érzékel–gondolkodik–cselekszik ciklus

A robot programja egy **végtelen ciklus**, amely másodpercenként sokszor ismétli:

1. **Érzékel:** beolvassa a szenzorok értékeit.
2. **Gondolkodik:** a program logikája eldönti, mit tegyen.
3. **Cselekszik:** utasítást ad a motoroknak.

```text
      ┌──────────┐     ┌──────────────┐     ┌────────────┐
 ───▶ │ ÉRZÉKEL  │ ──▶ │ GONDOLKODIK  │ ──▶ │ CSELEKSZIK │ ──┐
 │    └──────────┘     └──────────────┘     └────────────┘   │
 └─────────────────────────────────────────────────────────── ┘
```

Egy egyszerű szimuláció: a robot egyenesen halad, és megáll, ha 20 cm-nél közelebb ér egy akadályhoz. A „szenzor” itt egy előre megadott méréssorozat.

```python run
# Szimulált távolságmérő: egymás utáni mérések centiméterben.
meresek = [120, 95, 70, 48, 31, 19, 12]

def erzekel(lepes: int) -> int:
    """A szenzor értékének beolvasása (itt a listából)."""
    return meresek[lepes]

def gondolkodik(tavolsag: int) -> str:
    """Döntés a távolság alapján."""
    return "állj" if tavolsag < 20 else "előre"

def cselekszik(parancs: str) -> None:
    """A motorok vezérlése (itt csak kiírjuk)."""
    print(f"  motor: {parancs}")

for lepes in range(len(meresek)):
    tavolsag = erzekel(lepes)
    print(f"{lepes}. lépés – távolság: {tavolsag} cm")
    parancs = gondolkodik(tavolsag)
    cselekszik(parancs)
    if parancs == "állj":
        break
```

Ugyanezt egy valódi roboton is így írnánk – csak az `erzekel()` a szenzort olvasná, a `cselekszik()` pedig a motort vezérelné. A logika (`gondolkodik()`) változatlan, ezért **szimulációban is tesztelhető**.

## Miben más a robotprogramozás?

- **Valós idő:** a döntésnek időben meg kell születnie – egy késő fékparancs ütközést okoz.
- **Zajos, pontatlan adatok:** a szenzorok értékei ingadoznak, néha hibásak. Szűrni kell őket (pl. több mérés átlaga, medián).
- **Bizonytalanság:** a kerék megcsúszhat, a robot nem pontosan oda ér, ahova szeretnénk.
- **Biztonság:** a hibás program fizikai kárt okozhat – vészleállító, határértékek, óvatos alapértelmezések kellenek.
- **Szimuláció:** a programot először szimulátorban próbáljuk ki (pl. Gazebo, Webots, CoppeliaSim), csak utána a drága hardveren.

## Eszközök és nyelvek

| Eszköz / keretrendszer                   | Nyelv                                                   | Jellemző                                              |
| ---------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| **Arduino**                              | C/C++ (Arduino-dialektus)                               | olcsó mikrovezérlő, oktatás, hobbi                    |
| **Raspberry Pi**                         | Python (is)                                             | teljes Linuxos számítógép, kamera, hálózat            |
| **MicroPython**                          | Python                                                  | Python mikrovezérlőkön (pl. ESP32, Raspberry Pi Pico) |
| **ROS / ROS 2** (Robot Operating System) | C++, Python                                             | a kutatás és ipar szabványos robotikai keretrendszere |
| **LEGO / oktatási robotok**              | blokkalapú, Python                                      | kezdőknek                                             |
| **ipari robotok**                        | gyártóspecifikus nyelvek (pl. KUKA KRL, ABB RAPID), PLC | gyártósorok                                           |

Egy MicroPython-program így villogtat egy LED-et (valós hardveren futna, itt csak szemléltetés):

```python
from machine import Pin   # csak mikrovezérlőn létezik
import time

led = Pin(25, Pin.OUT)    # a 25-ös láb kimenet
while True:
    led.toggle()          # LED be/ki
    time.sleep(0.5)       # fél másodperc várakozás
```

## Összefoglalás

- Robot = **érzékelők + vezérlő + beavatkozók**.
- A program magja az **érzékel–gondolkodik–cselekszik** ciklus.
- A döntési logikát válaszd külön a hardvertől – így szimulációban is tesztelhető.
- A robotikában Python (Raspberry Pi, MicroPython, ROS) és C/C++ (Arduino, ROS) a legelterjedtebb.

## A lecke feladata: Érzékel–gondolkodik–cselekszik akkumulátorral

Bővítsd a lecke szimulációját: a robotnak most akkumulátora is van. Írj `ciklus(meresek, akku=100)` függvényt, amely a távolságmérések (cm) listáján lépésenként végigmegy, és visszaadja a kiadott parancsok listáját. Minden lépésben, **ebben a sorrendben** dönt:

1. ha az akku 15 % alatt van: `"töltőre"`, és a ciklus véget ér,
2. ha a távolság 20 cm alatt van: `"állj"`, és a ciklus véget ér,
3. ha a távolság 50 cm alatt van: `"lassan"` – ez 2 % akkut fogyaszt,
4. egyébként: `"előre"` – ez 5 % akkut fogyaszt.

Ha a mérések elfogynak, a ciklus magától véget ér.

```python starter required
def ciklus(meresek, akku=100):
    parancsok = []
    for tavolsag in meresek:
        if tavolsag < 20:
            parancsok.append("állj")
        else:
            parancsok.append("előre")
    return parancsok


print(ciklus([120, 95, 70, 48, 31, 19, 12]))
```

<details>
<summary>Megoldás</summary>

```python solution
def ciklus(meresek, akku=100):
    parancsok = []
    for tavolsag in meresek:
        # Érzékelés után döntés – a sorrend számít!
        if akku < 15:
            parancsok.append("töltőre")
            break
        if tavolsag < 20:
            parancsok.append("állj")
            break
        if tavolsag < 50:
            parancsok.append("lassan")
            akku -= 2
        else:
            parancsok.append("előre")
            akku -= 5
    return parancsok


print(ciklus([120, 95, 70, 48, 31, 19, 12]))
```

</details>

```python test
assert ciklus([120, 95, 70, 48, 31, 19, 12]) == ["előre", "előre", "előre", "lassan", "lassan", "állj"], "A lecke méréssorozatán: 3× előre, 2× lassan, majd állj (és utána már nincs parancs)."
assert ciklus([100] * 10, akku=25) == ["előre", "előre", "előre", "töltőre"], "25 % akkuval 3 előre lépés után 15 % alá esik: töltőre."
assert ciklus([30, 30, 30], akku=16) == ["lassan", "töltőre"], "Lassan haladva 2 %-ot fogy; 14 %-nál töltőre."
assert ciklus([10], akku=10) == ["töltőre"], "Az akku ellenőrzése az első, még akadály előtt is."
assert ciklus([]) == [], "Mérések nélkül nincs parancs."
assert ciklus([60, 50, 49, 20]) == ["előre", "előre", "lassan", "lassan"], "A határok: 50 már előre, 20 még lassan."
```

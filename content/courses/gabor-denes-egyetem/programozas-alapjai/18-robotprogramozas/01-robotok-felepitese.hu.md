---
title: A robotok felépítése és működése
summary: Érzékelők, beavatkozók, vezérlő és az érzékel–gondolkodik–cselekszik ciklus.
minutes: 14
---

## Amit ebben a leckében megtanulsz

- milyen **részekből** áll egy robot,
- mi az **érzékel–gondolkodik–cselekszik** (*sense–think–act*) ciklus,
- milyen eszközökkel és nyelveken programozzák a robotokat,
- miért különleges a robotprogramozás (valós idő, zajos adatok, biztonság).

## Mi a robot?

A robot olyan gép, amely **érzékeli** a környezetét, a beérkező adatok alapján **döntést hoz**, és **mozgással vagy más módon beavatkozik** a világba. Lehet ipari robotkar, robotporszívó, drón, önvezető autó vagy egy oktatási robot (pl. LEGO, Arduino-alapú kisautó).

## A robot részei

| Rész | Feladata | Példák |
| --- | --- | --- |
| **Érzékelők** (szenzorok) | adatot gyűjtenek a környezetről és a robot saját állapotáról | távolságmérő (ultrahang, lézer/LiDAR), kamera, fény- és vonalérzékelő, ütközésérzékelő, gyorsulásmérő, giroszkóp, kerékjeladó (enkóder) |
| **Vezérlő** | a „agy”: futtatja a programot | mikrovezérlő (Arduino), egylapos számítógép (Raspberry Pi), ipari PLC |
| **Beavatkozók** (aktuátorok) | a döntést fizikai hatássá alakítják | egyenáramú motor, szervomotor, léptetőmotor, megfogó, LED, hangszóró |
| **Energiaellátás** | áramot ad | akkumulátor, tápegység |
| **Kommunikáció** | kapcsolat más eszközökkel | Wi-Fi, Bluetooth, soros port |

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

| Eszköz / keretrendszer | Nyelv | Jellemző |
| --- | --- | --- |
| **Arduino** | C/C++ (Arduino-dialektus) | olcsó mikrovezérlő, oktatás, hobbi |
| **Raspberry Pi** | Python (is) | teljes Linuxos számítógép, kamera, hálózat |
| **MicroPython** | Python | Python mikrovezérlőkön (pl. ESP32, Raspberry Pi Pico) |
| **ROS / ROS 2** (Robot Operating System) | C++, Python | a kutatás és ipar szabványos robotikai keretrendszere |
| **LEGO / oktatási robotok** | blokkalapú, Python | kezdőknek |
| **ipari robotok** | gyártóspecifikus nyelvek (pl. KUKA KRL, ABB RAPID), PLC | gyártósorok |

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

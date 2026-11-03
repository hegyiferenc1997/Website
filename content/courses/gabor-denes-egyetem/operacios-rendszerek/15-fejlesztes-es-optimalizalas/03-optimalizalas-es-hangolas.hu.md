---
title: Optimalizálás és hangolás
summary: Indítási programok, szolgáltatások, gyorsítótár, swappiness, energiaséma, SSD és frissítések – valamint az Amdahl-törvény, ami megmondja, mennyit ér a több mag.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- milyen **egyszerű hangolási lépésekkel** gyorsítható egy Windows vagy Linux rendszer,
- mit csinál a **gyorsítótár** és a **swappiness**,
- hogyan számolod ki az **Amdahl-törvénnyel**, mennyit gyorsít a több processzormag.

## Az aranyszabály

Az előző lecke szerint: **előbb mérj**, keresd meg a szűk keresztmetszetet, **egyszerre egy dolgot** változtass, majd mérj újra. Az alábbi lépések a leggyakoribb, kockázatmentes hangolások.

## Indítási programok és szolgáltatások

Minden induláskor elinduló program memóriát és CPU-időt fogyaszt, és lassítja a bejelentkezést.

- **Windows**: Feladatkezelő → **Indítás** fül: a felesleges programokat (frissítő segédek, csevegők) tiltsd le. A szolgáltatásokat (`services.msc`) csak akkor módosítsd, ha biztosan tudod, mire valók.
- **Linux**: a háttérszolgáltatásokat a `systemd` kezeli:

```bash
systemd-analyze                 # mennyi ideig tartott a rendszerindítás
systemd-analyze blame | head    # melyik szolgáltatás lassította a legjobban
systemctl list-unit-files --state=enabled   # mi indul automatikusan
sudo systemctl disable --now cups           # pl. a nyomtatószolgáltatás kikapcsolása, ha nincs nyomtatód
```

## Gyorsítótár: a szabad memória nem jó semmire

Linuxon a `free -h` gyakran mutat kevés **free**, de sok **buff/cache** memóriát. Ez **nem baj**: a kernel a nemrég olvasott fájlokat memóriában tartja (**lapgyorsítótár**, _page cache_), így a következő olvasás nem a lemezről jön. Ha egy programnak memória kell, a gyorsítótár azonnal felszabadul. A fontos oszlop az **available** (elérhető). Windowson ugyanezt a **SuperFetch / SysMain** szolgáltatás és a „Gyorsítótárazott” memória végzi.

## Swap és swappiness

A **swappiness** (0–200, Ubuntun alapból **60**) azt szabályozza, mennyire szívesen tesz ki a kernel lapokat a swapba a gyorsítótár ürítése helyett. Kevés RAM-mal rendelkező asztali gépen a kisebb érték (pl. 10–20) gyakran gördülékenyebb felületet ad.

```bash
cat /proc/sys/vm/swappiness            # jelenlegi érték
sudo sysctl vm.swappiness=20           # ideiglenes módosítás (újraindításig)
echo 'vm.swappiness=20' | sudo tee /etc/sysctl.d/99-swappiness.conf   # tartós
```

## Energiaséma, SSD, frissítések

- **Energiaséma**: laptopon a „Takarékos” mód visszafogja a CPU órajelét. Windowson: Beállítások → Rendszer → Energiaellátás → **Energiaellátási mód**; PowerShellből:

```powershell
powercfg /list                 # az energiasémák listája
powercfg /setactive SCHEME_MIN # „Nagy teljesítmény” séma
```

  Linuxon a `powerprofilesctl` (Ubuntu: Beállítások → Energia) vált a _power-saver_, _balanced_ és _performance_ profil között.
- **SSD**: a legnagyobb egyszeri gyorsulás egy régi gépen a merevlemez → SSD csere. A rendszer heti **TRIM**-mel (`fstrim.timer` Linuxon, „Meghajtók optimalizálása” Windowson) tartja jó állapotban; SSD-t **nem kell** töredezettségmentesíteni.
- **Frissítések**: a kernel- és illesztőprogram-frissítések gyakran hoznak teljesítményjavítást és biztonsági javításokat is.
- **Virtuális gépben**: adj elég RAM-ot és 2+ magot a VM-nek, telepítsd a **vendégkiegészítőket**, és kapcsold be a 3D gyorsítást (lásd az 1. témakört).

## Az Amdahl-törvény

Több mag csak a program **párhuzamosítható** részét gyorsítja. Ha a futásidő **p** része párhuzamosítható, **n** maggal a gyorsulás:

**S(n) = 1 / ((1 − p) + p / n)**

Ha n nagyon nagy, a p/n tag eltűnik, így a **felső határ 1 / (1 − p)**: a soros rész mindig megmarad. Próbáld ki:

```python run
# Amdahl-törvény: mennyit gyorsul egy program n maggal, ha a futásidő p része párhuzamosítható?
def gyorsulas(p, n):
    return 1 / ((1 - p) + p / n)

p = 0.8                      # a program 80%-a párhuzamosítható
for n in [1, 2, 4, 8, 16, 1000]:
    print(f"{n:5} mag: {gyorsulas(p, n):.2f}-szeres gyorsulás")
print("elméleti felső határ:", round(1 / (1 - p), 2))
```

80% párhuzamos résznél 16 mag is csak **4-szeres**, és végtelen sok mag is legfeljebb **5-szörös** gyorsulást ad. Ezért fontos a soros rész csökkentése is, nem csak a magok számának növelése.

## Összefoglalás

- Hangolás előtt mérj; egyszerre egy dolgot változtass.
- Felesleges indítási programok és szolgáltatások letiltása; `systemd-analyze blame`.
- A gyorsítótárban lévő memória hasznos, az **available** számít; a swappiness a swap használatát szabályozza.
- Energiaséma, SSD + TRIM, frissítések, VM-ben vendégkiegészítők.
- Amdahl: S(n) = 1 / ((1 − p) + p/n), felső határ 1/(1 − p).

## A lecke feladata

```quiz required
? Egy program futásidejének 75%-a párhuzamosítható (p = 0,75). Hányszoros gyorsulást ad 3 mag az Amdahl-törvény szerint?
= 2
! 1 / (0,25 + 0,75/3) = 1 / (0,25 + 0,25) = 2.

? Mennyi a legnagyobb elérhető gyorsulás ugyanennél a programnál, akármennyi maggal?
= 4
! 1 / (1 − 0,75) = 1 / 0,25 = 4.

? A free -h kimenetében kevés a free, de sok a buff/cache memória. Mit jelent ez?
- a gép memóriája elfogyott, azonnal bővíteni kell
+ a kernel fájlokat tart gyorsítótárban, amit szükség esetén azonnal felszabadít
- egy program memóriaszivárgással küzd
- a swap meghibásodott
! Az available oszlop mutatja, mennyi memória érhető el ténylegesen.

? Melyik paranccsal látod Linuxon, melyik szolgáltatás lassította a legjobban a rendszerindítást?
+ systemd-analyze blame
- free -h
- df -h
- uname -r
! A systemd méri minden szolgáltatás indulási idejét.
```

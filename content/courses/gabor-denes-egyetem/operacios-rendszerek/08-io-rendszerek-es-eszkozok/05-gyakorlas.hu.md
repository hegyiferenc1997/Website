---
title: Gyakorlás – I/O rendszerek
summary: Ellenőrző kérdések, eszközfelderítés a VM-ben és összefoglaló feladatlap lemezütemezéssel.
minutes: 50
kind: practice
---

## Eszközfelderítés

Ubuntu VM-ben:

```bash
lsblk -d -o NAME,ROTA,SIZE,MODEL   # ROTA=1: forgó lemez, 0: SSD (VM-ben a VirtualBox beállítása szerint)
ls -l /dev/sda /dev/tty0           # az első betű: b = blokkos, c = karakteres eszköz
free -h                            # buff/cache: a lemez-gyorsítótár
```

Windows 11 VM-ben nyisd meg az **Eszközkezelőt**, és keresd meg a **VirtualBox Graphics Adapter** és a **VirtualBox Guest Additions** eszközöket. PowerShellben: `Get-PnpDevice -PresentOnly | Select-Object -First 10 Class, FriendlyName`.

## Ellenőrző kérdések

<details>
<summary>1. Miért nem jó a polling egy lassú eszköznél, például a billentyűzetnél?</summary>

Mert a CPU szinte végig csak az állapotregisztert olvasná, miközben a felhasználó másodpercenként csak néhány billentyűt üt le. Megszakítással a CPU közben más munkát végezhet.

</details>

<details>
<summary>2. Miért fut az illesztőprogram kernel módban, és mi ennek a veszélye?</summary>

Mert közvetlenül kell elérnie a hardver regisztereit és a megszakításokat, ami csak kernel módban lehetséges. A veszély: egy hibás driver az egész kernelt lerántja (Windowson kék halál, Linuxon kernel panic).

</details>

<details>
<summary>3. Miért nem baj, ha a Linux a „buff/cache” miatt kevés szabad memóriát mutat?</summary>

Mert a gyorsítótárban lévő adatok másolatok, a kernel bármikor eldobhatja őket, ha egy programnak memória kell. Az üres RAM kihasználatlan RAM – a cache gyorsítja a lemezműveleteket.

</details>

<details>
<summary>4. Mikor jobb a SCAN az SSTF-nél?</summary>

Ha folyamatosan érkeznek kérések a fej környékén: az SSTF ilyenkor a távoli kéréseket kiéheztetheti, a SCAN viszont garantáltan eljut mindenhová egy oda-vissza úton belül.

</details>

## Összefoglaló feladatlap

Cilinderek 0–99, a fej a **40.** cilinderen áll. Kérések: `10, 22, 20, 2, 40, 6, 38`.

```quiz required
? Mennyi a fej összes elmozdulása FCFS-sel?
= 166
! 30 + 12 + 2 + 18 + 38 + 34 + 32 = 166.

? Mennyi a fej összes elmozdulása SSTF-fel?
= 38
! 40 → 40 → 38 → 22 → 20 → 10 → 6 → 2: 0 + 2 + 16 + 2 + 10 + 4 + 4 = 38.

? Mi jelzi az `ls -l` kimenetének első betűjében, hogy egy eszközfájl blokkos?
= b
! A karakteres eszközt c jelzi.

? Melyik technika másol adatot az eszköz és a memória között a CPU részvétele nélkül?
+ DMA
- polling
- spoololás
- pufferelés
! Direct Memory Access.

? Mi a kettős pufferelés lényege?
- Minden adatot kétszer írunk a lemezre.
+ Az egyik puffert töltjük, miközben a másikat ürítjük.
- Két különböző lemezre írunk egyszerre.
- A puffer mérete kétszerese a RAM-nak.
! Így a gyártó és a fogyasztó nem várakoztatja egymást.

? Melyik Linux I/O-ütemező a gyakori választás NVMe SSD-n?
+ none
- SSTF
- SCAN
- FCFS
! Az SSD-n nincs fejmozgás, a sorbarendezés felesleges.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Merevlemez elérési ideje.** Az átlagos elérési idő = keresési idő + átlagos forgási késleltetés (fél fordulat ideje) + átviteli idő. Írd meg az `eleresi_ms(rpm, kereses_ms, atvitel_ms)` függvényt (két tizedesre kerekítve)!

```python starter
def eleresi_ms(rpm, kereses_ms, atvitel_ms):
    return kereses_ms
```

<details>
<summary>Megoldás</summary>

```python solution
def eleresi_ms(rpm, kereses_ms, atvitel_ms):
    fordulat_ms = 60_000 / rpm                # egy teljes fordulat ideje
    return round(kereses_ms + fordulat_ms / 2 + atvitel_ms, 2)
```

</details>

```python test
assert eleresi_ms(7200, 9, 0.1) == 13.27
assert eleresi_ms(5400, 12, 0) == 17.56
assert eleresi_ms(15000, 3.5, 0.05) == 5.55
print("Minden ellenőrzés sikeres!")
```

**2.** **SSTF lemezütemezés.** Az SSTF mindig a fej jelenlegi helyéhez **legközelebbi** kérést szolgálja ki. Írd meg az `sstf(fej, kerelmek)` függvényt, amely visszaadja a fej összes elmozdulását (sávban)!

```python starter
def sstf(fej, kerelmek):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
def sstf(fej, kerelmek):
    hatra = list(kerelmek)
    ut = 0
    while hatra:
        kov = min(hatra, key=lambda s: abs(s - fej))   # a legközelebbi kérés
        ut += abs(kov - fej)
        fej = kov
        hatra.remove(kov)
    return ut
```

</details>

```python test
assert sstf(53, [98, 183, 37, 122, 14, 124, 65, 67]) == 236
assert sstf(50, [40, 60]) == 30
assert sstf(10, []) == 0
print("Minden ellenőrzés sikeres!")
```

**3.** **IOPS-ból átviteli sebesség.** Írd meg az `mb_per_s(iops, blokk_kb)` függvényt: ha egy eszköz másodpercenként `iops` műveletet végez, egyenként `blokk_kb` KB-tal, hány MB/s az átviteli sebesség (1 MB = 1024 KB, egy tizedesre)?

```python starter
def mb_per_s(iops, blokk_kb):
    return iops
```

<details>
<summary>Megoldás</summary>

Ugyanaz a merevlemez véletlen kis olvasásnál nevetségesen lassú (0,3 MB/s), nagy soros blokkoknál viszont 200 MB/s-ot is tud – a keresés és a forgás ideje az, ami fáj.

```python solution
def mb_per_s(iops, blokk_kb):
    return round(iops * blokk_kb / 1024, 1)
```

</details>

```python test
assert mb_per_s(76, 4) == 0.3          # merevlemez, véletlen 4 KB-os olvasás
assert mb_per_s(100000, 4) == 390.6    # NVMe SSD
assert mb_per_s(200, 1024) == 200.0    # merevlemez, nagy soros blokkok
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Miért nincs szükség lemezütemezésre (SSTF, SCAN) egy SSD-nél?
+ mert nincs mozgó fej: minden blokk elérési ideje közel azonos
- mert az SSD csak egy kérést fogad egyszerre
- mert az SSD-t a BIOS ütemezi
! Linuxon az SSD-k ütemezője gyakran none vagy mq-deadline.

? Mi a különbség a blokkos és a karakteres eszköz között?
+ a blokkos eszköz rögzített méretű blokkokban, tetszőleges sorrendben érhető el (lemez); a karakteres bájtfolyam (billentyűzet, soros port)
- a blokkos eszköz lassabb
- a karakteres eszköz csak szöveget tárol
! ls -l /dev: a sor eleji b vagy c betű jelzi.

? Mire való a pufferelés az I/O-ban?
+ a gyors és lassú eszközök sebességkülönbségének kiegyenlítésére, és hogy kevesebb, nagyobb műveletet végezzünk
- az adatok titkosítására
- a hibák elrejtésére
! Pl. a lemezre írás előbb a memóriába kerül.

? Mit csinál az illesztőprogram (driver)?
+ lefordítja az OS általános kéréseit az adott eszköz saját „nyelvére”
- gyorsítja a processzort
- az eszköz áramellátását biztosítja
! Az OS így egységes felületen éri el a különböző eszközöket.

? Melyik lemezütemező viselkedik úgy, mint a lift: az egyik irányba végigmegy, majd visszafordul?
- FCFS
- SSTF
+ SCAN
! A LOOK annyiban okosabb, hogy csak az utolsó kérésig megy el.
```

---
title: Gyakorlás – I/O rendszerek
summary: Ellenőrző kérdések, eszközfelderítés a VM-ben és összefoglaló feladatlap lemezütemezéssel.
minutes: 25
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

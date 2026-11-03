---
title: Gyakorlás – kernel és felhasználói tér
summary: Kernelfelderítés az Ubuntu VM-ben, ellenőrző kérdések és összefoglaló feladatlap.
minutes: 25
kind: practice
---

## Kernelfelderítés

```bash
uname -a                               # kernel neve, verziója, architektúrája
lsmod | grep -i vbox                   # a VirtualBox vendégkiegészítő moduljai
sudo dmesg | grep -i -m5 virtualbox    # mit írt a kernel a virtuális hardverről
ps -eo pid,user,comm | head -15        # a [kthreadd] és a többi kernelszál
cat /proc/sys/kernel/hostname          # a gépnév a kernelből
```

Kérdések: Hány `vbox` kezdetű modul van betöltve? Ki a 2-es PID-ű folyamat (`ps -p 2 -o comm`)? (Ez a `kthreadd`, a kernelszálak „szülője”.)

## Ellenőrző kérdések

<details>
<summary>1. Miért lehet egy hibás illesztőprogram veszélyesebb egy hibás alkalmazásnál?</summary>

Mert az illesztőprogram kernel módban fut, teljes hozzáféréssel a memóriához és a hardverhez. A hibája felülírhatja a kernel adatait, és az egész rendszert leállíthatja. Egy alkalmazás hibája csak az alkalmazást állítja le.

</details>

<details>
<summary>2. Miért fut a Windows grafikus alrendszerének egy része kernel módban, ha ez kockázatos?</summary>

Teljesítmény miatt: kernel módban kevesebb módváltás és üzenetküldés kell a rajzoláshoz. Ez a hibrid kernel tipikus kompromisszuma a sebesség és a megbízhatóság között.

</details>

<details>
<summary>3. Mi a különbség a /proc/cpuinfo és egy közönséges szövegfájl között?</summary>

A /proc/cpuinfo nem foglal helyet a lemezen: amikor megnyitod, a kernel abban a pillanatban generálja a tartalmát az aktuális adatokból.

</details>

<details>
<summary>4. Miért kell újraindítani a gépet egy kernelfrissítés után, de egy böngészőfrissítés után nem a gépet, csak a böngészőt?</summary>

Mert a futó kernel nem cserélhető le menet közben (az új kernel csak indításkor töltődik be), a böngésző viszont egy felhasználói folyamat, amelyet egyszerűen újra lehet indítani az új verzióval.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik kerneltípusba tartozik a Windows NT (Windows 10/11)?
- monolitikus
- mikrokernel
+ hibrid
- exokernel
! Moduláris felépítés, de sok szolgáltatás kernel módban.

? Melyik kernel helyességét bizonyították matematikailag?
= seL4
! Egy L4-családba tartozó mikrokernel.

? Mi a Linux-kernelmodulok fájlkiterjesztése?
= .ko
= ko
! kernel object

? Hogy hívják a kernel végzetes hiba miatti leállását Linuxon?
= kernel panic
= pánik
= panic
! Windowson: kék halál (BSOD).

? Melyik fájl a Windows kernelje?
+ ntoskrnl.exe
- explorer.exe
- winlogon.exe
- svchost.exe
! C:\Windows\System32\ntoskrnl.exe

? Melyik mappában állíthatók a Linux kernel paraméterei (sysctl)?
= /proc/sys
! pl. /proc/sys/vm/swappiness
```

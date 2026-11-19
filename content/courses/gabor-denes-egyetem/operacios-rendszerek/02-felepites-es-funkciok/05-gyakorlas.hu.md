---
title: Gyakorlás – felépítés és funkciók
summary: Ellenőrző kérdések és összefoglaló feladatlap az operációs rendszerek felépítéséhez.
minutes: 20
kind: practice
---

## Ellenőrző kérdések

Előbb próbálj meg fejben válaszolni, csak utána nyisd le a választ!

<details>
<summary>1. Mondj egy példát arra, amikor az OS erőforrás-kezelőként, és egyet, amikor kiterjesztett gépként viselkedik!</summary>

Erőforrás-kezelő: a böngésző és a zenelejátszó felváltva kapja a processzort, és mindkettő külön memóriaterületet kap. Kiterjesztett gép: a programok fájlokat nyitnak meg név szerint, nem lemezblokkokat címeznek.

</details>

<details>
<summary>2. Miért kell az időzítő megszakítás egy többfeladatos rendszerben?</summary>

Mert enélkül egy program, amely sosem hív rendszerhívást (pl. végtelen ciklusban fut), soha nem adná vissza a vezérlést az OS-nek, és a többi program nem futhatna.

</details>

<details>
<summary>3. Sorold fel a rendszerindítás lépéseit Linuxon!</summary>

Bekapcsolás → UEFI firmware (POST, indítóeszköz) → GRUB rendszerbetöltő → a kernel betöltése és inicializálása → a systemd (PID 1) elindítja a szolgáltatásokat → bejelentkező képernyő.

</details>

<details>
<summary>4. Miért gyorsítja a gépet, ha az OS a gyakran használt adatokat a RAM-ban tartja?</summary>

Mert a RAM elérése nagyságrendekkel gyorsabb, mint az SSD-é vagy a HDD-é (kb. 100 ns kontra 0,1–10 ms).

</details>

Próbáld ki az Ubuntu VM-ben:

```bash
cat /proc/cpuinfo | grep "model name" | head -1   # milyen processzort lát a vendég
cat /proc/meminfo | head -3                        # memória
systemd-analyze                                    # az indítás ideje
```

## Összefoglaló feladatlap

```quiz required
? Mi a régi BIOS mai utódja, amely a számítógép indítását végzi?
= UEFI
! Unified Extensible Firmware Interface.

? Melyik Linux rendszerbetöltő a legelterjedtebb (Ubuntu is ezt használja)?
+ GRUB
- NTLDR
- systemd
- POST
! GRand Unified Bootloader.

? Melyik a leggyorsabb tár a memóriahierarchiában?
+ regiszter
- L3 cache
- RAM
- SSD
! A regiszterek a processzorban vannak, 1 ns alatt elérhetők.

? Melyik fajta megszakítást váltja ki szándékosan egy program, amikor az OS szolgáltatását kéri?
- hardveres megszakítás
- kivétel
+ szoftveres megszakítás (trap, rendszerhívás)
- időzítő megszakítás
! A rendszerhívásokról külön témakör szól.

? Melyik rendszer a mai Linux és macOS szellemi őse (1970-es évek, Bell Labs)?
= UNIX
! Ken Thompson és Dennis Ritchie, 1969–1973.

? Hány nanoszekundum nagyságrendileg a RAM elérési ideje a lecke táblázata szerint?
= 100
! Regiszter < 1 ns, RAM ~100 ns, SSD ~100 000 ns.
```

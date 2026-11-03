---
title: Gyakorlás – interfészek
summary: Ellenőrző kérdések, parancssori mini-feladatok és összefoglaló feladatlap.
minutes: 25
kind: practice
---

## Parancssori mini-feladatok (Ubuntu VM)

1. Hozz létre a saját mappádban egy `os-gyak` mappát, benne három fájlt (`a.txt`, `b.txt`, `c.txt`) egy paranccsal: `touch a.txt b.txt c.txt`.
2. Írd bele az `a.txt`-be a mai dátumot: `date > a.txt`, majd fűzd hozzá a gépnevet: `hostname >> a.txt`.
3. Számold meg, hány sor van benne: `wc -l a.txt` (2 kell legyen).
4. Listázd ki az `/etc` mappa `.conf` végű fájljait, és számold meg őket egy csővel: `ls /etc/*.conf | wc -l`.
5. Írd át a leckében látott szkriptet úgy, hogy a szabad memóriát is kiírja (`free -h`).

## Ellenőrző kérdések

<details>
<summary>1. Miért elterjedt a parancssor a szervereken?</summary>

Mert kevés erőforrást igényel, távolról (SSH-n) is jól használható, és a feladatok szkriptekkel automatizálhatók. Sok szerveren nincs is grafikus felület.

</details>

<details>
<summary>2. Mi a különbség a Bash és a PowerShell csöve között?</summary>

Bashben a cső szöveget (bájtfolyamot) ad tovább, amelyet a következő program értelmez. PowerShellben objektumok mennek át a csövön, tulajdonságokkal (pl. Name, CPU), így szűrni, rendezni közvetlenül lehet.

</details>

<details>
<summary>3. Miért biztonságosabb a Wayland az X11-nél?</summary>

X11 alatt bármely grafikus program olvashatja a többi program billentyűleütéseit és képernyőtartalmát. Waylandnél a kompozitor elszigeteli az ablakokat, egy program csak a saját bemenetét kapja.

</details>

<details>
<summary>4. Mi a különbség a `systemctl start` és a `systemctl enable` között?</summary>

A `start` most azonnal elindítja a szolgáltatást (újraindításig). Az `enable` beállítja, hogy minden rendszerindításkor elinduljon, de most nem indítja el (erre `enable --now` való).

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik program értelmezi a terminálba begépelt parancsokat?
+ a shell
- a kernel
- a kompozitor
- a rendszerbetöltő
! Linuxon általában Bash, Windowson PowerShell.

? Hány sort ír ki a `wc -l` arra a fájlra, amelybe előbb `date >`, majd `hostname >>` írt?
= 2
! A > létrehozza az első sort, a >> hozzáfűzi a másodikat.

? Melyik paranccsal törölsz egy fájlt Linuxon?
= rm
! Vigyázz: nincs kuka, a törlés végleges.

? Melyik paranccsal látod egy systemd-szolgáltatás naplóját?
+ journalctl -u szolgáltatásnév
- systemctl enable szolgáltatásnév
- cat /dev/null
- service --log
! journalctl -u ssh --since today

? Melyik PowerShell cmdlet listázza a szolgáltatásokat?
= Get-Service
! Get-Service -Name Spooler

? Melyik asztali környezet a legkönnyebb (kevés erőforrás) a lecke példái közül?
- GNOME
- KDE Plasma
+ Xfce
- Aqua
! A Xubuntu ezt használja, régebbi gépekre is jó.
```

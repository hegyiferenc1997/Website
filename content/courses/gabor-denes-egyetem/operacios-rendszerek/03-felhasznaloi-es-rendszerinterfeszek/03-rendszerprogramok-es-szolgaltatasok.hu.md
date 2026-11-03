---
title: Rendszerprogramok, szolgáltatások és szkriptek
summary: Segédprogramok, háttérszolgáltatások (démonok), a systemctl és a Windows-szolgáltatások, valamint az első shell-szkript.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mik a **rendszerprogramok** (segédprogramok), és miben különböznek a kerneltől,
- mi a **szolgáltatás** / **démon**, és hogyan kezeled `systemctl`-lel és Windowson,
- hogyan írsz egy egyszerű **shell-szkriptet**, amely parancsokat automatizál.

## Rendszerprogramok

A **rendszerprogramok** (_system utilities_) az OS-szel együtt érkező, de **nem a kernelben** futó programok. Kényelmes felületet adnak a kernel szolgáltatásaihoz.

| Csoport            | Linux példa              | Windows példa                    |
| ------------------ | ------------------------ | -------------------------------- |
| fájlkezelés        | `ls`, `cp`, Fájlok       | Intéző, `robocopy`               |
| állapot-információ | `top`, `df`, `free`      | Feladatkezelő, Erőforrás-figyelő |
| szövegszerkesztés  | `nano`, `vim`            | Jegyzettömb                      |
| programfejlesztés  | `gcc`, `python3`, `make` | Visual Studio, `py`              |
| csomagkezelés      | `apt`, `snap`            | `winget`, Microsoft Store        |
| kommunikáció       | `ssh`, `curl`            | Távoli asztal, `curl`            |

## Szolgáltatások (démonok)

A **szolgáltatás** (Linuxon hagyományosan **démon**, _daemon_) olyan program, amely **a háttérben**, felhasználói ablak nélkül fut, gyakran már a rendszerindításkor elindul: pl. a hálózatkezelő, a nyomtatási sor, az időszinkron, a naplózás, egy webszerver. Linuxon a démonok neve gyakran **d** betűre végződik: `sshd`, `systemd-journald`, `cupsd`.

### Linux: systemd és systemctl

```bash
systemctl list-units --type=service --state=running   # futó szolgáltatások
systemctl status ssh                                   # egy szolgáltatás állapota
sudo systemctl start ssh        # indítás most
sudo systemctl stop ssh         # leállítás
sudo systemctl enable ssh       # induljon el a rendszerrel együtt
journalctl -u ssh --since today # a szolgáltatás mai naplója
```

(Az `ssh` szervert előbb telepíteni kell: `sudo apt install openssh-server`.)

### Windows: szolgáltatások

A **services.msc** ablakban (Win + R → `services.msc`) látod a szolgáltatásokat; az **Indítás típusa** lehet _Automatikus_, _Kézi_ vagy _Letiltva_. PowerShellben:

```powershell
Get-Service | Where-Object Status -eq Running | Select-Object -First 5
Get-Service -Name Spooler          # a nyomtatási sor
# Rendszergazdaként: Restart-Service Spooler
```

## Az első shell-szkript

A **szkript** parancsok sorozata egy fájlban, amelyet a shell egymás után végrehajt. Hozd létre az Ubuntu VM-ben:

```bash
nano rendszerinfo.sh
```

```bash
#!/bin/bash
# Rövid rendszerjelentés: ki vagyok, mi fut, mennyi a hely.
echo "Felhasználó: $USER"
echo "Gépnév: $(hostname)"
echo "Kernel: $(uname -r)"
echo "Futó folyamatok száma: $(ps -e --no-headers | wc -l)"
df -h / | tail -1
```

```bash
chmod +x rendszerinfo.sh   # futtathatóvá tesszük
./rendszerinfo.sh          # futtatás
```

Az első sor, a **shebang** (`#!/bin/bash`) mondja meg, melyik értelmező futtassa a fájlt. A `$( … )` egy parancs kimenetét illeszti be a szövegbe. Windowson ugyanerre a `.ps1` PowerShell-szkriptek valók.

## Összefoglalás

- A rendszerprogramok a kernel fölött futó segédprogramok (fájlkezelés, állapot, fejlesztés, csomagkezelés).
- A szolgáltatás/démon a háttérben fut; Linuxon `systemctl`, Windowson `services.msc` / `Get-Service` kezeli.
- A shell-szkript a parancsok automatizálása; az első sor a shebang (`#!/bin/bash`), futtatás előtt `chmod +x`.

## A lecke feladata

```quiz required
? Hogy hívják Linuxon hagyományosan a háttérben futó szolgáltatásokat?
= démon
= daemon
= demon
! Gyakran d-re végződik a nevük: sshd, cupsd.

? Melyik paranccsal állítod be, hogy egy szolgáltatás a rendszerrel együtt induljon el?
- sudo systemctl start ssh
+ sudo systemctl enable ssh
- sudo systemctl status ssh
- sudo systemctl list-units
! A start csak most indítja el, az enable minden indításkor.

? Hogy hívják a szkript első, `#!/bin/bash` sorát?
= shebang
! Megadja, melyik értelmező futtassa a fájlt.

? Melyik parancs teszi futtathatóvá a `rendszerinfo.sh` fájlt?
= chmod +x rendszerinfo.sh
! A jogosultságokról a biztonsági témakörben részletesen lesz szó.

? Melyik Windows-eszközben (Win + R) látod és állítod a szolgáltatások indítási típusát?
+ services.msc
- notepad.exe
- explorer.exe
- winver
! Indítás típusa: Automatikus, Kézi vagy Letiltva.
```

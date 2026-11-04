---
title: Linux-szerver telepítése és biztonságos beállítása
summary: Ubuntu Server telepítése, SSH-kulcsos belépés, felhasználók és sudo, frissítések, tűzfal (ufw), szolgáltatások a systemd-vel.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan telepítesz egy **Ubuntu Server**t (virtuális gépre vagy felhőbe),
- hogyan lépsz be biztonságosan **SSH-kulccsal**,
- az első lépéseket: **felhasználó**, **frissítés**, **tűzfal**, **szolgáltatások**.

## Telepítés

A szerverekre általában **LTS** (hosszú távon támogatott) kiadást telepítünk, mert évekig kap biztonsági javításokat. Az **Ubuntu Server 26.04 LTS** telepítője szöveges, grafikus felület nélküli:

1. töltsd le az ISO-t az ubuntu.com-ról, és indítsd el a gépet róla (vagy hozz létre egy VM-et VirtualBoxban, illetve egy felhős gépet),
2. válassz nyelvet, billentyűzetet, hálózatot (a DHCP általában elég, szervernek később fix címet adunk),
3. lemez: „egész lemez használata”, LVM-mel,
4. adj meg felhasználónevet, gépnevet (pl. `web01`) és erős jelszót,
5. **pipáld be az OpenSSH-szerver telepítését**,
6. újraindítás után jelentkezz be.

## Belépés SSH-val

Az **SSH** (Secure Shell, 22-es port) titkosított távoli parancssor. A saját gépedről (Windows PowerShellből is):

```powershell
ssh anna@192.168.56.10
```

A jelszavas belépésnél biztonságosabb a **kulcspár**: a titkos kulcs a te gépeden marad, a nyilvános kulcs a szerverre kerül.

```powershell
ssh-keygen -t ed25519                 # kulcspár létrehozása a saját gépen
ssh-copy-id anna@192.168.56.10        # Linux/macOS; Windowson a .pub fájl tartalmát
                                      # a szerver ~/.ssh/authorized_keys fájljába kell másolni
```

Ha a kulcsos belépés működik, a szerveren kapcsold ki a jelszavas és a root belépést (`/etc/ssh/sshd_config`: `PasswordAuthentication no`, `PermitRootLogin no`), majd `sudo systemctl restart ssh`.

## Az első lépések a szerveren

```bash
sudo apt update && sudo apt upgrade -y        # minden csomag frissítése
sudo apt install unattended-upgrades          # automatikus biztonsági frissítések

sudo adduser bela                              # új felhasználó
sudo usermod -aG sudo bela                     # rendszergazdai jog (sudo) neki

sudo ufw allow OpenSSH                         # tűzfal: az SSH maradjon elérhető!
sudo ufw allow 80,443/tcp                      # web
sudo ufw enable
sudo ufw status
```

A `sudo` egy parancsot rendszergazdai joggal futtat; a mindennapi munkát sima felhasználóként végezd (legkisebb jogosultság elve).

## Szolgáltatások: systemd

A háttérben futó programokat (**szolgáltatásokat**, démonokat) a **systemd** kezeli:

```bash
systemctl status ssh             # fut-e, mióta, utolsó naplósorok
sudo systemctl restart ssh       # újraindítás
sudo systemctl enable nginx      # induljon el a rendszerrel együtt
journalctl -u ssh --since today  # a szolgáltatás mai naplója
```

## Összefoglalás

- Szerverre LTS kiadás (Ubuntu Server 26.04 LTS), telepítéskor OpenSSH-szerverrel.
- SSH-kulcsos belépés, a jelszavas és root belépés tiltása.
- Frissítés (`apt`), külön felhasználó `sudo`-val, tűzfal (`ufw`), szolgáltatások (`systemctl`, `journalctl`).

## A lecke feladata

```quiz required
? Melyik porton fut alapértelmezetten az SSH?
= 22
! Secure Shell.

? Melyik parancs hoz létre SSH-kulcspárt a saját gépeden?
- ssh-copy-id
+ ssh-keygen -t ed25519
- sudo ufw enable
- systemctl status ssh
! A titkos kulcs nálad marad, a nyilvánosat másolod a szerverre.

? Mit kell engedélyezni a tűzfalon, **mielőtt** bekapcsolod egy távoli szerveren?
+ az SSH-t (különben kizárod magad)
- a nyomtatást
- a Bluetooth-t
- semmit
! sudo ufw allow OpenSSH.

? Melyik paranccsal nézed meg, fut-e egy szolgáltatás (pl. ssh)?
= systemctl status ssh
! A systemd kezeli a szolgáltatásokat.
```

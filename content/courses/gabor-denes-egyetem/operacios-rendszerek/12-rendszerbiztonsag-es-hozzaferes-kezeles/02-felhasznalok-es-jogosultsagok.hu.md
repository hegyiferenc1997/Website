---
title: Felhasználók és jogosultságok
summary: Felhasználók és csoportok, az rwx jogok és a chmod oktális számolással, a root és a sudo, a Windows UAC és az ACL.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan kezeli a Linux a **felhasználókat** és **csoportokat**,
- hogyan olvasod és állítod az **rwx** jogokat, és hogyan számolod ki a **chmod** oktális kódját,
- mi a **root**, a **sudo**, és hogyan működik ugyanez Windowson (**UAC**, **ACL**).

## Felhasználók és csoportok

Minden felhasználónak van egy **azonosítója** (UID) és legalább egy **csoportja** (GID). A **root** (UID 0) a rendszergazda: mindent megtehet.

```bash
id                       # a te UID-ed, GID-ed és csoportjaid
cat /etc/passwd | tail -3   # felhasználók (név:x:UID:GID:leírás:saját mappa:shell)
groups                   # csoportjaid (pl. sudo, vboxsf)
sudo adduser vendeg      # új felhasználó
sudo usermod -aG labor vendeg   # hozzáadás a labor csoporthoz
```

## Az rwx jogok

Minden fájlnak van **tulajdonosa** és **csoportja**, és háromféle jogot határoz meg háromféle szereplőre:

```bash
ls -l jegyzet.sh
-rwxr-x---  1  anna  labor  120  nov 3 10:00  jegyzet.sh
│└┬┘└┬┘└┬┘     │     │
│ │  │  │      │     └ csoport
│ │  │  │      └ tulajdonos
│ │  │  └ mindenki más (others): ---
│ │  └ a csoport (group): r-x
│ └ a tulajdonos (user): rwx
└ fájltípus: - = fájl, d = könyvtár, l = szimbolikus link
```

| Jog   | Fájlnál                  | Könyvtárnál                                 |
| ----- | ------------------------ | ------------------------------------------- |
| **r** | olvashatod               | listázhatod a tartalmát                     |
| **w** | módosíthatod             | létrehozhatsz, törölhetsz benne fájlt       |
| **x** | futtathatod              | **beléphetsz** (`cd`)                       |

## chmod oktálisan

Minden jog egy **szám**: **r = 4**, **w = 2**, **x = 1**. Szereplőnként összeadjuk, és a három számjegyet egymás mellé írjuk (tulajdonos, csoport, mások):

| Jogok        | Számolás                         | Kód     |
| ------------ | -------------------------------- | ------- |
| `rwxr-x---`  | (4+2+1) (4+0+1) (0+0+0)          | **750** |
| `rw-r--r--`  | (4+2) (4) (4)                    | **644** |
| `rwxr-xr-x`  | 7 5 5                            | **755** |
| `rw-------`  | 6 0 0                            | **600** |

```bash
chmod 644 jegyzet.txt     # szokásos fájl: én írom, mindenki olvassa
chmod 755 szkript.sh      # futtatható program
chmod 600 ~/.ssh/id_ed25519   # titkos kulcs: csak én
chmod u+x,g-w fajl        # szimbolikusan: a tulajdonosnak +x, a csoporttól −w
sudo chown anna:labor fajl    # tulajdonos és csoport módosítása
```

Az új fájlok alapjogait az **umask** határozza meg (Ubuntun általában `0002` vagy `0022` → az új fájl 664 vagy 644).

## root és sudo

A **sudo** egy-egy parancsot root jogokkal futtat – a **saját** jelszavaddal, és naplózva (`/var/log/auth.log`). Ubuntun nincs külön root-jelszó: a `sudo` csoport tagjai rendszergazdák. Ez a legkisebb jogosultság elve: csak akkor vagy root, amikor tényleg kell.

## Windows: UAC és ACL

- **UAC** (_User Account Control_, Felhasználói fiókok felügyelete): még a rendszergazda is **korlátozott jogokkal** dolgozik; ha egy program rendszergazdai jogot kér, egy elsötétített képernyőn **jóváhagyást** kér (hasonló a `sudo`-hoz).
- **ACL** (_Access Control List_): NTFS-en minden fájlhoz egy **lista** tartozik, amely tetszőleges felhasználóknak és csoportoknak ad finom jogokat (olvasás, írás, módosítás, teljes hozzáférés, megtagadás). A fájl **Tulajdonságok → Biztonság** fülén látod.

```powershell
whoami /groups              # milyen csoportokban vagy
icacls C:\Users\Public      # egy mappa ACL-je
```

(Linuxon is van ACL a hagyományos rwx mellett: `getfacl`, `setfacl`.)

## Összefoglalás

- Felhasználó: UID, csoport: GID; a root UID-je 0.
- Jogok: r = 4, w = 2, x = 1; tulajdonos, csoport, mások → pl. `rwxr-x---` = 750.
- A sudo egy parancsot futtat root jogokkal, naplózva.
- Windows: UAC jóváhagyás és NTFS ACL-ek.

## A lecke feladata

```quiz required
? Mi a `rw-rw-r--` jogok oktális kódja?
= 664
! (4+2)(4+2)(4) = 6 6 4.

? Mi a `rwx------` jogok oktális kódja?
= 700
! Csak a tulajdonos olvashat, írhat, futtathat.

? Mit jelent az `x` jog egy könyvtáron?
- Törölhető a könyvtár.
+ Be lehet lépni a könyvtárba (cd).
- A könyvtár programként futtatható.
- A könyvtár rejtett.
! A tartalom listázásához az r jog kell.

? Melyik a root felhasználó UID-je?
= 0
! A rendszergazdának mindig 0 az azonosítója.

? Hogy hívják azt a Windows-funkciót, amely rendszergazdai művelet előtt jóváhagyást kér?
= UAC
= User Account Control
= Felhasználói fiókok felügyelete
! A sudo megfelelője Windowson.
```

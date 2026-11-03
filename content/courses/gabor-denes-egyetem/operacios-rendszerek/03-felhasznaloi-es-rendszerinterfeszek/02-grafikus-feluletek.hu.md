---
title: Grafikus felhasználói felületek
summary: Ablakok, asztali környezetek, X11 és Wayland, és hogyan rajzol a Windows és a macOS.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **grafikus felhasználói felület** (GUI) és a **WIMP** elv,
- mi a különbség az **ablakkezelő**, a **kijelzőszerver** és az **asztali környezet** között,
- miben más a Linux, a Windows és a macOS grafikus felülete.

## GUI és WIMP

A **GUI** (_Graphical User Interface_) a parancsok begépelése helyett **vizuális elemeket** ad. Alapelve a **WIMP**: _Windows_ (ablakok), _Icons_ (ikonok), _Menus_ (menük), _Pointer_ (egérmutató). A Xerox PARC kutatói dolgozták ki az 1970-es években; az Apple Macintosh (1984) és a Windows tette népszerűvé.

| Szempont       | CLI                              | GUI                        |
| -------------- | -------------------------------- | -------------------------- |
| tanulás        | nehezebb, parancsokat kell tudni | könnyebb, „felfedezhető”   |
| sebesség       | gyakorlott kézben gyorsabb       | sok kattintás              |
| automatizálás  | könnyű (szkriptek)               | nehéz                      |
| erőforrásigény | kicsi                            | nagyobb (grafika, memória) |

A mai rendszerekben mindkettő megvan, és **kiegészítik egymást**. Az érintőképernyős (mobil) felület és a hangvezérlés is felhasználói interfész.

## A Linux grafikus „rétegei”

Linuxon a grafika több, cserélhető részből áll:

```text
alkalmazások (Firefox, Fájlok)
  ↓
asztali környezet: GNOME, KDE Plasma, Xfce   ← panelek, menük, beállítások, saját programok
  ↓
kompozitor / ablakkezelő                      ← hol van az ablak, kerete, átfedések
  ↓
kijelzőprotokoll: Wayland (új) vagy X11 (régi)
  ↓
kernel: DRM/KMS grafikus meghajtó → videokártya
```

- **X11** (X Window System, 1987): hálózati alapú, régi, sok biztonsági gyengeséggel (bármely program „lehallgathatja” a billentyűzetet).
- **Wayland**: a modern utód; egyszerűbb, biztonságosabb, az Ubuntu alapból ezt használja.
- **Asztali környezet**: az Ubuntu a **GNOME**-ot használja; a Kubuntu a **KDE Plasmát**, a Xubuntu a könnyű **Xfce**-t.

Az Ubuntu VM-ben:

```bash
echo $XDG_SESSION_TYPE     # wayland vagy x11
echo $XDG_CURRENT_DESKTOP  # pl. ubuntu:GNOME
```

## Windows és macOS

- **Windows**: a grafika a rendszer szerves része. A **Desktop Window Manager** (`dwm.exe`) a kompozitor, az **Intéző** (`explorer.exe`) adja a tálcát és a Start menüt. Ha az Intéző lefagy, a Feladatkezelőben újraindítható – a rendszer fut tovább.
- **macOS**: a **Quartz Compositor** rajzol, a **Finder** a fájlkezelő, a **Dock** az alkalmazássáv.

## Összefoglalás

- A GUI alapelve a WIMP: ablakok, ikonok, menük, mutató.
- Linuxon a grafika rétegzett: kijelzőprotokoll (X11/Wayland) → kompozitor → asztali környezet (GNOME, KDE, Xfce).
- Windowson a `dwm.exe` és az `explorer.exe`, macOS-en a Quartz és a Finder adja a felületet.

## A lecke feladata

```quiz required
? Mit jelent a WIMP betűszóban a P?
- Program
+ Pointer (mutató)
- Process
- Panel
! Windows, Icons, Menus, Pointer.

? Melyik a modern Linux kijelzőprotokoll, amely az X11-et váltja?
= Wayland
! Az Ubuntu alapból Waylandet használ.

? Melyik asztali környezetet használja alapból az Ubuntu?
+ GNOME
- KDE Plasma
- Xfce
- Aqua
! A Kubuntu KDE-t, a Xubuntu Xfce-t használ.

? Melyik Windows-folyamat adja a tálcát és a Start menüt?
- dwm.exe
+ explorer.exe
- svchost.exe
- wininit.exe
! A dwm.exe a kompozitor, az explorer.exe az Intéző.
```

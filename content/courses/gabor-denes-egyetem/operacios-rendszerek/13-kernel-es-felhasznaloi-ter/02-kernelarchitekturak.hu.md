---
title: Kernelarchitektúrák
summary: Monolitikus kernel, mikrokernel, hibrid kernel és exokernel – előnyeik, hátrányaik és a valódi rendszerek (Linux, Windows NT, macOS, MINIX, seL4).
minutes: 25
---

## Amit ebben a leckében megtanulsz

- milyen fő **kernelarchitektúrák** léteznek,
- mi az előnyük és hátrányuk **sebesség**, **megbízhatóság** és **bővíthetőség** szempontjából,
- melyik mai rendszer melyik típusba tartozik, és mi volt a híres **Tanenbaum–Torvalds vita**.

## Monolitikus kernel

A **monolitikus** kernelben szinte **minden** OS-szolgáltatás – ütemező, memóriakezelés, fájlrendszerek, hálózati verem, illesztőprogramok – **egyetlen nagy programként**, kernel módban, közös címtérben fut.

```text
felhasználói tér:   [ alkalmazások ]  [ shell ]  [ könyvtárak ]
──────────────────────── rendszerhívások ────────────────────────
kernel mód:         [ ütemező | memória | fájlrendszer | hálózat | driverek ]  ← egy program
──────────────────────────────────────────────────────────────────
hardver
```

- **Előny**: **gyors** – a részek közönséges függvényhívással érik el egymást.
- **Hátrány**: egy hibás illesztőprogram **az egész kernelt** lerántja; nagy, bonyolult kód.
- **Példák**: **Linux**, a klasszikus UNIX-ok, FreeBSD.

A Linux ezt **betölthető modulokkal** teszi rugalmassá: az illesztőprogramok futás közben betölthetők és eltávolíthatók – de betöltve ugyanúgy kernel módban futnak (következő lecke).

## Mikrokernel

A **mikrokernel** csak a legszükségesebbet tartja kernel módban: **folyamatok/szálak**, **memória-címterek**, **üzenetküldés** (IPC), alapvető ütemezés. Minden más – fájlrendszer, driverek, hálózat – **felhasználói módú szerverfolyamat**, és üzenetekkel kommunikálnak.

```text
felhasználói tér:  [ alkalmazás ] ⇄ [ fájlrendszer-szerver ] ⇄ [ lemez-driver ] ⇄ [ hálózat ]
                                       ↑↓ üzenetek a kernelen át ↑↓
kernel mód:        [ mikrokernel: IPC, ütemezés, címterek ]
```

- **Előny**: **megbízható és biztonságos** – ha egy driver összeomlik, újraindítható, a rendszer fut tovább; kicsi kernel, könnyebb ellenőrizni (az **seL4** mikrokernel helyességét matematikailag bizonyították).
- **Hátrány**: **lassabb** – minden kérés több üzenetet és módváltást igényel.
- **Példák**: **MINIX 3**, **QNX** (autók, ipari rendszerek), **seL4**, L4 család.

## Hibrid kernel

A **hibrid** kernel mikrokernel-szerű, moduláris felépítésű, de a teljesítmény miatt sok szolgáltatást (fájlrendszer, grafika egy része, driverek) mégis **kernel módban** futtat.

- **Windows NT** (Windows 10/11): a kernel (`ntoskrnl.exe`) a mikrokernel-szerű magból és a fölötte lévő **Executive**-ból áll, mind kernel módban; a **HAL** (hardverabsztrakciós réteg) a hardverkülönbségeket rejti el.
- **macOS / iOS – XNU**: a **Mach** mikrokernel és a **BSD** UNIX-réteg egyetlen kernel módú programban, plusz az **IOKit** driverkeretrendszer.

## Exokernel és unikernel (érdekességként)

- **Exokernel**: a kernel csak biztonságosan **elosztja** a hardvert, az absztrakciókat (fájl, folyamat) könyvtárak adják a programoknak. Főleg kutatási irány.
- **Unikernel**: az alkalmazás és a szükséges OS-részek **egyetlen** speciális programmá fordulnak, amely közvetlenül a hipervizoron fut – felhőben, apró és gyors szolgáltatásokhoz.

## A Tanenbaum–Torvalds vita

1992-ben **Andrew S. Tanenbaum** (a MINIX szerzője) azt írta a Usenetre: „A Linux elavult”, mert monolitikus, a jövő pedig a mikrokernelé. **Linus Torvalds** azt válaszolta, hogy a monolitikus kernel egyszerűbb és gyorsabb, és a gyakorlatban jobban működik. Mindkettőjüknek részben igaza lett: a Linux uralja a szervereket és az Androidot, a mikrokernelek pedig ott nyertek, ahol a megbízhatóság a legfontosabb (QNX autókban; a MINIX egy változata pedig a 2015 utáni Intel processzorok beépített felügyeleti egységében (Intel ME) fut).

## Összevetés

| Szempont        | Monolitikus   | Mikrokernel    | Hibrid                  |
| --------------- | ------------- | -------------- | ----------------------- |
| sebesség        | **nagy**      | kisebb         | nagy                    |
| megbízhatóság   | egy driverhiba mindent megállít | **nagy** | közepes      |
| kernel mérete   | nagy          | **kicsi**      | nagy                    |
| példa           | Linux, FreeBSD | MINIX 3, QNX, seL4 | Windows NT, macOS XNU |

## Összefoglalás

- Monolitikus: minden kernel módban, gyors, de egy hiba mindent megállít (Linux).
- Mikrokernel: csak IPC, ütemezés, címterek a kernelben, a többi felhasználói módú szerver – megbízható, de lassabb (MINIX, QNX, seL4).
- Hibrid: moduláris, de sok szolgáltatás kernel módban (Windows NT, macOS XNU).

## A lecke feladata

```quiz required
? Melyik kerneltípus a Linux?
+ monolitikus (betölthető modulokkal)
- mikrokernel
- hibrid
- exokernel
! Minden szolgáltatás kernel módban, közös címtérben fut.

? Melyik kerneltípusnál futnak a fájlrendszer és az illesztőprogramok felhasználói módú szerverfolyamatként?
- monolitikus
+ mikrokernel
- hibrid
- unikernel
! Pl. MINIX 3, QNX.

? Mi a mikrokernel fő hátránya?
- kevésbé megbízható
+ lassabb, mert a kérések több üzenetet és módváltást igényelnek
- túl nagy a kernel
- nem támogat illesztőprogramokat
! Cserébe egy driver összeomlása nem állítja le a rendszert.

? Melyik mikrokernel köré épül a macOS XNU kernele?
= Mach
! A Mach mellett egy BSD UNIX-réteg is van benne.

? Ki írta a MINIX-et, és vitatkozott Linus Torvaldsszal 1992-ben?
+ Andrew S. Tanenbaum
- Dennis Ritchie
- Richard Stallman
- Dave Cutler
! „A Linux elavult” – írta a Usenetre.
```

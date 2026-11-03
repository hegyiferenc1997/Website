---
title: Hogyan fejlesztenek egy operációs rendszert?
summary: A Linux kernel fejlesztési folyamata, a Windows kiadási rendje, a programnyelvek (C, Rust) és a tesztelés.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan készül egy új **Linux kernel**: karbantartók, levelezőlisták, **beolvasztási ablak**, rc-kiadások,
- hogyan fejlesztik és frissítik a **Windowst** és az **Ubuntut**,
- milyen **nyelveken** írják az operációs rendszereket, és hogyan **tesztelik** őket.

## A Linux kernel fejlesztése

A Linux a világ egyik legnagyobb közös szoftverprojektje: egy kiadásban jellemzően **ezernél több** fejlesztő (cégek és önkéntesek) változtatásai vannak, a forráskód több tízmillió sor.

A folyamat:

1. A fejlesztők **foltokat** (_patch_) küldenek e-mailben az adott alrendszer **levelezőlistájára** (pl. hálózat, USB, fájlrendszerek).
2. Az alrendszer **karbantartója** (_maintainer_) átnézi, kéri a javításokat, majd beveszi a saját **git**-ágába.
3. Egy új verzió elején kéthetes **beolvasztási ablak** (_merge window_) nyílik: Linus Torvalds ekkor húzza be az alrendszerek változásait.
4. Utána hetente jön egy **rc** (_release candidate_) kiadás (`-rc1`, `-rc2` …), ekkor már **csak hibajavítás** kerülhet be.
5. Általában az `-rc7` vagy `-rc8` után jelenik meg a kész verzió – összesen kb. **9–10 hét**.

A kész verziókat a **stabil** ág karbantartói még hónapokig, az évente kijelölt **LTS** kerneleket évekig javítják. A disztribúciók (Ubuntu, Fedora) ezekből választanak, és saját javításokkal adják ki.

> A **git** verziókezelőt is Linus Torvalds írta 2005-ben, éppen a kernel fejlesztéséhez.

## A Windows és az Ubuntu kiadási rendje

| Rendszer    | Ritmus                                                                                                                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Windows** | évente egy nagyobb funkciófrissítés (pl. 24H2, 25H2), havonta biztonsági javítások: a **„Patch Tuesday”** minden hónap **második keddjén**; előzetes tesztelés a **Windows Insider** programban |
| **Ubuntu**  | **április és október**: új kiadás (ÉÉ.HH, pl. 26.04); **kétévente** (páros év április) **LTS**; a köztes kiadások 9 hónapig támogatottak                                                        |

## Programnyelvek

- **C**: a kernelek fő nyelve (Linux, Windows NT, XNU) – közel van a hardverhez, gyors, és pontosan irányítható vele a memória.
- **Assembly**: a legalacsonyabb részek (rendszerindítás, megszakításkezelők, környezetváltás) processzorfüggő kódja.
- **Rust**: 2022 óta (6.1-es kernel) a Linuxban is írhatók benne illesztőprogramok, és a Windows kernelbe is kerül Rust kód. Előnye a **memóriabiztonság**: a fordító megakadályozza a tipikus hibákat (felszabadított memória használata, puffertúlcsordulás), amelyek a biztonsági rések nagy részét okozzák.
- **C++**, **Objective-C**, **Swift**: felhasználói térben és egyes driverkeretrendszerekben (macOS IOKit).

## Tesztelés

Egy OS-hibának óriási a hatása, ezért többszintű tesztelés kell:

- **automatikus tesztek** minden változtatásra (Linux: KernelCI, kselftest; fuzzing a syzkallerrel, amely véletlenszerű rendszerhívásokkal keres összeomlást),
- **regressziós tesztek**: egy javítás ne rontson el mást,
- **előzetes kiadások** önkéntes tesztelőknek (rc-kernelek, Windows Insider, Ubuntu béta),
- **fokozatos kihelyezés**: a frissítést előbb a gépek kis része kapja meg.

A 2024. júliusi **CrowdStrike-incidens** – egy biztonsági szoftver hibás kernel-meghajtó frissítése világszerte kb. 8,5 millió Windows-gépet állított le kék halállal – megmutatta, miért fontos a fokozatos kihelyezés és miért kockázatos a kernel módú kód.

## Összefoglalás

- Linux: foltok levelezőlistán → karbantartó → kéthetes beolvasztási ablak → heti rc-k → kész verzió ~9–10 hetente; stabil és LTS ágak.
- Windows: éves funkciófrissítés, havi Patch Tuesday (2. kedd); Ubuntu: április/október, kétévente LTS.
- Nyelvek: C és assembly, egyre több Rust a memóriabiztonság miatt.
- Tesztelés: automatikus tesztek, fuzzing, előzetes kiadások, fokozatos kihelyezés.

## A lecke feladata

```quiz required
? Hány hétig tart a Linux kernel beolvasztási ablaka (merge window)?
= 2
= kettő
! Utána már csak hibajavítás kerülhet be.

? Mit jelent az rc rövidítés a kernelverzióknál (pl. 7.1-rc3)?
+ release candidate (kiadásra jelölt)
- root controller
- remote copy
- real-time core
! Hetente jön egy, amíg a verzió elég stabil.

? A hónap hányadik keddjén adja ki a Microsoft a havi biztonsági javításokat?
= 2
= második
! Patch Tuesday.

? Melyik memóriabiztos nyelven írhatók 2022 óta Linux-illesztőprogramok?
= Rust
! A 6.1-es kerneltől.

? Ki írta a git verziókezelőt?
+ Linus Torvalds
- Bill Gates
- Andrew Tanenbaum
- Guido van Rossum
! 2005-ben, a kernel fejlesztéséhez.
```

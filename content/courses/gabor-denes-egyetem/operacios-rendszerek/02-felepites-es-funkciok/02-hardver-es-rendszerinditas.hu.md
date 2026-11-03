---
title: A hardver és a rendszerindítás
summary: Processzor, memória, buszok és megszakítások – és mi történik a bekapcsolástól a bejelentkezésig.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- milyen **hardverelemekkel** dolgozik az OS (processzor, memóriahierarchia, perifériák),
- mi a **megszakítás** (_interrupt_), és miért ez az OS „ébresztőórája”,
- hogyan **indul el** a számítógép: firmware → rendszerbetöltő → kernel → első folyamat.

## A számítógép fő részei

- **Processzor (CPU)**: utasításokat hajt végre. Fontos regiszterei: a **programszámláló** (PC – a következő utasítás címe), a **veremmutató** (SP) és az **állapotregiszter** (benne a módbit: kernel- vagy felhasználói mód).
- **Memória**: a futó programok és adataik helye.
- **Perifériák**: lemez, billentyűzet, hálózati kártya, kijelző – mindegyikhez egy **vezérlő** (_controller_) tartozik.
- **Buszok** kötik össze őket.

### A memóriahierarchia

| Szint             | Tipikus méret | Elérési idő      |
| ----------------- | ------------- | ---------------- |
| regiszterek       | < 1 KB        | < 1 ns           |
| gyorsítótár (cache L1–L3) | 1–64 MB | 1–10 ns       |
| főmemória (RAM)   | 8–64 GB       | ~100 ns          |
| SSD               | 0,5–4 TB      | ~0,1 ms (100 000 ns) |
| HDD               | 1–20 TB       | ~10 ms           |

Minél lejjebb megyünk, annál nagyobb és olcsóbb, de **lassabb** a tár. Az OS egyik fő feladata, hogy a gyakran használt adatok a gyorsabb szinten legyenek.

## Megszakítások

A **megszakítás** egy jelzés a processzornak, hogy valami figyelmet igényel. A CPU ilyenkor **félbehagyja** az aktuális munkát, elmenti az állapotát, és lefuttatja a megfelelő **megszakításkezelőt** (az OS része), majd folytatja ott, ahol abbahagyta.

| Fajta                     | Ki váltja ki?                 | Példa                                    |
| ------------------------- | ----------------------------- | ---------------------------------------- |
| **hardveres** megszakítás | egy eszköz                    | lenyomtál egy billentyűt, megjött egy hálózati csomag, lejárt az időzítő |
| **kivétel** (_exception_) | a futó utasítás hibája        | nullával osztás, érvénytelen memóriacím  |
| **szoftveres** megszakítás (_trap_) | szándékosan a program | rendszerhívás (pl. fájlt akar olvasni)   |

Az **időzítő** (_timer_) megszakítás különösen fontos: rendszeresen visszaadja a vezérlést az OS-nek, így egy végtelen ciklusban ragadt program sem tudja „elvenni” a gépet.

## A rendszerindítás (boot)

```text
bekapcsolás
  → firmware (UEFI): hardverteszt (POST), indítóeszköz keresése
  → rendszerbetöltő: GRUB (Linux) / Windows Boot Manager
  → kernel betöltése és indítása: hardver felismerése, meghajtók
  → első felhasználói folyamat: systemd (PID 1) / smss.exe, wininit.exe
  → szolgáltatások, bejelentkező képernyő
```

1. A **firmware** (ma **UEFI**, régen BIOS) az alaplapon lévő program; ellenőrzi a hardvert, és megkeresi az **EFI rendszerpartíciót**.
2. A **rendszerbetöltő** (_boot loader_) betölti a kernelt a memóriába. Secure Bootnál az aláírást is ellenőrzi.
3. A **kernel** inicializálja a memóriakezelést, az ütemezőt, betölti az illesztőprogramokat.
4. Elindul az **első folyamat**: Linuxon a **systemd** (folyamatazonosító: **1**), amely a többi szolgáltatást indítja.

Az Ubuntu VM-ben megnézheted, mennyi ideig tartott az indítás:

```bash
systemd-analyze          # összes indítási idő
systemd-analyze blame | head   # a leglassabb szolgáltatások
ps -p 1 -o pid,comm      # ki az 1-es folyamat?
```

## Összefoglalás

- A CPU regiszterei közül a programszámláló és az állapotregiszter (módbit) a legfontosabb az OS számára.
- A memóriahierarchia: regiszter → cache → RAM → SSD → HDD; lefelé nagyobb, de lassabb.
- A megszakítás félbeszakítja a CPU-t; fajtái: hardveres, kivétel, szoftveres (trap).
- Indítás: UEFI → rendszerbetöltő → kernel → első folyamat (Linuxon systemd, PID 1).

## A lecke feladata

```quiz required
? Melyik regiszter tárolja a következő végrehajtandó utasítás címét?
+ programszámláló (PC)
- veremmutató (SP)
- akkumulátor
- állapotregiszter
! Program Counter – más néven utasításmutató (IP).

? Melyik megszakítás biztosítja, hogy egy végtelen ciklusban ragadt program se foglalja le örökre a processzort?
- billentyűzet-megszakítás
+ időzítő (timer) megszakítás
- nullával osztás kivétel
- lemezmegszakítás
! Az időzítő rendszeresen visszaadja a vezérlést az OS-nek.

? Mi a folyamatazonosítója (PID) a systemd-nek Linuxon?
= 1
! Ez az első felhasználói folyamat, minden más az ő leszármazottja.

? Milyen fajta megszakítás a nullával osztás?
- hardveres megszakítás
+ kivétel (exception)
- rendszerhívás
- időzítő megszakítás
! A futó utasítás hibája váltja ki.

? Hányszor lassabb nagyságrendileg egy SSD elérése (~100 000 ns) a RAM-énál (~100 ns)?
= 1000
! 100 000 / 100 = 1000.
```

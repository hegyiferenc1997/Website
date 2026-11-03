---
title: A rendszerhívás fogalma
summary: Hogyan kér szolgáltatást egy program a kerneltől, mi történik a trap során, és miért drága egy rendszerhívás.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **rendszerhívás** (_system call_), és miért nem érheti el egy program közvetlenül a hardvert,
- milyen **lépésekben** jut el a vezérlés a programból a kernelbe és vissza,
- hogyan **figyelheted meg** a rendszerhívásokat (`strace`).

## Miért kell rendszerhívás?

A felhasználói programok **felhasználói módban** futnak: nem olvashatnak közvetlenül lemezt, nem küldhetnek hálózati csomagot, nem nyúlhatnak más folyamatok memóriájához. Ez a **védelem** alapja. Ha egy programnak ilyesmire van szüksége, **meg kell kérnie a kernelt** – ez a **rendszerhívás**: a kernel által nyújtott szolgáltatás hívása, ellenőrzött belépési ponton keresztül.

Példa: amikor egy Python program kiírja, hogy `print("szia")`, végül egy `write` rendszerhívás jut el a kernelhez, amely a szöveget a terminálba juttatja.

## A rendszerhívás lépései

```text
felhasználói mód                         kernel mód
────────────────                         ──────────
1. a program meghívja a write() könyvtári függvényt
2. a könyvtár regiszterekbe teszi:
   - a rendszerhívás számát (write = 1 x86-64 Linuxon)
   - a paramétereket (fájlleíró, puffer címe, hossz)
3. kiadja a speciális utasítást (syscall / trap)  ──►  4. a CPU kernel módba vált,
                                                         a rendszerhívás-táblából kikeresi
                                                         a 1-es számú kezelőt
                                                      5. a kernel ELLENŐRZI a paramétereket
                                                         (jó-e a fájlleíró, a te memóriád-e a puffer)
                                                      6. elvégzi a munkát
7. a program folytatódik a visszatérési értékkel ◄──  visszavált felhasználói módba
   (pl. kiírt bájtok száma, vagy −1 hiba esetén)
```

Lényeges pontok:

- a program **nem ugorhat** tetszőleges kernelcímre – csak a rendszerhívás-táblán keresztül léphet be;
- a kernel **soha nem bízik** a paraméterekben, mindent ellenőriz;
- hiba esetén a visszatérési érték jelzi a gondot, C-ben az `errno` változó mondja meg az okát (pl. `ENOENT` = nincs ilyen fájl).

## Mennyibe kerül?

Egy rendszerhívás a módváltás, az ellenőrzések és a gyorsítótárak miatt **sokszor drágább** egy közönséges függvényhívásnál (nagyságrendileg száz nanoszekundum kontra néhány ns). Ezért **pufferelnek** a könyvtárak: a `printf` nem hív minden karakternél `write`-ot, hanem összegyűjti, és egyszerre írja ki.

## Megfigyelés: strace

Az Ubuntu VM-ben a `strace` kiírja egy program összes rendszerhívását:

```bash
sudo apt install -y strace
strace -c ls > /dev/null        # összesítés: melyik hívásból hány volt
strace -e trace=openat,read,write cat /etc/hostname
```

A második parancs kimenetében látod, ahogy a `cat` megnyitja (`openat`), beolvassa (`read`) és kiírja (`write`) a fájlt. Windowson hasonló eszköz a **Process Monitor** (Sysinternals).

## Összefoglalás

- A rendszerhívás a kernel szolgáltatásának ellenőrzött hívása a felhasználói programból.
- Lépései: paraméterek és hívásszám regiszterekbe → `syscall` utasítás → kernel mód → ellenőrzés → munka → vissza.
- Drágább egy függvényhívásnál, ezért pufferelnek a könyvtárak; `strace`-szel megfigyelhető.

## A lecke feladata

```quiz required
? Miért nem olvashat egy felhasználói program közvetlenül a lemezről?
+ Mert felhasználói módban fut, és a hardvert csak a kernel érheti el.
- Mert a lemez nincs bekapcsolva.
- Mert a programok nem ismerik a lemez címét.
- Mert a lemezt csak a BIOS olvashatja.
! A rendszerhívás az ellenőrzött belépési pont a kernelbe.

? Melyik x86-64 utasítással lép be egy Linux program a kernelbe rendszerhívásnál?
= syscall
! Régebben az int 0x80 szoftveres megszakítás.

? Mi a kernel első dolga, miután megkapta a rendszerhívást?
- Azonnal végrehajtja a kérést.
+ Ellenőrzi a paramétereket (pl. a fájlleírót és a puffer címét).
- Újraindítja a programot.
- Kiírja a kérést a naplóba.
! A kernel soha nem bízik a felhasználói programban.

? Melyik Linux-eszköz írja ki egy program összes rendszerhívását?
= strace
! strace -c ls – összesítés.

? Miért gyűjti össze a printf a kiírandó szöveget, mielőtt egyszerre kiírja?
+ Mert a rendszerhívás drága, így kevesebb write hívás kell.
- Mert a terminál csak egész sorokat fogad.
- Mert a kernel nem tud egy karaktert kiírni.
- Mert így titkosítva marad a szöveg.
! Pufferelés: sok kis kiírás helyett egy nagyobb.
```

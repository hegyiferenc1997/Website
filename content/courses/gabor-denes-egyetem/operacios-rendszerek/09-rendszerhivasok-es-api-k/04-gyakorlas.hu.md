---
title: Gyakorlás – rendszerhívások
summary: Rendszerhívások nyomon követése strace-szel, ellenőrző kérdések és összefoglaló feladatlap.
minutes: 25
kind: practice
---

## Nyomozás strace-szel (Ubuntu VM)

1. `strace -c echo szia` – hány `write` hívás volt? Mennyi az összes hívás?
2. `strace -e trace=openat cat /etc/hostname` – melyik fájlokat nyitja meg a `cat` a `/etc/hostname`-en kívül? (Tipp: a C könyvtárat és a nyelvi beállításokat.)
3. `strace -f -e trace=clone,execve bash -c "ls"` – látod a `clone` (a fork Linuxos megvalósítása) és az `execve` hívásokat?
4. `ls /nincs 2> /dev/null; echo $?` – a kilépési kód (2) jelzi a hibát, a hibaüzenet pedig a „semmibe” ment.

## Ellenőrző kérdések

<details>
<summary>1. Miért ellenőrzi a kernel a rendszerhívás összes paraméterét?</summary>

Mert a felhasználói program lehet hibás vagy rosszindulatú. Ha a kernel ellenőrzés nélkül írna egy megadott címre, egy program a kernel vagy más folyamat memóriáját írhatná felül.

</details>

<details>
<summary>2. Miért nem írnak a programozók közvetlenül rendszerhívásokat (syscall utasítással)?</summary>

Mert az nem hordozható (a számozás OS-enként és architektúránként eltér), kényelmetlen, és lemondanánk a könyvtár pufferezéséről és hibakezeléséről. A libc és a POSIX API ezt elfedi.

</details>

<details>
<summary>3. Miért van szükség külön stderr-re, ha van stdout?</summary>

Hogy a program kimenete és a hibaüzenetek szétválaszthatók legyenek: például `program > eredmeny.txt` mellett a hibák továbbra is a terminálon jelennek meg, nem keverednek az eredménybe.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik fájlleíró a szabványos kimenet (stdout)?
= 1
! 0 = stdin, 1 = stdout, 2 = stderr.

? Mi a POSIX `fork` + `exec` páros Win32 megfelelője?
= CreateProcess
! Egy hívással létrehozza és elindítja az új folyamatot.

? Melyik formátumú egy Windows `.exe` fájl?
- ELF
+ PE
- Mach-O
- ISO
! Portable Executable.

? Mit ad vissza egy sikertelen POSIX rendszerhívás jellemzően?
= -1
! A hiba okát az errno változó tárolja.

? Melyik shell-átirányítás küldi a hibaüzeneteket egy fájlba?
- > hibak.txt
+ 2> hibak.txt
- < hibak.txt
- | hibak.txt
! A 2-es fájlleíró a stderr.

? Melyik csoportba tartozik a `chmod` rendszerhívás?
- információ
- kommunikáció
+ védelem
- eszközkezelés
! A fájl jogosultságait állítja.
```

---
title: Socketek és folyamatok közötti kommunikáció
summary: A socket API lépései szerveren és kliensen, egy mini Python szerver, valamint a cső, a közös memória és az üzenetsor.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **socket**, és milyen **rendszerhívásokkal** épül fel egy TCP-kapcsolat,
- hogyan ír egy egyszerű **szervert** és **klienst** pár sorban,
- milyen módokon kommunikálhat két folyamat **egy gépen belül** (IPC).

## A socket

A **socket** a kommunikáció **végpontja**: a program és a kernel hálózati verme közötti kapu. A program számára olyan, mint egy fájl – egy **fájlleírót** kap, amelybe írhat és amelyből olvashat. A **Berkeley socket API** (1983, BSD UNIX) ma szinte minden rendszeren ugyanígy működik, Windowson **Winsock** néven.

```text
SZERVER                                 KLIENS
socket()     ← végpont létrehozása      socket()
bind(port)   ← címhez, porthoz kötés
listen()     ← figyelés
accept()  ◄──── háromutas kézfogás ────  connect(cím, port)
recv() / send()  ◄──── adatok ────►      send() / recv()
close()                                 close()
```

Az `accept` **blokkoló** hívás: a szerver addig várakozik, amíg kliens nem jelentkezik. Minden új kapcsolathoz **új socketet** ad vissza, így egy szerver sok klienst szolgálhat ki (szálakkal vagy aszinkron I/O-val).

## Mini visszhangszerver Pythonban

Mentsd el az Ubuntu VM-ben `szerver.py` néven, és futtasd: `python3 szerver.py`.

```python
# Egyszerű TCP visszhangszerver: amit a kliens küld, nagybetűsen visszaküldi.
import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:   # IPv4 + TCP
    s.bind(("127.0.0.1", 5000))     # csak a saját gépről érhető el, az 5000-es porton
    s.listen()
    print("Várok egy kliensre…")
    kapcsolat, cim = s.accept()     # blokkol, amíg valaki nem csatlakozik
    with kapcsolat:
        print("Csatlakozott:", cim)
        adat = kapcsolat.recv(1024)
        kapcsolat.sendall(adat.upper())
```

Egy **másik** terminálban a kliens lehet a `nc` (netcat) program, vagy egy hasonló pár soros Python program a `connect` hívással:

```bash
echo "szia kernel" | nc 127.0.0.1 5000     # válasz: SZIA KERNEL
ss -tlnp | grep 5000                       # miközben a szerver fut: LISTEN állapot
```

## Folyamatok közötti kommunikáció (IPC)

Ha két folyamat **ugyanazon a gépen** fut, a hálózatnál gyorsabb, egyszerűbb eszközök is vannak:

| Módszer                   | Leírás                                                                                               | Példa                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------ |
| **cső** (_pipe_)          | egyirányú bájtfolyam szülő és gyerek között                                                          | `ls \| wc -l` a shellben |
| **nevesített cső** (FIFO) | csőnek neve van a fájlrendszerben, bárki megnyithatja                                                | `mkfifo cso`             |
| **UNIX-socket**           | socket, de fájlútvonallal, hálózat nélkül                                                            | `/run/docker.sock`       |
| **közös memória**         | ugyanaz a memórialap mindkét folyamat címterében – a leggyorsabb, de szinkronizálni kell (szemafor!) | `mmap`, `shm_open`       |
| **üzenetsor**             | a kernel tárolja az üzeneteket, sorrendben adja át                                                   | POSIX `mq_open`          |
| **jelzések**              | rövid értesítés (szám), adatot nem visz                                                              | `kill -TERM`             |

Windowson is megvannak a megfelelőik: _anonymous_ és _named pipe_, közös memória (`CreateFileMapping`), és a Windows-üzenetek az ablakok között.

## Összefoglalás

- A socket a kommunikáció végpontja, a program fájlleíróként kezeli.
- Szerver: socket → bind → listen → accept → recv/send; kliens: socket → connect → send/recv.
- IPC egy gépen: cső, nevesített cső, UNIX-socket, közös memória (a leggyorsabb), üzenetsor, jelzések.

## A lecke feladata

```quiz required
? Melyik socket-hívással köti a szerver a socketet egy porthoz?
- listen
+ bind
- accept
- connect
! bind(("127.0.0.1", 5000))

? Melyik hívással kezdeményez kapcsolatot a kliens?
= connect
! A szerver oldalon ennek az accept felel meg.

? Melyik hívás blokkol a szerveren, amíg egy kliens nem csatlakozik?
+ accept
- bind
- socket
- close
! Minden kapcsolathoz új socketet ad vissza.

? Melyik IPC-módszer a leggyorsabb, de külön szinkronizálást igényel?
- cső
- üzenetsor
+ közös memória
- jelzés
! Nincs másolás, de a versenyhelyzetet szemaforral kell kezelni.

? Melyik Linux-parancs hoz létre nevesített csövet?
= mkfifo
! mkfifo cso – utána két terminálból írható és olvasható.
```

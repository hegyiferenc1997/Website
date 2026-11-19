---
title: Gyakorlás – virtualizáció
summary: Élő migráció szimulációja Pythonban, kipróbálós feladat a VirtualBoxban és Dockerrel, ellenőrző kérdések és összefoglaló feladatlap.
minutes: 25
kind: practice
---

## Élő migráció számokkal

Az előző lecke élő migrációja körökben halad: először az egész memória megy át, majd mindig csak az, ami közben módosult. Futtasd, majd próbáld ki más értékekkel (pl. `piszkolas = 900`)!

```python run
# Élő migráció szimulációja: minden körben átküldjük a piszkos lapokat, közben újak keletkeznek.
memoria = 4096        # a VM memóriája (MB)
savszel = 1000        # hálózati sebesség (MB/s)
piszkolas = 200       # ennyi MB memória módosul másodpercenként futás közben

kuldendo = memoria    # első kör: az egész memória
kor = 1
while kuldendo > 50:  # 50 MB alatt már megállíthatjuk a VM-et
    ido = kuldendo / savszel                 # ennyi ideig tart a kör
    print(f"{kor}. kör: {kuldendo:7.1f} MB, {ido:.3f} s")
    kuldendo = piszkolas * ido               # közben ennyi lap lett újra piszkos
    kor += 1
print(f"megállás: {kuldendo:.1f} MB maradék, kb. {kuldendo / savszel * 1000:.0f} ms szünet")
```

Ha a VM gyorsabban „piszkítja” a memóriát, mint ahogy a hálózat átviszi (`piszkolas >= savszel`), a migráció sosem érne véget – ilyenkor a hipervizor lelassítja a VM-et, vagy hamarabb megállítja.

## Kipróbálós feladat

1. A VirtualBoxban nézd meg az Ubuntu VM beállításait: **Rendszer → Gyorsítás** – melyik paravirtualizációs felület (_KVM_, _Hyper-V_) van kiválasztva?
2. Az Ubuntu VM-ben futtasd: `lscpu | grep -i hypervisor` és `systemd-detect-virt`. Mit írnak ki?
3. Telepítsd a Dockert (előző lecke), indíts egy konténert (`docker run -it --rm ubuntu bash`), és futtasd benne a `ps aux` és a `hostname` parancsot. Hasonlítsd össze a VM-ben kapott eredménnyel.

<details>
<summary>Mit kell látnod?</summary>

1. Linux vendégnél alapból **KVM**, Windowsnál **Hyper-V** felület: a vendég OS ezen keresztül tudja, hogy VM-ben fut, és gyorsabb órát és megszakításokat kap.
2. `Hypervisor vendor: KVM` és `oracle` (VirtualBox) – a vendég tudja, hogy virtualizált.
3. A konténerben csak a `bash` és a `ps` látszik, a gépnév egy véletlen azonosító: ez a PID és UTS névtér hatása. A kernel (`uname -r`) viszont ugyanaz, mint a VM-é.

</details>

## Ellenőrző kérdések

<details>
<summary>1. Miért gyorsabb a konténer indulása, mint a virtuális gépé?</summary>

Mert nem kell kernelt betölteni és egy teljes operációs rendszert elindítani: a konténer csak egy új folyamat a már futó gazda kernelen, saját névterekkel és cgroups-korlátokkal.

</details>

<details>
<summary>2. Futtatható-e Windows egy Linux-konténerben? És Linux virtuális gépen?</summary>

Linux-konténerben nem, mert a konténer a gazda Linux kernelét használja. Virtuális gépben igen, mert a VM saját kernelt futtat a virtuális hardveren.

</details>

<details>
<summary>3. Miért nem fut a VirtualBox 64 bites vendéggel, ha a BIOS-ban ki van kapcsolva a VT-x?</summary>

Mert a modern VirtualBox a hardveresen támogatott virtualizációra épül: a vendég kernel a CPU külön vendég módjában fut. Szoftveres bináris fordítást 64 bites vendéghez már nem kínál.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy 2048 MB memóriájú VM-et migrálsz 1000 MB/s-os hálózaton, a VM másodpercenként 250 MB-ot piszkít. Hány MB megy át a 2. körben?
= 512
! 1. kör: 2048 MB, 2,048 s; közben 250 × 2,048 = 512 MB lett piszkos.

? Ugyanennél a migrációnál hány kör után marad 50 MB alatt a küldendő adat (amikor megállítható a VM)?
= 3
! 2048 → 512 → 128 → 32 MB: a 3. kör után 32 MB marad.

? Melyik 1. típusú hipervizor épül be a Linux kernelbe?
+ KVM
- VirtualBox
- VMware Workstation
- Parallels Desktop
! Kernel-based Virtual Machine.

? Mit jelent az, hogy a Linux-konténerek osztoznak a gazda kernelén?
+ minden konténer ugyanazt a kernelt használja, csak a névterek és a cgroups választják el őket
- minden konténer saját kernelt indít
- a konténerek nem használnak rendszerhívásokat
- a konténerek csak Windowson futnak
! Ezért gyorsak, de gyengébb az elszigetelésük.

? Melyik modellben kapsz kész, böngészőből használható alkalmazást?
- IaaS
- PaaS
+ SaaS
- egyik sem
! Software as a Service, pl. Gmail.
```

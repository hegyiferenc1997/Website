---
title: Konténerek
summary: Mi a konténer, és miben más, mint a virtuális gép; névterek, cgroups, rétegzett képek, Docker és Podman a gyakorlatban.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **konténer**, és miben különbözik a **virtuális géptől**,
- melyik két kernelfunkcióra épül: **névterek** és **cgroups**,
- hogyan indítasz egy konténert **Dockerrel** az Ubuntu VM-eden.

## Virtuális gép vagy konténer?

A virtuális gép **teljes operációs rendszert** futtat, saját kernellel. A **konténer** ezzel szemben csak egy **elszigetelt folyamatcsoport** a gazda kernelén: saját fájlrendszert, hálózatot és folyamatlistát lát, de a kernel **közös**.

|               | **Virtuális gép**          | **Konténer**                                             |
| ------------- | -------------------------- | -------------------------------------------------------- |
| kernel        | saját                      | a gazdáé, közös                                          |
| indulás       | tíz másodperc – perc       | jellemzően egy másodperc alatt                           |
| méret         | több GB (teljes OS)        | néhány MB – néhány száz MB                               |
| elszigetelés  | erős (hardveres határ)     | gyengébb (közös kernel)                                  |
| futtatható OS | bármi (Windows Linuxon is) | ugyanazon kernelre épülő (Linux-konténer Linux kernelen) |

Ezért Windowson és macOS-en a Docker Desktop egy kis **Linux virtuális gépet** (Windowson a WSL 2-t) indít a háttérben, és abban futnak a Linux-konténerek.

## Amire a konténer épül

A konténer nem külön technológia, hanem a Linux kernel két funkciójának együttese:

- **Névterek** (_namespaces_): elszigetelik, **mit lát** a folyamat. Saját **PID** névtérben a konténer első folyamata az 1-es PID, és más folyamatot nem lát; a **mount** névtérben saját gyökér-fájlrendszere van; a **net** névtérben saját hálózati kártyája és IP-címe; továbbá van **UTS** (gépnév), **IPC** és **user** névtér is.
- **cgroups** (_control groups_): korlátozzák, **mennyit használhat**: CPU-idő, memória, lemez I/O, folyamatok száma. Ha a konténer túllépi a memóriakorlátot, a kernel leállítja (OOM).

Ehhez jön a **rétegzett kép** (_image_): a konténer fájlrendszere csak olvasható rétegekből áll (pl. Ubuntu alap + Python + az alkalmazás), és a konténer egy vékony írható réteget kap fölé. Így tíz, ugyanarra a képre épülő konténer csak egyszer foglalja a közös rétegeket.

## Docker a gyakorlatban

Az Ubuntu VM-eden (1. témakör):

```bash
sudo apt install docker.io         # a Docker telepítése Ubuntu csomagból
sudo usermod -aG docker $USER      # sudo nélküli használat (utána jelentkezz ki és be)
docker run hello-world             # teszt: letölti és lefuttatja a képet
docker run -it --rm ubuntu bash    # interaktív Ubuntu-konténer; kilépéskor törlődik
docker run -d -p 8080:80 --name web nginx   # webszerver háttérben, a gazda 8080-as portján
docker ps                          # futó konténerek
docker stop web && docker rm web   # leállítás, törlés
docker images                      # letöltött képek
```

A konténerben futtasd a `ps aux` parancsot: csak egy-két folyamatot látsz – ez a PID névtér hatása. A `--memory 256m` és a `--cpus 0.5` kapcsolók a cgroups-korlátokat állítják.

Saját képet egy **Dockerfile** ír le:

```dockerfile
# alap réteg
FROM python:3.13-slim
# az alkalmazás rétege
COPY hello.py /app/hello.py
# mi induljon a konténerben
CMD ["python", "/app/hello.py"]
```

```bash
docker build -t hello .        # kép építése
docker run --rm hello          # futtatás
```

A **Podman** a Docker parancsaival kompatibilis alternatíva, amely háttérdémon nélkül, sima felhasználóként (_rootless_) is fut. Sok konténer felhőbeli összehangolására a **Kubernetes** szolgál.

## Összefoglalás

- Konténer: elszigetelt folyamatcsoport a közös gazda kernelen; VM: teljes OS saját kernellel.
- Névterek: mit lát (PID, mount, net, UTS, IPC, user); cgroups: mennyit használhat.
- Rétegzett képek: csak olvasható rétegek + vékony írható réteg.
- Docker: `run`, `ps`, `stop`, `build`; alternatíva a Podman; összehangolás: Kubernetes.

## A lecke feladata

```quiz required
? Melyik Linux-kernelfunkció korlátozza egy konténer memória- és CPU-használatát?
+ cgroups
- névterek
- lapozás
- rendszerhívás-tábla
! A névterek azt szabályozzák, mit lát a folyamat, a cgroups azt, mennyit használhat.

? Egy saját PID névtérben induló konténer első folyamata hányas PID-et kap a konténeren belül?
= 1
! A gazdán közben egy egészen más PID-je van.

? Miért kell Windowson a Docker Desktopnak egy Linux virtuális gép a Linux-konténerekhez?
+ mert a konténerek a gazda kernelét használják, és Linux-konténerhez Linux kernel kell
- mert a Windows nem tud fájlokat tárolni
- mert a Docker csak 32 bites rendszeren fut
- mert a konténerek mindig saját kernelt hoznak magukkal
! A konténer és a gazda kernele közös.

? Melyik paranccsal indítasz Dockerrel egy interaktív Ubuntu-konténert, ami kilépéskor törlődik?
- docker ps -a ubuntu
+ docker run -it --rm ubuntu bash
- docker build ubuntu
- docker stop ubuntu
! -it: interaktív terminál, --rm: törlés kilépéskor.
```

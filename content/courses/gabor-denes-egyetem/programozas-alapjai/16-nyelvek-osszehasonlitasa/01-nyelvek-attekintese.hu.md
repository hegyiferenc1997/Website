---
title: A legismertebb nyelvek áttekintése
summary: Python, Java, C#, Ruby, C/C++, JavaScript/TypeScript, Go és Rust – mire valók, miben erősek.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- melyek a ma legtöbbet használt programozási nyelvek,
- mi az egyes nyelvek **fő jellemzője** (típusosság, futtatás, paradigma),
- melyik nyelvet **mire** használják a gyakorlatban.

## Miért nem elég egyetlen nyelv?

Minden nyelv kompromisszum: az egyik a **gyors futást**, a másik a **gyors fejlesztést**, a harmadik a **biztonságot** helyezi előtérbe. Egy mérnökinformatikus pályája során jellemzően több nyelvet is megtanul – szerencsére az alapfogalmak (változó, elágazás, ciklus, függvény, osztály) mindenhol ugyanazok, csak a **szintaxis** más.

## A nyelvek egy pillantásra

| Nyelv          | Típusosság            | Futtatás                     | Fő paradigma              | Tipikus terület                                            |
| -------------- | --------------------- | ---------------------------- | ------------------------- | ---------------------------------------------------------- |
| **Python**     | dinamikus, erős       | interpretált (bájtkód)       | többparadigmás            | adatelemzés, MI, szkriptek, web-backend, oktatás           |
| **Java**       | statikus, erős        | bájtkód + JVM (JIT)          | objektumorientált         | nagyvállalati rendszerek, Android, backend                 |
| **C#**         | statikus, erős        | bájtkód + .NET CLR (JIT)     | objektumorientált         | Windows-alkalmazások, játékok (Unity), web (ASP.NET)       |
| **Ruby**       | dinamikus, erős       | interpretált                 | tisztán objektumorientált | webfejlesztés (Ruby on Rails), szkriptek                   |
| **C**          | statikus, gyenge      | gépi kódra fordított         | imperatív, procedurális   | operációs rendszerek, beágyazott rendszerek, mikrovezérlők |
| **C++**        | statikus              | gépi kódra fordított         | többparadigmás            | játékmotorok, nagy teljesítményű szoftverek, robotika      |
| **JavaScript** | dinamikus, gyenge     | böngészőben/Node.js-ben, JIT | többparadigmás            | weboldalak, webalkalmazások                                |
| **TypeScript** | statikus (opcionális) | JavaScriptre fordított       | többparadigmás            | nagyobb webes projektek                                    |
| **Go**         | statikus, erős        | gépi kódra fordított         | imperatív, konkurens      | felhőszolgáltatások, hálózati szerverek                    |
| **Rust**       | statikus, erős        | gépi kódra fordított         | többparadigmás            | biztonságkritikus, nagy teljesítményű rendszerek           |

## Python

- **Előny:** rövid, olvasható kód, hatalmas könyvtárkínálat (NumPy, pandas, Django, PyTorch), gyors prototípus-készítés, ideális kezdőnyelv.
- **Hátrány:** lassabb a fordított nyelveknél, a típushibák csak futás közben derülnek ki (a típusjelölés + mypy segít).
- **Érdekesség:** a behúzás a szintaxis része – nincs `{}`.

## Java

- **Előny:** „Write once, run anywhere” – a bájtkód bármely gépen fut, ahol van JVM. Szigorú típusrendszer, kiforrott eszközök, rengeteg munkahely.
- **Hátrány:** bőbeszédű (sok „körítés”: osztály, `public static void main`), a JVM indulása lassabb.
- **Érdekesség:** minden kód osztályon belül van.

## C#

- **Előny:** a Java-hoz hasonló, de modernebb szintaxis (LINQ, `async/await`, tulajdonságok), kiváló fejlesztőkörnyezet (Visual Studio), a Unity játékmotor nyelve.
- **Hátrány:** történetileg Windows-központú volt (a .NET ma már platformfüggetlen).

## Ruby

- **Előny:** a programozó kényelmére tervezték – nagyon kifejező, „természetes” szintaxis. A Ruby on Rails keretrendszer felgyorsította a webfejlesztést.
- **Hátrány:** lassabb, és a népszerűsége csökken; kisebb a közössége, mint a Pythonnak.
- **Érdekesség:** _minden_ objektum, még a szám is: `5.times { puts "Szia" }`.

## C és C++

- **Előny:** közvetlen hozzáférés a memóriához és a hardverhez, nagyon gyors futás, kis erőforrás-igény.
- **Hátrány:** kézi memóriakezelés (memóriaszivárgás, puffer-túlcsordulás), hosszabb fejlesztési idő, nehezebben tanulható (főleg a C++).

## JavaScript és TypeScript

- **Előny:** az egyetlen nyelv, amely minden böngészőben natívan fut; Node.js-szel szerveren is. A TypeScript statikus típusokat ad hozzá.
- **Hátrány:** a JavaScript sok furcsa automatikus típusátalakítást végez (`"5" - 2 === 3`, de `"5" + 2 === "52"`).

## Go és Rust

- **Go:** egyszerű, gyorsan fordul, beépített támogatás a párhuzamos futtatáshoz (_goroutine_). A Docker és a Kubernetes is Go-ban készült.
- **Rust:** C-szintű sebesség **memóriabiztonsággal** – a fordító a futtatás előtt kiszűri a memóriahibák nagy részét (_ownership_ rendszer). Cserébe meredekebb a tanulási görbe.

## Népszerűség

A nyelvek népszerűségét több index is méri (pl. TIOBE, Stack Overflow Developer Survey, GitHub Octoverse). Az elmúlt években a **Python**, a **JavaScript/TypeScript**, a **Java**, a **C#** és a **C/C++** folyamatosan az élmezőnyben van. A rangsorok évről évre kicsit változnak, de ezeknek a nyelveknek az ismerete hosszú távon is értékes.

## Összefoglalás

- Nincs „legjobb” nyelv – mindegyik egy-egy célra optimalizált.
- **Python, Ruby, JavaScript:** dinamikus típusosság, gyors fejlesztés.
- **Java, C#:** statikus típusosság, bájtkód + virtuális gép, nagyvállalati környezet.
- **C, C++, Rust, Go:** gépi kódra fordulnak, a sebesség és az erőforrás-hatékonyság a cél.
- Az alapfogalmak minden nyelvben közösek – egy új nyelv megtanulása főleg szintaxis kérdése.

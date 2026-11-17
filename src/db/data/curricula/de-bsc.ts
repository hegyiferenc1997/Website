// Debreceni Egyetem (IK) – Mérnökinformatikus BSc tanterv (2024-es tanterv, nappali, 7 félév, 210 kredit).
// A kritériumtárgyak (Munkavédelem, Testnevelés, szaknyelv) nincsenek felvéve.
import { k, v, type Curriculum } from "./types";

export const deBsc: Curriculum = {
  university: "debreceni-egyetem",
  level: "bsc",
  sources: [
    {
      url: "https://inf.unideb.hu/sites/default/files/inline-files/MI%20BSc%202024%20tanterv_2024.pdf",
      title: "A mérnökinformatikus alapszak tanterve (2024)",
    },
  ],
  note: {
    hu: "A differenciált szakmai tárgyak egyetlen választható csoportot alkotnak (30 kredit, benne a 12 kredites szakmai gyakorlat); specializáció nincs.",
    en: "The differentiated courses form a single elective pool (30 credits, including the 12-credit internship); there are no specializations.",
  },
  semesters: [
    // 1. félév
    [
      k("Algoritmusok és a programozás alapjai", "Algorithms and Programming Fundamentals", 3),
      k("Elektronika", "Electronics", 6),
      k("Kalkulus", "Calculus", 6),
      k("Matematika mérnököknek 1", "Mathematics for Engineers 1", 6),
      k("A logika és a számítástudomány alapjai", "Foundations of Logic and Computer Science", 6),
      k("Operációs rendszerek", "Operating Systems", 3),
    ],
    // 2. félév
    [
      k("Fizika", "Physics", 6),
      k("Adatszerkezetek és algoritmusok", "Data Structures and Algorithms", 6),
      k("Matematika mérnököknek 2", "Mathematics for Engineers 2", 6),
      k("Digitális technika", "Digital Electronics", 6),
      k("Programozási nyelvek 1", "Programming Languages 1", 6),
    ],
    // 3. félév
    [
      k(
        "Valószínűségszámítás és matematikai statisztika",
        "Probability Theory and Mathematical Statistics",
        6,
      ),
      k("Közgazdasági alapismeretek", "Principles of Economics", 6),
      k("Jelek és rendszerek", "Signals and Systems", 3),
      k(
        "Mérnöki szoftverfejlesztés és prototípus tervezés grafikus paradigma mentén",
        "Engineering Software Development and Prototyping with a Graphical Paradigm",
        3,
      ),
      k("Programozási nyelvek 2", "Programming Languages 2", 6),
      k("Számítógépes hálózatok", "Computer Networks", 6),
    ],
    // 4. félév
    [
      k("Számítógép architektúrák", "Computer Architectures", 3),
      k("Adathálózati rendszerek menedzsmentje", "Data Network Systems Management", 3),
      k("Rendszerközeli programozás", "Systems Programming", 3),
      k("Szabályozástechnika", "Control Engineering", 3),
      k("Vállalati információs rendszerek", "Enterprise Information Systems", 3),
      k("Webes megoldások", "Web Solutions", 3),
      k(
        "Adatbázis-kezelés, tudásreprezentáció",
        "Database Management and Knowledge Representation",
        6,
      ),
      k("IT biztonság", "IT Security", 3),
      k("Számítógépes grafika", "Computer Graphics", 3),
      v("Mikrokontrollerek", "Microcontrollers", 6),
      v("Az információ- és kódelmélet alapjai", "Fundamentals of Information and Coding Theory", 3),
    ],
    // 5. félév
    [
      k("A gazdasági jog alapjai", "Fundamentals of Business Law", 3),
      k("Szoftverfejlesztés mérnököknek", "Software Development for Engineers", 6),
      k("A mesterséges intelligencia alapjai", "Fundamentals of Artificial Intelligence", 6),
      k("Assembly programozás", "Assembly Programming", 3),
      k("Beágyazott rendszerek", "Embedded Systems", 6),
      v(
        "Informatikai rendszerek felépítése, modellezése, analízise, megvalósítása",
        "Structure, Modelling, Analysis and Implementation of IT Systems",
        3,
      ),
      v("Hálózati eszközök programozása 1", "Network Device Programming 1", 6),
      v("Újrakonfigurálható áramkörök", "Reconfigurable Circuits", 6),
      v("Szkriptnyelvek", "Scripting Languages", 3),
      v(
        "IT szolgáltatások gyakorlati megvalósítása nagyvállalati környezetben",
        "Practical Implementation of IT Services in Enterprise Environments",
        6,
      ),
    ],
    // 6. félév
    [
      k("Menedzsment alapok mérnököknek", "Management Basics for Engineers", 6),
      k("Mobil megoldások", "Mobile Solutions", 3),
      k("Szakdolgozat 1", "Thesis 1", 6),
      k("Szakmai gyakorlat", "Professional Internship", 12),
      v("Beágyazott rendszerek fejlesztése", "Embedded Systems Development", 6),
      v("Hálózati eszközök programozása 2", "Network Device Programming 2", 6),
      v(
        "Hálózatok modellezése és hatékonyságvizsgálata",
        "Network Modelling and Performance Analysis",
        6,
      ),
      v("Távközlő hálózatok és technikák", "Telecommunication Networks and Techniques", 6),
      v("Bevezetés a felhőtechnológiákba", "Introduction to Cloud Technologies", 3),
      v("Informatikai biztonság alapjai", "Fundamentals of IT Security", 3),
    ],
    // 7. félév
    [
      k("Szakdolgozat 2", "Thesis 2", 9),
      v("Szenzor és aktuátor hálózatok", "Sensor and Actuator Networks", 6),
    ],
  ],
  unscheduled: [
    v(
      "Vállalatirányítási rendszerek alkalmazása és fejlesztése Microsoft alapokon",
      "Application and Development of ERP Systems on Microsoft Platforms",
      3,
    ),
    v(
      "Bevezetés az önvezető autók fejlesztésébe",
      "Introduction to Self-Driving Car Development",
      6,
    ),
    v("Etikus hackelés I.", "Ethical Hacking I", 3),
    v("Blokklánc technológia", "Blockchain Technology", 3),
    v("Data Engineering alapok", "Data Engineering Basics", 6),
    v(
      "Szoftverfejlesztés az NI nagyvállalati környezetében",
      "Software Development in NI's Enterprise Environment",
      3,
    ),
    v("Felhő alapú infrastruktúra menedzselése", "Cloud Infrastructure Management", 3),
    v("Karriermenedzsment", "Career Management", 3),
    v(
      "Bevezetés az AWS alapú felhő infrastruktúrába",
      "Introduction to AWS Cloud Infrastructure",
      3,
    ),
    v("Hálózat- és rendszerbiztonság", "Network and System Security", 3),
    v(
      "Szoftverfejlesztés C# nyelven nagyvállalati környezetben",
      "Software Development in C# in Enterprise Environments",
      3,
    ),
  ],
};

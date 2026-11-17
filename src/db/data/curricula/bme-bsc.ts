// Budapesti Műszaki és Gazdaságtudományi Egyetem (VIK) – Mérnökinformatikus BSc, 2026-os képzési program (7 félév, 210 kredit).
// A félévek a képzési program 6.1. mintatantervéből valók. A gazdasági és humán tárgyak (14 kredit), a szabadon
// választhatók és a kritériumtárgyak listáját a kar honlapja közli, ezért ezek nincsenek felvéve.
import { k, spec, v, type Curriculum } from "./types";

const NET = "intelligens-halozatok";
const SW = "szoftverfejlesztes";
const IS = "informacios-rendszerek";
const net = spec(NET, true);
const sw = spec(SW, true);
const is = spec(IS, true);

export const bmeBsc: Curriculum = {
  university: "budapesti-muszaki-es-gazdasagtudomanyi-egyetem",
  level: "bsc",
  sources: [
    {
      url: "https://vik.bme.hu/document/7979/original/BSc_Info_K%C3%A9pz%C3%A9si_program_HU_2026.pdf",
      title: "Mérnökinformatikus BSc képzési program (2026)",
    },
    {
      url: "https://vik.bme.hu/document/8000/original/El%C5%91tan_BSc_info%20260901.pdf",
      title: "Mérnökinformatikus BSc előtanulmányi rend (2026. 09. 01.)",
    },
  ],
  note: {
    hu: "A kötelezően választható szakmai tárgyakból ötöt kell teljesíteni az 5–7. félévben (az őszi tárgyak az 5., a tavasziak a 6. félévnél szerepelnek). A specializáción az ágazati főtantárgy és labor kötelező, mellé két további specializációs tárgy választandó.",
    en: "Five elective professional courses are taken in semesters 5–7 (autumn courses are listed under semester 5, spring ones under 6). In the specialization the branch main course and lab are compulsory, plus two further specialization courses.",
  },
  specializations: [
    { slug: NET, name: "Intelligens hálózatok", en: "Intelligent Networks" },
    { slug: SW, name: "Szoftverfejlesztés", en: "Software Development" },
    { slug: IS, name: "Információs rendszerek", en: "Information Systems" },
  ],
  semesters: [
    // 1. félév
    [
      k("Analízis 1 informatikusoknak", "Analysis 1 for Computer Engineers", 8),
      k("Bevezetés a számításelméletbe 1", "Introduction to the Theory of Computing 1", 6),
      k("Fizikai alapismeretek", "Basic Physics", 2),
      k("Villamos alapismeretek", "Basic Electrical Engineering", 3),
      k("Digitális technika", "Digital Electronics", 5),
      k("A programozás alapjai 1", "Programming Fundamentals 1", 7),
    ],
    // 2. félév
    [
      k("Analízis 2 informatikusoknak", "Analysis 2 for Computer Engineers", 6),
      k("Bevezetés a számításelméletbe 2", "Introduction to the Theory of Computing 2", 5),
      k("Algoritmuselmélet", "Theory of Algorithms", 5),
      k("Fizika I", "Physics I", 4),
      k("Számítógép-architektúrák", "Computer Architectures", 5),
      k("A programozás alapjai 2", "Programming Fundamentals 2", 6),
    ],
    // 3. félév
    [
      k("Valószínűségszámítás és statisztika", "Probability Theory and Statistics", 6),
      k("Kódolástechnika", "Coding Technology", 4),
      k("Operációs rendszerek", "Operating Systems", 5),
      k("A programozás alapjai 3", "Programming Fundamentals 3", 5),
      k("Adatbázisok", "Databases", 5),
      k("Szoftvertechnológia", "Software Technology", 5),
    ],
    // 4. félév
    [
      k("Kommunikációs hálózatok", "Communication Networks", 7),
      k("Szoftvertechnikák", "Software Techniques", 5),
      k("Szoftverprojekt laboratórium", "Software Project Laboratory", 4),
      k("Számítógépes grafika", "Computer Graphics", 5),
    ],
    // 5. félév
    [
      k("Mesterséges intelligencia", "Artificial Intelligence", 5),
      // Őszi kötelezően választható szakmai tárgyak
      v("Mobil és webes szoftverek", "Mobile and Web Software", 5),
      v("Kvantuminformatikai alkalmazások", "Quantum Information Applications", 5),
      v("Rendszerelmélet", "Systems Theory", 5),
      v("Képfeldolgozás", "Image Processing", 5),
      v("Deklaratív programozás", "Declarative Programming", 5),
      v("Beszédinformációs rendszerek", "Speech Information Systems", 5),
      net("Hálózat- és forgalommenedzsment", "Network and Traffic Management", 5),
      net("Szoftverrádiós technológiák", "Software-Defined Radio Technologies", 5),
      net(
        "Cloud Native hálózati funkciók fejlesztése",
        "Developing Cloud Native Network Functions",
        5,
      ),
      net(
        "Mobil kommunikációs hálózatok és alkalmazásaik",
        "Mobile Communication Networks and Applications",
        5,
      ),
      net("Távérzékelés és helymeghatározás", "Remote Sensing and Positioning", 5),
      net("Konténeralapú felhőplatformok", "Container-Based Cloud Platforms", 5),
      net(
        "Intelligens érzékelők és gépi adatfeldolgozás",
        "Intelligent Sensors and Machine Data Processing",
        5,
      ),
      sw("Adatvezérelt rendszerek", "Data-Driven Systems", 5),
      sw("Objektumorientált szoftvertervezés", "Object-Oriented Software Design", 5),
      sw("Automatizált szoftverfejlesztés", "Automated Software Development", 5),
      sw("Kliensoldali rendszerek", "Client-Side Systems", 5),
      sw("3D grafikus rendszerek", "3D Graphics Systems", 5),
      sw(
        "Természetes nyelvi és szemantikus technológiák",
        "Natural Language and Semantic Technologies",
        5,
      ),
      sw("SCADA és a villamosenergia-rendszer", "SCADA and the Power System", 5),
      is("Vállalatirányítási rendszerek", "Enterprise Resource Planning Systems", 5),
      is("Algoritmikus játékelmélet", "Algorithmic Game Theory", 5),
      is("Adatelemzés mélytanulási módszerekkel", "Data Analysis with Deep Learning Methods", 5),
      is("Termeléstervezés és ipari IoT", "Production Planning and Industrial IoT", 5),
      is("Véges matematika", "Finite Mathematics", 5),
      is("Data science módszerek Python környezetben", "Data Science Methods in Python", 5),
    ],
    // 6. félév
    [
      k("IT biztonság", "IT Security", 5),
      k("Önálló laboratórium", "Individual Laboratory", 5),
      // Tavaszi kötelezően választható szakmai tárgyak
      v("IT eszközök technológiája", "Technology of IT Devices", 5),
      v("Intelligens gyártás", "Intelligent Manufacturing", 5),
      v("Rendszermodellezés", "System Modelling", 5),
      v("Beágyazott információs rendszerek", "Embedded Information Systems", 5),
      v("Információs rendszerek üzemeltetése", "Operation of Information Systems", 5),
      net(
        "Hálózat- és forgalommenedzsment laboratórium",
        "Network and Traffic Management Laboratory",
        3,
      ),
      net(
        "Szoftverrádió és távérzékelés laboratórium",
        "Software Radio and Remote Sensing Laboratory",
        3,
      ),
      net("Cloud Native technológiák laboratórium", "Cloud Native Technologies Laboratory", 3),
      sw(
        "Adatvezérelt szoftverfejlesztés laboratórium",
        "Data-Driven Software Development Laboratory",
        3,
      ),
      sw("Objektumorientált laboratórium", "Object-Oriented Laboratory", 3),
      sw(
        "Automatizált szoftverfejlesztés laboratórium",
        "Automated Software Development Laboratory",
        3,
      ),
      is(
        "Vállalatirányítási rendszerek programozása laboratórium",
        "ERP Systems Programming Laboratory",
        3,
      ),
      is(
        "Algoritmikus problémák megoldása laboratórium",
        "Algorithmic Problem Solving Laboratory",
        3,
      ),
      is(
        "Adatelemzés és mélytanulás laboratórium",
        "Data Analysis and Deep Learning Laboratory",
        3,
      ),
    ],
    // 7. félév
    [
      k("Szakdolgozat-készítés", "Thesis Project", 15),
      k("Szakmai gyakorlat", "Professional Internship", 0),
    ],
  ],
};

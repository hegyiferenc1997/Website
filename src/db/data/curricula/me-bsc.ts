// Miskolci Egyetem (GEIK) – Mérnökinformatikus BSc mintatanterv (képzési program 2022, nappali, 7 félév).
// A 0 kredites tárgyak (Testnevelés, nyelvi aláírások, szigorlatok) nincsenek felvéve.
import { k, spec, v, type Curriculum } from "./types";

const IK = "infokommunikacios-rendszerek";
const RM = "informatikai-rendszermernok";
const WEB = "korszeru-web-technologiak";
const LOG = "logisztikai-rendszerek";
const TI = "termelesinformatika";
const ik = spec(IK);
const ikV = spec(IK, true);
const rm = spec(RM);
const rmV = spec(RM, true);
const web = spec(WEB);
const log = spec(LOG);
const logV = spec(LOG, true);
const ti = spec(TI);
const tiV = spec(TI, true);

export const meBsc: Curriculum = {
  university: "miskolci-egyetem",
  level: "bsc",
  sources: [
    {
      url: "https://geik.uni-miskolc.hu/content/32/32_259.pdf",
      title: "Mérnökinformatikus (BI) alapszak – mintatantervi háló",
    },
    {
      url: "https://geik.uni-miskolc.hu/content/32/32_261.pdf",
      title: "Mérnök informatikus alapszak képzési programja (2022)",
    },
  ],
  specializations: [
    { slug: IK, name: "Infokommunikációs rendszerek", en: "Infocommunication Systems" },
    { slug: RM, name: "Informatikai rendszermérnök", en: "IT Systems Engineering" },
    { slug: WEB, name: "Korszerű Web technológiák", en: "Modern Web Technologies" },
    { slug: LOG, name: "Logisztikai rendszerek", en: "Logistics Systems" },
    { slug: TI, name: "Termelésinformatika", en: "Production Informatics" },
  ],
  semesters: [
    // 1. félév
    [
      k("Lineáris algebra és diszkrét matematika", "Linear Algebra and Discrete Mathematics", 6),
      k("Matematikai analízis I.", "Mathematical Analysis I", 6),
      k("Műszaki kommunikáció", "Technical Communication", 5),
      k("Programozás alapjai", "Programming Fundamentals", 5),
      k("Számítógép architektúrák", "Computer Architectures", 5),
      k("Termelésmenedzsment", "Production Management", 3),
    ],
    // 2. félév
    [
      k("Adatstruktúrák és algoritmusok", "Data Structures and Algorithms", 5),
      k("Diszkrét matematika II.", "Discrete Mathematics II", 5),
      k("Fizika", "Physics", 5),
      k("Matematikai analízis II.", "Mathematical Analysis II", 5),
      k("Objektum orientált programozás", "Object-Oriented Programming", 5),
      k("Operációs rendszerek", "Operating Systems", 5),
    ],
    // 3. félév
    [
      k("Adatbázisrendszerek I.", "Database Systems I", 5),
      k("Digitális rendszerek", "Digital Systems", 5),
      k("Integrált vállalati rendszerek", "Integrated Enterprise Systems", 5),
      k("Számítógép hálózatok", "Computer Networks", 5),
      k("Szoftvertechnológia", "Software Technology", 5),
      k(
        "Valószínűség-számítás és matematikai statisztika",
        "Probability Theory and Mathematical Statistics",
        5,
      ),
    ],
    // 4. félév
    [
      k("Adatbázisrendszerek II.", "Database Systems II", 5),
      k("Biztonság és védelem a számítástechnikában", "Security and Protection in Computing", 5),
      k("Modern fizika", "Modern Physics", 2),
      k("Szoftvertechnológia gyakorlatok", "Software Technology Practice", 5),
      k("Web technológia alapjai", "Fundamentals of Web Technology", 3),
      v("Fizika és számítógépek", "Physics and Computers", 5),
      v("Numerikus analízis", "Numerical Analysis", 5),
      v("Optimalizálás", "Optimization", 5),
      v("C# programozás", "C# Programming", 5),
      v("Java programozás", "Java Programming", 5),
    ],
    // 5. félév
    [
      k("Elektrotechnika-elektronika", "Electrical Engineering and Electronics", 5),
      k("Mesterséges intelligencia alapok", "Fundamentals of Artificial Intelligence", 5),
      v("UNIX rendszergazda", "UNIX System Administration", 5),
      v("Windows rendszergazda", "Windows System Administration", 5),
      ik("Multimédia rendszerek", "Multimedia Systems", 5),
      ikV("Irányítástechnika", "Control Engineering", 5),
      rm("RDBMS rendszergazda", "RDBMS Administration", 5),
      rm("Számítógép hálózatok üzemeltetése", "Computer Network Operation", 5),
      rmV("Intelligens anyagmozgató gépek", "Intelligent Material Handling Machines", 5),
      rmV(
        "Terméknyomonkövetési rendszerek a logisztikában",
        "Product Tracking Systems in Logistics",
        5,
      ),
      web("Mobil programozási alapok", "Mobile Programming Basics", 5),
      web("Web technológiák 1.", "Web Technologies 1", 5),
      web("Webes adatkezelő környezetek", "Web Data Management Environments", 5),
      log("Anyagáramlási rendszerek", "Material Flow Systems", 5),
      log("Logisztika alapjai", "Fundamentals of Logistics", 5),
      log("Logisztikai informatika", "Logistics Informatics", 5),
      ti("A termelésinformatika alapjai", "Fundamentals of Production Informatics", 5),
      ti("Számítógépes gyártásirányítás", "Computer-Aided Production Control", 5),
      tiV("Vállalati informatika", "Enterprise Informatics", 5),
    ],
    // 6. félév
    [
      k("Erőforrás tervezés", "Resource Planning", 3),
      k("Vezetés-szervezés", "Management and Organization", 4),
      // Minden specializáción szerepel, ezért közös tárgy.
      k("Szakdolgozatkészítés I.", "Thesis Preparation I", 5),
      v("Programozható logikák", "Programmable Logic", 5),
      v("Számítógépi grafika", "Computer Graphics", 5),
      v("Haladó C#", "Advanced C#", 5),
      v("Haladó Java", "Advanced Java", 5),
      v("Modern C++", "Modern C++", 5),
      v(
        "Számítógép hálózat üzemeltetési alapismeretek I.",
        "Computer Network Operation Basics I",
        5,
      ),
      v("Folyamatok modellezése", "Process Modelling", 5),
      v("Ipar 4.0 és logisztika", "Industry 4.0 and Logistics", 5),
      v("Logisztikai folyamatok szimulációja", "Simulation of Logistics Processes", 5),
      v("SAP-ABAP programozás alapjai", "Fundamentals of SAP ABAP Programming", 5),
      ik("Beágyazott rendszerek", "Embedded Systems", 5),
      ik("IoT internetes eszközök", "IoT Internet Devices", 5),
      rm("Rendszerüzemeltetés A", "System Operation A", 5),
      web("Web technológiák 2.", "Web Technologies 2", 5),
      log("Szimulációs módszerek a logisztikában", "Simulation Methods in Logistics", 5),
      logV("Minőségbiztosítás logisztikája", "Logistics of Quality Assurance", 5),
      ti(
        "Diszkrét termelési folyamatok számítógépes tervezése és irányítása",
        "Computer-Aided Planning and Control of Discrete Production Processes",
        5,
      ),
      ti("Informatikai rendszerek építése", "Building IT Systems", 5),
    ],
    // 7. félév
    [
      k("Szoftvertesztelés", "Software Testing", 5),
      k("Szakdolgozatkészítés II.", "Thesis Preparation II", 10),
      k("Szakmai gyakorlat", "Professional Internship", 0),
      v("Korszerű információs technológiák", "Modern Information Technologies", null),
      v(
        "Számítógép hálózatok üzemeltetési alapismeretek II.",
        "Computer Network Operation Basics II",
        5,
      ),
      v("Számítógépi grafika programozása", "Computer Graphics Programming", 5),
      v("Windows hálózatok üzemeltetése", "Windows Network Operation", 5),
      ik("Távközléstechnika alapjai", "Fundamentals of Telecommunications", 5),
      rm("Rendszerüzemeltetés B", "System Operation B", 5),
      web("Web-es alkalmazások (Java)", "Web Applications (Java)", 5),
      log("Recycling logisztika", "Recycling Logistics", 5),
      ti("Virtuális vállalat", "Virtual Enterprise", 5),
    ],
  ],
};

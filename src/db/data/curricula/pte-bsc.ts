// Pécsi Tudományegyetem (MIK) – Mérnökinformatikus BSc mintatanterv (2025/2026. tanévtől, nappali, 7 félév, 210 kredit).
// A szabadon választható tárgyak (10 kredit) nincsenek felvéve, mert a tanterv csak üres helyeket ad meg.
import { k, spec, type Curriculum } from "./types";

const IR = "intelligens-rendszerek-informaciotechnologiaja";
const APP = "alkalmazasfejleszto";
const RM = "rendszermernok";
const ir = spec(IR);
const app = spec(APP);
const rm = spec(RM);

export const pteBsc: Curriculum = {
  university: "pecsi-tudomanyegyetem",
  level: "bsc",
  sources: [
    {
      url: "https://info.mik.pte.hu/Attachment/get/portal_article_attachment/411/mernokinformatikus-bsc-mintatantervi-halo-2025-250901012436.pdf",
      title: "Mérnökinformatikus BSc mintatantervi háló (2025/2026-tól)",
    },
  ],
  specializations: [
    {
      slug: IR,
      name: "Intelligens rendszerek információtechnológiája",
      en: "Information Technology of Intelligent Systems",
    },
    { slug: APP, name: "Alkalmazásfejlesztő", en: "Application Development" },
    { slug: RM, name: "Rendszermérnök", en: "Systems Engineering" },
  ],
  semesters: [
    // 1. félév
    [
      k("Matematika alapjai", "Fundamentals of Mathematics", 3),
      k("Bevezetés a lineáris algebrába", "Introduction to Linear Algebra", 5),
      k("Problémaosztályok, algoritmusok", "Problem Classes and Algorithms", 4),
      k("Bevezetés a számítástudományokba", "Introduction to Computer Science", 3),
      k("Bevezetés az egyetemi életbe", "Introduction to University Life", 2),
      k("Informatika alapjai 1.", "Fundamentals of Informatics 1", 3),
      k("Programozás 1.", "Programming 1", 5),
      k("Digitális technika 1.", "Digital Electronics 1", 5),
    ],
    // 2. félév
    [
      k("Matematika mérnököknek 1.", "Mathematics for Engineers 1", 5),
      k("Fizika mérnököknek 1.", "Physics for Engineers 1", 4),
      k("Informatika alapjai 2.", "Fundamentals of Informatics 2", 3),
      k("A magas szintű programozás alapjai", "Fundamentals of High-Level Programming", 3),
      k("Adatbázisok 1.", "Databases 1", 4),
      k("Számítógép hálózatok alapjai", "Fundamentals of Computer Networks", 3),
      k("Elektronika 1.", "Electronics 1", 4),
      k(
        "Bevezetés a mesterséges intelligencia alkalmazásaiba",
        "Introduction to Applications of Artificial Intelligence",
        2,
      ),
      k("Speciális programozás", "Special Programming", 2),
    ],
    // 3. félév
    [
      k("Matematika mérnököknek 2.", "Mathematics for Engineers 2", 5),
      k("Fizika mérnököknek 2.", "Physics for Engineers 2", 5),
      k(
        "A mesterséges intelligencia matematikai alapjai",
        "Mathematical Foundations of Artificial Intelligence",
        3,
      ),
      k("Web programozás 1.", "Web Programming 1", 2),
      k("Programozás 2.", "Programming 2", 4),
      k("IP alapú rendszerek és alkalmazások 1.", "IP-Based Systems and Applications 1", 4),
      k("Számítógép architektúrák", "Computer Architectures", 3),
      k("Mérésadatgyűjtés és jelfeldolgozás", "Data Acquisition and Signal Processing", 4),
    ],
    // 4. félév
    [
      k("Lineáris algebra mérnököknek", "Linear Algebra for Engineers", 2),
      k(
        "Valószínűségszámítás és matematikai statisztika",
        "Probability Theory and Mathematical Statistics",
        3,
      ),
      k("Információ és kódelmélet", "Information and Coding Theory", 2),
      k("Minőségbiztosítás 1.", "Quality Assurance 1", 3),
      k("Szoftvertechnológia", "Software Technology", 3),
      k("Kiberbiztonság", "Cybersecurity", 5),
      k("Operációs rendszerek", "Operating Systems", 4),
      k("Rendszerelmélet", "Systems Theory", 4),
      ir("Mesterséges intelligencia 1.", "Artificial Intelligence 1", 4),
      app("Programozás 3.", "Programming 3", 4),
      rm("IP alapú rendszerek és alkalmazások 2.", "IP-Based Systems and Applications 2", 4),
    ],
    // 5. félév
    [
      k("Projektmenedzsment 1.", "Project Management 1", 3),
      k("Projekt 1.", "Project 1", 11),
      ir("Számítógép vezérelt irányítások", "Computer-Controlled Systems", 4),
      ir("Képfeldolgozás és gépi látás", "Image Processing and Machine Vision", 4),
      ir("Mesterséges intelligencia 2.", "Artificial Intelligence 2", 4),
      app("Programozás 4.", "Programming 4", 4),
      app("Adatbázisok 2.", "Databases 2", 5),
      app("Design, UX, ergonómia", "Design, UX and Ergonomics", 3),
      rm("IP alapú rendszerek és alkalmazások 3.", "IP-Based Systems and Applications 3", 5),
      rm("Linux rendszergazda ismeretek", "Linux System Administration", 4),
      rm("Rendszerprogramozás", "Systems Programming", 3),
    ],
    // 6. félév
    [
      k("Projektmenedzsment 2.", "Project Management 2", 3),
      k("Munka-, tűz- és egészségvédelem", "Occupational, Fire and Health Safety", 3),
      k("Projekt 2.", "Project 2", 11),
      ir("Mérnöki programozás", "Engineering Programming", 4),
      ir("Robotika", "Robotics", 5),
      app("Programozás 5.", "Programming 5", 6),
      app("Web programozás 2.", "Web Programming 2", 3),
      rm("Felhő technológiák", "Cloud Technologies", 6),
      rm("Windows rendszergazda ismeretek", "Windows System Administration", 3),
    ],
    // 7. félév
    [
      k("Vállalkozási és munkaerőpiaci ismeretek", "Entrepreneurship and Labour Market Skills", 3),
      k("Informatikai rendszerek", "IT Systems", 5),
      k("Szakdolgozat", "Thesis", 15),
      k("Szakmai gyakorlat", "Professional Internship", 0),
      ir("Mobil robotika és autonóm járművek", "Mobile Robotics and Autonomous Vehicles", 5),
      app("Programozás 6.", "Programming 6", 5),
      rm("Hálózat és rendszermenedzsment", "Network and System Management", 5),
    ],
  ],
};

// Neumann János Egyetem (GAMF) – Mérnökinformatikus BSc, 2021-es tanterv (nappali, 7 félév, 210 kredit).
// Minden specializáción a 9 felkínált tárgyból 8 teljesítendő. A 0 kredites tárgyak nincsenek felvéve.
import { k, spec, v, type Curriculum } from "./types";

const NET = "halozat-biztonsagi-es-uzemeltetesi";
const IND = "ipari-informatika";
const MW = "mobil-es-web-fejlesztesi";
const net = spec(NET);
const ind = spec(IND);
const mw = spec(MW);

export const njeBsc: Curriculum = {
  university: "neumann-janos-egyetem",
  level: "bsc",
  sources: [
    {
      url: "https://gamf.uni-neumann.hu/wp-content/uploads/2025/11/Mernokinformatikus_alapszak_reszletes_tanulmanyi_tajekoztato_2021_2025_11_13.pdf",
      title:
        "Mérnökinformatikus alapszak – részletes tanulmányi tájékoztató (2021-es tanterv, 2025. 11. 13.)",
    },
    {
      url: "https://gamf.uni-neumann.hu/wp-content/uploads/2023/02/tanterv_BSc_mernokinf_nappali.pdf",
      title: "Mérnökinformatikus szak 2021 BSc, nappali munkarend – tanterv",
    },
  ],
  specializations: [
    { slug: NET, name: "Hálózatbiztonsági és üzemeltetési", en: "Network Security and Operations" },
    { slug: IND, name: "Ipari informatika", en: "Industrial Informatics" },
    { slug: MW, name: "Mobil- és webfejlesztési", en: "Mobile and Web Development" },
  ],
  semesters: [
    // 1. félév
    [
      k("Közgazdaságtan", "Economics", 4),
      k(
        "A számítástudomány matematikai alapjai I.",
        "Mathematical Foundations of Computer Science I",
        5,
      ),
      k("Analízis I.", "Analysis I", 5),
      k("Fizika", "Physics", 5),
      k("Digitális technika I.", "Digital Electronics I", 3),
      k("Hálózati alapismeretek", "Networking Fundamentals", 5),
      k("Programozás I.", "Programming I", 4),
    ],
    // 2. félév
    [
      k("Villamosságtan", "Electrical Engineering", 5),
      k("Analízis II.", "Analysis II", 5),
      k("Algoritmusok és adatstruktúrák", "Algorithms and Data Structures", 5),
      k("Digitális technika II.", "Digital Electronics II", 2),
      k("Mikroprocesszorok rendszertechnikája", "Microprocessor System Design", 4),
      k("Programozás II.", "Programming II", 4),
      k("Számítógép-architektúrák I.", "Computer Architectures I", 5),
      k("Informatikai szakmai angol I.", "Technical English for IT I", 2),
    ],
    // 3. félév
    [
      k("Menedzsment", "Management", 4),
      k("Transzverzális ismeretek I.", "Transversal Skills I", 1),
      k("Valószínűségszámítás és statisztika", "Probability and Statistics", 5),
      k("Adatbázisok", "Databases", 4),
      k("Jelek és rendszerek", "Signals and Systems", 4),
      k("Operációs rendszerek", "Operating Systems", 4),
      k("Programozási paradigmák és technikák", "Programming Paradigms and Techniques", 5),
      k("Informatikai szakmai angol II.", "Technical English for IT II", 2),
    ],
    // 4. félév
    [
      k(
        "A számítástudomány matematikai alapjai II.",
        "Mathematical Foundations of Computer Science II",
        5,
      ),
      k("Adatbázis rendszerek", "Database Systems", 5),
      k("Az informatikai biztonság alapjai", "Fundamentals of IT Security", 3),
      k("Irányítástechnika", "Control Engineering", 4),
      k("Vállalati információs rendszerek I.", "Enterprise Information Systems I", 4),
      k("Vizuális programozás", "Visual Programming", 5),
      k("WEB-programozás I.", "Web Programming I", 5),
    ],
    // 5. félév
    [
      k("Haladó programozás", "Advanced Programming", 4),
      k("Szoftvertechnológia", "Software Technology", 5),
      // Mindhárom specializáción felkínált tárgy.
      v("Mesterséges intelligencia alapjai", "Fundamentals of Artificial Intelligence", 5),
      // A hálózati és a mobil/web specializáción is felkínált tárgy.
      v("Felhő alapú szolgáltatások", "Cloud-Based Services", 5),
      net("Hálózati adminisztráció I.", "Network Administration I", 5),
      net(
        "Számítógépes hálózatok konfigurálása és üzemeltetése",
        "Configuration and Operation of Computer Networks",
        5,
      ),
      net("Vállalati információs rendszerek II.", "Enterprise Information Systems II", 5),
      ind("Számítógép-architektúrák II.", "Computer Architectures II", 5),
      ind("Robottechnika I.", "Robotics I", 5),
      ind("Elektronika", "Electronics", 5),
      ind("Mikrovezérlős rendszerfejlesztés", "Microcontroller System Development", 5),
      ind("Ipari információs rendszerek", "Industrial Information Systems", 5),
      mw("Java alkalmazások", "Java Applications", 5),
      mw("Szerveroldali alkalmazások", "Server-Side Applications", 5),
      mw("Fejlesztés mobil eszközökre I.", "Mobile Development I", 5),
      mw("WEB-programozás II.", "Web Programming II", 5),
    ],
    // 6. félév
    [
      k("Jogi ismeretek", "Introduction to Law", 4),
      k("Vállalkozás-gazdaságtan", "Business Economics", 4),
      k("Informatikai projektfeladat", "IT Project", 5),
      net("Hálózati biztonság", "Network Security", 5),
      net("Hálózati adminisztráció II.", "Network Administration II", 5),
      net("Etikus hackelés", "Ethical Hacking", 5),
      net("Informatikai szolgáltatásmenedzsment", "IT Service Management", 5),
      ind("Digitális jelfeldolgozás", "Digital Signal Processing", 5),
      ind("Ipari képfeldolgozás", "Industrial Image Processing", 5),
      ind("Robottechnika II.", "Robotics II", 5),
      mw("Fejlesztés mobil eszközökre II.", "Mobile Development II", 5),
      mw("Játékfejlesztés", "Game Development", 5),
      mw(
        "Alkalmazásfejlesztés webes technológiákkal",
        "Application Development with Web Technologies",
        5,
      ),
    ],
    // 7. félév (mobilitási ablak: csak szakdolgozat és szakmai gyakorlat)
    [k("Szakdolgozat", "Thesis", 15), k("Szakmai gyakorlat", "Professional Internship", 0)],
  ],
};

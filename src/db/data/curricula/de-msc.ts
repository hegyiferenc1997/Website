// Debreceni Egyetem (IK) – Mérnökinformatikus MSc tanterv (2021-es tanterv, 2024/25-ös tájékoztató, nappali, 4 félév).
// A kritériumtárgyak (Munkavédelem, Testnevelés, szaknyelv) nincsenek felvéve.
import { k, v, type Curriculum } from "./types";

export const deMsc: Curriculum = {
  university: "debreceni-egyetem",
  level: "msc",
  sources: [
    {
      url: "https://inf.unideb.hu/sites/default/files/inline-files/MI%20MSc%20f%C3%BCzet_2021_20242025.pdf",
      title: "Mérnökinformatikus MSc tájékoztató füzet (2021-es tanterv, 2024/2025)",
    },
  ],
  note: {
    hu: "A 3–4. félév differenciált szakmai tárgyai egy választható csoportot alkotnak (24 kredit, benne a 9 kredites szakmai gyakorlat).",
    en: "The differentiated courses of semesters 3–4 form one elective pool (24 credits, including the 9-credit internship).",
  },
  semesters: [
    // 1. félév
    [
      k(
        "Bevezetés az új hálózati kommunikációs technológiákba",
        "Introduction to New Network Communication Technologies",
        3,
      ),
      k(
        "Matematika és információelmélet mérnököknek",
        "Mathematics and Information Theory for Engineers",
        6,
      ),
      k(
        "Rendszerbiztonsági technikák és megoldások",
        "System Security Techniques and Solutions",
        6,
      ),
      k("Gépi tanulás mérnököknek", "Machine Learning for Engineers", 3),
      k(
        "Infokommunikációs hálózatok teljesítményanalízise",
        "Performance Analysis of Infocommunication Networks",
        6,
      ),
      k("Rendszerarchitektúrák", "System Architectures", 3),
      k("Bevezetés a Big Data-ba", "Introduction to Big Data", 3),
    ],
    // 2. félév
    [
      k(
        "Számítástudomány a mérnöki alkalmazásokban",
        "Computer Science in Engineering Applications",
        4,
      ),
      k("Közgazdasági és jogi ismeretek", "Economics and Law", 5),
      k("Menedzsment és szervezési ismeretek", "Management and Organization", 5),
      k(
        "Logikai tervezés hardverleíró nyelven",
        "Logic Design with Hardware Description Languages",
        6,
      ),
      k(
        "Párhuzamos számítógépes képfeldolgozás és alakfelismerés",
        "Parallel Image Processing and Pattern Recognition",
        6,
      ),
      k(
        "Tárgyak Internete rendszerek és technológiák",
        "Internet of Things Systems and Technologies",
        4,
      ),
    ],
    // 3. félév
    [
      k("Diplomamunka 1", "Master's Thesis 1", 15),
      v("Haladó kapcsolás és útválasztás 1 (CCNP1)", "Advanced Switching and Routing 1 (CCNP1)", 6),
      v("Intelligens szenzorhálózatok", "Intelligent Sensor Networks", 6),
      v("Multimédia hálózatok", "Multimedia Networks", 6),
      v("Újrakonfigurálható beágyazott rendszerek", "Reconfigurable Embedded Systems", 6),
      v("Adatfeldolgozás felhős környezetben", "Data Processing in Cloud Environments", 3),
      v("Szakmai gyakorlat", "Professional Internship", 9),
    ],
    // 4. félév
    [
      k("Diplomamunka 2", "Master's Thesis 2", 15),
      v("Adatbányászat a mérnöki rendszerekhez", "Data Mining for Engineering Systems", 6),
      v(
        "Felhőszolgáltatás architektúrák és szolgáltatások",
        "Cloud Service Architectures and Services",
        6,
      ),
      v("Haladó kapcsolás és útválasztás 2 (CCNP2)", "Advanced Switching and Routing 2 (CCNP2)", 6),
      v("Hardver-szoftver együttes tervezés", "Hardware-Software Co-Design", 6),
      v("Mikrokontrollerek alkalmazástechnikája", "Microcontroller Applications", 6),
      v(
        "Fejlett adatfeldolgozás felhős környezetben",
        "Advanced Data Processing in Cloud Environments",
        3,
      ),
      v(
        "Gépi tanuló algoritmusok beágyazott rendszerekben",
        "Machine Learning Algorithms in Embedded Systems",
        3,
      ),
      v("Haladó önvezető autók fejlesztése", "Advanced Self-Driving Car Development", 6),
    ],
  ],
};

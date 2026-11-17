// Nyíregyházi Egyetem – Mérnökinformatikus BSc mintatanterv (2025 szeptemberétől, nappali, 7 félév).
// Egy specializáció van; az angol nevek a mintatanterv angol oszlopából valók. A szabadon választható helyek nincsenek felvéve.
import { k, spec, type Curriculum } from "./types";

const NET = "halozati-biztonsag-es-intelligens-muszaki-rendszerek";
const net = spec(NET);

export const nyeBsc: Curriculum = {
  university: "nyiregyhazi-egyetem",
  level: "bsc",
  sources: [
    {
      url: "https://ttajekoztato.nye.hu/mintatanterveks/kepzesiszint_szakok/50",
      title: "Nyíregyházi Egyetem – BSc mintatantervek (Mérnökinformatikus, 2025 szeptemberétől)",
    },
  ],
  specializations: [
    {
      slug: NET,
      name: "Hálózati biztonság és intelligens műszaki rendszerek",
      en: "Network Security and Intelligent Technical Systems",
    },
  ],
  semesters: [
    // 1. félév
    [
      k("Környezet és ember", "Environment and Human", 2),
      k("Lineáris algebra", "Linear Algebra", 6),
      k("Mérnöki fizika", "Engineering Physics", 4),
      k("Számítógép architektúrák", "Computer Architectures", 3),
      k(
        "Hálózati architektúrák és osztott rendszerek",
        "Network Architectures and Distributed Systems",
        3,
      ),
      k("Programozási nyelvek I.", "Programming Languages I", 6),
      k("Bevezetés az informatikába", "Foundations of Informatics", 5),
    ],
    // 2. félév
    [
      k("Diszkrét matematika", "Discrete Mathematics", 6),
      k("Adatszerkezetek és algoritmusok", "Data Structures and Algorithms", 3),
      k("Digitális alkalmazások", "Digital Applications", 3),
      k("Műszaki mérés", "Technical Measurement", 5),
      k("Programozási nyelvek II.", "Programming Languages II", 6),
      k("Adatbázisrendszerek", "Database Systems", 5),
    ],
    // 3. félév
    [
      k("Analízis", "Mathematical Analysis", 6),
      k("Közgazdaságtan", "Economics", 3),
      k("Programozási technológiák", "Programming Technology", 7),
      k("Digitális elektronika", "Digital Electronics", 7),
      k(
        "A rendszerfejlesztés technológiája és módszertana",
        "Technology and Methodology of Systems Development",
        5,
      ),
    ],
    // 4. félév
    [
      k("Valószínűségszámítás és statisztika", "Probability and Statistics", 6),
      k("Algoritmusok tervezése és elemzése", "Algorithm Design and Analysis", 3),
      k("Internet eszközök és szolgáltatások", "Internet Tools and Services", 4),
      k("Operációs rendszerek", "Operating Systems", 6),
      k("GUI programozás", "GUI Programming", 4),
      net("Hálózati biztonság I.", "Network Security I", 7),
    ],
    // 5. félév
    [
      k("Vállalatgazdaságtan", "Business Economics", 5),
      k("Vezetés és szervezés", "Management and Organization", 3),
      k("IoT alapok", "IoT Basics", 4),
      k("Automatizálás és irányítástechnika I.", "Automation and Control I", 5),
      k("Szakmai gyakorlat I.", "Professional Internship I", 0),
      k("Szakdolgozat I.", "Thesis I", 5),
      net(
        "Hálózati operációs rendszerek és IoT technológia",
        "Network Operating Systems and IoT Technology",
        3,
      ),
      net("Hálózati biztonság II.", "Network Security II", 5),
    ],
    // 6. félév
    [
      k("Informatikai jogi és vállalkozási ismeretek", "IT Law and Entrepreneurship", 3),
      k("Mesterséges intelligencia", "Artificial Intelligence", 5),
      k("Szakdolgozat II.", "Thesis II", 5),
      k("Szakmai gyakorlat II.", "Professional Internship II", 0),
      net("Informatikai biztonság", "IT Security", 3),
      net("Hálózati biztonság III.", "Network Security III", 6),
      net("Automatizálás és irányítástechnika II.", "Automation and Control II", 6),
    ],
    // 7. félév
    [
      k("Társadalomtudományi alapismeretek", "Basics of Social Sciences", 3),
      k("EU intézményrendszere és működése", "Institutions and Operation of the European Union", 4),
      k("Mobilalkalmazás-fejlesztés", "Mobile Application Development", 4),
      k("Szakmai gyakorlat III.", "Professional Internship III", 0),
      k("Szakdolgozat III.", "Thesis III", 5),
      net("IoT fejlesztések", "IoT Development", 5),
      net("Hálózati biztonság IV.", "Network Security IV", 6),
    ],
  ],
};

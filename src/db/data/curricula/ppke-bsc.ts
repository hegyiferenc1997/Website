// Pázmány Péter Katolikus Egyetem (ITK) – Mérnökinformatikus BSc tanterv (nappali, érvényes a 2026/2027. tanévtől, 7 félév).
// A kritériumtárgyak (Testnevelés), a záróvizsgák és a szabadon választható tárgyak nincsenek felvéve.
// Néhány tárgyat angolul oktatnak; ezek neve a tantervben is angol.
import { k, spec, v, type Curriculum } from "./types";

const ROB = "erzekelo-robotok-es-digitalis-elektronika";
const NLP = "szoftvertechnologia-es-nyelvtechnologia";
const rob = spec(ROB);
const robV = spec(ROB, true);
const nlp = spec(NLP);
const nlpV = spec(NLP, true);

export const ppkeBsc: Curriculum = {
  university: "pazmany-peter-katolikus-egyetem",
  level: "bsc",
  sources: [
    {
      url: "https://itk.ppke.hu/storage/tinymce/uploads/2026-mintatantervek/IANI-MI-2026_H.xlsx?u=1gaicO",
      title: "Mérnökinformatikus BSc tanterv (IANI-MI, 2026/2027-től)",
    },
  ],
  note: {
    hu: "Az analízist két változatban lehet teljesíteni (Analízis vagy Alkalmazott analízis), ezért ezek választhatóként szerepelnek.",
    en: "Analysis can be taken in two variants (Analysis or Applied Analysis), so these are listed as electives.",
  },
  specializations: [
    {
      slug: ROB,
      name: "Érzékelő robotok és digitális elektronika",
      en: "Sensory Robotics and Digital Electronics",
    },
    {
      slug: NLP,
      name: "Szoftvertechnológia és nyelvtechnológia",
      en: "Software Engineering and Language Technology",
    },
  ],
  semesters: [
    // 1. félév
    [
      k("Fizikai alapismeretek", "Basics of Physics", 3),
      k(
        "Lineáris algebra és diszkrét matematika I.",
        "Linear Algebra and Discrete Mathematics 1",
        4,
      ),
      v("Analízis I.", "Analysis 1", 8),
      v("Alkalmazott analízis I.", "Calculus 1", 8),
      k("A közgazdaságtan alapjai", "Basics of Economics", 5),
      k("Bevezetés a mérnökségbe", "Introduction to Engineering", 1),
      k("Egyetemi pályaszocializáció", "University and Career Socialisation", 2),
      k("Bevezetés a számítástechnikába", "Introduction to Information Technology", 2),
      k("Bevezetés a programozásba I.", "Introduction to Programming 1", 5),
    ],
    // 2. félév
    [
      k(
        "Lineáris algebra és diszkrét matematika II.",
        "Linear Algebra and Discrete Mathematics 2",
        7,
      ),
      v("Analízis II.", "Analysis 2", 7),
      v("Alkalmazott analízis II.", "Calculus 2", 7),
      k("A Biblia világa", "The World of the Bible", 2),
      v("A holokauszt és emlékezete", "The Holocaust and Its Memory", 2),
      v("Tanulástechnika", "Learning Methodology", 2),
      v("A fizika kultúrtörténete", "Cultural History of Physics", 2),
      k(
        "Bevezetés a méréstechnikába és jelfeldolgozásba",
        "Introduction to Electrical Measurements",
        5,
      ),
      k(
        "Mérnöki számítások MATLAB és Python környezetben",
        "Engineering Calculations in MATLAB and Python",
        3,
      ),
      k("Bevezetés a programozásba II.", "Introduction to Programming 2", 5),
    ],
    // 3. félév
    [
      k("Valószínűségszámítás, matematikai statisztika", "Probability, Statistics", 7),
      v("Multidiszciplináris kitekintés I.", "Multidisciplinary Outlook 1", 1),
      v("Bioetika és környezetetika I.", "Bio- and Environmental Ethics 1", 2),
      v("Az agykutatás története", "History of Brain Research", 1),
      k("Áramkörök elmélete és számítása", "Electrical Networks - Theory and Computation", 5),
      k("Adatszerkezetek és algoritmusok", "Data Structures and Algorithms", 6),
      k("Számítógépes hálózatok", "Computer Networks", 5),
      robV(
        "ARM Cortex-M alapú beágyazott rendszerek programozása",
        "ARM Cortex-M Based Embedded System Programming",
        2,
      ),
      robV(
        "Gyors prototípuskészítési módszerek - Ipar 4.0",
        "Rapid Prototyping Technologies - Industry 4.0",
        4,
      ),
      robV(
        "Az információtechnika és a bionika fizikai alapjai I.",
        "Physics of Information Technology and Bionics 1",
        5,
      ),
      nlp("A nyelvtechnológia alapjai", "Basics of Natural Language Processing", 6),
      nlpV(
        "Információ-visszakeresés elmélete és gyakorlata",
        "The Theory and Practice of Information-retrieval",
        3,
      ),
    ],
    // 4. félév
    [
      k("A digitális számítás elmélete", "Theory of Digital Computation", 5),
      k("Bevezetés a kereszténységbe", "Introduction to Christianity", 2),
      v(
        'Bevezetés a filozófiába "Fides et Ratio"',
        'Introduction to Philosophy: "Fides et Ratio"',
        2,
      ),
      v("Bioetika és környezetetika II.", "Bio- and Environmental Ethics 2", 2),
      k(
        "Digitális rendszerek és számítógép architektúrák",
        "Digital Systems and Computer Architectures",
        6,
      ),
      k("Digitális jelfeldolgozás", "Digital Signal Processing", 5),
      k("Java programozás", "Java Programming", 4),
      k("Adatbázis rendszerek", "Introduction to Database Systems", 5),
      robV("Mikroelektronika", "Microelectronics", 6),
      robV("Elektromágneses terek", "Classical Electrodynamics", 5),
      nlpV("Játékelmélet és hálózati alkalmazásai", "Game Theory and Network Applications", 3),
      nlpV("A nyelvtechnológia eszközei", "Tools of Natural Language Processing", 5),
      nlpV("A számítógépes grafika alapjai", "Basics of Computer Graphics", 4),
    ],
    // 5. félév
    [
      k("A Katolikus Egyház társadalmi tanítása", "Social Teaching of the Catholic Church", 2),
      v("Menedzsment alapismeretek", "Basics of Management", 3),
      v("Multidiszciplináris kitekintés II.", "Multidisciplinary Outlook 2", 1),
      k("Neural Networks", "Neural Networks", 5),
      k("Computer Controlled Systems", "Computer Controlled Systems", 5),
      k("Introduction to Artificial Intelligence", "Introduction to Artificial Intelligence", 5),
      k("Infocommunication Systems", "Infocommunication Systems", 3),
      k("Előírt laboratórium", "Prescribed Laboratory", 4),
      rob("Robotika", "Robotics", 5),
      rob("FPGA-based Algorithm Design", "FPGA-based Algorithm Design", 5),
      robV(
        "Szenzortechnika és biológiai érzékelés",
        "Sensor Technologies and Biological Sensing",
        2,
      ),
      robV("Database Systems 2", "Database Systems 2", 2),
      nlp("Mobile Application Development", "Mobile Application Development", 5),
      nlpV("Database Systems 2", "Database Systems 2", 2),
    ],
    // 6. félév
    [
      k("A szoftvertechnológia alapjai", "Basics of Software Engineering", 5),
      k("Programozási nyelvek és módszerek", "Methods and Languages of Programming", 3),
      k("Adatbiztonság és kriptográfia", "Data Security and Cryptography", 5),
      k("Információ- és kódelmélet", "Information and Coding Theory", 5),
      robV("Celluláris hullámszámítógépek", "Cellular Wave Computers", 5),
      nlpV("Celluláris hullámszámítógépek", "Cellular Wave Computers", 5),
      nlpV("Web programozás", "Web Programming", 3),
      nlpV("Basics of Software Testing", "Basics of Software Testing", 2),
      k("Önálló laboratórium", "Individual Laboratory", 4),
      k("Szakmai gyakorlat", "Professional Internship", 0),
    ],
    // 7. félév
    [
      k(
        "Jogi alapismeretek és szellemi tulajdon",
        "Introduction to Law and Issues of Copyrights",
        3,
      ),
      v("Vizuális kultúra és kommunikáció", "Visual Culture and Communication", 3),
      k("Operációs rendszerek alapjai", "Basics of Operating Systems", 5),
      robV("Gépi tanulás robotikai alkalmazásai", "Application of Machine Learning in Robotics", 5),
      robV("Internetes média-kommunikáció", "Media Communication on the Internet", 4),
      robV("Vezeték nélküli érzékelő hálózatok", "Wireless Sensor Networks", 4),
      nlpV("Haladó C++ programozás", "Advanced C++ Programming", 2),
      k("Szakdolgozat", "Thesis", 15),
      rob(
        "Érzékelő robotok és digitális elektronika záróvizsga",
        "Sensory Robotics and Digital Electronics Final Exam",
        0,
      ),
      nlp(
        "Szoftvertechnológia és nyelvtechnológia záróvizsga",
        "Software Engineering and Natural Language Processing Final Exam",
        0,
      ),
    ],
  ],
};

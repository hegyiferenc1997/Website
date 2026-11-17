// Pannon Egyetem (MIK) – Mérnökinformatikus BSc tanterv (2026. 03. 17., a 2023/24/1-től kezdőknek, nappali).
// A kötelezően választható differenciált tárgyaknak a tanterv nem ad félévet: tárgycsoportonként a „félév nélküli” részben vannak.
// A 0 kredites tárgyak (Testnevelés, nyelvi kollokvium, Tanulásmódszertan) nincsenek felvéve.
import { k, spec, type Curriculum } from "./types";

const DS = "adattudomany";
const NET = "halozatok-es-rendszerek";
const SW = "rendszer-es-szoftverfejlesztes";
const EMB = "beagyazott-rendszerek";
const ds = spec(DS, true);
const net = spec(NET, true);
const sw = spec(SW, true);
const emb = spec(EMB, true);

export const peBsc: Curriculum = {
  university: "pannon-egyetem",
  level: "bsc",
  sources: [
    {
      url: "https://mik.uni-pannon.hu/docs/tantervek/260317-mernokinfo-BSc-uj-kepzes-KTutan.pdf",
      title: "Mérnökinformatikus BSc szak tanterve (2026. 03. 17.)",
    },
  ],
  note: {
    hu: "A tárgycsoportok (Adattudomány, Hálózatok és rendszerek, Rendszer- és szoftverfejlesztés, Beágyazott rendszerek) kötelezően választható tárgyainak a tanterv nem ad ajánlott félévet (a 4–7. félévben 22 kreditnyit kell választani).",
    en: "The curriculum gives no recommended semester for the elective course groups (Data Science, Networks and Systems, System and Software Development, Embedded Systems); 22 credits are chosen in semesters 4–7.",
  },
  specializations: [
    { slug: DS, name: "Adattudomány", en: "Data Science" },
    {
      slug: NET,
      name: "Hálózatok és rendszerek",
      en: "Networks and Systems",
    },
    {
      slug: SW,
      name: "Rendszer- és szoftverfejlesztés",
      en: "System and Software Development",
    },
    { slug: EMB, name: "Beágyazott rendszerek", en: "Embedded Systems" },
  ],
  semesters: [
    // 1. félév
    [
      k(
        "Az informatika logikai és algebrai alapjai",
        "Logical and Algebraic Foundations of Computing",
        4,
      ),
      k("Matematikai alapismeretek", "Basic Mathematics", 2),
      k("Matematikai analízis I.", "Mathematical Analysis I", 6),
      k("Fizika I.", "Physics I", 3),
      k("Információs technológia", "Information Technology", 3),
      k("A programozás alapjai", "Programming Fundamentals", 6),
      k("Programozás I.", "Programming I", 6),
    ],
    // 2. félév
    [
      k("Diszkrét matematika", "Discrete Mathematics", 4),
      k("Lineáris algebra", "Linear Algebra", 4),
      k("Matematikai analízis II.", "Mathematical Analysis II", 6),
      k("Adatstruktúrák és algoritmusok I.", "Data Structures and Algorithms I", 4),
      k("Elektromosságtan", "Electrical Engineering", 4),
      k("Programozás II.", "Programming II", 6),
      k("Számítógép-architektúrák I.", "Computer Architectures I", 3),
    ],
    // 3. félév
    [
      k("Adatbázis-kezelő rendszerek I.", "Database Management Systems I", 6),
      k("Elektronikus elemek és áramkörök", "Electronic Components and Circuits", 4),
      k("Haladó programozási technikák I.", "Advanced Programming Techniques I", 4),
      k("Jelek és rendszerek", "Signals and Systems", 3),
      k("Számítógép-hálózatok I.", "Computer Networks I", 6),
      k("Szoftvertechnológia", "Software Technology", 4),
      k("Web programozás I.", "Web Programming I", 3),
    ],
    // 4. félév
    [
      k("A rendszerfejlesztés haladó módszerei", "Advanced Methods of Systems Development", 3),
      k("Mesterséges intelligencia alapjai", "Fundamentals of Artificial Intelligence", 4),
      k("Operációs rendszerek", "Operating Systems", 4),
      k("Python programozás", "Python Programming", 4),
      k("Számítógép-architektúrák II.", "Computer Architectures II", 4),
      k("Számítógépes perifériák", "Computer Peripherals", 3),
      k("Vállalati gazdaságtan", "Business Economics", 6),
    ],
    // 5. félév
    [
      k(
        "Valószínűségszámítás és matematikai statisztika",
        "Probability Theory and Mathematical Statistics",
        6,
      ),
      k("Bevezetés a digitális jelfeldolgozásba", "Introduction to Digital Signal Processing", 3),
      k(
        "Informatikai rendszerek konfigurálása és üzemeltetése",
        "Configuration and Operation of IT Systems",
        3,
      ),
      k("Projekt labor", "Project Laboratory", 6),
      k("Vállalkozói ismeretek", "Entrepreneurship", 6),
    ],
    // 6. félév
    [
      k("Informatikai biztonság", "IT Security", 6),
      k("Mobil robotika", "Mobile Robotics", 4),
      k("Operációkutatás", "Operations Research", 4),
      k("Távközlési hálózatok", "Telecommunication Networks", 3),
      k("Tervezés I.", "Thesis Design I", 5),
    ],
    // 7. félév
    [
      k("Tervezés II.", "Thesis Design II", 10),
      k("Szakmai gyakorlat", "Professional Internship", 0),
    ],
  ],
  unscheduled: [
    ds("A Data Science alapjai", "Fundamentals of Data Science", 3),
    ds("Adatbányászat", "Data Mining", 4),
    ds("Adatbázis-kezelő rendszerek II.", "Database Management Systems II", 3),
    ds("Adatelemzés Pythonban", "Data Analysis in Python", 3),
    ds("Bevezetés a lágy számítás módszereibe", "Introduction to Soft Computing", 3),
    ds("Információ ábrázolás és modellezés", "Information Representation and Modelling", 3),
    ds("Korszerű adatbázis technológiák", "Modern Database Technologies", 3),
    net("IoT biztonság", "IoT Security", 3),
    net("Linux rendszergazda ismeretek I.", "Linux System Administration I", 4),
    net("Linux rendszergazda ismeretek II.", "Linux System Administration II", 3),
    net("Mobil hálózatok", "Mobile Networks", 6),
    net("Nagyvállalati Linux technológiák", "Enterprise Linux Technologies", 3),
    net("Virtualizációs technológiák a gyakorlatban", "Virtualization Technologies in Practice", 4),
    net("Vállalati kommunikációs rendszerek", "Enterprise Communication Systems", 4),
    net("Számítógép-hálózatok II.", "Computer Networks II", 6),
    sw("A digitális számítás elmélete", "Theory of Digital Computation", 4),
    sw("A multimédia alapjai", "Fundamentals of Multimedia", 6),
    sw("Az informatika ipari alkalmazásai", "Industrial Applications of Informatics", 3),
    sw("C# programozás", "C# Programming", 3),
    sw("Felhasználói interfészek tervezése", "User Interface Design", 3),
    sw("Java programozás I.", "Java Programming I", 6),
    sw("Java programozás II.", "Java Programming II", 6),
    sw("Mobil programozás", "Mobile Programming", 6),
    sw("Párhuzamos programozás", "Parallel Programming", 6),
    sw("Rendszertesztelés", "System Testing", 4),
    sw("Virtuális és kiterjesztett valóság", "Virtual and Augmented Reality", 4),
    sw("Web programozás II.", "Web Programming II", 3),
    emb("LabVIEW fejlesztői környezet", "LabVIEW Development Environment", 6),
    emb(
      "Autóipari szoftver- és hardverfejlesztés a gyakorlatban I.",
      "Automotive Software and Hardware Development in Practice I",
      6,
    ),
    emb(
      "Autóipari szoftver- és hardverfejlesztés a gyakorlatban II.",
      "Automotive Software and Hardware Development in Practice II",
      6,
    ),
    emb("Energiamenedzsment alapjai", "Fundamentals of Energy Management", 4),
    emb("FPGA alapú beágyazott rendszerek", "FPGA-Based Embedded Systems", 4),
    emb("IoT rendszerek", "IoT Systems", 3),
    emb("Irányításelmélet és -technika I.", "Control Theory and Engineering I", 3),
    emb("Képfeldolgozás", "Image Processing", 6),
    emb(
      "Tervezési módszerek programozható logikai eszközökkel",
      "Design Methods with Programmable Logic Devices",
      4,
    ),
  ],
};

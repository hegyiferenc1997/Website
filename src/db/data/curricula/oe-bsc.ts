// Óbudai Egyetem (NIK) – Mérnökinformatikus BSc mintatanterv (nappali, érvényes a 2024/25-ös tanévtől, 7 félév, 210 kredit).
// A Testnevelés, a szigorlat, a Patronálás és a nyelvi kritériumtárgyak nincsenek felvéve.
// Az „Intelligens üzleti és vállalati rendszerek” specializáció a tanterv szerint határozatlan ideig nem indul, ezért kimaradt.
import { k, spec, v, type Curriculum } from "./types";

const IOT = "iot-beagyazott-rendszerek-es-robotika";
const BD = "big-data-es-uzleti-intelligencia";
const CLOUD = "felho-szolgaltatasi-technologiak-es-it-biztonsag";
const SW = "szoftvertervezes-es-fejlesztes";
const AI = "mesterseges-intelligencia";
const iot = spec(IOT);
const bd = spec(BD);
const cloud = spec(CLOUD);
const sw = spec(SW);
const ai = spec(AI);

export const oeBsc: Curriculum = {
  university: "obudai-egyetem",
  level: "bsc",
  sources: [
    {
      url: "https://nik.uni-obuda.hu/wp-content/uploads/2026/03/Mernokinformatikus-BSc-Tanterv-nappali-F.pdf",
      title: "Mérnökinformatikus BSc mintatanterv, nappali tagozat („F” tanterv)",
    },
    {
      url: "https://amk.uni-obuda.hu/wp-content/uploads/2023/12/MERNOKINFORMATIKUS-f-tantervi_graf.pdf",
      title: "Mérnökinformatikus „F” tanterv – tantervi gráf",
    },
  ],
  note: {
    hu: "A PDF táblázatának félévoszlopai nem olvashatók ki egyértelműen; a félévi beosztás a félévenkénti kreditösszegekből és az előfeltételekből következtetett. A kötelezően választható szakmai tárgyak (12 kredit) listáját a kar honlapja közli.",
    en: "The semester columns of the PDF could not be read unambiguously; placement is inferred from credit totals and prerequisites. The list of elective professional courses (12 credits) is published on the faculty website.",
  },
  specializations: [
    {
      slug: IOT,
      name: "IoT, beágyazott rendszerek és robotika",
      en: "IoT, Embedded Systems and Robotics",
    },
    {
      slug: BD,
      name: "Big Data és üzleti intelligencia",
      en: "Big Data and Business Intelligence",
    },
    {
      slug: CLOUD,
      name: "Felhőszolgáltatási technológiák és IT-biztonság",
      en: "Cloud Service Technologies and IT Security",
    },
    { slug: SW, name: "Szoftvertervezés és -fejlesztés", en: "Software Design and Development" },
    { slug: AI, name: "Mesterséges intelligencia", en: "Artificial Intelligence" },
  ],
  semesters: [
    // 1. félév
    [
      k("Matematikai alapismeretek", "Basic Mathematics", 6),
      k("Az informatika matematikai alapjai", "Mathematical Foundations of Computing", 6),
      k("Problémamegoldás programozással", "Problem Solving with Programming", 6),
      k("Tanulásmódszertan", "Study Skills", 6),
      k("Fizika", "Physics", 4),
    ],
    // 2. félév
    [
      k("Elektronikai alapismeretek", "Basic Electronics", 5),
      k("Analízis I.", "Analysis I", 4),
      k("Diszkrét matematika és lineáris algebra", "Discrete Mathematics and Linear Algebra", 4),
      k("Szoftverfejlesztés alapjai", "Fundamentals of Software Development", 6),
      k("Adatbázisok", "Databases", 5),
      k(
        "Tutorálás felkészítő és projektdokumentációs technikák",
        "Tutoring Preparation and Project Documentation Techniques",
        5,
      ),
    ],
    // 3. félév
    [
      k("Analízis II.", "Analysis II", 4),
      k("Tutorálás", "Tutoring", 4),
      k("Elektronika", "Electronics", 5),
      k("Algoritmusok és adatszerkezetek", "Algorithms and Data Structures", 5),
      k("Digitális rendszerek", "Digital Systems", 4),
      k("Haladó szoftverfejlesztés", "Advanced Software Development", 4),
      k("Számítógép hálózatok", "Computer Networks", 4),
    ],
    // 4. félév
    [
      k(
        "Valószínűségszámítás és matematikai statisztika",
        "Probability Theory and Mathematical Statistics",
        5,
      ),
      k("Rendszerelmélet", "Systems Theory", 4),
      k(
        "Vállalkozásszervezés és projektmenedzsment",
        "Business Organization and Project Management",
        4,
      ),
      k("Szoftvertechnológia", "Software Technology", 4),
      k("Full-stack szoftverfejlesztés", "Full-Stack Software Development", 5),
      k("Mesterséges intelligencia", "Artificial Intelligence", 5),
      k("Operációs rendszerek", "Operating Systems", 5),
    ],
    // 5. félév
    [
      k("Számítógép architektúrák alapjai", "Fundamentals of Computer Architectures", 4),
      k("Informatikai biztonság", "IT Security", 5),
      k("Mobilprogramozás", "Mobile Programming", 4),
      k("Projektmunka I.", "Project Work I", 4),
      // A Big Data és a Mesterséges intelligencia specializáción is szerepel.
      v("Bevezetés az adattudományba", "Introduction to Data Science", 5),
      iot("Irányítástechnika", "Control Engineering", 5),
      iot("Beágyazott és érzékelőalapú rendszerek", "Embedded and Sensor-Based Systems", 5),
      bd("Korszerű adatbázisok", "Modern Databases", 5),
      cloud("Hálózati technológiák", "Network Technologies", 5),
      cloud("Felhőszolgáltatások", "Cloud Services", 5),
      sw(
        "Párhuzamos és elosztott rendszerek programozása",
        "Parallel and Distributed Systems Programming",
        5,
      ),
      sw("Haladó algoritmusok", "Advanced Algorithms", 4),
      ai(
        "Gépi látás és képfeldolgozás az egészségügyben",
        "Machine Vision and Image Processing in Healthcare",
        5,
      ),
    ],
    // 6. félév
    [
      k("Korszerű számítógép architektúrák", "Modern Computer Architectures", 4),
      k("Projektmunka II.", "Project Work II", 4),
      // A Big Data és a Mesterséges intelligencia specializáción is szerepel.
      v("Big Data és felhő alapú szolgáltatások", "Big Data and Cloud-Based Services", 5),
      iot("Robottechnika alapjai", "Fundamentals of Robotics", 6),
      iot(
        "Beágyazott eszközök programozása, kommunikációs protokollok",
        "Embedded Device Programming and Communication Protocols",
        5,
      ),
      bd("Adattárházak és üzleti intelligencia", "Data Warehouses and Business Intelligence", 5),
      cloud(
        "Számítógép hálózatok és felhők biztonsága",
        "Security of Computer Networks and Clouds",
        5,
      ),
      cloud(
        "Virtuális hálózatok és adatközpontok technológiái",
        "Virtual Network and Data Centre Technologies",
        5,
      ),
      sw("Adatpárhuzamos programozás", "Data-Parallel Programming", 4),
      sw(
        "Nagy rendszerek fejlesztésének technológiája",
        "Technology of Large-Scale System Development",
        4,
      ),
      ai("Fejlett robotprogramozás ROS környezetben", "Advanced Robot Programming with ROS", 5),
      ai("Mély gépi tanulás", "Deep Learning", 5),
    ],
    // 7. félév
    [
      k("Szakdolgozat", "Thesis", 15),
      iot("Szenzorhálózatok, IoT rendszerek", "Sensor Networks and IoT Systems", 4),
      bd("Haladó adatelemzés", "Advanced Data Analysis", 5),
      cloud(
        "Informatikai rendszerek és szolgáltatások biztonsága",
        "Security of IT Systems and Services",
        5,
      ),
      sw("Modern szoftvertechnológia", "Modern Software Technology", 4),
      sw("Backend és frontend fejlesztés", "Backend and Frontend Development", 4),
    ],
  ],
};

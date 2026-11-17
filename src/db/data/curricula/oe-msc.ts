// Óbudai Egyetem (NIK) – Mérnökinformatikus MSc tantervi tábla (nappali, érvényes a 2023/2024. tanévtől, 4 félév).
// A specializációk évente váltva indulnak. A 0 kredites kritériumtárgy (Patronálás) nincs felvéve.
import { k, spec, v, type Curriculum } from "./types";

const CMR = "kiberorvosi-rendszerek";
const ROB = "robotika";
const SOC = "soc-elemzo";
const cmr = spec(CMR);
const rob = spec(ROB);
const soc = spec(SOC);

export const oeMsc: Curriculum = {
  university: "obudai-egyetem",
  level: "msc",
  sources: [
    {
      url: "https://nik.uni-obuda.hu/wp-content/uploads/2026/03/Mernokinformatikus-MSc-F-Tanterv-nappali.pdf",
      title: "Mérnökinformatikus mesterképzési szak, nappali tagozat – tantervi tábla",
    },
  ],
  note: {
    hu: "A tantervi tábla félévoszlopai a PDF-ből nem olvashatók ki egyértelműen; a félévi beosztás a félévenkénti kreditösszegekből következtetett, néhány tárgynál eltérhet.",
    en: "The semester columns of the PDF could not be read unambiguously; the placement is inferred from per-semester credit totals and may differ for some courses.",
  },
  specializations: [
    { slug: CMR, name: "Kiberorvosi rendszerek", en: "Cyber-Medical Systems" },
    { slug: ROB, name: "Robotika", en: "Robotics" },
    { slug: SOC, name: "SOC elemző", en: "SOC Analyst" },
  ],
  semesters: [
    // 1. félév
    [
      k(
        "Programozási paradigmák és adatszerkezetek",
        "Programming Paradigms and Data Structures",
        5,
      ),
      k("Hálózati technológiák", "Network Technologies", 4),
      k("Adatbázis és Big Data technológiák", "Database and Big Data Technologies", 5),
      k("Korszerű operációs rendszerek", "Modern Operating Systems", 5),
      k(
        "Projektmenedzsment és vállalkozásfejlesztés",
        "Project Management and Business Development",
        5,
      ),
    ],
    // 2. félév
    [
      k("Alkalmazott matematika", "Applied Mathematics", 4),
      k("Rendszer- és irányításelmélet", "Systems and Control Theory", 5),
      k("Informatikai rendszerek biztonságtechnikája", "Security of IT Systems", 5),
      k(
        "Szoftverfejlesztés párhuzamos architektúrákra",
        "Software Development for Parallel Architectures",
        4,
      ),
      k("Diplomamunka I.", "Master's Thesis I", 8),
      cmr("Szenzormodalitások", "Sensor Modalities", 4),
      rob("Gépi intelligencia", "Machine Intelligence", 4),
      soc(
        "Bevezetés a kiberbiztonságba – biztonságtudatosság",
        "Introduction to Cybersecurity – Security Awareness",
        4,
      ),
    ],
    // 3. félév
    [
      k("Üzleti gazdaságtan", "Business Economics", 5),
      k("Számítógépes képfeldolgozás és grafika", "Computer Image Processing and Graphics", 5),
      k("Diplomamunka II.", "Master's Thesis II", 10),
      cmr("Diagnosztikai célú orvosi képalkotás", "Diagnostic Medical Imaging", 4),
      cmr(
        "Egészségügyi informatikai rendszerek biztonsága",
        "Security of Healthcare IT Systems",
        4,
      ),
      cmr(
        "Orvosi vizsgálatok kiértékelésének mérnökinformatikai alapjai",
        "Engineering Informatics Foundations of Evaluating Medical Examinations",
        4,
      ),
      rob(
        "Magas rendelkezésre állású beágyazott rendszerek",
        "High-Availability Embedded Systems",
        4,
      ),
      rob("Robotrendszerek programozása", "Programming Robot Systems", 4),
      rob(
        "Ipari robotok kinematikai és dinamikai modellezése",
        "Kinematic and Dynamic Modelling of Industrial Robots",
        4,
      ),
      soc("IT megfelelőség, audit és kockázatelemzés", "IT Compliance, Audit and Risk Analysis", 4),
      soc(
        "Haladó hálózati technológiák és biztonságuk",
        "Advanced Network Technologies and Their Security",
        4,
      ),
      soc(
        "Nyílt forráskódú SOC fejlesztés a gyakorlatban I.",
        "Open-Source SOC Development in Practice I",
        4,
      ),
    ],
    // 4. félév
    [
      k("Felhő alapú IoT és Big Data platformok", "Cloud-Based IoT and Big Data Platforms", 4),
      k("Diplomamunka III.", "Master's Thesis III", 12),
      // A kiberorvosi és a robotika specializáción is szerepel.
      v("Robotika és adattudomány az orvoslásban", "Robotics and Data Science in Medicine", 4),
      cmr("Biostatisztikai módszerek alkalmazása", "Applied Biostatistical Methods", 4),
      rob("Robotok irányítása", "Robot Control", 4),
      soc(
        "Nyílt forráskódú SOC fejlesztés a gyakorlatban II.",
        "Open-Source SOC Development in Practice II",
        4,
      ),
      soc("MI-alapú megoldások a kibervédelemben", "AI-Based Solutions in Cyber Defence", 4),
    ],
  ],
  unscheduled: [
    v("Felhőszámítási rendszerek üzemeltetése", "Operating Cloud Computing Systems", 4),
    v("Digitális kvantitatív mikroszkópia", "Digital Quantitative Microscopy", 4),
    v("Orvosi készülékek gyártmányfejlesztése", "Medical Device Product Development", 4),
    v("Recent Advances in Intelligent Systems", "Recent Advances in Intelligent Systems", 4),
  ],
};

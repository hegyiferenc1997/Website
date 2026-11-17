// Dunaújvárosi Egyetem – Mérnökinformatikus BSc mintatanterv (2026, nappali, 7 félév, 210 kredit).
// A 0 kredites felzárkóztató és kritériumtárgyak (pl. Matematika felzárkóztató, Sport) nincsenek felvéve.
import { k, spec, type Curriculum } from "./types";

const RH = "rendszer-es-halozatmernok";
const SW = "szoftvertechnologia";
const rh = spec(RH);
const sw = spec(SW);

export const dueBsc: Curriculum = {
  university: "dunaujvarosi-egyetem",
  level: "bsc",
  sources: [
    {
      url: "https://www.uniduna.hu/images/202605/Mintatantervek2026/Mernokinformatikus_BSc_Mintatanterv_2026-HU.pdf",
      title: "Mérnökinformatikus BSc mintatanterv 2026",
    },
  ],
  note: {
    hu: "A specializációs tárgyak félévi beosztása a táblázat sorrendjéből és óraszámaiból következtetett.",
    en: "The semester placement of specialization courses is inferred from the table order and hours.",
  },
  specializations: [
    { slug: RH, name: "Rendszer- és hálózatmérnök", en: "Systems and Network Engineering" },
    { slug: SW, name: "Szoftvertechnológia", en: "Software Technology" },
  ],
  semesters: [
    // 1. félév
    [
      k("Bevezetés a programozásba", "Introduction to Programming", 5),
      k("Mérnöki matematika 1.", "Engineering Mathematics 1", 5),
      k("Számítástudomány alapjai 1.", "Foundations of Computer Science 1", 5),
      k("Számítógép és hálózati architektúrák", "Computer and Network Architectures", 5),
      k("Mérnöki fizika", "Engineering Physics", 5),
      k("Jogi alapismeretek", "Introduction to Law", 5),
    ],
    // 2. félév
    [
      k("Mérnöki matematika 2.", "Engineering Mathematics 2", 5),
      k("Számítástudomány alapjai 2.", "Foundations of Computer Science 2", 5),
      k("Informatika", "Informatics", 5),
      k("Adatbáziskezelés", "Database Management", 5),
      k("Programozás 1.", "Programming 1", 5),
      k("Windows operációs rendszer", "Windows Operating System", 5),
    ],
    // 3. félév
    [
      k("Matematika 3.", "Mathematics 3", 5),
      k("Internet technológiák", "Internet Technologies", 5),
      k("Programozás 2.", "Programming 2", 5),
      k("Elektronika és digitális technika", "Electronics and Digital Systems", 5),
      k("Linux operációs rendszerek", "Linux Operating Systems", 5),
      k("Közgazdaságtan 1.", "Economics 1", 5),
    ],
    // 4. félév
    [
      k("Mesterséges intelligencia alapjai", "Fundamentals of Artificial Intelligence", 5),
      k("Beágyazott rendszerek", "Embedded Systems", 5),
      k("Adatbiztonság, adatvédelem", "Data Security and Data Protection", 5),
      k("Hálózat menedzselés 1.", "Network Management 1", 5),
    ],
    // 5. félév
    [
      k("Multimédia", "Multimedia", 5),
      k("Menedzsment", "Management", 5),
      k("Vállalkozástan", "Entrepreneurship", 5),
      // Mindkét specializáción szerepel, ezért közös tárgy.
      k("Szkript nyelvek", "Scripting Languages", 5),
      rh("Hálózat menedzselés 2.", "Network Management 2", 5),
      rh("Hálózati operációs rendszerek – Windows", "Network Operating Systems – Windows", 5),
      sw("Szoftverfejlesztési technológiák", "Software Development Technologies", 5),
      sw("Programozás 3.", "Programming 3", 5),
    ],
    // 6. félév
    [
      k("Numerikus módszerek", "Numerical Methods", 5),
      k("Mérés- és irányítástechnika", "Measurement and Control Engineering", 5),
      k("Operációkutatás és döntéselmélet", "Operations Research and Decision Theory", 5),
      k("Informatika projekt 1.", "IT Project 1", 5),
      rh("Hálózati operációs rendszerek – Linux", "Network Operating Systems – Linux", 5),
      sw("Web programozás", "Web Programming", 5),
    ],
    // 7. félév
    [
      k("Informatika projekt 2.", "IT Project 2", 5),
      k(
        "Kritikus rendszerek minőségbiztosítása és auditja",
        "Quality Assurance and Audit of Critical Systems",
        5,
      ),
      k("Szakdolgozat", "Thesis", 15),
      k("Szakmai gyakorlat", "Professional Internship", 0),
    ],
  ],
};

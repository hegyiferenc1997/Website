// Pécsi Tudományegyetem (MIK) – Mérnökinformatikus MSc mintatanterv (2025-től, nappali, 4 félév, 120 kredit).
// A szabadon választható tárgyak (6 kredit) nincsenek felvéve, mert a tanterv csak üres helyeket ad meg.
import { k, spec, type Curriculum } from "./types";

const IR = "intelligens-rendszerek";
const ir = spec(IR);

export const pteMsc: Curriculum = {
  university: "pecsi-tudomanyegyetem",
  level: "msc",
  sources: [
    {
      url: "https://info.mik.pte.hu/Attachment/get/portal_article_attachment/419/mernokinformatikus-msc-mintatantervi-halo-2025-250901013857.pdf",
      title: "Mérnökinformatikus MSc mintatantervi háló (2025-től)",
    },
  ],
  specializations: [{ slug: IR, name: "Intelligens rendszerek", en: "Intelligent Systems" }],
  semesters: [
    // 1. félév
    [
      k("Információ és kódelmélet", "Information and Coding Theory", 4),
      k("Párhuzamos algoritmusok és programozás", "Parallel Algorithms and Programming", 4),
      k("Nagy méretű lineáris egyenletrendszerek", "Large-Scale Systems of Linear Equations", 4),
      k("Minőségbiztosítás 2.", "Quality Assurance 2", 2),
      k("Üzleti kommunikáció", "Business Communication", 2),
      k("Ergonómia", "Ergonomics", 2),
      k("Projektmenedzsment 3.", "Project Management 3", 2),
      k(
        "Mesterséges intelligencia elmélete és gyakorlata 1.",
        "Theory and Practice of Artificial Intelligence 1",
        3,
      ),
      k("Intelligens rendszerek", "Intelligent Systems", 6),
    ],
    // 2. félév
    [
      k("Kvantum-informatika: kriptográfia", "Quantum Informatics: Cryptography", 4),
      k("Jelfeldolgozás és gépi tanulás", "Signal Processing and Machine Learning", 4),
      k(
        "Mesterséges intelligencia elmélete és gyakorlata 2.",
        "Theory and Practice of Artificial Intelligence 2",
        3,
      ),
      k("Párhuzamos technológiák 1.", "Parallel Technologies 1", 4),
      ir("Emelt szintű képfeldolgozás", "Advanced Image Processing", 6),
      ir("Autonóm rendszerek", "Autonomous Systems", 4),
    ],
    // 3. félév
    [
      k("Környezetvédelem mérnököknek", "Environmental Protection for Engineers", 3),
      k("Párhuzamos technológiák 2.", "Parallel Technologies 2", 4),
      k("Önálló labor", "Individual Laboratory", 12),
      ir("Számítógépes látórendszerek", "Computer Vision Systems", 6),
      ir("Robotizált rendszerek", "Robotized Systems", 5),
    ],
    // 4. félév
    [k("Diplomamunka", "Master's Thesis", 30)],
  ],
};

// Pannon Egyetem (MIK) – Mérnökinformatikus MSc tanterv (2026. 03. 17., 4 félév, 120 kredit, nappali).
// Az 1. és 2. félév az őszi/tavaszi kezdéstől függően felcserélődik; itt az őszi kezdés sorrendje szerepel.
import { k, spec, v, type Curriculum } from "./types";

const AUTO = "autoipari-beagyazott-es-intelligens-rendszerek";
const auto = spec(AUTO, true);

export const peMsc: Curriculum = {
  university: "pannon-egyetem",
  level: "msc",
  sources: [
    {
      url: "https://mik.uni-pannon.hu/docs/tantervek/260317-mernokinfo-MSc-uj-kepzes-KTutan.pdf",
      title: "Mérnökinformatikus MSc szak tanterve (2026. 03. 17.)",
    },
  ],
  note: {
    hu: "A 3–4. félév differenciált szakmai tárgyainak (20 kredit) a tanterv nem ad pontos félévet; ezek a „félév nélküli” részben vannak.",
    en: "The curriculum gives no exact semester for the differentiated courses of semesters 3–4 (20 credits); they are listed without a semester.",
  },
  specializations: [
    {
      slug: AUTO,
      name: "Autóipari beágyazott és intelligens rendszerek",
      en: "Automotive Embedded and Intelligent Systems",
    },
  ],
  semesters: [
    // 1. félév (őszi kezdés)
    [
      k("Haladó operációkutatás", "Advanced Operations Research", 6),
      k("Digitális jelfeldolgozás", "Digital Signal Processing", 6),
      k("Információs rendszerek biztonságtechnikája", "Security of Information Systems", 6),
      k("Projekt labor", "Project Laboratory", 6),
    ],
    // 2. félév
    [
      k("Numerikus analízis", "Numerical Analysis", 6),
      k("Diszkrét és folytonos rendszerek", "Discrete and Continuous Systems", 6),
      k("Haladó adatbázis-kezelő rendszerek", "Advanced Database Management Systems", 6),
      k("Felhő programozás", "Cloud Programming", 6),
      k("Önálló laborgyakorlat", "Individual Laboratory", 6),
    ],
    // 3. félév
    [k("Diplomalabor", "Thesis Laboratory", 15)],
    // 4. félév
    [k("Diplomamunka", "Master's Thesis", 15)],
  ],
  unscheduled: [
    v("Robotika és gépi látás", "Robotics and Machine Vision", 9),
    v("Ipar 4.0", "Industry 4.0", 9),
    auto("Beágyazott okos rendszerek", "Embedded Smart Systems", 9),
    v("Felhőbiztonság", "Cloud Security", 4),
    v("Algoritmus és bonyolultságelmélet", "Algorithms and Complexity Theory", 4),
    v("Matematikai statisztika", "Mathematical Statistics", 4),
    v("Intelligens irányító rendszerek", "Intelligent Control Systems", 6),
    v(
      "Információ-elmélet mérnöki alkalmazásokkal",
      "Information Theory with Engineering Applications",
      3,
    ),
    v("Hálózatszintézis és optimalizálás", "Network Synthesis and Optimization", 4),
    v("GPU programozás", "GPU Programming", 6),
    v("Kombinatorikus algoritmusok", "Combinatorial Algorithms", 3),
    v("Ipari adatkezelés", "Industrial Data Management", 4),
    auto(
      "Autóipari szoftvertesztelés és validáció",
      "Automotive Software Testing and Validation",
      3,
    ),
    auto(
      "Autóipari szenzorfejlesztés és rendszermérnöki szemlélet",
      "Automotive Sensor Development and Systems Engineering",
      3,
    ),
    v("Irányítási rendszerek az Ipar 4.0-ban", "Control Systems in Industry 4.0", 3),
    auto("Kutatás-fejlesztés I.", "Research and Development I", 4),
    v("Kutatás-fejlesztés II.", "Research and Development II", 4),
    v("Szoftver ergonómia", "Software Ergonomics", 3),
    v(
      "Adatvizualizációs és üzleti intelligencia rendszerek",
      "Data Visualization and Business Intelligence Systems",
      4,
    ),
    v("Kutatásmódszertan", "Research Methodology", 3),
    v("Regionális gazdaságtan", "Regional Economics", 3),
    v(
      "Iparjogvédelem és innováció menedzsment",
      "Industrial Property Protection and Innovation Management",
      3,
    ),
    v("Szellemitulajdon-védelem", "Intellectual Property Protection", 3),
    v("Üzleti kommunikáció", "Business Communication", 3),
  ],
};

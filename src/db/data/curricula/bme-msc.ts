// Budapesti Műszaki és Gazdaságtudományi Egyetem (VIK) – Mérnökinformatikus MSc, 2026-os képzési program (4 félév, 120 kredit).
// A tárgylista a képzési program ismeretkör- és specializációleírásaiból, a félévi beosztás a 6.1. mintatantervből való.
// A főspecializációs tárgyak A1/A2/B/C sorrendje a felsorolás sorrendjéből következtetett.
// Itt a főspecializációk szerepelnek; a mellékspecializációk (14 kredit) a dokumentumban vannak felsorolva.
import { k, spec, v, type Curriculum } from "./types";

const DS = "adattudomany-es-mesterseges-intelligencia";
const NET = "internetarchitektura-es-felhoszolgaltatasok";
const SEC = "it-biztonsag";
const SW = "szoftverfejlesztes";
const VIS = "vizualis-informatika";
const ds = spec(DS);
const net = spec(NET);
const sec = spec(SEC);
const sw = spec(SW);
const vis = spec(VIS);

export const bmeMsc: Curriculum = {
  university: "budapesti-muszaki-es-gazdasagtudomanyi-egyetem",
  level: "msc",
  sources: [
    {
      url: "https://vik.bme.hu/document/7995/original/MSc_Info_K%C3%A9pz%C3%A9si_program_HU_2026.pdf",
      title: "Mérnökinformatikus MSc képzési program (2026)",
    },
  ],
  note: {
    hu: "A félévi beosztás a mintatanterv általános helyeiből (pl. „főspecializáció A1 tantárgy”) következtetett, a tárgyakat a felsorolás sorrendjében rendeltük hozzá. A matematikai és közös tárgyak az 1–2. félévben választhatók. A mellékspecializációk (pl. Kvantuminformatika, Mobilszoftver-fejlesztés, Kritikus rendszerek) nincsenek felvéve.",
    en: 'Semester placement is inferred from the sample curriculum\'s generic slots (e.g. "main specialization A1 course"), assigning courses in listed order. Mathematics and common courses can be taken in semesters 1–2. Minor specializations are not included.',
  },
  specializations: [
    {
      slug: DS,
      name: "Adattudomány és mesterséges intelligencia",
      en: "Data Science and Artificial Intelligence",
    },
    {
      slug: NET,
      name: "Internetarchitektúra és felhőszolgáltatások",
      en: "Internet Architecture and Cloud Services",
    },
    { slug: SEC, name: "IT-biztonság", en: "IT Security" },
    { slug: SW, name: "Szoftverfejlesztés", en: "Software Development" },
    { slug: VIS, name: "Vizuális informatika", en: "Visual Computing" },
  ],
  semesters: [
    // 1. félév
    [
      // Felsőbb matematika és közös tárgyak (az 1–2. félévben, csoportonként kettő választandó)
      v("Analízis", "Analysis", 5),
      v("Rendszeroptimalizálás", "System Optimization", 5),
      v("Matematikai statisztika", "Mathematical Statistics", 5),
      v("Sztochasztika", "Stochastics", 5),
      v("Formális módszerek", "Formal Methods", 5),
      v("Nyelvek és automaták", "Languages and Automata", 5),
      v("Szoftverarchitektúrák", "Software Architectures", 5),
      v("Információelmélet", "Information Theory", 5),
      v("Adatbázisok elmélete", "Database Theory", 5),
      k("Önálló laboratórium 1", "Individual Laboratory 1", 5),
      // Főspecializáció A1 tantárgy
      ds("Gépi tanulás", "Machine Learning", 5),
      net(
        "Felhő- és mikroszolgáltatások hálózati architektúrái",
        "Network Architectures of Cloud and Microservices",
        5,
      ),
      sec("Szoftverbiztonság", "Software Security", 5),
      sw("Modellalapú szoftverfejlesztés", "Model-Based Software Development", 5),
      vis("Képszintézis", "Image Synthesis", 5),
    ],
    // 2. félév
    [
      k("Önálló laboratórium 2", "Individual Laboratory 2", 5),
      // Főspecializáció A1 labor és A2 tantárgy
      ds("Gépi tanulási esettanulmányok", "Machine Learning Case Studies", 5),
      ds("Mélytanulás", "Deep Learning", 5),
      net(
        "Felhők hálózati architektúrái laboratórium",
        "Cloud Network Architectures Laboratory",
        5,
      ),
      net(
        "Felhőalapú hálózati szolgáltatások programozása Go nyelven",
        "Programming Cloud Network Services in Go",
        5,
      ),
      sec("Szoftverbiztonság labor", "Software Security Laboratory", 5),
      sec("Számítógép- és hálózatbiztonság", "Computer and Network Security", 5),
      sw("Modellalapú szoftverfejlesztés labor", "Model-Based Software Development Laboratory", 5),
      sw("Üzleti intelligencia", "Business Intelligence", 5),
      vis("Játékfejlesztés labor", "Game Development Laboratory", 5),
      vis(
        "3D számítógépes geometria és alakzatrekonstrukció",
        "3D Computational Geometry and Shape Reconstruction",
        5,
      ),
    ],
    // 3. félév
    [
      k("Diplomatervezés 1", "Master's Thesis Design 1", 10),
      // Főspecializáció A2 labor és B tantárgy
      ds("Haladó adatelemzési módszerek labor", "Advanced Data Analysis Methods Laboratory", 5),
      ds(
        "Intelligens adatelemzés és döntéstámogatás",
        "Intelligent Data Analysis and Decision Support",
        5,
      ),
      net("Felhők hálózati szolgáltatásai laboratórium", "Cloud Network Services Laboratory", 5),
      net("Az Internet ökoszisztémája", "The Internet Ecosystem", 5),
      sec("Számítógép- és hálózatbiztonság labor", "Computer and Network Security Laboratory", 5),
      sec("Kriptográfiai protokollok", "Cryptographic Protocols", 5),
      sw("Üzleti intelligencia labor", "Business Intelligence Laboratory", 5),
      sw("Szoftverfejlesztés az iparban", "Software Development in Industry", 5),
      vis(
        "GPU programozás és párhuzamos rendszerek labor",
        "GPU Programming and Parallel Systems Laboratory",
        5,
      ),
      vis("Deep-learning a vizuális informatikában", "Deep Learning in Visual Computing", 5),
    ],
    // 4. félév
    [
      k("Mérnöki menedzsment", "Engineering Management", 4),
      k("Diplomatervezés 2", "Master's Thesis Design 2", 20),
    ],
  ],
  unscheduled: [
    // Kötelezően választható szakmai tárgyak (egy választandó); a mintatanterv nem köti félévhez
    v("Skálázható szoftverek", "Scalable Software", 5),
    v("A gépi tanulás biztonsága", "Security of Machine Learning", 5),
    v("Vizualizáció és orvosi képalkotás", "Visualization and Medical Imaging", 5),
    v("Megbízható mesterséges intelligencia és adatelemzés", "Trustworthy AI and Data Analysis", 5),
    v("Adatszerkezetek és algoritmusok", "Data Structures and Algorithms", 5),
    v("IoT – Tárgyak internete", "IoT – Internet of Things", 5),
    // Hathetes szakmai gyakorlat
    k("Szakmai gyakorlat", "Professional Internship", 0),
  ],
};

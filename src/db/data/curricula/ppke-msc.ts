// Pázmány Péter Katolikus Egyetem (ITK) – Mérnökinformatikus MSc tanterv (IMNI-AMI, angol nyelvű, nappali, 2025/2026 ősztől, 4 félév).
// A tanterv angol nyelvű; a magyar nevek fordítások. A kritériumtárgyak, a záróvizsga, a csak külföldi hallgatóknak szóló
// tárgyak, a mobilitási helykitöltők és a szabadon választható tárgyak nincsenek felvéve.
import { k, spec, v, type Curriculum } from "./types";

const ML = "machine-learning-for-data-science";
const HPC = "high-performance-computational-tools-and-architectures";
const SE = "software-engineering";
const ml = spec(ML);
const mlV = spec(ML, true);
const hpc = spec(HPC);
const hpcV = spec(HPC, true);
const se = spec(SE);
const seV = spec(SE, true);

export const ppkeMsc: Curriculum = {
  university: "pazmany-peter-katolikus-egyetem",
  level: "msc",
  sources: [
    {
      url: "https://itk.ppke.hu/storage/tinymce/uploads/2025---sz-mintatantervek/IMNI-AMI-2025_H.xlsx?u=1ehbUv",
      title: "MSc Curriculum in Computer Science Engineering (IMNI-AMI, 2025/2026)",
    },
  ],
  note: {
    hu: "A képzés angol nyelvű; a magyar tárgynevek fordítások.",
    en: "The programme is taught in English; the Hungarian course names are translations.",
  },
  specializations: [
    { slug: ML, name: "Gépi tanulás az adattudományban", en: "Machine Learning for Data Science" },
    {
      slug: HPC,
      name: "Nagy teljesítményű számítási eszközök és architektúrák",
      en: "High Performance Computational Tools and Architectures",
    },
    { slug: SE, name: "Szoftvertechnológia", en: "Software Engineering" },
  ],
  semesters: [
    // 1. félév
    [
      k("Elektromos mérések laboratórium", "Electrical Measurements Laboratory", 2),
      k("Adatbányászat és gépi tanulás", "Data Mining and Machine Learning", 5),
      // A gépi tanulás és a nagy teljesítményű specializáción kötelező.
      v("Párhuzamos számítási architektúrák", "Parallel Computing Architectures", 3),
      v("Numerikus analízis 1", "Numerical Analysis 1", 5),
      v(
        "Az információtechnika és a bionika fizikája 2",
        "Physics of Information Technology and Bionics 2",
        5,
      ),
      v("Akadémiai angol", "English for Academic Purposes", 3),
      v("Bevezetés a startup innovációba", "Introduction to Startup Innovation", 3),
      v("Többmodalitású szenzorfúzió és navigáció", "Multimodal Sensor Fusion and Navigation", 5),
      ml("Alapvető képfeldolgozó algoritmusok", "Basic Image Processing Algorithms", 5),
      mlV(
        "Adatelemzés a sportban és a rehabilitációban",
        "Data Analytics in Sports and Rehabilitation",
        3,
      ),
      mlV("Bevezetés a bioinformatikába", "Introduction to Bioinformatics", 5),
      mlV("Személyi navigáció", "Personal Navigation", 4),
      hpcV(
        "Elektromágneses metaanyagok és alkalmazásaik",
        "Electromagnetic Metamaterials and Applications",
        4,
      ),
      hpcV("Magas szintű szintézis FPGA-n", "High-level Synthesis Methods on FPGAs", 5),
      hpcV(
        "Nyomtatott áramkör tervezése a gyakorlatban",
        "Printed Circuit Board Design Practice",
        3,
      ),
      hpcV("VLSI-tervezés elmélete és gyakorlata", "VLSI Design Theory and Practice", 5),
      hpcV(
        "Az FDTD módszer mérnököknek",
        "The Finite Difference Time Domain Method for Engineers",
        4,
      ),
      se("Tervezési minták", "Design Patterns", 5),
      seV("IT-technológiák nagyvállalatoknál", "IT Technologies in Large Enterprises", 1),
      seV("Haladó Java programozás", "Advanced Java Programming", 2),
      seV("Angular", "Angular", 2),
      seV("Információs rendszerek integrációja", "Integration of Information Systems", 5),
    ],
    // 2. félév
    [
      k("Optimalizálási módszerek", "Optimization Methods", 4),
      k("Irányított kutatási projekt", "Tutored Research Project", 10),
      k("Szakmai gyakorlat", "Professional Internship", 0),
      // A nagy teljesítményű és a szoftvertechnológia specializáción kötelező, a gépi tanulásin választható.
      v("Párhuzamos programozás", "Parallel Programming", 3),
      v("Funkcionálanalízis", "Functional Analysis", 5),
      v("Kombinatorikus módszerek", "Combinatorial Methods", 3),
      v("A holokauszt és emlékezete", "The Holocaust and Its Memory", 2),
      v("Bioetika és környezetetika II.", "Bio- and Environmental Ethics 2", 2),
      v("Projektalapok", "Project Fundamentals", 3),
      v("Akadémiai angol 2", "English for Academic Purposes 2", 3),
      v("Tudományos Python", "Scientific Python", 3),
      v("Érzékelő robotika", "Sensory Robotics", 4),
      v(
        "Szoftveresen definiált elektronikai és információs rendszerek",
        "Software Defined Electronic and Information Systems",
        4,
      ),
      ml("Gépi tanulás", "Machine Learning", 5),
      mlV(
        "Adatvizualizáció a bioinformatikában és a rendszerbiológiában",
        "Data Visualization in Bioinformatics and Systems Biology",
        2,
      ),
      hpcV("Beágyazott elektronikai rendszerek", "Embedded Electronic Systems", 3),
      hpcV("Nanoelektronika és nanotechnológia", "Nanoelectronics and Nanotechnology", 5),
      seV("Adattömörítési módszerek", "Data Compression Methods", 2),
      seV("Scrum agilis fejlesztési módszertan", "Scrum Agile Development Methodology", 2),
      seV(
        "Adatintenzív alkalmazások technológiái",
        "Technologies of Data Intensive Applications",
        2,
      ),
    ],
    // 3. félév
    [
      k("Diplomamunka 1", "Thesis Work 1", 15),
      v("Nemlineáris dinamikai rendszerek", "Nonlinear Dynamical Systems", 5),
      v("Sztochasztikus jelek és rendszerek", "Stochastic Signals and Systems", 5),
      v("Az agykutatás története", "History of Brain Research", 1),
      v("Vizuális kultúra és kommunikáció", "Visual Culture and Communication", 3),
      se("Programozási módszertan", "Programming Methodology", 5),
      seV(".NET programozás alapjai", "Basics of .NET Programming", 3),
      seV(
        "Szoftvertesztelés automatizálása a gyakorlatban",
        "Software Test Automation in Practice",
        2,
      ),
    ],
    // 4. félév
    [
      k("Paraméterbecslés", "Parameter Estimation", 5),
      k("Diplomamunka 2", "Thesis Work 2", 15),
      v("Numerikus analízis 2", "Numerical Analysis 2", 4),
      v("Szellemi tulajdonjogok a kutatás-fejlesztésben", "Intellectual Property Rights in R&D", 2),
      mlV("Biometria a személyazonosításban", "Biometrics in Person Identification", 4),
      hpc("Optikai eszközök és fotonika", "Optical Devices and Photonics", 5),
      hpcV("Antennatömb-jelfeldolgozás", "Array Signal Processing", 2),
      hpcV("Digitális IC-tervezés", "Digital IC Design", 2),
    ],
  ],
};

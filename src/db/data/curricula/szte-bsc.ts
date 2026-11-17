// Szegedi Tudományegyetem (TTIK) – Mérnökinformatikus BSc: egyelőre csak az 1. félév ismert
// (a 2024 őszén bevezetett tantervmódosítás tájékoztatójából). A teljes mintatanterv még nincs feldolgozva.
import { k, v, type Curriculum } from "./types";

export const szteBsc: Curriculum = {
  university: "szegedi-tudomanyegyetem",
  level: "bsc",
  sources: [
    {
      url: "https://sci.u-szeged.hu/hallgatoknak/informatikai-intezet/mernokinformatikus-bsc-tajekoztato",
      title: "Mérnökinformatikus BSc tájékoztató (2024 őszi tantervmódosítás)",
    },
  ],
  note: {
    hu: "Egyelőre csak az ajánlott 1. félév ismert; a többi félév tárgyai a teljes mintatanterv feldolgozása után kerülnek fel.",
    en: "Only the recommended first semester is known so far; the other semesters will be added once the full curriculum is processed.",
  },
  semesters: [
    // 1. félév
    [
      k("Diszkrét matematika I.", "Discrete Mathematics I", 5),
      k("Kalkulus I.", "Calculus I", 5),
      k("Programozás alapjai", "Programming Fundamentals", 5),
      k("Fizika mérnökinformatikusoknak I.", "Physics for Computer Engineers I", 5),
      k("Digitális architektúrák", "Digital Architectures", 4),
      k("Számítógép-hálózatok", "Computer Networks", 4),
      v("Személyes és szociális készségek", "Personal and Social Skills", 2),
    ],
  ],
};

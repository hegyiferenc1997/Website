import { describe, expect, it } from "vitest";
import { normalize, search, type SearchItem } from "@/features/search/match";

const item = (kind: SearchItem["kind"], title: string, keywords: string, university = "gde") =>
  ({
    kind,
    key: `${kind}:${university}/${title}`,
    title,
    meta: keywords,
    keywords,
    university,
  }) as SearchItem;

const items: SearchItem[] = [
  item("university", "Gábor Dénes Egyetem", "gde Budapest"),
  item("university", "Óbudai Egyetem", "obuda Budapest", "obuda"),
  item("course", "Matematika", "Gábor Dénes Egyetem gde"),
  item("course", "Matematika", "Óbudai Egyetem obuda", "obuda"),
  item("course", "Lineáris algebra", "Gábor Dénes Egyetem gde"),
  item("course", "Diszkrét matematika", "Gábor Dénes Egyetem gde"),
];

describe("search", () => {
  it("ékezet és kisbetű nélkül is talál", () => {
    expect(normalize("Gábor Dénes")).toBe("gabor denes");
    expect(search(items, "linearis").map((i) => i.title)).toEqual(["Lineáris algebra"]);
  });

  it("ugyanazt a tárgyat minden egyetemnél megadja", () => {
    const hits = search(items, "matematika");
    expect(hits.filter((i) => i.title === "Matematika")).toHaveLength(2);
    // A névvel kezdődő találat előrébb van, mint ahol csak a név közepén szerepel.
    expect(hits.at(-1)?.title).toBe("Diszkrét matematika");
  });

  it("több szóval szűkít, pl. tárgy + egyetem", () => {
    expect(search(items, "matek").length).toBe(0);
    expect(search(items, "matematika obuda").map((i) => i.university)).toEqual(["obuda"]);
  });

  it("egyetemre is keres", () => {
    expect(search(items, "óbudai").some((i) => i.kind === "university")).toBe(true);
  });

  it("üres keresésre nincs találat", () => {
    expect(search(items, "   ")).toEqual([]);
  });
});

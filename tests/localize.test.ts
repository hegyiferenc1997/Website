import { describe, expect, it } from "vitest";
import { localize } from "@/features/courses/localize";

describe("localize", () => {
  it("a kért nyelvet adja vissza, ha van", () => {
    expect(localize({ hu: "Egyetem", en: "University" }, "en")).toBe("University");
  });

  it("magyarra esik vissza, ha nincs fordítás", () => {
    expect(localize({ hu: "Egyetem" }, "de")).toBe("Egyetem");
  });

  it("üres mezőre null-t ad", () => {
    expect(localize(null, "hu")).toBeNull();
  });
});

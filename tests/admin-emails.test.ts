// Az admin e-mail címek felismerésének tesztje (ADMIN_EMAILS környezeti változó).
import { describe, expect, it } from "vitest";
import { adminEmails, isAdminEmail } from "@/features/admin/admin-emails";

describe("admin e-mail címek", () => {
  it("vesszővel elválasztott lista, szóközök és kis-/nagybetű nélkül", () => {
    expect(adminEmails(" A@x.hu, b@Y.com ,,")).toEqual(["a@x.hu", "b@y.com"]);
  });

  it("üres vagy hiányzó változónál senki sem admin", () => {
    expect(isAdminEmail("a@x.hu", "")).toBe(false);
    expect(adminEmails(undefined)).toEqual([]);
  });

  it("csak a listában szereplő cím admin", () => {
    expect(isAdminEmail("A@X.hu", "a@x.hu")).toBe(true);
    expect(isAdminEmail("masik@x.hu", "a@x.hu")).toBe(false);
    expect(isAdminEmail(null, "a@x.hu")).toBe(false);
  });
});

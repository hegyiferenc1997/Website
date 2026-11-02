import "server-only";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { PaymentProvider } from "./provider";

// Próba-fizetés: valódi terhelés nélkül a saját „fizetési oldalunkra” visz (/fizetes), ahol egy gombbal
// rögzíthető a vásárlás. Ugyanúgy viselkedik, mint egy valódi szolgáltató átirányítása (pl. Stripe Checkout).

export const mockProvider: PaymentProvider = {
  id: "mock",
  async createCheckout(order) {
    const query = new URLSearchParams({
      university: order.universitySlug,
      semester: String(order.semester),
      plan: order.plan,
      back: order.returnTo,
    });
    const path = getPathname({ href: "/checkout", locale: order.locale as Locale });
    return { url: `${path}?${query}` };
  },
};

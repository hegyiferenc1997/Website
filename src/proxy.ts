import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Felismeri a nyelvet, és a magyar URL-eket (/egyetemek) a belső útvonalakra irányítja.
export default createMiddleware(routing);

export const config = {
  // Minden útvonal, kivéve az API-t, a Next.js belső fájljait és a pontot tartalmazó fájlneveket.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

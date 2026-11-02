import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import type { Database } from "@/db";
import { accounts, sessions, users, verifications } from "@/db/schema";
import {
  isPasswordValid,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  type SocialProviders,
} from "./shared";

/** A külső belépési módok, amelyekhez meg vannak adva a kulcsok (lásd .env.example). */
export function configuredSocialProviders(): SocialProviders {
  return {
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    apple: Boolean(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET),
  };
}

/**
 * A bejelentkezés beállításai (Better Auth).
 * Biztonság: a jelszavakat scrypt hash-ként tárolja, a munkamenet-süti httpOnly és SameSite=Lax
 * (élesben Secure), a POST kéréseknél ellenőrzi a kérés forrását (CSRF), és élesben korlátozza
 * a próbálkozások számát.
 */
export function createAuth(db: Database) {
  const social = configuredSocialProviders();
  const isDev = process.env.NODE_ENV !== "production";

  return betterAuth({
    appName: "Engineering Maxxing",
    baseURL: process.env.BETTER_AUTH_URL ?? (isDev ? "http://localhost:3000" : undefined),
    // Élesben kötelező a BETTER_AUTH_SECRET; nélküle a Better Auth hibát dob (nem indul gyenge kulccsal).
    secret: process.env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: { user: users, session: sessions, account: accounts, verification: verifications },
    }),
    // Az Apple a visszahívást űrlapként küldi a saját domainjéről.
    trustedOrigins: social.apple ? ["https://appleid.apple.com"] : [],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: MIN_PASSWORD_LENGTH,
      maxPasswordLength: MAX_PASSWORD_LENGTH,
      autoSignIn: true,
      revokeSessionsOnPasswordReset: true,
      resetPasswordTokenExpiresIn: 60 * 60,
      async sendResetPassword({ user, url }) {
        // Még nincs e-mail küldő szolgáltatás bekötve. Fejlesztés közben a link a terminálban jelenik meg;
        // élesben szándékosan nem írjuk ki, mert a link a fiókhoz ad hozzáférést.
        if (isDev) {
          console.info(`\n[jelszó-visszaállítás] ${user.email}\n${url}\n`);
        } else {
          console.warn("[jelszó-visszaállítás] Nincs beállítva e-mail küldés, a link nem ment ki.");
        }
      },
    },
    socialProviders: {
      ...(social.google && {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          prompt: "select_account" as const,
        },
      }),
      ...(social.apple && {
        apple: {
          clientId: process.env.APPLE_CLIENT_ID!,
          clientSecret: process.env.APPLE_CLIENT_SECRET!,
        },
      }),
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 nap („Jelszó megjegyzése” esetén)
      updateAge: 60 * 60 * 24, // naponta egyszer meghosszabbítja
      // A munkamenet rövid ideig egy aláírt sütiben is megvan, így a legtöbb oldalbetöltés nem kérdezi az adatbázist.
      cookieCache: { enabled: true, maxAge: 5 * 60 },
    },
    advanced: {
      cookiePrefix: "em",
    },
    hooks: {
      // Regisztrációnál és új jelszónál a szerver is ellenőrzi a jelszó szabályait
      // (legalább 8 karakter, nagybetű, szám, speciális karakter), nem csak a böngésző.
      before: createAuthMiddleware(async (ctx) => {
        const password =
          ctx.path === "/sign-up/email"
            ? ctx.body?.password
            : ctx.path === "/reset-password"
              ? ctx.body?.newPassword
              : undefined;
        if (password !== undefined && !isPasswordValid(String(password))) {
          throw new APIError("BAD_REQUEST", {
            code: "PASSWORD_TOO_WEAK",
            message: "Password does not meet the requirements",
          });
        }
      }),
    },
    telemetry: { enabled: false },
  });
}

/** A bejelentkezés példányának típusa. */
export type Auth = ReturnType<typeof createAuth>;

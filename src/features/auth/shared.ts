// A böngésző és a szerver által is használt bejelentkezési beállítások (nincs bennük titok).

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

/** Mely külső belépési módok vannak beállítva (a gombok ennek alapján működnek). */
export type SocialProviders = { google: boolean; apple: boolean };

/** A jelszó szabályai; regisztrációnál és új jelszónál mind kötelező (a szerver is ellenőrzi). */
export const PASSWORD_RULES = ["length", "upper", "digit", "special"] as const;
export type PasswordRule = (typeof PASSWORD_RULES)[number];

/** Melyik szabályt teljesíti a jelszó. */
export function checkPassword(password: string): Record<PasswordRule, boolean> {
  return {
    length: password.length >= MIN_PASSWORD_LENGTH,
    upper: /\p{Lu}/u.test(password),
    digit: /\p{Nd}/u.test(password),
    // Speciális karakter: ami nem betű, nem szám és nem szóköz (pl. ! ? # @ - _ .).
    special: /[^\p{L}\p{N}\s]/u.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  const checks = checkPassword(password);
  return password.length <= MAX_PASSWORD_LENGTH && PASSWORD_RULES.every((r) => checks[r]);
}

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

/**
 * Jelszó erőssége 0–4 között a csíkhoz: üres = 0; amíg nem teljesít minden szabályt, legfeljebb 2;
 * minden szabály = 3 („jó”); minden szabály és legalább 12 karakter = 4 („erős”).
 */
export function passwordStrength(password: string): PasswordStrength {
  if (!password) return 0;
  const met = PASSWORD_RULES.filter((r) => checkPassword(password)[r]).length;
  if (met < 4) return met <= 2 ? 1 : 2;
  return password.length >= 12 ? 4 : 3;
}

// A böngésző és a szerver által is használt bejelentkezési beállítások (nincs bennük titok).

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

/** Mely külső belépési módok vannak beállítva (a gombok ennek alapján működnek). */
export type SocialProviders = { google: boolean; apple: boolean };

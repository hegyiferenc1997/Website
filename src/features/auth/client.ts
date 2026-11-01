"use client";

import { createAuthClient } from "better-auth/react";

/** A böngészőből hívható bejelentkezési műveletek (regisztráció, belépés, kilépés stb.). */
export const authClient = createAuthClient();

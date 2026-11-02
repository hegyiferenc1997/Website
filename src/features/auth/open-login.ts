// A fejléc bejelentkezés paneljének megnyitása bárhonnan (pl. a „Jelentkezz be a vásárláshoz” gombbal).
// A LoginMenu figyeli ezt az eseményt.

/** Az esemény neve. */
export const OPEN_LOGIN_EVENT = "em:open-login";

/** Megnyitja a bejelentkezés panelt. */
export function openLoginPanel() {
  window.dispatchEvent(new Event(OPEN_LOGIN_EVENT));
}

"use client";

import { useEffect } from "react";
import { connectAccount, disconnectAccount } from "./store";

/** Összeköti a böngészőben tárolt haladást a bejelentkezett fiókkal (vagy leválasztja róla). */
export function ProgressSync({ userId }: { userId: string | null }) {
  useEffect(() => {
    if (userId) void connectAccount(userId);
    else disconnectAccount();
  }, [userId]);
  return null;
}

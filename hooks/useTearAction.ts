"use client";

import { useState } from "react";
import { tearPage } from "@/lib/firebase/firestore";
import { getTodayKey } from "@/lib/utils/dateUtils";

export function useTearAction(
  uid: string | null,
  lastTearDate: string | null
) {
  const [isTearing, setIsTearing] = useState(false);
  const todayKey = getTodayKey();
  const canTear = lastTearDate !== todayKey;

  async function handleTearPage() {
    if (!uid || !canTear || isTearing) return;
    setIsTearing(true);
    try {
      await tearPage(uid, todayKey);
    } catch (err) {
      console.error("tearPage error:", err);
    } finally {
      setIsTearing(false);
    }
  }

  return { canTear, isTearing, handleTearPage, todayKey };
}

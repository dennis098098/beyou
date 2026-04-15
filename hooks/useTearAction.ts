"use client";

import { useState, useEffect } from "react";
import { tearPage } from "@/lib/firebase/firestore";
import { getTodayKey } from "@/lib/utils/dateUtils";

export function useTearAction(
  uid: string | null,
  lastTearDates: Record<string, string | null> | null | undefined,
  calendarType: string
) {
  const [isTearing, setIsTearing] = useState(false);
  const [tornToday, setTornToday] = useState(false); // optimistic local state
  const todayKey = getTodayKey();

  useEffect(() => {
    setTornToday(false);
  }, [calendarType]);
  const lastTearDate = lastTearDates?.[calendarType] ?? null;
  const canTear = !tornToday && lastTearDate !== todayKey;

  async function handleTearPage() {
    if (!uid || !canTear || isTearing) return;
    setIsTearing(true);
    setTornToday(true); // immediately hide button / hint
    try {
      await tearPage(uid, todayKey, calendarType);
    } catch (err) {
      console.error("tearPage error:", err);
      setTornToday(false); // rollback if write failed
    } finally {
      setIsTearing(false);
    }
  }

  return { canTear, isTearing, handleTearPage, todayKey };
}

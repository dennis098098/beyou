"use client";

import { useState, useEffect } from "react";
import { getSentence, saveSentence } from "@/lib/firebase/firestore";
import { generateSentence } from "@/lib/claude/generateSentence";
import { getTodayKey, getDayOfWeek } from "@/lib/utils/dateUtils";
import { CalendarType, MBTIType } from "@/types";

export function useTodaySentence(
  uid: string | null,
  mbti: MBTIType,
  calendarType: CalendarType | null,
  userName: string
) {
  const [sentence, setSentence] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || !calendarType || !userName) {
      setIsLoading(false);
      return;
    }

    const dateKey = getTodayKey();

    async function fetchSentence() {
      setIsLoading(true);
      setError(null);
      try {
        // Check Firestore cache first
        const cached = await getSentence(uid!, dateKey);
        if (cached?.sentence) {
          setSentence(cached.sentence);
          setIsLoading(false);
          return;
        }

        // Generate via Claude
        const generated = await generateSentence({
          mbti,
          calendarType: calendarType!,
          dateKey,
          dayOfWeek: getDayOfWeek(),
          userName,
        });

        // Cache in Firestore
        await saveSentence(uid!, dateKey, {
          sentence: generated,
          calendarType: calendarType!,
          mbti,
          torn: false,
          tornAt: null,
          generatedAt: Date.now(),
        });

        setSentence(generated);
      } catch (err) {
        console.error("useTodaySentence error:", err);
        setError("無法取得今日句子，請稍後再試");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSentence();
  }, [uid, calendarType, userName, mbti]);

  return { sentence, isLoading, error };
}

"use client";

import { useState, useEffect } from "react";
import { getSecondsUntilMidnight, formatCountdown } from "@/lib/utils/dateUtils";

interface DailyLockOverlayProps {
  sentence: string | null;
}

export function DailyLockOverlay({ sentence }: DailyLockOverlayProps) {
  const [countdown, setCountdown] = useState(getSecondsUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getSecondsUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 z-10">
      <div className="text-4xl mb-3">✂️</div>
      <h3 className="text-lg font-bold text-gray-700 mb-1">今天的頁面已撕下</h3>
      <p className="text-gray-500 text-sm text-center mb-4">明天再見，新的一天又有新句子等著你</p>

      {sentence && (
        <div className="bg-gray-50 rounded-xl px-5 py-4 mb-4 max-w-xs text-center">
          <p className="text-gray-600 text-sm italic">「{sentence}」</p>
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-400 mb-1">距離下一頁</p>
        <div className="text-2xl font-mono font-bold text-gray-600">
          {formatCountdown(countdown)}
        </div>
      </div>
    </div>
  );
}

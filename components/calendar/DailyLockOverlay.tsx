"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getSecondsUntilMidnight, formatCountdown, getTodayKey } from "@/lib/utils/dateUtils";
import { LuckChangeDialog } from "@/components/luck/LuckChangeDialog";

interface DailyLockOverlayProps {
  sentence: string | null;
  tornCount: number;
  isFunny: boolean;
  mbti: string | null;
  calendarType: string;
  uid?: string | null;
}

export function DailyLockOverlay({ sentence, tornCount, isFunny, mbti, calendarType, uid }: DailyLockOverlayProps) {
  const [countdown, setCountdown] = useState(getSecondsUntilMidnight());
  const todayKey = getTodayKey();
  const storageKey = uid ? `overlay_${uid}_${todayKey}` : null;

  const [isHydrated, setIsHydrated] = useState(false);
  const [analyses, setAnalyses] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [showLuckDialog, setShowLuckDialog] = useState(false);
  const [luckResults, setLuckResults] = useState<Record<string, "success" | "fail">>({});
  const [luckBonuses, setLuckBonuses] = useState<Record<string, string>>({});

  const analysis = analyses[calendarType] ?? null;
  const luckResult = luckResults[calendarType] ?? null;
  const luckBonus = luckBonuses[calendarType] ?? null;

  // Load from localStorage after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    if (!storageKey) { setIsHydrated(true); return; }
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
      setAnalyses(stored.analyses ?? {});
      setLuckResults(stored.luckResults ?? {});
      setLuckBonuses(stored.luckBonuses ?? {});
    } catch {}
    setIsHydrated(true);
  }, [storageKey]);

  // Persist state to localStorage
  useEffect(() => {
    if (!isHydrated || !storageKey) return;
    try { localStorage.setItem(storageKey, JSON.stringify({ analyses, luckResults, luckBonuses })); } catch {}
  }, [analyses, luckResults, luckBonuses, storageKey, isHydrated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getSecondsUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleAnalyze(reversed = false) {
    if (!sentence || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisError("");
    try {
      const res = await fetch("/api/analyze-sentence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence, mbti, calendarType, reversed }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalyses((prev) => ({ ...prev, [calendarType]: data.analysis }));
      } else {
        setAnalysisError(data.error ?? "分析失敗");
      }
    } catch {
      setAnalysisError("分析失敗，請再試一次");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function fetchLuckBonus() {
    if (!sentence) return;
    try {
      const res = await fetch("/api/analyze-sentence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence, calendarType, luckBonus: true }),
      });
      const data = await res.json();
      if (data.analysis) {
        setLuckBonuses((prev) => ({ ...prev, [calendarType]: data.analysis }));
      }
    } catch { /* silent fail */ }
  }

  function handleLuckComplete(success: boolean) {
    setShowLuckDialog(false);
    setLuckResults((prev) => ({ ...prev, [calendarType]: success ? "success" : "fail" }));
    if (success) {
      setLuckBonuses((prev) => { const next = { ...prev }; delete next[calendarType]; return next; });
      fetchLuckBonus();
    } else if (sentence) {
      handleAnalyze(true);
    }
  }

  const accent = isFunny ? "text-orange-500" : "text-teal-500";
  const badgeBg = isFunny ? "bg-orange-50 border-orange-100" : "bg-teal-50 border-teal-100";
  const btnBg = isFunny ? "bg-orange-500 hover:bg-orange-600" : "bg-teal-500 hover:bg-teal-600";

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 w-full">
      {/* Today's sentence */}
      {sentence && (
        <motion.div
          className={`rounded-2xl border px-6 py-5 max-w-xs text-center transition-colors duration-700
            ${luckResult === "success"
              ? "border-yellow-400 bg-yellow-50 shadow-[0_0_24px_4px_rgba(250,204,21,0.35)]"
              : luckResult === "fail"
              ? "border-gray-400 bg-gray-100 shadow-[0_0_20px_4px_rgba(0,0,0,0.18)]"
              : badgeBg}`}
          animate={luckResult === "fail" ? {
            x: [-14, 14, -12, 12, -8, 8, -4, 4, 0],
            rotate: [-2, 2, -1.5, 1.5, -1, 1, 0],
            boxShadow: [
              "0 0 0px rgba(220,38,38,0)",
              "0 0 36px 10px rgba(220,38,38,0.55)",
              "0 0 20px 6px rgba(220,38,38,0.3)",
              "0 0 20px 4px rgba(0,0,0,0.18)",
            ],
          } : {}}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <p className={`text-xs font-medium mb-2 ${accent}`}>
            {getTodayKey().replace(/-/g, " · ")}
          </p>
          <p className="text-gray-700 text-base leading-relaxed">「{sentence}」</p>

          {/* AI analysis */}
          {!analysis && (
            <button
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing}
              className={`mt-4 w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all ${btnBg} disabled:opacity-50`}
            >
              {isAnalyzing ? "解析中..." : "解析這句話"}
            </button>
          )}
          {analysisError && (
            <p className="mt-2 text-xs text-red-400">{analysisError}</p>
          )}
          {analysis && (
            <div className="mt-4 pt-4 border-t border-current border-opacity-10 text-left">
              <p className={`text-xs font-medium mb-1.5 ${accent}`}>解析</p>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{analysis}</p>
            </div>
          )}
          {luckBonus && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-3 pt-3 border-t border-yellow-200 text-left"
            >
              <p className="text-xs font-medium text-yellow-500 mb-1.5">✦ 今日彩蛋</p>
              <p className="text-yellow-700 text-sm leading-relaxed">{luckBonus}</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Luck change button — only after analysis, hide after success, wait for hydration to avoid flash */}
      {isHydrated && analysis && luckResult !== "success" && (
        <button
          onClick={() => setShowLuckDialog(true)}
          className={`px-8 py-3 rounded-2xl text-white text-sm font-semibold transition-all shadow-md
            ${isFunny ? "bg-orange-500 hover:bg-orange-600" : "bg-teal-500 hover:bg-teal-600"}`}
        >
          改運
        </button>
      )}

      {/* Countdown */}
      <div className="text-center">
        <p className="text-xs text-gray-400 mb-1">距離明天</p>
        <div className="text-2xl font-mono font-bold text-gray-600">
          {formatCountdown(countdown)}
        </div>
      </div>
      <AnimatePresence>
        {showLuckDialog && (
          <LuckChangeDialog onClose={() => setShowLuckDialog(false)} onComplete={handleLuckComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}

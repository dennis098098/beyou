"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { useTodaySentence } from "@/hooks/useTodaySentence";
import { useTearAction } from "@/hooks/useTearAction";
import { getTodayKey, getDaysSinceStart } from "@/lib/utils/dateUtils";
import { TearAnimation } from "@/components/calendar/TearAnimation";
import { PageContent } from "@/components/calendar/PageContent";
import { DailyLockOverlay } from "@/components/calendar/DailyLockOverlay";
import { TornStack } from "@/components/calendar/TornStack";
import { signOut } from "@/lib/firebase/auth";

export default function CalendarPage() {
  const { user, profile } = useAppContext();
  const [tornCount, setTornCount] = useState(profile?.totalPagesTorn ?? 0);

  const { sentence, isLoading, error } = useTodaySentence(
    user?.uid ?? null,
    profile?.mbti ?? null,
    profile?.calendarType ?? null,
    profile?.name ?? ""
  );

  const { canTear, handleTearPage, todayKey } = useTearAction(
    user?.uid ?? null,
    profile?.lastTearDate ?? null
  );

  const isFunny = profile?.calendarType === "funny";
  const dayNumber = profile?.calendarStartDate
    ? getDaysSinceStart(profile.calendarStartDate)
    : 1;

  async function onTearComplete() {
    await handleTearPage();
    setTornCount((prev) => prev + 1);
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-between p-6
      ${isFunny ? "bg-gradient-to-b from-yellow-50 to-orange-50" : "bg-gradient-to-b from-green-50 to-teal-50"}`}>

      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between mb-4">
        <div>
          <h1 className="font-bold text-gray-700 text-base">
            {isFunny ? "幽默日曆" : "正向日曆"}
          </h1>
          {profile?.mbti && (
            <span className="text-xs text-gray-400">{profile.mbti}</span>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          登出
        </button>
      </div>

      {/* Main calendar card */}
      <div className="w-full max-w-sm flex-1 flex flex-col items-center justify-center">
        <div className="relative w-full">
          {/* Binding holes */}
          <div className="flex justify-center gap-10 mb-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-gray-200 border-2 border-gray-300 shadow-inner" />
            ))}
          </div>

          {/* Calendar page */}
          <TearAnimation canTear={canTear} onTearComplete={onTearComplete}>
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 min-h-72 border border-gray-100">
              {/* Top perforated edge */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden h-1">
                <div className="w-full border-t-2 border-dashed border-gray-200" />
              </div>

              <PageContent
                dateKey={todayKey}
                sentence={sentence}
                isLoading={isLoading}
                calendarType={profile?.calendarType ?? "positive"}
                dayNumber={dayNumber}
              />

              {!canTear && (
                <DailyLockOverlay sentence={sentence} />
              )}
            </div>
          </TearAnimation>

          {error && (
            <p className="text-red-400 text-xs text-center mt-2">{error}</p>
          )}

          {/* Tear button for desktop / accessibility */}
          {canTear && (
            <button
              onClick={onTearComplete}
              className={`mt-4 w-full py-3 rounded-xl font-medium text-white transition-all shadow-md hover:shadow-lg
                ${isFunny ? "bg-orange-500 hover:bg-orange-600" : "bg-teal-500 hover:bg-teal-600"}`}
            >
              撕下這頁 ✂️
            </button>
          )}
        </div>
      </div>

      {/* Torn stack */}
      <div className="mt-4 mb-4">
        <TornStack count={tornCount} />
      </div>
    </div>
  );
}

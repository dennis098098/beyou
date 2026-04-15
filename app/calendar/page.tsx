"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { useTodaySentence } from "@/hooks/useTodaySentence";
import { useTearAction } from "@/hooks/useTearAction";
import { getTodayKey, getDaysSinceStart } from "@/lib/utils/dateUtils";
import { getAvatar } from "@/lib/utils/avatarUtils";
import { TearAnimation } from "@/components/calendar/TearAnimation";
import { PageContent } from "@/components/calendar/PageContent";
import { DailyLockOverlay } from "@/components/calendar/DailyLockOverlay";
import { deleteSentence } from "@/lib/firebase/firestore";
import { CalendarType } from "@/types";
import Image from "next/image";

export default function CalendarPage() {
  const { user, profile, updateProfile, isLoadingAuth } = useAppContext();
  const router = useRouter();
  const [tornCount, setTornCount] = useState(profile?.totalPagesTorn ?? 0);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      router.replace("/auth");
    }
  }, [user, isLoadingAuth, router]);

  const { sentence, isLoading, error } = useTodaySentence(
    user?.uid ?? null,
    profile?.mbti ?? null,
    profile?.calendarType ?? null,
    profile?.name ?? ""
  );

  const { canTear, handleTearPage, todayKey } = useTearAction(
    user?.uid ?? null,
    profile?.lastTearDates ?? null,
    profile?.calendarType ?? "positive"
  );

  const isFunny = profile?.calendarType === "funny";
  const avatar = getAvatar(profile?.avatar ?? null);
  const dayNumber = profile?.calendarStartDate
    ? getDaysSinceStart(profile.calendarStartDate)
    : 1;

  async function onTearComplete() {
    await handleTearPage();
    setTornCount((prev) => prev + 1);
  }

  async function handleSwitchCalendar(type: CalendarType) {
    if (type === profile?.calendarType || isSwitching) return;
    setIsSwitching(true);
    await updateProfile({ calendarType: type });
    setShowCalendarDialog(false);
    setIsSwitching(false);
  }

  const calendarName = isFunny ? "Be Fun" : "Be Positive";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-6">
      <Image src="/lobby-bg.jpg" alt="background" fill priority className="object-cover object-center" />
      <div className="absolute inset-0 bg-white/40" />

      {/* Header */}
      <div className="relative z-10 w-full max-w-sm flex items-center justify-between mb-2">
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 active:opacity-70 transition-opacity"
        >
          <div className="w-12 h-12 rounded-xl overflow-hidden" style={{ background: avatar.bg }}>
            <img src={avatar.src} alt={avatar.label} className="w-full h-full object-cover" />
          </div>
          <span className="text-base font-semibold text-gray-700">{profile?.name || "我"}</span>
        </button>
        <div className="w-9" />
      </div>

      {/* Calendar name — clickable, in the red box area */}
      <div className="relative z-10 w-full max-w-sm mb-2">
        <button
          onClick={() => setShowCalendarDialog(true)}
          className={`w-full py-2.5 rounded-2xl text-sm font-semibold border-2 transition-all
            ${isFunny
              ? "bg-orange-50 border-orange-200 text-orange-500"
              : "bg-teal-50 border-teal-200 text-teal-500"}`}
        >
          {calendarName} ↕
        </button>
      </div>

      {/* Main area */}
      <div className="relative z-10 w-full max-w-sm flex-1 flex flex-col items-center justify-center">
        {canTear ? (
          <div className="relative w-full">
            <div className="flex justify-center gap-10 mb-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-gray-200 border-2 border-gray-300 shadow-inner" />
              ))}
            </div>
            <TearAnimation canTear={canTear} onTearComplete={onTearComplete}>
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 min-h-72 border border-gray-100">
                <div className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden h-1">
                  <div className="w-full border-t-2 border-dashed border-gray-200" />
                </div>
                <PageContent
                  dateKey={todayKey}
                  sentence={sentence}
                  isLoading={isLoading}
                  calendarType={profile?.calendarType ?? "positive"}
                  dayNumber={dayNumber}
                  hideContent={true}
                />
              </div>
            </TearAnimation>
            {error && <p className="text-red-400 text-xs text-center mt-2">{error}</p>}
            <button
              onClick={onTearComplete}
              className={`mt-4 w-full py-3 rounded-xl font-medium text-white transition-all shadow-md hover:shadow-lg
                ${isFunny ? "bg-orange-500 hover:bg-orange-600" : "bg-teal-500 hover:bg-teal-600"}`}
            >
              翻開
            </button>
          </div>
        ) : (
          <DailyLockOverlay sentence={sentence} tornCount={tornCount} isFunny={isFunny} mbti={profile?.mbti ?? null} calendarType={profile?.calendarType ?? "positive"} uid={user?.uid ?? null} />
        )}
      </div>

      {/* Dev: reset today's sentence — local only */}
      {process.env.NODE_ENV === "development" && (
        <button
          onClick={async () => {
            if (!user?.uid) return;
            await deleteSentence(user.uid, `${getTodayKey()}_${profile?.calendarType ?? "positive"}`);
            // Clear analysis / luck bonus from localStorage
            try {
              localStorage.removeItem(`overlay_${user.uid}_${getTodayKey()}`);
            } catch {}
            window.location.reload();
          }}
          className="fixed bottom-4 right-4 text-xs text-gray-300 underline"
        >
          重新生成句子
        </button>
      )}

      {/* Calendar switch dialog */}
      {showCalendarDialog && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          onClick={() => setShowCalendarDialog(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-sm p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold text-gray-700 text-center mb-5">我的日曆</h2>
            <div className="flex flex-col gap-3">
              {([
                { value: "funny" as CalendarType, label: "Be Fun", emoji: "😄", desc: "幽默自嘲，用笑聲面對荒謬" },
                { value: "positive" as CalendarType, label: "Be Positive", emoji: "🌱", desc: "溫暖踏實，像朋友留的便條" },
              ]).map((opt) => {
                const isActive = profile?.calendarType === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSwitchCalendar(opt.value)}
                    disabled={isSwitching}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                      ${isActive
                        ? opt.value === "funny"
                          ? "bg-orange-50 border-orange-400"
                          : "bg-teal-50 border-teal-400"
                        : "bg-white border-gray-200"}`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${isActive ? "text-gray-800" : "text-gray-500"}`}>{opt.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                    </div>
                    {isActive && (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${opt.value === "funny" ? "bg-orange-400" : "bg-teal-400"}`}>
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

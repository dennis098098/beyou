"use client";

import { CalendarType } from "@/types";
import { formatDateDisplay } from "@/lib/utils/dateUtils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface PageContentProps {
  dateKey: string;
  sentence: string | null;
  isLoading: boolean;
  calendarType: CalendarType;
  dayNumber: number;
}

export function PageContent({ dateKey, sentence, isLoading, calendarType, dayNumber }: PageContentProps) {
  const { month, day, weekday } = formatDateDisplay(dateKey);

  const accentColor = calendarType === "funny"
    ? "text-orange-500"
    : "text-teal-500";

  return (
    <div className="flex flex-col h-full select-none">
      {/* Day number badge */}
      <div className="text-center mb-2">
        <span className={`text-xs font-medium ${accentColor} opacity-70`}>
          第 {dayNumber} 天
        </span>
      </div>

      {/* Date display */}
      <div className="text-center mb-4">
        <div className="text-6xl font-black text-gray-800 leading-none">{day}</div>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-gray-400 text-sm">{month} 月</span>
          <span className={`text-sm font-medium ${accentColor}`}>{weekday}</span>
        </div>
      </div>

      {/* Perforated divider */}
      <div className="flex items-center gap-1 my-3 px-4">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flex-1 h-px bg-gray-200" />
        ))}
      </div>

      {/* Sentence */}
      <div className="flex-1 flex items-center justify-center px-4 py-2">
        {isLoading ? (
          <LoadingSpinner />
        ) : sentence ? (
          <p className={`text-center text-lg font-medium leading-relaxed text-gray-700
            ${calendarType === "funny" ? "font-['serif']" : ""}`}>
            {sentence}
          </p>
        ) : (
          <p className="text-gray-400 text-sm text-center">今日句子載入中...</p>
        )}
      </div>

      {/* Bottom decoration */}
      <div className={`text-center mt-3 text-2xl ${calendarType === "funny" ? "" : "opacity-60"}`}>
        {calendarType === "funny" ? "😄" : "🌱"}
      </div>
    </div>
  );
}

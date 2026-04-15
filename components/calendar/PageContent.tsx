"use client";

import Image from "next/image";
import { CalendarType } from "@/types";
import { formatDateDisplay } from "@/lib/utils/dateUtils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface PageContentProps {
  dateKey: string;
  sentence: string | null;
  isLoading: boolean;
  calendarType: CalendarType;
  dayNumber: number;
  hideContent?: boolean;
}

export function PageContent({ dateKey, sentence, isLoading, calendarType, dayNumber, hideContent = false }: PageContentProps) {
  const { month, day, weekday } = formatDateDisplay(dateKey);

  const accentColor = calendarType === "funny" ? "text-orange-500" : "text-teal-500";

  return (
    <div className="flex flex-col h-full select-none">
      {/* Cover image — top 60% */}
      <div className="relative w-full h-44 rounded-2xl overflow-hidden">
        <Image src={calendarType === "funny" ? "/cover-bg-fun.jpg" : "/cover-bg.jpg"} alt="" fill className="object-cover object-center" />
      </div>

      {/* Bottom white area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 gap-2">
        {/* Date */}
        <div className="text-center">
          <div className="text-5xl font-black text-gray-800 leading-none">{day}</div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-gray-400 text-sm">{month} 月</span>
            <span className={`text-sm font-medium ${accentColor}`}>{weekday}</span>
          </div>
        </div>

        {/* Sentence */}
        {!hideContent && (
          <div className="w-full text-center mt-2">
            {isLoading ? (
              <LoadingSpinner />
            ) : sentence ? (
              <p className={`text-base font-medium leading-relaxed text-gray-700
                ${calendarType === "funny" ? "font-['serif']" : ""}`}>
                {sentence}
              </p>
            ) : (
              <p className="text-gray-400 text-sm">今日句子載入中...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CoverCard } from "@/components/cover/CoverCard";
import { useAppContext } from "@/contexts/AppContext";
import { CalendarType } from "@/types";
import { getTodayKey } from "@/lib/utils/dateUtils";

export default function CoverPage() {
  const { updateProfile } = useAppContext();
  const [selected, setSelected] = useState<CalendarType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleConfirm() {
    if (!selected || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await updateProfile({
        calendarType: selected,
        coverSelected: true,
        calendarStartDate: getTodayKey(),
      });
      router.push("/intro");
    } catch {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col p-6">
      <div className="text-center mt-8 mb-8">
        <h1 className="text-2xl font-black text-gray-800 mb-2">選擇你的日曆</h1>
        <p className="text-gray-500 text-sm">選擇適合你今天心情的那一本</p>
      </div>

      <div className="flex flex-col gap-4 max-w-sm mx-auto w-full flex-1">
        <CoverCard type="funny" selected={selected === "funny"} onSelect={() => setSelected("funny")} />
        <CoverCard type="positive" selected={selected === "positive"} onSelect={() => setSelected("positive")} />
      </div>

      <div className="max-w-sm mx-auto w-full mt-6 pb-8">
        <button
          onClick={handleConfirm}
          disabled={!selected || isSubmitting}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 rounded-2xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
        >
          {isSubmitting ? "確認中..." : selected ? `選擇《${selected === "funny" ? "幽默日曆" : "正向日曆"}》` : "請選擇日曆"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";

export default function IntroPage() {
  const { profile } = useAppContext();
  const router = useRouter();

  const isFunny = profile?.calendarType === "funny";

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-8 text-center
      ${isFunny ? "bg-gradient-to-br from-yellow-50 to-orange-100" : "bg-gradient-to-br from-green-50 to-teal-100"}`}>

      <div className="text-6xl mb-6 animate-bounce">
        {isFunny ? "😄" : "🌱"}
      </div>

      <h1 className="text-2xl font-black text-gray-800 mb-3">
        {isFunny ? "Be Fun，已開封！" : "Be Positive，已開封！"}
      </h1>

      <p className="text-gray-600 text-base leading-relaxed mb-2 max-w-xs">
        嗨，{profile?.name || "你好"}！
      </p>

      <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
        {isFunny
          ? "每天翻開一頁，用幽默的視角重新看看這個荒謬的世界。每句話都針對你的個性量身打造。"
          : "每天翻開一頁，讓一句溫暖的話陪你踏出第一步。每句話都針對你的個性量身打造。"
        }
      </p>

      <div className="bg-white/70 rounded-2xl p-5 max-w-xs w-full mb-8 shadow-sm">
        <div className="text-sm text-gray-500 mb-3 font-medium">使用說明</div>
        <div className="flex flex-col gap-2 text-sm text-gray-600 text-left">
          <div className="flex items-start gap-2">
            <span className="text-lg">👆</span>
            <span>向上滑動或點擊撕下今天的日曆頁</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">📅</span>
            <span>每天只能撕一張，明天再見</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">✨</span>
            <span>每句話都根據你的 MBTI 個性化生成</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/calendar")}
        className={`w-full max-w-xs py-4 rounded-2xl font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105
          ${isFunny ? "bg-orange-500 hover:bg-orange-600" : "bg-teal-500 hover:bg-teal-600"}`}
      >
        翻開第一頁 →
      </button>
    </div>
  );
}

"use client";

import Image from "next/image";
import { CalendarType } from "@/types";

interface CoverCardProps {
  type: CalendarType;
  selected: boolean;
  onSelect: () => void;
}

const COVER_DATA = {
  funny: {
    emoji: "😄",
    title: "Be Fun",
    subtitle: "每天笑著面對人生的荒謬",
    description: "帶點自嘲、帶點荒謬，讓你每天早上先笑一個",
    bg: "from-yellow-50 to-orange-50",
    border: "border-orange-300",
    ring: "ring-orange-400",
    badge: "bg-orange-100 text-orange-700",
  },
  positive: {
    emoji: "🌱",
    title: "Be Positive",
    subtitle: "每天一句溫暖，陪你踏實前行",
    description: "低調的鼓勵，像智慧朋友留給你的便條",
    bg: "from-green-50 to-teal-50",
    border: "border-teal-300",
    ring: "ring-teal-400",
    badge: "bg-teal-100 text-teal-700",
  },
};

export function CoverCard({ type, selected, onSelect }: CoverCardProps) {
  const data = COVER_DATA[type];

  return (
    <button
      onClick={onSelect}
      className={`
        relative w-full rounded-2xl p-6 text-left transition-all duration-200 border-2
        bg-gradient-to-br ${data.bg} ${data.border}
        ${selected ? `ring-4 ${data.ring} scale-105 shadow-xl` : "hover:scale-102 hover:shadow-lg shadow-md"}
      `}
    >
      {selected && (
        <div className="absolute top-3 right-3 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        </div>
      )}

      {/* Calendar cover visual */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-full rounded-xl overflow-hidden shadow-inner mb-3">
          {/* Calendar binding holes */}
          <div className="flex justify-center gap-6 pt-3 pb-2 bg-white">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-gray-200 border border-gray-300" />
            ))}
          </div>
          <div className="relative w-full h-36">
            <Image src={type === "funny" ? "/cover-bg-fun.jpg" : "/cover-bg.jpg"} alt="封面" fill className="object-cover object-center" />
          </div>
          {/* Perforated line */}
          <div className="border-t-2 border-dashed border-gray-200 bg-white py-1" />
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${data.badge}`}>
          MBTI 個性化
        </span>
      </div>

      <div>
        <h3 className="font-bold text-gray-800 text-base">{data.subtitle}</h3>
        <p className="text-gray-500 text-sm mt-1">{data.description}</p>
      </div>
    </button>
  );
}

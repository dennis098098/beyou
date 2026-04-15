"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { MBTI_OPTIONS } from "@/lib/utils/mbtiUtils";
import { MBTIType } from "@/types";

export function ProfileSetupModal() {
  const { updateProfile } = useAppContext();
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [mbti, setMbti] = useState<string>("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const birthday = birthYear && birthMonth && birthDay
    ? `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`
    : "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "請填寫你的名字";
    else if (name.trim().length > 8) errs.name = "名字最多 8 個字";
    else if (/[^\u4e00-\u9fff\u3400-\u4dbf\uff00-\uffefa-zA-Z0-9\s]/.test(name.trim())) errs.name = "名字不能包含特殊符號";
    if (!birthday) errs.birthday = "請填寫生日";
    else {
      const bday = new Date(birthday);
      if (bday >= new Date()) errs.birthday = "生日必須是過去的日期";
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: name.trim(),
        birthday,
        mbti: (mbti || null) as MBTIType,
        setupComplete: true,
      });
    } catch {
      setErrors({ submit: "儲存失敗，請再試一次" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl my-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📅</div>
          <h2 className="text-2xl font-bold text-gray-800">歡迎！先認識一下你</h2>
          <p className="text-gray-500 text-sm mt-1">這些資訊會幫助我們為你客製化每日句子</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="setup-name" className="block text-sm font-medium text-gray-700 mb-1">
              你的名字 <span className="text-red-500">*</span>
            </label>
            <input
              id="setup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入你的名字"
              maxLength={8}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{name.length} / 8</p>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              生日 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="flex-1 border border-gray-300 rounded-xl px-3 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-white text-sm"
              >
                <option value="">年</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="w-20 border border-gray-300 rounded-xl px-3 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-white text-sm"
              >
                <option value="">月</option>
                {months.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="w-20 border border-gray-300 rounded-xl px-3 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-white text-sm"
              >
                <option value="">日</option>
                {days.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {errors.birthday && <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>}
          </div>

          <div>
            <label htmlFor="setup-mbti" className="block text-sm font-medium text-gray-700 mb-1">
              MBTI 類型 <span className="text-gray-400 font-normal">（選填）</span>
            </label>
            <select
              id="setup-mbti"
              value={mbti}
              onChange={(e) => setMbti(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-white"
            >
              <option value="">不確定 / 跳過</option>
              {MBTI_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? "儲存中..." : "開始使用日曆 →"}
          </button>
        </form>
      </div>
    </div>
  );
}

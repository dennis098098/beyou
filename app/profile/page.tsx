"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { AVATARS, getAvatar } from "@/lib/utils/avatarUtils";
import { MBTI_OPTIONS } from "@/lib/utils/mbtiUtils";
import { AvatarId, Gender, MBTIType, CalendarType } from "@/types";
import { signOut } from "@/lib/firebase/auth";
import { resetUser } from "@/lib/firebase/firestore";

export default function ProfilePage() {
  const { profile, updateProfile, isLoadingProfile } = useAppContext();
  const router = useRouter();

  const [avatar, setAvatar] = useState<AvatarId | null>(null);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState<Gender>(null);
  const [mbti, setMbti] = useState<string>("");
  const [calendarType, setCalendarType] = useState<CalendarType>("positive");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setAvatar(profile.avatar ?? null);
      setName(profile.name ?? "");
      setBirthday(profile.birthday ?? "");
      setGender(profile.gender ?? null);
      setMbti(profile.mbti ?? "");
      setCalendarType(profile.calendarType ?? "positive");
    }
  }, [profile]);

  // On mount: pick up MBTI result from test page if present
  useEffect(() => {
    const mbtiFromTest = sessionStorage.getItem("mbti_result");
    if (mbtiFromTest) {
      setMbti(mbtiFromTest);
      sessionStorage.removeItem("mbti_result");
    }
  }, []);

  async function handleSave() {
    if (!name.trim()) { setError("請填寫名字"); return; }
    setIsSaving(true);
    setError("");
    try {
      await updateProfile({
        avatar,
        name: name.trim(),
        birthday,
        gender,
        mbti: (mbti || null) as MBTIType,
        calendarType,
      });
      router.back();
    } catch {
      setError("儲存失敗，請再試一次");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoadingProfile) {
    return <div className="min-h-screen bg-green-50" />;
  }

  const currentAvatar = getAvatar(avatar);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-teal-50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button onClick={() => router.back()} className="text-gray-500 text-sm">
          ← 取消
        </button>
        <h1 className="text-base font-bold text-gray-700">個人資料</h1>
        <div className="w-10" />
      </div>

      <div className="px-5 pb-8 flex flex-col gap-6">
        {/* Avatar picker */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-600 mb-4">選擇頭像</p>
          <div className="grid grid-cols-4 gap-3">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAvatar(a.id)}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="w-14 h-14 rounded-2xl overflow-hidden transition-all"
                  style={{
                    background: a.bg,
                    outline: avatar === a.id ? "3px solid #5BC8C0" : "3px solid transparent",
                    transform: avatar === a.id ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <img src={a.src} alt={a.label} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-gray-400">{a.label}</span>
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="mt-4 flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="w-12 h-12 rounded-2xl overflow-hidden" style={{ background: currentAvatar.bg }}>
              <img src={currentAvatar.src} alt={currentAvatar.label} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{name || "你的名字"}</p>
              <p className="text-xs text-gray-400">預覽效果</p>
            </div>
          </div>
        </div>

        {/* Name / Birthday / Gender */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              名字 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入名字"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">生日</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">性別</label>
            <div className="flex gap-2">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(gender === g ? null : g)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                    ${gender === g ? "bg-teal-500 text-white border-teal-500" : "bg-white text-gray-500 border-gray-200"}`}
                >
                  {g === "male" ? "男" : "女"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MBTI */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-600">MBTI 類型</label>
            <button
              onClick={() => router.push("/mbti-test")}
              className="text-xs text-teal-500 underline"
            >
              不知道？去測測看 →
            </button>
          </div>
          <select
            value={mbti}
            onChange={(e) => setMbti(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          >
            <option value="">不確定 / 跳過</option>
            {MBTI_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-base transition-all shadow-md disabled:opacity-50"
        >
          {isSaving ? "儲存中..." : "儲存"}
        </button>

        {/* Logout */}
        <button
          onClick={async () => { await signOut(); router.replace("/auth"); }}
          className="w-full py-3 rounded-2xl border border-red-200 text-red-400 text-sm font-medium"
        >
          登出帳號
        </button>

        {/* Dev reset */}
        <button
          onClick={async () => {
            if (!profile?.uid) return;
            if (!confirm("確定要重置所有資料？這會清除你的個人設定並重新走一次設定流程。")) return;
            await resetUser(profile.uid);
            router.replace("/");
          }}
          className="w-full py-2 text-xs text-gray-400 underline"
        >
          重置帳號資料（測試用）
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PROGRESS_KEY = "mbti_progress";

// Each question has a dimension and direction:
// score > 0 → first letter wins (E, S, T, J)
// score < 0 → second letter wins (I, N, F, P)
// Likert: +2 強烈同意, +1 同意, 0 中立, -1 不同意, -2 強烈不同意
const QUESTIONS: { text: string; dim: "EI" | "SN" | "TF" | "JP"; dir: 1 | -1 }[] = [
  // ── E/I ──────────────────────────────────────────────────
  { text: "我在社交場合後，感覺充了電而不是精疲力竭。", dim: "EI", dir: 1 },
  { text: "我喜歡認識許多不同的新朋友。", dim: "EI", dir: 1 },
  { text: "我在獨處時更容易恢復精力。", dim: "EI", dir: -1 },
  { text: "我在大型聚會或派對中感到自在。", dim: "EI", dir: 1 },
  { text: "我通常先充分思考再開口，而不是邊說邊想。", dim: "EI", dir: -1 },
  { text: "我喜歡成為眾人注目的焦點。", dim: "EI", dir: 1 },
  { text: "我需要大量個人空間和安靜的獨處時間。", dim: "EI", dir: -1 },
  { text: "我很容易與陌生人開啟話題並展開對話。", dim: "EI", dir: 1 },
  { text: "長時間的社交互動常常讓我感到疲憊。", dim: "EI", dir: -1 },
  { text: "我更喜歡一對一的深度對話而非大型群體討論。", dim: "EI", dir: -1 },
  { text: "我享受成為活動或討論的核心推動者。", dim: "EI", dir: 1 },
  { text: "我在安靜的環境中工作效率最高。", dim: "EI", dir: -1 },
  { text: "我在行動之前傾向於長時間獨自思考。", dim: "EI", dir: -1 },
  { text: "我容易在社交環境中感到充實和愉快。", dim: "EI", dir: 1 },
  { text: "我喜歡透過與他人互動來整理自己的想法。", dim: "EI", dir: 1 },

  // ── S/N ──────────────────────────────────────────────────
  { text: "我注重實際細節多於整體概念和遠景。", dim: "SN", dir: 1 },
  { text: "我喜歡思考未來的可能性和潛力。", dim: "SN", dir: -1 },
  { text: "我相信具體的事實勝於抽象的理論。", dim: "SN", dir: 1 },
  { text: "我容易被新奇的想法和創新概念所吸引。", dim: "SN", dir: -1 },
  { text: "我喜歡按照有效的既定方式做事。", dim: "SN", dir: 1 },
  { text: "我常常想像「如果…會怎樣」的各種可能場景。", dim: "SN", dir: -1 },
  { text: "我重視實用性和可操作性高於創意性。", dim: "SN", dir: 1 },
  { text: "我對尚未發生的未來充滿想像力。", dim: "SN", dir: -1 },
  { text: "我傾向於依賴過去的經驗來做決定。", dim: "SN", dir: 1 },
  { text: "我喜歡探索抽象和理論性的概念。", dim: "SN", dir: -1 },
  { text: "我注重當下發生的具體事物多於長遠規劃。", dim: "SN", dir: 1 },
  { text: "我常常對事物背後更深層的含義感到好奇。", dim: "SN", dir: -1 },
  { text: "我做事傾向於按部就班，一步一步進行。", dim: "SN", dir: 1 },
  { text: "我喜歡尋找創新且非傳統的解決方案。", dim: "SN", dir: -1 },
  { text: "我更相信可以親眼觀察到的具體事實。", dim: "SN", dir: 1 },

  // ── T/F ──────────────────────────────────────────────────
  { text: "做決定時，我以邏輯分析而非個人感情為優先。", dim: "TF", dir: 1 },
  { text: "我很在意別人的感受，常常把它放在心上。", dim: "TF", dir: -1 },
  { text: "我認為批評性的誠實比安慰性的謊言更有價值。", dim: "TF", dir: 1 },
  { text: "我常常扮演傾聽者和情感支持者的角色。", dim: "TF", dir: -1 },
  { text: "在分析問題時，我能夠保持客觀冷靜。", dim: "TF", dir: 1 },
  { text: "做決定時我會優先考慮對相關人員的情感影響。", dim: "TF", dir: -1 },
  { text: "我認為公平正義在大多數情況下比個人感情重要。", dim: "TF", dir: 1 },
  { text: "我很容易感同身受他人的情緒和處境。", dim: "TF", dir: -1 },
  { text: "我傾向於用理性論據和事實說服別人。", dim: "TF", dir: 1 },
  { text: "我非常重視和諧的人際關係和團隊氛圍。", dim: "TF", dir: -1 },
  { text: "我可以不受情緒影響地做出困難的決定。", dim: "TF", dir: 1 },
  { text: "我很難拒絕需要幫助的人，即使很不方便。", dim: "TF", dir: -1 },
  { text: "我認為效率和結果有時比顧及他人感受更重要。", dim: "TF", dir: 1 },
  { text: "在衝突中，我會先考慮如何讓對方感覺好受。", dim: "TF", dir: -1 },
  { text: "我習慣用數據和事實來支持自己的觀點。", dim: "TF", dir: 1 },

  // ── J/P ──────────────────────────────────────────────────
  { text: "我喜歡提前計劃，不喜歡臨時做決定。", dim: "JP", dir: 1 },
  { text: "我享受隨機應變帶來的刺激和樂趣。", dim: "JP", dir: -1 },
  { text: "我的工作和生活空間通常整齊且有條理。", dim: "JP", dir: 1 },
  { text: "我喜歡保留選項，不急於下最終決定。", dim: "JP", dir: -1 },
  { text: "我喜歡按照時程表行事，並確實執行。", dim: "JP", dir: 1 },
  { text: "我在截止日期前才能激發出最好的表現。", dim: "JP", dir: -1 },
  { text: "面對不確定性和突發狀況，我容易感到焦慮。", dim: "JP", dir: 1 },
  { text: "我喜歡同時進行多項工作，在不同任務間切換。", dim: "JP", dir: -1 },
  { text: "我在開始一件事之前需要有清楚的計劃和目標。", dim: "JP", dir: 1 },
  { text: "我喜歡在工作中保持彈性，不被固定流程束縛。", dim: "JP", dir: -1 },
  { text: "我傾向於早早完成任務，而非在最後一刻趕工。", dim: "JP", dir: 1 },
  { text: "在做事途中我容易根據新資訊改變方向。", dim: "JP", dir: -1 },
  { text: "我喜歡生活中有明確的規則、結構和秩序。", dim: "JP", dir: 1 },
  { text: "我認為規則和計劃是可以隨時彈性調整的。", dim: "JP", dir: -1 },
  { text: "我做事有始有終，不喜歡留下未完成的事情。", dim: "JP", dir: 1 },
];

const LABELS = ["強烈不同意", "不同意", "中立", "同意", "強烈同意"];
const SCORES = [-2, -1, 0, 1, 2];

const MBTI_DESC: Record<string, { title: string; emoji: string }> = {
  INTJ: { title: "策略家", emoji: "🧠" }, INTP: { title: "邏輯學家", emoji: "🔭" },
  ENTJ: { title: "指揮官", emoji: "👑" }, ENTP: { title: "辯論家", emoji: "💡" },
  INFJ: { title: "提倡者", emoji: "🌟" }, INFP: { title: "調停者", emoji: "🌿" },
  ENFJ: { title: "主人公", emoji: "🤝" }, ENFP: { title: "競選者", emoji: "🎨" },
  ISTJ: { title: "物流師", emoji: "📋" }, ISFJ: { title: "守護者", emoji: "🛡️" },
  ESTJ: { title: "總經理", emoji: "📊" }, ESFJ: { title: "執政官", emoji: "💛" },
  ISTP: { title: "鑑賞家", emoji: "🔧" }, ISFP: { title: "探險家", emoji: "🎵" },
  ESTP: { title: "企業家", emoji: "⚡" }, ESFP: { title: "表演者", emoji: "🎭" },
};

export default function MbtiTestPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState({ EI: 0, SN: 0, TF: 0, JP: 0 });
  const [done, setDone] = useState(false);
  const [result, setResult] = useState("");

  // Restore saved progress on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(PROGRESS_KEY);
    if (saved) {
      try {
        const { current: c, scores: s } = JSON.parse(saved);
        setCurrent(c);
        setScores(s);
      } catch {
        sessionStorage.removeItem(PROGRESS_KEY);
      }
    }
  }, []);

  function handleAnswer(rawScore: number) {
    const q = QUESTIONS[current];
    const delta = rawScore * q.dir;
    const next = { ...scores, [q.dim]: scores[q.dim] + delta };

    if (current < QUESTIONS.length - 1) {
      const nextIndex = current + 1;
      setScores(next);
      setCurrent(nextIndex);
      // Save progress after each answer
      sessionStorage.setItem(PROGRESS_KEY, JSON.stringify({ current: nextIndex, scores: next }));
    } else {
      const mbti =
        (next.EI >= 0 ? "E" : "I") +
        (next.SN >= 0 ? "S" : "N") +
        (next.TF >= 0 ? "T" : "F") +
        (next.JP >= 0 ? "J" : "P");
      setResult(mbti);
      setDone(true);
      sessionStorage.removeItem(PROGRESS_KEY); // clear saved progress on completion
    }
  }

  function handleConfirm() {
    sessionStorage.setItem("mbti_result", result);
    router.replace("/profile");
  }

  function handleRestart() {
    sessionStorage.removeItem(PROGRESS_KEY);
    setScores({ EI: 0, SN: 0, TF: 0, JP: 0 });
    setCurrent(0);
    setDone(false);
    setResult("");
  }

  // ── Result screen ────────────────────────────────────────
  if (done) {
    const info = MBTI_DESC[result] ?? { title: "獨特個性", emoji: "✨" };
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-green-50 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-10">
          <div className="text-6xl mb-3">{info.emoji}</div>
          <p className="text-gray-400 text-sm mb-1">你的 MBTI 類型是</p>
          <h1 className="text-7xl font-black text-teal-500 tracking-widest mb-2">{result}</h1>
          <p className="text-gray-600 text-xl font-semibold">{info.title}</p>
        </div>
        <div className="w-full max-w-xs flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            className="w-full py-4 rounded-2xl bg-teal-500 text-white font-semibold text-base shadow-md"
          >
            回到個人資訊
          </button>
          <button
            onClick={handleRestart}
            className="w-full py-3 rounded-2xl border border-gray-200 text-gray-500 text-sm"
          >
            重新測試
          </button>
        </div>
      </div>
    );
  }

  // ── Question screen ──────────────────────────────────────
  const q = QUESTIONS[current];
  const progress = ((current) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-green-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-3">
        <button onClick={() => router.replace("/profile")} className="text-gray-500 text-sm">← 返回</button>
        <span className="text-sm font-bold text-gray-700 flex-1 text-center pr-10">MBTI 性格測驗</span>
      </div>

      {/* Progress */}
      <div className="px-5 mb-2">
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">{current + 1} / {QUESTIONS.length}</p>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <p className="text-center text-lg font-semibold text-gray-800 leading-relaxed max-w-sm">
          {q.text}
        </p>

        {/* Likert scale */}
        <div className="w-full max-w-sm flex flex-col gap-2.5">
          {LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(SCORES[i])}
              className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-700 font-medium shadow-sm active:scale-95 active:bg-teal-50 active:border-teal-400 transition-all"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-12" />
    </div>
  );
}

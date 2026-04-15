"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COUNTRIES = [
  {
    id: "taiwan",
    flag: "🇹🇼",
    name: "台灣",
    method: "過火爐與祭改",
    desc: "到廟裡過火三圈，除去晦氣，迎接好運",
    locked: false,
  },
  {
    id: "japan",
    flag: "🇯🇵",
    name: "日本",
    method: "御守與繪馬",
    desc: "前往神社購買御守隨身攜帶，或在繪馬上寫下心願",
    locked: false,
  },
  {
    id: "italy",
    flag: "🇮🇹",
    name: "義大利",
    method: "摸茱麗葉的右胸",
    desc: "觸摸茱麗葉銅像的右胸，帶來真愛與好運",
    locked: false,
  },
  {
    id: "uk",
    flag: "🇬🇧",
    name: "英國",
    method: "觸摸木頭",
    desc: "說好兆頭時立刻摸木頭，防止好運走掉",
    locked: true,
  },
  {
    id: "spain",
    flag: "🇪🇸",
    name: "西班牙",
    method: "吞十二顆葡萄",
    desc: "跨年鐘聲響起時連吞十二顆葡萄，祈求順風順水",
    locked: true,
  },
];

// ── Flame particle ──────────────────────────────────────
function Flame({ x, delay, height }: { x: number; delay: number; height: number }) {
  return (
    <motion.div
      className="absolute bottom-0 rounded-full"
      style={{
        left: x,
        width: 18 + Math.random() * 10,
        background: "linear-gradient(to top, #ff4500, #ff8c00, #ffcc00, transparent)",
        transformOrigin: "bottom center",
      }}
      animate={{
        height: [height * 0.6, height, height * 0.75, height * 1.1, height * 0.6],
        scaleX: [1, 0.75, 1.2, 0.85, 1],
        x: [0, -4, 4, -2, 0],
        opacity: [0.9, 1, 0.85, 1, 0.9],
      }}
      transition={{ duration: 1.2 + delay * 0.3, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

// ── Smoke particle ──────────────────────────────────────
function Smoke({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-gray-400/30"
      style={{ left: x, bottom: 60, width: 12, height: 12 }}
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: [0, 0.4, 0], y: -60, scale: [0.5, 1.5, 2], x: [0, -8, 8] }}
      transition={{ duration: 2.5, repeat: Infinity, delay, ease: "easeOut" }}
    />
  );
}

// ── Sparkle ──────────────────────────────────────────────
function Sparkle({ x, delay, color }: { x: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute text-xl"
      style={{ left: x, bottom: 80 }}
      initial={{ opacity: 0, y: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], y: -100 - Math.random() * 60, scale: [0, 1.2, 0], x: [0, (Math.random() - 0.5) * 60] }}
      transition={{ duration: 1.5, repeat: Infinity, delay, ease: "easeOut" }}
    >
      {color}
    </motion.div>
  );
}

// ── Taiwan Ritual ─────────────────────────────────────────
type TaiwanPhase = "ready" | "fire" | "crossing" | "blessing" | "done" | "fail_extinguish" | "fail_done";

function TaiwanRitual({ onComplete }: { onComplete?: (success: boolean) => void }) {
  const [phase, setPhase] = useState<TaiwanPhase>("ready");
  const [success] = useState(() => Math.random() > 0.4);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fire"), 800);
    const t2 = setTimeout(() => setPhase("crossing"), 2200);
    const t3 = setTimeout(() => {
      setPhase(success ? "blessing" : "fail_extinguish");
    }, 4000);
    const t4 = setTimeout(() => {
      setPhase(success ? "done" : "fail_done");
      onCompleteRef.current?.(success);
    }, 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const flames = [
    { x: 20, delay: 0, height: 55 }, { x: 40, delay: 0.2, height: 70 },
    { x: 60, delay: 0.1, height: 60 }, { x: 80, delay: 0.3, height: 75 },
    { x: 100, delay: 0.15, height: 58 }, { x: 120, delay: 0.25, height: 65 },
    { x: 140, delay: 0.05, height: 72 }, { x: 160, delay: 0.2, height: 55 },
    { x: 180, delay: 0.1, height: 68 }, { x: 200, delay: 0.3, height: 60 },
  ];
  const blessings = ["🌟", "✨", "🍀", "💫", "🌸", "🎊", "💛", "🌈"];
  const badOmens = ["💨", "🌧️", "⚡", "🌩️", "💀", "😱", "🌑"];

  const showFire = phase === "fire" || phase === "crossing" || phase === "blessing";
  const isFail = phase === "fail_extinguish" || phase === "fail_done";

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <AnimatePresence mode="wait">
        <motion.p key={phase} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className={`text-sm font-medium h-6 ${isFail ? "text-gray-500" : "text-gray-600"}`}>
          {phase === "ready" && "道士正在準備儀式..."}
          {phase === "fire" && "聖火已點燃，準備過火！"}
          {phase === "crossing" && "正在過火，除去晦氣...🔥"}
          {phase === "blessing" && "祈福中，好運降臨..."}
          {phase === "done" && "🎉 改運成功！今日鴻運當頭！"}
          {phase === "fail_extinguish" && "聖火突然熄滅...不妙😰"}
          {phase === "fail_done" && "💨 改運失敗，晦氣依舊纏身..."}
        </motion.p>
      </AnimatePresence>

      <div className="relative w-64 h-40 overflow-hidden">
        {/* Dark overlay on fail */}
        <AnimatePresence>
          {isFail && (
            <motion.div key="dark" className="absolute inset-0 bg-gray-900/50 z-10 rounded-xl"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-800/60 to-amber-700/40 rounded-lg" />

        {/* Fire — dims on fail */}
        <AnimatePresence>
          {showFire && (
            <motion.div key="fire" className="absolute bottom-8 left-0 right-0"
              initial={{ opacity: 0, scaleY: 0 }} style={{ transformOrigin: "bottom" }}
              animate={{ opacity: isFail ? 0 : 1, scaleY: isFail ? 0 : 1 }}
              transition={{ duration: isFail ? 0.6 : 0.5 }}>
              {flames.map((f, i) => <Flame key={i} x={f.x} delay={f.delay} height={f.height} />)}
              {flames.slice(0, 4).map((f, i) => <Smoke key={i} x={f.x + 20} delay={f.delay + 0.5} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Person crossing */}
        <AnimatePresence>
          {phase === "crossing" && (
            <motion.div key="person" className="absolute text-3xl" style={{ bottom: 50 }}
              initial={{ x: -30, opacity: 0 }} animate={{ x: 220, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.2, ease: "linear" }}>
              🧍
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success blessings */}
        <AnimatePresence>
          {(phase === "blessing" || phase === "done") && blessings.map((b, i) => (
            <Sparkle key={i} x={10 + i * 28} delay={i * 0.15} color={b} />
          ))}
        </AnimatePresence>

        {/* Fail bad omens */}
        <AnimatePresence>
          {isFail && badOmens.map((b, i) => (
            <motion.div key={i} className="absolute text-xl z-20"
              style={{ left: 10 + i * 30, top: 10 }}
              initial={{ opacity: 0, y: -20, scale: 0 }}
              animate={{ opacity: [0, 1, 0.8], y: [-20, 20, 60], scale: [0, 1.2, 0.8] }}
              transition={{ duration: 1.5, delay: i * 0.12, repeat: Infinity, repeatDelay: 1 }}>
              {b}
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-3xl z-10">🏮</div>
      </div>

      <AnimatePresence>
        {phase === "done" && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4 text-center w-full">
            <p className="text-red-600 font-bold text-base mb-1">改運完成！</p>
            <p className="text-red-400 text-sm">今日晦氣已除，好運隨行</p>
          </motion.div>
        )}
        {phase === "fail_done" && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-100 border border-gray-300 rounded-2xl px-6 py-4 text-center w-full">
            <p className="text-gray-600 font-bold text-base mb-1">改運失敗 😓</p>
            <p className="text-gray-400 text-sm">聖火不旺，今日緣分未到，明天再試</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Japan Ritual ──────────────────────────────────────────
type JapanPhase = "shrine" | "writing" | "hanging" | "omamori" | "done" | "fail_wind" | "fail_done";

const WISH_TEXT = "今年萬事順心、好運連連";

function JapanRitual({ onComplete }: { onComplete?: (success: boolean) => void }) {
  const [phase, setPhase] = useState<JapanPhase>("shrine");
  const [writtenChars, setWrittenChars] = useState(0);
  const [petals, setPetals] = useState<{ x: number; delay: number; rotate: number }[]>([]);
  const [success] = useState(() => Math.random() > 0.4);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setPetals(Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * 220,
      delay: i * 0.3,
      rotate: Math.random() * 360,
    })));
    const t1 = setTimeout(() => setPhase("writing"), 1200);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "writing") return;
    if (writtenChars >= WISH_TEXT.length) {
      const t = setTimeout(() => setPhase("hanging"), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setWrittenChars((n) => n + 1), 120);
    return () => clearTimeout(t);
  }, [phase, writtenChars]);

  useEffect(() => {
    if (phase === "hanging") {
      const t = setTimeout(() => setPhase(success ? "omamori" : "fail_wind"), 1800);
      return () => clearTimeout(t);
    }
    if (phase === "omamori") {
      const t = setTimeout(() => { setPhase("done"); onCompleteRef.current?.(true); }, 2200);
      return () => clearTimeout(t);
    }
    if (phase === "fail_wind") {
      const t = setTimeout(() => { setPhase("fail_done"); onCompleteRef.current?.(false); }, 2000);
      return () => clearTimeout(t);
    }
  }, [phase, success]);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Status */}
      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-sm font-medium text-gray-600 h-6"
        >
          {phase === "shrine" && "走向神社，感受靈氣..."}
          {phase === "writing" && "在繪馬上寫下今年的心願..."}
          {phase === "hanging" && "將繪馬掛在神社，靜待願望實現..."}
          {phase === "omamori" && "御守降下庇佑，隨身帶著吧..."}
          {phase === "done" && "⛩️ 祈願完成！心願已掛上神社！"}
          {phase === "fail_wind" && "突然一陣大風，繪馬掉落了...💨"}
          {phase === "fail_done" && "🍂 祈願失敗，緣分未到，改天再來"}
        </motion.p>
      </AnimatePresence>

      {/* Scene */}
      <div className="relative w-64 h-44 overflow-hidden">

        {/* Cherry blossom petals */}
        {petals.map((p, i) => (
          <motion.div
            key={i}
            className="absolute text-sm"
            style={{ left: p.x, top: -20 }}
            animate={{ y: 180, rotate: p.rotate + 360, opacity: [0, 0.8, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: p.delay, ease: "linear" }}
          >
            🌸
          </motion.div>
        ))}

        {/* Shrine gate */}
        <motion.div
          className="absolute top-2 left-1/2 -translate-x-1/2 text-5xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          ⛩️
        </motion.div>

        {/* Ema (wooden plaque) */}
        <AnimatePresence>
          {(phase === "writing" || phase === "hanging" || phase === "fail_wind") && (
            <motion.div
              key="ema"
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: phase === "hanging" ? 28 : 80 }}
              initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
              animate={phase === "fail_wind"
                ? { opacity: 0, y: 80, rotate: 45, scale: 0.5 }
                : { opacity: 1, scale: 1, top: phase === "hanging" ? 28 : 80, rotate: phase === "hanging" ? 0 : -5 }
              }
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="bg-amber-100 border-2 border-amber-400 rounded-lg px-3 py-2 text-center shadow-md min-w-[140px]">
                <p className="text-xs text-amber-800 font-bold mb-1">今年心願</p>
                <p className="text-xs text-amber-700 tracking-wide">
                  {WISH_TEXT.slice(0, writtenChars)}
                  {phase === "writing" && writtenChars < WISH_TEXT.length && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >|</motion.span>
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Omamori amulet */}
        <AnimatePresence>
          {(phase === "omamori" || phase === "done") && (
            <motion.div
              key="omamori"
              className="absolute left-1/2 -translate-x-1/2 bottom-4 flex flex-col items-center"
              initial={{ y: -30, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.div
                className="text-5xl"
                animate={{ scale: [1, 1.15, 1], rotate: [-3, 3, -3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                🎴
              </motion.div>
              {/* Glow rings */}
              {[1, 2, 3].map((n) => (
                <motion.div
                  key={n}
                  className="absolute rounded-full border border-yellow-300/60"
                  style={{ width: 40 + n * 20, height: 40 + n * 20, top: -(n * 10), left: -(n * 10) }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: n * 0.3 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Done / Fail */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-50 border border-rose-200 rounded-2xl px-6 py-4 text-center w-full">
            <p className="text-rose-600 font-bold text-base mb-1">祈願完成！</p>
            <p className="text-rose-400 text-sm">御守隨身帶著，好運與你同行</p>
          </motion.div>
        )}
        {phase === "fail_done" && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-100 border border-gray-300 rounded-2xl px-6 py-4 text-center w-full">
            <p className="text-gray-600 font-bold text-base mb-1">祈願失敗 🍂</p>
            <p className="text-gray-400 text-sm">繪馬被風吹走了，下次選個風小的日子再來</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Italy Ritual ──────────────────────────────────────────
type ItalyPhase = "arrive" | "queue" | "touching" | "glowing" | "done" | "fail_push" | "fail_done";

const TOURISTS = ["🧑‍🦰", "👩", "👦", "🧔", "👩‍🦱", "🧑"];

function ItalyRitual({ onComplete }: { onComplete?: (success: boolean) => void }) {
  const [phase, setPhase] = useState<ItalyPhase>("arrive");
  const [success] = useState(() => Math.random() > 0.4);
  const [floatItems, setFloatItems] = useState<{ x: number; delay: number; emoji: string }[]>([]);
  const [touristPositions] = useState(() =>
    Array.from({ length: 5 }, (_, i) => ({ x: 12 + i * 44, tourist: TOURISTS[i] }))
  );
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setFloatItems(
      Array.from({ length: 8 }, (_, i) => ({
        x: 18 + i * 29,
        delay: i * 0.2,
        emoji: i % 3 === 0 ? "❤️" : i % 3 === 1 ? "🌹" : "✨",
      }))
    );
    const t1 = setTimeout(() => setPhase("queue"), 900);
    const t2 = setTimeout(() => setPhase("touching"), 2400);
    const t3 = setTimeout(() => setPhase(success ? "glowing" : "fail_push"), 4000);
    const t4 = setTimeout(() => {
      setPhase(success ? "done" : "fail_done");
      onCompleteRef.current?.(success);
    }, 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const isFail = phase === "fail_push" || phase === "fail_done";

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <AnimatePresence mode="wait">
        <motion.p key={phase} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className={`text-sm font-medium h-6 ${isFail ? "text-gray-500" : "text-gray-600"}`}>
          {phase === "arrive" && "抵達維羅納，茱麗葉之家廣場..."}
          {phase === "queue" && "擠過觀光人潮，靠近銅像...👤"}
          {phase === "touching" && "伸手觸摸銅像右胸，默念心願...🤲"}
          {phase === "glowing" && "銅像散發金光，愛神賜福！✨"}
          {phase === "done" && "❤️ 改運成功！茱麗葉的祝福降臨！"}
          {phase === "fail_push" && "被後方觀光客推開，沒摸到...😩"}
          {phase === "fail_done" && "💔 改運失敗，人潮太多，下次早點來"}
        </motion.p>
      </AnimatePresence>

      <div className="relative w-64 h-44 overflow-hidden rounded-xl">
        {/* Italian piazza background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-orange-50 to-stone-100" />
        {/* Cobblestone floor */}
        <div className="absolute bottom-0 left-0 right-0 h-10"
          style={{ background: "repeating-linear-gradient(90deg, #c4a882 0px, #c4a882 18px, #b8976e 18px, #b8976e 20px)" }} />
        {/* Arch / wall */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-amber-200/70 to-transparent" />

        {/* Dark fail overlay */}
        <AnimatePresence>
          {isFail && (
            <motion.div key="dark" className="absolute inset-0 bg-gray-900/45 z-20 rounded-xl"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} />
          )}
        </AnimatePresence>

        {/* Tourist crowd — small figures behind statue */}
        {touristPositions.map((t, i) => (
          <motion.div key={i} className="absolute text-lg" style={{ bottom: 36, left: t.x }}
            initial={{ opacity: 0 }} animate={{ opacity: phase !== "arrive" ? 0.55 : 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}>
            {t.tourist}
          </motion.div>
        ))}

        {/* Juliet bronze statue — 🥉 styled woman */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-8 z-10 flex flex-col items-center"
          animate={
            phase === "glowing"
              ? { filter: ["brightness(1)", "brightness(1.8) sepia(0.5)", "brightness(1.4)"], scale: [1, 1.08, 1] }
              : phase === "touching"
              ? { scale: [1, 1.05, 1] }
              : {}
          }
          transition={{ duration: 0.6 }}
        >
          <span style={{ fontSize: 38, filter: "sepia(0.6) saturate(1.4) brightness(0.9)" }}>🧍‍♀️</span>
          {/* Pedestal */}
          <div className="w-10 h-3 bg-stone-400 rounded-sm mt-0.5" />
        </motion.div>

        {/* Glow rings on statue during blessing */}
        <AnimatePresence>
          {(phase === "glowing" || phase === "done") && [1, 2, 3].map((n) => (
            <motion.div key={n} className="absolute rounded-full border-2 border-yellow-400/70 z-10"
              style={{
                width: 30 + n * 22, height: 30 + n * 22,
                left: `calc(50% - ${15 + n * 11}px)`,
                bottom: 42 - n * 2,
              }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: n * 0.25 }}
            />
          ))}
        </AnimatePresence>

        {/* Floating hearts / roses on success */}
        <AnimatePresence>
          {(phase === "glowing" || phase === "done") && floatItems.map((f, i) => (
            <motion.div key={i} className="absolute text-lg z-10" style={{ left: f.x, bottom: 30 }}
              initial={{ opacity: 0, y: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], y: -90, scale: [0, 1.1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: f.delay, ease: "easeOut" }}>
              {f.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Touching hand */}
        <AnimatePresence>
          {phase === "touching" && (
            <motion.div key="hand" className="absolute text-2xl z-20" style={{ bottom: 52, left: "56%" }}
              initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.45 }}>
              🤲
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fail: tourist shoves you */}
        <AnimatePresence>
          {isFail && (
            <motion.div key="shove" className="absolute text-3xl z-30" style={{ bottom: 28 }}
              initial={{ x: 260, opacity: 0 }}
              animate={{ x: [260, 130, 115], opacity: [0, 1, 1] }}
              transition={{ duration: 0.55, ease: "easeOut" }}>
              🏃‍♂️
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fail collision sparks */}
        <AnimatePresence>
          {isFail && ["💥", "😵"].map((e, i) => (
            <motion.div key={i} className="absolute text-xl z-30"
              style={{ bottom: 60 + i * 20, left: "44%" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0] }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.2 }}>
              {e}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {phase === "done" && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-50 border border-rose-200 rounded-2xl px-6 py-4 text-center w-full">
            <p className="text-rose-600 font-bold text-base mb-1">茱麗葉的祝福降臨！</p>
            <p className="text-rose-400 text-sm">真愛與好運已傳遞，今日緣分大開</p>
          </motion.div>
        )}
        {phase === "fail_done" && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-100 border border-gray-300 rounded-2xl px-6 py-4 text-center w-full">
            <p className="text-gray-600 font-bold text-base mb-1">改運失敗 💔</p>
            <p className="text-gray-400 text-sm">觀光客太多，沒擠進去，明天早點來</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Dialog ───────────────────────────────────────────
interface LuckChangeDialogProps {
  onClose: () => void;
  onComplete?: (success: boolean) => void;
}

export function LuckChangeDialog({ onClose, onComplete }: LuckChangeDialogProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  function handleSelect(id: string, locked: boolean) {
    if (locked) return;
    setSelected(id);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={() => { if (!started) onClose(); }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-t-3xl w-full max-w-sm pb-10 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-gray-800">改運</h2>
          <button onClick={onClose} className="text-gray-400 text-sm">關閉</button>
        </div>

        {!started ? (
          <div className="px-5 flex flex-col gap-3">
            {COUNTRIES.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id, c.locked)}
                className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all
                  ${c.locked
                    ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                    : selected === c.id
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 bg-white hover:border-red-300"}`}
              >
                <span className="text-3xl mt-0.5">{c.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-800">{c.name}</span>
                    <span className="text-xs text-gray-400">{c.method}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.desc}</p>
                </div>
                {c.locked && (
                  <div className="absolute top-3 right-3 bg-gray-200 rounded-full px-2 py-0.5 flex items-center gap-1">
                    <span className="text-xs">🔒</span>
                    <span className="text-xs text-gray-500">解鎖</span>
                  </div>
                )}
                {!c.locked && selected === c.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-red-400 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}

            <button
              onClick={() => selected && setStarted(true)}
              disabled={!selected}
              className="mt-2 w-full py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              開始改運
            </button>
          </div>
        ) : (
          <div className="px-5">
            {selected === "taiwan" && <TaiwanRitual onComplete={onComplete} />}
            {selected === "japan" && <JapanRitual onComplete={onComplete} />}
            {selected === "italy" && <ItalyRitual onComplete={onComplete} />}
          </div>
        )}
      </motion.div>
    </div>
  );
}

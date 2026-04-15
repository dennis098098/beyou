"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, type Transition } from "framer-motion";

interface TearAnimationProps {
  children: React.ReactNode;
  canTear: boolean;
  onTearComplete: () => void;
}

export function TearAnimation({ children, canTear, onTearComplete }: TearAnimationProps) {
  const [phase, setPhase] = useState<"idle" | "tearing" | "flip" | "tornAway">("idle");
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-150, 0], [-8, 0]);
  const scale = useTransform(y, [-150, 0], [1.03, 1]);
  const dragRef = useRef(false);

  async function triggerTear() {
    if (!canTear || phase !== "idle") return;

    // Phase 1: shake
    setPhase("tearing");
    await new Promise((r) => setTimeout(r, 300));

    // Phase 2: flip up (page turn effect)
    setPhase("flip");
    await new Promise((r) => setTimeout(r, 400));

    // Phase 3: fly away
    setPhase("tornAway");
    await new Promise((r) => setTimeout(r, 500));

    onTearComplete();
    setPhase("idle");
    y.set(0);
  }

  function handleDragEnd(_: unknown, info: { offset: { y: number } }) {
    if (info.offset.y < -80 && canTear && !dragRef.current) {
      dragRef.current = true;
      triggerTear().finally(() => { dragRef.current = false; });
    } else {
      y.set(0);
    }
  }

  const animateVariant: { y: number; rotateX: number; rotate: number | number[]; opacity: number; scale: number; transition: Transition } =
    phase === "tearing"
      ? { y: -20, rotateX: 0, rotate: [-2, 3, -3, 2, 0], opacity: 1, scale: 1, transition: { duration: 0.3 } }
      : phase === "flip"
      ? { y: -60, rotateX: -35, rotate: -4, opacity: 1, scale: 1.04, transition: { duration: 0.35, ease: "easeIn" as const } }
      : phase === "tornAway"
      ? { y: -700, rotateX: -80, rotate: 18, opacity: 0, scale: 0.8, transition: { duration: 0.45, ease: [0.4, 0, 1, 1] as [number, number, number, number] } }
      : { y: 0, rotateX: 0, rotate: 0, opacity: 1, scale: 1, transition: { duration: 0.3 } };

  return (
    <div className="relative" style={{ perspective: "800px" }}>
      <AnimatePresence>
        {phase === "tearing" && (
          <motion.div
            key="tear-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent z-20"
            style={{
              clipPath: "polygon(0 0, 5% 100%, 10% 0, 18% 100%, 25% 0, 35% 100%, 45% 0, 55% 100%, 65% 0, 75% 100%, 85% 0, 92% 100%, 100% 0)",
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        drag={canTear && phase === "idle" ? "y" : false}
        dragConstraints={{ top: -200, bottom: 0 }}
        dragElastic={0.3}
        style={{ y, rotate, scale, transformStyle: "preserve-3d" }}
        onDragEnd={handleDragEnd}
        animate={animateVariant}
        className={canTear && phase === "idle" ? "cursor-grab active:cursor-grabbing" : ""}
      >
        {children}
      </motion.div>

      {/* Pull hint */}
      {canTear && phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute -top-6 left-0 right-0 flex justify-center"
        >
          <span className="text-xs text-gray-400">↑ 向上滑動撕下今日頁面</span>
        </motion.div>
      )}
    </div>
  );
}

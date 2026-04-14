"use client";

import { motion } from "framer-motion";

interface TornStackProps {
  count: number;
}

export function TornStack({ count }: TornStackProps) {
  if (count === 0) return null;

  const visiblePages = Math.min(count, 5);

  return (
    <div className="relative flex justify-center mt-4" style={{ height: "48px" }}>
      {[...Array(visiblePages)].map((_, i) => {
        const rotation = (i - Math.floor(visiblePages / 2)) * 4;
        const translateY = i * 2;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: translateY, rotate: rotation }}
            className="absolute w-24 h-10 bg-white rounded-sm shadow-sm border border-gray-100"
            style={{ zIndex: i, transformOrigin: "center" }}
          />
        );
      })}
      <div className="absolute bottom-0 text-xs text-gray-400 font-medium" style={{ top: "52px" }}>
        已撕 {count} 張
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { getStreakMultiplier } from "@/lib/gamification/xp-engine";
import { loadProgressBlob } from "@/lib/progress/local-progress";

/**
 * Ícone de chama animado que mostra a streak actual do utilizador.
 * Lê do localStorage e actualiza em tempo real via evento custom.
 */
export function StreakFlame() {
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    function sync() {
      const blob = loadProgressBlob();
      setStreak(blob.streakCount);
      setXp(blob.xp);
    }

    sync();

    // Escuta atualizações de progresso (emitidas pelo saveProgressBlob)
    window.addEventListener("algoria-progress", sync);
    return () => window.removeEventListener("algoria-progress", sync);
  }, []);

  const multiplier = getStreakMultiplier(streak);
  const isActive = streak > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-none border-2 border-border px-2 py-1 transition-colors hover:border-orange-500/50 hover:bg-orange-500/5"
        aria-label={`Streak: ${streak} dias`}
      >
        <motion.svg
          width="16"
          height="20"
          viewBox="0 0 16 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={
            isActive
              ? {
                  scale: [1, 1.1, 1],
                  filter: [
                    "drop-shadow(0 0 2px rgba(251,146,60,0.4))",
                    "drop-shadow(0 0 6px rgba(251,146,60,0.7))",
                    "drop-shadow(0 0 2px rgba(251,146,60,0.4))",
                  ],
                }
              : {}
          }
          transition={
            isActive
              ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
        >
          <path
            d="M8 0C8 0 2 6 2 11C2 14.866 4.686 18 8 18C11.314 18 14 14.866 14 11C14 6 8 0 8 0Z"
            fill={isActive ? "url(#flame-gradient)" : "#71717a"}
            fillOpacity={isActive ? 1 : 0.3}
          />
          <path
            d="M8 8C8 8 5 11 5 13.5C5 15.433 6.343 17 8 17C9.657 17 11 15.433 11 13.5C11 11 8 8 8 8Z"
            fill={isActive ? "#fbbf24" : "#a1a1aa"}
            fillOpacity={isActive ? 0.9 : 0.2}
          />
          {isActive && (
            <defs>
              <linearGradient
                id="flame-gradient"
                x1="8"
                y1="0"
                x2="8"
                y2="18"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#f97316" />
                <stop offset="1" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          )}
        </motion.svg>

        <span
          className={`font-mono text-xs font-black tabular-nums ${
            isActive ? "text-orange-500" : "text-muted-foreground/40"
          }`}
        >
          {streak}
        </span>
      </button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-52 border-2 border-border bg-background p-3 shadow-xl"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Streak Actual
                </span>
                <span className="font-mono text-sm font-black text-orange-500">
                  {streak} {streak === 1 ? "dia" : "dias"}
                </span>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  XP Total
                </span>
                <span className="font-mono text-sm font-black text-primary">
                  {xp.toLocaleString("pt-BR")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Multiplicador
                </span>
                <span
                  className={`font-mono text-sm font-black ${
                    multiplier > 1 ? "text-green-500" : "text-muted-foreground"
                  }`}
                >
                  {multiplier}x
                </span>
              </div>

              {multiplier < 2.0 && (
                <p className="text-[10px] leading-snug text-muted-foreground">
                  {streak < 7
                    ? `Mais ${7 - streak} dia${7 - streak === 1 ? "" : "s"} para 1.2x XP`
                    : streak < 14
                      ? `Mais ${14 - streak} dia${14 - streak === 1 ? "" : "s"} para 1.5x XP`
                      : `Mais ${30 - streak} dia${30 - streak === 1 ? "" : "s"} para 2.0x XP`}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

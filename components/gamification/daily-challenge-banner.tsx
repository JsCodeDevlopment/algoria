"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, CheckCircle2, Flame } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { completeDailyChallenge, isDailyChallengeCompleted } from "@/lib/gamification/xp-engine";
import { loadProgressBlob, saveProgressBlob } from "@/lib/progress/local-progress";

interface DailyChallengeBannerProps {
  slug: string;
  title: string;
  difficulty: string;
  dateKey: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-green-500 border-green-500/30 bg-green-500/10",
  medium: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
  hard: "text-red-500 border-red-500/30 bg-red-500/10",
};

export function DailyChallengeBanner({
  slug,
  title,
  difficulty,
  dateKey,
}: DailyChallengeBannerProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const sync = () => {
      const b = loadProgressBlob();
      setCompleted(isDailyChallengeCompleted(b));
    };

    const timer = setTimeout(sync, 0);
    
    window.addEventListener("algoria-progress", sync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("algoria-progress", sync);
    };
  }, []);

  const handleComplete = () => {
    if (completed) return;
    let blob = loadProgressBlob();
    blob = completeDailyChallenge(blob);
    saveProgressBlob(blob);
    setCompleted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden border-2 border-orange-500/30 bg-gradient-to-r from-orange-500/[0.06] via-background to-amber-500/[0.06]"
    >
      <div className="absolute top-0 left-0 h-[3px] w-full bg-border/20">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
          initial={{ width: "0%" }}
          animate={{ width: completed ? "100%" : "40%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-orange-500/30 bg-orange-500/10">
            {completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <CalendarDays className="h-5 w-5 text-orange-500" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500">
                Desafio do Dia
              </span>
              <span className="text-[9px] font-mono text-muted-foreground/50">
                {dateKey}
              </span>
            </div>
            <Link
              href={`/problems/${slug}`}
              className="group flex items-center gap-2 text-lg font-black uppercase tracking-tight transition-colors hover:text-primary"
            >
              {title}
              <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
            </Link>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`rounded-none px-1.5 py-0 text-[9px] font-black uppercase ${DIFFICULTY_COLORS[difficulty] ?? ""}`}
              >
                {difficulty}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-none border-orange-500/30 bg-orange-500/10 px-1.5 py-0 text-[9px] font-black uppercase text-orange-500"
              >
                <Flame className="mr-0.5 h-3 w-3" />
                +50 XP
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {completed ? (
            <div className="flex items-center gap-2 rounded-none border-2 border-green-500/30 bg-green-500/10 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">
                Concluído
              </span>
            </div>
          ) : (
            <Link
              href={`/problems/${slug}`}
              onClick={handleComplete}
              className="flex items-center gap-2 border-2 border-orange-500 bg-orange-500 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-orange-600 active:scale-95"
            >
              Aceitar Desafio
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

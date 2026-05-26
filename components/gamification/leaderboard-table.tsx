"use client";

import { motion } from "framer-motion";
import { Crown, Flame, Medal, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  image: string | null;
  xp: number;
  streakCount: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

function getTierInfo(xp: number): { label: string; color: string } {
  if (xp >= 5000) return { label: "MASTER", color: "text-purple-500" };
  if (xp >= 2000) return { label: "EXPERT", color: "text-yellow-500" };
  if (xp >= 500) return { label: "INTERMEDIATE", color: "text-blue-500" };
  return { label: "ROOKIE", color: "text-muted-foreground" };
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1)
    return <Crown className="h-5 w-5 text-yellow-500" />;
  if (rank === 2)
    return <Medal className="h-5 w-5 text-zinc-400" />;
  if (rank === 3)
    return <Medal className="h-5 w-5 text-amber-700" />;
  return (
    <span className="flex h-5 w-5 items-center justify-center font-mono text-xs font-bold text-muted-foreground">
      {rank}
    </span>
  );
}

export function LeaderboardTable({
  entries,
  currentUserId,
}: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="border-2 border-dashed border-border p-16 text-center">
        <Trophy className="mx-auto mb-4 h-8 w-8 text-muted-foreground/30" />
        <p className="text-sm font-medium text-muted-foreground">
          Nenhum utilizador com XP registado ainda.
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Começa a estudar para aparecer no ranking!
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[3rem_1fr_5rem_5rem_6rem] gap-2 border-b-2 border-border bg-muted/30 px-4 py-3">
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          #
        </span>
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          Desenvolvedor
        </span>
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">
          XP
        </span>
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">
          Streak
        </span>
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">
          Tier
        </span>
      </div>

      {/* Rows */}
      {entries.map((entry, idx) => {
        const isCurrentUser = entry.id === currentUserId;
        const tier = getTierInfo(entry.xp);
        const isTopThree = entry.rank <= 3;

        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.25 }}
          >
            <Link
              href={`/user/${entry.id}`}
              className={`grid grid-cols-[3rem_1fr_5rem_5rem_6rem] gap-2 items-center px-4 py-3 border-b border-border/50 transition-all hover:bg-primary/[0.04] ${
                isCurrentUser
                  ? "bg-primary/[0.06] border-l-4 border-l-primary"
                  : ""
              } ${isTopThree ? "bg-muted/10" : ""}`}
            >
              <div className="flex items-center justify-center">
                <RankIcon rank={entry.rank} />
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden border ${
                    isTopThree
                      ? "border-primary/40"
                      : "border-border"
                  }`}
                >
                  {entry.image ? (
                    <Image
                      src={entry.image}
                      alt={entry.name}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {entry.name?.substring(0, 2).toUpperCase() ?? "?"}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-bold uppercase tracking-tight ${
                      isCurrentUser ? "text-primary" : ""
                    }`}
                  >
                    {entry.name}
                    {isCurrentUser && (
                      <span className="ml-1.5 text-[9px] text-primary font-normal normal-case">
                        (tu)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-sm font-black tabular-nums text-primary">
                  {entry.xp.toLocaleString("pt-BR")}
                </span>
              </div>

              <div className="flex items-center justify-end gap-1">
                {entry.streakCount > 0 && (
                  <Flame className="h-3 w-3 text-orange-500" />
                )}
                <span
                  className={`font-mono text-sm font-bold tabular-nums ${
                    entry.streakCount > 0
                      ? "text-orange-500"
                      : "text-muted-foreground/40"
                  }`}
                >
                  {entry.streakCount}
                </span>
              </div>

              <div className="text-right">
                <span
                  className={`text-[9px] font-black uppercase tracking-[0.2em] ${tier.color}`}
                >
                  {tier.label}
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

"use client";

import { Globe, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useAuthDialog } from "@/components/auth/auth-dialog-context";
import { LeaderboardTable } from "@/components/gamification/leaderboard-table";
import { Button } from "@/components/ui/button";

interface Entry {
  rank: number;
  id: string;
  name: string;
  image: string | null;
  xp: number;
  streakCount: number;
}

interface LeaderboardClientProps {
  globalEntries: Entry[];
  followingEntries: Entry[];
  currentUserId?: string;
  isLoggedIn: boolean;
}

export function LeaderboardClient({
  globalEntries,
  followingEntries,
  currentUserId,
  isLoggedIn,
}: LeaderboardClientProps) {
  const [scope, setScope] = useState<"global" | "following">("global");
  const { openAuthDialog } = useAuthDialog();

  const entries = scope === "global" ? globalEntries : followingEntries;

  return (
    <div>
      <div className="mb-8 flex items-center gap-0 border-2 border-border w-fit">
        <button
          type="button"
          onClick={() => setScope("global")}
          className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
            scope === "global"
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:bg-muted/30"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          Global
        </button>
        <button
          type="button"
          onClick={() => setScope("following")}
          disabled={!isLoggedIn}
          className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-l-2 border-border ${
            scope === "following"
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:bg-muted/30"
          } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Users className="h-3.5 w-3.5" />
          Seguidos
        </button>
      </div>

      {scope === "following" && !isLoggedIn && (
        <div className="mb-6 border-2 border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Faz login para veres o ranking dos teus amigos.
          </p>
          <Button
            variant="outline"
            className="rounded-none font-black uppercase tracking-widest text-[10px] cursor-pointer"
            onClick={() => openAuthDialog()}
          >
            Entrar
          </Button>
        </div>
      )}

      <LeaderboardTable entries={entries} currentUserId={currentUserId} />

      <div className="mt-12 flex flex-col items-center border-t border-border pt-8">
        <p className="mb-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Ganha XP estudando problemas e completando desafios diários
        </p>
        <Button
          asChild
          className="rounded-none font-black uppercase tracking-[0.2em] text-[10px] px-8"
        >
          <Link href="/problems">Começar a estudar</Link>
        </Button>
      </div>
    </div>
  );
}

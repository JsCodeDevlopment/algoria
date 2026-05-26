import { desc, eq, sql } from "drizzle-orm";
import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { LeaderboardClient } from "@/app/leaderboard/leaderboard-client";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, userFollower, userProgress } from "@/lib/db/schema";
import { buildPublicMetadata } from "@/lib/seo/build-metadata";

export const metadata: Metadata = buildPublicMetadata({
  title: "Leaderboard — Ranking da Comunidade",
  description:
    "Vê quem está a liderar em XP na Algoria. Compara o teu progresso com o da comunidade e com os teus amigos.",
  pathname: "/leaderboard",
  keywords: ["leaderboard", "ranking", "xp", "gamificação", "Algoria"],
});

async function getLeaderboardData(scope: string, userId?: string) {
  const xpExtract = sql<number>`COALESCE((${userProgress.data}::jsonb ->> 'xp')::int, 0)`;
  const streakExtract = sql<number>`COALESCE((${userProgress.data}::jsonb ->> 'streakCount')::int, 0)`;

  try {
    if (scope === "following" && userId) {
      const rows = await db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
          xp: xpExtract,
          streakCount: streakExtract,
        })
        .from(user)
        .innerJoin(userFollower, eq(userFollower.followingId, user.id))
        .leftJoin(userProgress, eq(userProgress.userId, user.id))
        .where(eq(userFollower.followerId, userId))
        .orderBy(desc(xpExtract))
        .limit(50);

      return rows.map((r, idx) => ({
        rank: idx + 1,
        id: r.id,
        name: r.name,
        image: r.image,
        xp: r.xp ?? 0,
        streakCount: r.streakCount ?? 0,
      }));
    }

    const rows = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        xp: xpExtract,
        streakCount: streakExtract,
      })
      .from(user)
      .leftJoin(userProgress, eq(userProgress.userId, user.id))
      .orderBy(desc(xpExtract))
      .limit(50);

    return rows.map((r, idx) => ({
      rank: idx + 1,
      id: r.id,
      name: r.name,
      image: r.image,
      xp: r.xp ?? 0,
      streakCount: r.streakCount ?? 0,
    }));
  } catch {
    return [];
  }
}

export default async function LeaderboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const [globalEntries, followingEntries] = await Promise.all([
    getLeaderboardData("global"),
    userId ? getLeaderboardData("following", userId) : Promise.resolve([]),
  ]);

  return (
    <div className="relative bg-grid-pattern min-h-screen flex flex-col">
      <div className="mx-auto max-w-7xl px-6 py-24 flex-1 w-full">
        <header className="mb-16 border-l-4 border-primary pl-8">
          <Badge
            variant="secondary"
            className="mb-4 rounded-none bg-primary/10 px-1.5 py-0 font-mono text-[10px] uppercase text-primary"
          >
            <Trophy className="mr-1 h-3 w-3" />
            Gamificação
          </Badge>
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Leaderboard
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed tracking-tight text-muted-foreground">
            Os programadores mais dedicados da plataforma. Estuda todos os dias,
            ganha XP e sobe no ranking.
          </p>
        </header>

        <LeaderboardClient
          globalEntries={globalEntries}
          followingEntries={followingEntries}
          currentUserId={userId}
          isLoggedIn={!!userId}
        />
      </div>
    </div>
  );
}

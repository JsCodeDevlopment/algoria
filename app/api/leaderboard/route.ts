import { eq, sql, desc } from 'drizzle-orm';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user, userProgress, userFollower } from '@/lib/db/schema';

/**
 * GET /api/leaderboard?scope=global|following&page=1&limit=20
 *
 * Retorna o ranking de utilizadores ordenados por XP (lido do JSON do userProgress).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const scope = url.searchParams.get('scope') ?? 'global';
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? '20')));
  const offset = (page - 1) * limit;

  try {
    // Extrai XP do JSON armazenado em userProgress.data
    const xpExtract = sql<number>`COALESCE((${userProgress.data}::jsonb ->> 'xp')::int, 0)`;
    const streakExtract = sql<number>`COALESCE((${userProgress.data}::jsonb ->> 'streakCount')::int, 0)`;


    let query;

    if (scope === 'following') {
      // Filtrar por utilizadores que o user actual segue
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user?.id) {
        return Response.json({ error: 'Autenticação necessária para scope=following.' }, { status: 401 });
      }

      query = db
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
        .where(eq(userFollower.followerId, session.user.id))
        .orderBy(desc(xpExtract))
        .limit(limit)
        .offset(offset);
    } else {
      // Global: todos com XP > 0
      query = db
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
        .limit(limit)
        .offset(offset);
    }

    const rows = await query;

    // Adicionar ranking
    const entries = rows.map((r, idx) => ({
      rank: offset + idx + 1,
      id: r.id,
      name: r.name,
      image: r.image,
      xp: r.xp ?? 0,
      streakCount: r.streakCount ?? 0,
    }));

    return Response.json({ entries, page, limit });
  } catch (error) {
    console.error('[Leaderboard API]', error);
    return Response.json({ entries: [], page, limit });
  }
}

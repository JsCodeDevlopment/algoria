import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userProgress } from '@/lib/db/schema';
import { ProgressBlobSchema } from '@/lib/progress/local-progress-schema';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return Response.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, session.user.id))
    .limit(1);

  if (!rows[0]) {
    return Response.json({ blob: { version: 1 as const, problems: {} } });
  }

  const blob = ProgressBlobSchema.parse(JSON.parse(rows[0].data));
  return Response.json({ blob });
}

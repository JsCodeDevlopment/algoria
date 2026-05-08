import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userProgress } from '@/lib/db/schema';
import { ProgressBlobSchema, type ProgressBlob } from '@/lib/progress/local-progress-schema';
import { mergeProgressBlobs } from '@/lib/progress/merge-blobs';
import { rateLimit } from '@/lib/security/rate-limit';

const MAX_BODY_BYTES = 512 * 1024;
const MERGE_LIMIT = 40;
const MERGE_WINDOW_MS = 60_000;

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return Response.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  if (
    !rateLimit(`progress-merge:${session.user.id}`, MERGE_LIMIT, MERGE_WINDOW_MS)
  ) {
    return Response.json(
      { error: 'Demasiados pedidos. Tenta daqui a um minuto.' },
      { status: 429 },
    );
  }

  const len = req.headers.get('content-length');
  if (len && Number(len) > MAX_BODY_BYTES) {
    return Response.json({ error: 'Payload demasiado grande.' }, { status: 413 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ error: 'Payload demasiado grande.' }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return Response.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  const body = parsed as { blob?: unknown };
  const local = ProgressBlobSchema.parse(body.blob ?? { version: 1, problems: {} });

  const rows = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, session.user.id))
    .limit(1);

  let server: ProgressBlob = { version: 1, problems: {} };
  if (rows[0]) {
    server = ProgressBlobSchema.parse(JSON.parse(rows[0].data));
  }

  const merged = mergeProgressBlobs(local, server);
  const now = new Date();

  if (rows[0]) {
    await db
      .update(userProgress)
      .set({
        data: JSON.stringify(merged),
        updatedAt: now,
      })
      .where(eq(userProgress.userId, session.user.id));
  } else {
    await db.insert(userProgress).values({
      userId: session.user.id,
      data: JSON.stringify(merged),
      updatedAt: now,
    });
  }

  return Response.json({ blob: merged });
}

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { userHasPro } from '@/lib/billing/entitlements';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  const uid = session?.user?.id;
  const pro = await userHasPro(uid);
  return Response.json({
    authenticated: Boolean(uid),
    pro,
    email: session?.user?.email ?? null,
    userId: uid ?? null,
  });
}

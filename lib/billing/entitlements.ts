import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { subscription } from '@/lib/db/schema';

/** Assinatura Stripe activa com período válido. */
export async function userHasPro(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  try {
    const rows = await db
      .select({ status: subscription.status, currentPeriodEnd: subscription.currentPeriodEnd })
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);
    const row = rows[0];
    if (!row) return false;
    if (row.status !== 'active' && row.status !== 'trialing') return false;
    if (row.currentPeriodEnd && row.currentPeriodEnd.getTime() < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

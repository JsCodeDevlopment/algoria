import type Stripe from 'stripe';

/** Fim do período de facturação actual (Stripe 22+ coloca o timestamp no item). */
export function subscriptionPeriodEnd(sub: Stripe.Subscription): Date | null {
  const first = sub.items?.data?.[0];
  const sec = first?.current_period_end;
  if (typeof sec !== 'number') return null;
  return new Date(sec * 1000);
}

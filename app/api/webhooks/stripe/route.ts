import { randomUUID } from 'node:crypto';

import { eq } from 'drizzle-orm';
import type Stripe from 'stripe';

import { db } from '@/lib/db';
import { subscription } from '@/lib/db/schema';
import { getStripe } from '@/lib/billing/stripe';
import { subscriptionPeriodEnd } from '@/lib/billing/stripe-subscription';

export async function POST(req: Request) {
  const stripe = getStripe();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !whSecret) {
    return new Response('Stripe webhook não configurado.', { status: 501 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('Sem assinatura', { status: 400 });

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch {
    return new Response('Assinatura inválida', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const sess = event.data.object as Stripe.Checkout.Session;
        const userId = sess.metadata?.userId ?? sess.client_reference_id;
        const customerId = typeof sess.customer === 'string' ? sess.customer : sess.customer?.id;
        const subId =
          typeof sess.subscription === 'string' ? sess.subscription : sess.subscription?.id;
        if (!userId || !customerId || !subId) break;

        const sub = await stripe.subscriptions.retrieve(subId);

        await upsertSubscription({
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subId,
          status: sub.status,
          currentPeriodEnd: subscriptionPeriodEnd(sub),
        });

        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
        if (!customerId) break;
        const rows = await db
          .select({ userId: subscription.userId })
          .from(subscription)
          .where(eq(subscription.stripeCustomerId, customerId))
          .limit(1);
        const userId = rows[0]?.userId;
        if (!userId) break;
        const periodEnd = subscriptionPeriodEnd(sub);
        await db
          .update(subscription)
          .set({
            status: sub.status,
            stripeSubscriptionId: sub.id,
            currentPeriodEnd: periodEnd,
            updatedAt: new Date(),
          })
          .where(eq(subscription.stripeCustomerId, customerId));
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('[stripe webhook]', e);
    return new Response('Erro ao processar evento', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}

async function upsertSubscription(params: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: string;
  currentPeriodEnd: Date | null;
}) {
  const existing = await db
    .select({ id: subscription.id })
    .from(subscription)
    .where(eq(subscription.userId, params.userId))
    .limit(1);

  if (existing[0]) {
    await db
      .update(subscription)
      .set({
        stripeCustomerId: params.stripeCustomerId,
        stripeSubscriptionId: params.stripeSubscriptionId,
        status: params.status,
        currentPeriodEnd: params.currentPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(subscription.userId, params.userId));
    return;
  }

  await db.insert(subscription).values({
    id: randomUUID(),
    userId: params.userId,
    stripeCustomerId: params.stripeCustomerId,
    stripeSubscriptionId: params.stripeSubscriptionId,
    status: params.status,
    currentPeriodEnd: params.currentPeriodEnd,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

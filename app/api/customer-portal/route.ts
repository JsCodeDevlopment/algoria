import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { getStripe } from '@/lib/billing/stripe';
import { db } from '@/lib/db';
import { subscription } from '@/lib/db/schema';

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return Response.json({ error: 'Stripe não configurado.' }, { status: 501 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return Response.json({ error: 'Inicia sessão para continuar.' }, { status: 401 });
  }

  // Busca o stripeCustomerId do banco
  const subRows = await db
    .select({ stripeCustomerId: subscription.stripeCustomerId })
    .from(subscription)
    .where(eq(subscription.userId, session.user.id))
    .limit(1);

  const sub = subRows[0];
  if (!sub) {
    return Response.json({ error: 'Não tens uma assinatura ativa.' }, { status: 404 });
  }

  // Verifica se é um ID fictício do script de dev
  if (sub.stripeCustomerId.startsWith('cus_mock_')) {
    return Response.json(
      { error: 'Não é possível abrir o portal com um ID fictício. Faz um checkout real para testar.' },
      { status: 400 }
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || new URL(req.url).origin;

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${origin}/pricing`,
    });

    return Response.json({ url: portalSession.url });
  } catch (err: any) {
    console.error('Portal error:', err);
    return Response.json(
      { error: err.message ?? 'Erro ao abrir o portal de gestão.' },
      { status: 500 },
    );
  }
}

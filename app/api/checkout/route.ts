import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { getStripe } from '@/lib/billing/stripe';
import { rateLimit } from '@/lib/security/rate-limit';

const CHECKOUT_LIMIT = 15;
const CHECKOUT_WINDOW_MS = 900_000;

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return Response.json({ error: 'Stripe não configurado.' }, { status: 501 });
  }
  const priceId = process.env.STRIPE_PRICE_PRO_MONTHLY;
  if (!priceId) {
    return Response.json({ error: 'STRIPE_PRICE_PRO_MONTHLY em falta.' }, { status: 501 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return Response.json({ error: 'Inicia sessão para continuar.' }, { status: 401 });
  }

  if (
    !rateLimit(
      `checkout:${session.user.id}`,
      CHECKOUT_LIMIT,
      CHECKOUT_WINDOW_MS,
    )
  ) {
    return Response.json(
      { error: 'Demasiadas tentativas de checkout. Aguarda alguns minutos.' },
      { status: 429 },
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || new URL(req.url).origin;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: session.user.email ?? undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/pricing?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancel`,
      metadata: { userId: session.user.id },
      client_reference_id: session.user.id,
    });

    if (!checkoutSession.url) {
      return Response.json({ error: 'URL de checkout indisponível.' }, { status: 500 });
    }

    return Response.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return Response.json(
      { error: err.message ?? 'Erro ao criar sessão de checkout.' },
      { status: 500 },
    );
  }
}

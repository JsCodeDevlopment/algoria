import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { CheckoutButton } from '@/components/billing/checkout-button';
import { PricingPageAnalytics } from '@/components/billing/pricing-analytics';
import { CheckoutSuccessAnalytics } from './checkout-success-analytics';
import { Button } from '@/components/ui/button';
import {
  checkoutAvailable,
  formatFreeTierPrice,
  formatPricingDisplay,
} from '@/lib/billing/pricing-env';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Preços e Algoria Pro',
  description: 'Compara o plano gratuito com a subscrição Pro: catálogo completo, sync de progresso e traces de execução.',
  pathname: '/pricing',
  keywords: ['preços', 'Pro', 'subscrição', 'Algoria'],
});

export default function PricingPage() {
  const { monthly, yearly, yearlyNote } = formatPricingDisplay();
  const canPay = checkoutAvailable();

  return (
    <div className="relative bg-grid-pattern">
      <CheckoutSuccessAnalytics />
      <PricingPageAnalytics />
      <div className="mx-auto max-w-4xl px-6 py-24">
        <Button asChild variant="outline" size="sm" className="mb-8 rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
          <Link href="/"><ArrowLeft className="h-3.5 w-3.5" /> Início</Link>
        </Button>
        <header className="mb-12 border-l-4 border-primary pl-8">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">Monetização transparente</p>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tighter md:text-5xl">Planos</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Dez problemas e funcionalidades essenciais gratuitos. Pro desbloqueia o catálogo completo, sincronização de progresso e investimento contínuo em conteúdo.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="border-2 border-border bg-background/80 p-8 shadow-sm">
            <h2 className="text-lg font-black uppercase tracking-tight">Free</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Catálogo limitado a 10 problemas hero (marcados como «Free» no catálogo), progresso no browser, todas as rotas públicas de conceitos e changelog.
            </p>
            <p className="mt-6 font-mono text-2xl font-black">{formatFreeTierPrice()}</p>
            <Button asChild variant="outline" className="mt-8 w-full rounded-none font-black uppercase">
              <Link href="/problems">Explorar catálogo free</Link>
            </Button>
          </section>

          <section className="border-2 border-primary bg-primary/5 p-8 shadow-lg">
            <h2 className="text-lg font-black uppercase tracking-tight text-primary">Pro</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Todo o catálogo (problemas marcados «Pro»), player e traces onde existirem, merge de progresso na conta e futuras funcionalidades premium.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-foreground">
              <li>· Pagamento seguro via Stripe</li>
              <li>· Cancelamento na conta Stripe / portal (em breve)</li>
              <li>· {yearlyNote}</li>
            </ul>
            <p className="mt-6 font-mono text-2xl font-black">{monthly}</p>
            <p className="mt-1 font-mono text-lg text-muted-foreground">{yearly}</p>
            <div className="mt-8 flex flex-col gap-3">
              {canPay ? (
                <CheckoutButton />
              ) : (
                <p className="text-xs text-muted-foreground">
                  Checkout indisponível: configura <code className="font-mono text-[10px]">STRIPE_SECRET_KEY</code> e{' '}
                  <code className="font-mono text-[10px]">STRIPE_PRICE_PRO_MONTHLY</code> no ambiente.
                </p>
              )}
              <Button asChild variant="outline" className="rounded-none font-black uppercase">
                <Link href="/auth/sign-in">Iniciar sessão para subscrever</Link>
              </Button>
            </div>
          </section>
        </div>

        <section className="mt-16 border border-border bg-muted/30 p-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-primary">Perguntas rápidas</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-foreground">O que acontece ao meu progresso local?</dt>
              <dd className="mt-1 text-muted-foreground">
                Ao iniciar sessão, o site tenta fundir o que tens no browser com o que está na conta (última linha lida, problemas visitados). Faz backup ocasional em JSON pelo catálogo.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Posso pedir reembolso?</dt>
              <dd className="mt-1 text-muted-foreground">
                Vê a página <Link href="/legal/refunds" className="text-primary underline-offset-4 hover:underline">Política de reembolso</Link>.
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

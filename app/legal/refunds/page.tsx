import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Reembolsos',
  description: 'Política de reembolso da subscrição Algoria Pro.',
  pathname: '/legal/refunds',
  keywords: ['reembolso', 'Stripe', 'Algoria'],
});

export default function RefundsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Button asChild variant="outline" size="sm" className="rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
        <Link href="/"><ArrowLeft className="h-3.5 w-3.5" /> Início</Link>
      </Button>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Política de reembolso</h1>
      <p className="mt-4 text-sm text-muted-foreground">Última actualização: Maio de 2026</p>
      <div className="prose prose-zinc dark:prose-invert mt-10 max-w-none text-sm leading-relaxed">
        <p>
          Pagamentos são processados pelo Stripe. Se um cobranço não autorizado ocorrer ou se precisares de reembolso por
          erro técnico que impeça o uso do serviço durante vários dias, contacta o suporte com o email da conta e o ID da
          factura Stripe.
        </p>
        <p>
          Para subscrições mensais/anuais, aplicam-se as políticas de cancelamento do Stripe e da lei do consumidor na tua
          jurisdição; tratamos cada caso manualmente num período razoável de dias úteis.
        </p>
      </div>
    </div>
  );
}

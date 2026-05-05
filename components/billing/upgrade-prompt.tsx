import Link from 'next/link';

import { PaywallAnalytics } from '@/components/billing/paywall-analytics';
import { Button } from '@/components/ui/button';

export function UpgradePrompt({ context, problemSlug }: { context?: string; problemSlug?: string }) {
  return (
    <div className="mx-auto max-w-lg border-2 border-primary bg-primary/5 p-8 text-center">
      {problemSlug ? <PaywallAnalytics problemSlug={problemSlug} /> : null}
      <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">Algoria Pro</p>
      <h2 className="text-xl font-black uppercase tracking-tight mb-3">
        {context ?? 'Conteúdo exclusivo Pro'}
      </h2>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Este problema faz parte do catálogo pago. Assina para aceder ao player linha-a-linha, traces de execução quando
        disponíveis e sincronização de progresso entre dispositivos.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild className="rounded-none font-black uppercase">
          <Link href="/pricing">Ver planos</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-none">
          <Link href="/auth/sign-in">Iniciar sessão</Link>
        </Button>
      </div>
    </div>
  );
}

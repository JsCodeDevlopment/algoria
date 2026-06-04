import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Reembolsos',
  description: 'Política de cancelamento e reembolso da Acite.',
  pathname: '/legal/refunds',
  keywords: ['reembolso', 'estorno', 'cancelamento', 'Stripe', 'Acite'],
});

export default function RefundsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Button asChild variant="outline" size="sm" className="rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
        <Link href="/"><ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Início</Link>
      </Button>

      <header className="mt-12 mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl border-l-4 border-primary pl-6">
          Política de Reembolso
        </h1>
        <p className="mt-4 text-muted-foreground">Última atualização: 07 de Maio de 2026</p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
        <section>
          <h2 className="text-2xl font-bold">1. Direito de Arrependimento</h2>
          <p>
            De acordo com o Código de Defesa do Consumidor (Brasil), você tem o direito de desistir da sua assinatura no prazo de <strong>7 (sete) dias corridos</strong> a partir da data da contratação. Caso o pedido de cancelamento seja feito dentro deste prazo, o valor integral pago será reembolsado.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">2. Cancelamento de Assinatura</h2>
          <p>
            As assinaturas da Acite Pro podem ser canceladas a qualquer momento através do painel de controle do usuário (gerenciado via Stripe Customer Portal).
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Ao cancelar, você continuará tendo acesso ao conteúdo Pro até o final do período de faturamento atual.</li>
            <li>Não oferecemos reembolsos proporcionais para cancelamentos feitos após o período de 7 dias de arrependimento, exceto em casos de falhas técnicas graves comprovadas.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">3. Reembolsos por Falhas Técnicas</h2>
          <p>
            Se você enfrentar problemas técnicos persistentes que impeçam totalmente o uso da plataforma por um período superior a 48 horas úteis, e nossa equipe de suporte não conseguir resolver o problema, você poderá ter direito a um reembolso parcial ou total, analisado caso a caso.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">4. Processo de Reembolso</h2>
          <p>
            Para solicitar um reembolso dentro das condições acima, você deve enviar um e-mail para o suporte oficial informando:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>O endereço de e-mail associado à sua conta Acite.</li>
            <li>O ID da transação ou número da fatura enviada pelo Stripe.</li>
            <li>O motivo detalhado da solicitação.</li>
          </ul>
          <p className="mt-4">
            Após a aprovação, o estorno será processado pelo Stripe e o crédito aparecerá na sua fatura de cartão de crédito de acordo com os prazos da sua operadora (geralmente entre 5 a 10 dias úteis).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">5. Cobranças Indevidas</h2>
          <p>
            Caso identifique qualquer cobrança que considere indevida, entre em contato conosco imediatamente antes de abrir uma disputa (chargeback) junto ao seu cartão de crédito. Disputas abertas sem contato prévio resultam no bloqueio imediato e permanente da conta na plataforma por questões de segurança e prevenção de fraude.
          </p>
        </section>

        <section className="bg-muted p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold mt-0">Dúvidas sobre Faturamento?</h2>
          <p className="mb-0">
            Nossa equipe está disponível para ajudar com qualquer questão financeira. Use o link de suporte no rodapé para iniciar uma conversa.
          </p>
        </section>
      </div>
    </div>
  );
}


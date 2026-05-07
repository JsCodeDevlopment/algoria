import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Privacidade',
  description: 'Como a Algoria trata dados pessoais, cookies e analytics.',
  pathname: '/legal/privacy',
  keywords: ['privacidade', 'RGPD', 'Algoria'],
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Button asChild variant="outline" size="sm" className="rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
        <Link href="/"><ArrowLeft className="h-3.5 w-3.5" /> Início</Link>
      </Button>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Política de privacidade</h1>
      <p className="mt-4 text-sm text-muted-foreground">Última actualização: Maio de 2026</p>
      <div className="prose prose-zinc dark:prose-invert mt-10 max-w-none text-sm leading-relaxed">
        <p>
          <strong>Conta.</strong> Email e credenciais são usados para autenticação (Better Auth) e ligação à subscrição
          Stripe. Podes pedir apagamento de conta; parte dos dados pode ser retida por obrigação legal (facturação).
        </p>
        <p>
          <strong>Progresso.</strong> Dados de estudo locais (localStorage) podem ser fundidos com a conta após login;
          o JSON agregado é armazenado em base de dados associada ao teu utilizador.
        </p>
        <p>
          <strong>Analytics.</strong> Se <code className="text-xs">NEXT_PUBLIC_POSTHOG_KEY</code> estiver activo, eventos
          de produto (páginas, player) podem ser enviados de forma anónima ou pseudo-anónima.
        </p>
        <p>
          <strong>Contacto.</strong> Usa o canal de suporte indicado no site para exercer direitos de acesso, rectificação
          ou apagamento (RGPD), sujeito a verificação de identidade.
        </p>
      </div>
    </div>
  );
}

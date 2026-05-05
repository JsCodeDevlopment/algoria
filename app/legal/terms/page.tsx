import Link from 'next/link';
import type { Metadata } from 'next';

import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Termos de uso',
  description: 'Termos de utilização do serviço Algoria.',
  pathname: '/legal/terms',
  keywords: ['termos', 'Algoria'],
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Início
      </Link>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Termos de utilização</h1>
      <p className="mt-4 text-sm text-muted-foreground">Última actualização: Maio de 2026</p>
      <div className="prose prose-zinc dark:prose-invert mt-10 max-w-none text-sm leading-relaxed">
        <p>
          A Algoria oferece conteúdo educativo online. Ao utilizares o site, concordas em não abusar de contas, em não
          copiar repositórios de conteúdo para serviços concorrentes sem autorização, e em cumprir as leis aplicáveis.
        </p>
        <p>
          O acesso a conteúdo Pro depende de pagamento válido no Stripe. Os preços e funcionalidades podem evoluir; ajustes
          serão comunicados no changelog.
        </p>
        <p>Para questões: contacta o suporte listado no rodapé quando estiver disponível.</p>
      </div>
    </div>
  );
}

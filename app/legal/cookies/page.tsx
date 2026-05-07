import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Cookies',
  description: 'Uso de cookies e consentimento no site Algoria.',
  pathname: '/legal/cookies',
  keywords: ['cookies', 'Algoria'],
});

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Button asChild variant="outline" size="sm" className="rounded-none gap-2 text-xs font-bold uppercase tracking-wide">
        <Link href="/"><ArrowLeft className="h-3.5 w-3.5" /> Início</Link>
      </Button>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Cookies</h1>
      <p className="mt-4 text-sm text-muted-foreground">Última actualização: Maio de 2026</p>
      <div className="prose prose-zinc dark:prose-invert mt-10 max-w-none text-sm leading-relaxed">
        <p>
          Utilizamos cookies essenciais de sessão para login e segurança (Better Auth). Opcionalmente, PostHog pode definir
          cookies ou usar armazenamento local para analytics se configurado no ambiente.
        </p>
        <p>
          Podes bloquear cookies de terceiros no browser; funcionalidades como sessão persistente podem deixar de funcionar.
        </p>
      </div>
    </div>
  );
}

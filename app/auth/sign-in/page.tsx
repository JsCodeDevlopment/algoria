import Link from 'next/link';
import type { Metadata } from 'next';

import { SignInForm } from '@/components/auth/sign-in-form';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Iniciar sessão',
  description: 'Entra na tua conta Algoria para sincronizar progresso e gerir a subscrição Pro.',
  pathname: '/auth/sign-in',
  keywords: ['login', 'conta', 'Algoria'],
});

export default function SignInPage() {
  return (
    <div className="relative bg-grid-pattern">
      <div className="mx-auto max-w-lg px-6 py-24">
        <Link href="/" className="mb-8 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← Início
        </Link>
        <div className="border-l-4 border-primary pl-8">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">Conta</p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tighter">Iniciar sessão</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Usa o mesmo email e palavra-passe que definiste no registo.
          </p>
        </div>
        <div className="mt-10">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}

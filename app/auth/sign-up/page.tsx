import Link from 'next/link';
import type { Metadata } from 'next';

import { SignUpForm } from '@/components/auth/sign-up-form';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Criar conta',
  description: 'Cria uma conta Algoria para guardar o progresso na nuvem e subscrever o catálogo Pro.',
  pathname: '/auth/sign-up',
  keywords: ['registo', 'conta', 'Algoria'],
});

export default function SignUpPage() {
  return (
    <div className="relative bg-grid-pattern">
      <div className="mx-auto max-w-lg px-6 py-24">
        <Link href="/" className="mb-8 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← Início
        </Link>
        <div className="border-l-4 border-primary pl-8">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">Conta</p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tighter">Criar conta</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O progresso local será fundido com a conta no primeiro login (ver política de privacidade).
          </p>
        </div>
        <div className="mt-10">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}

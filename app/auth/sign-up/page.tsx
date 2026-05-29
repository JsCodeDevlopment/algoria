import type { Metadata } from 'next';

import { SignUpRedirector } from '@/components/auth/sign-up-redirector';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Criar conta',
  description: 'Cria uma conta Algoria para guardar o progresso na nuvem e subscrever o catálogo Pro.',
  pathname: '/auth/sign-up',
  keywords: ['registo', 'conta', 'Algoria'],
});

export default function SignUpPage() {
  return <SignUpRedirector />;
}

import type { Metadata } from 'next';

import { SignInRedirector } from '@/components/auth/sign-in-redirector';
import { buildPublicMetadata } from '@/lib/seo/build-metadata';

export const metadata: Metadata = buildPublicMetadata({
  title: 'Iniciar sessão',
  description: 'Entra na tua conta Algoria para sincronizar progresso e gerir a subscrição Pro.',
  pathname: '/auth/sign-in',
  keywords: ['login', 'conta', 'Algoria'],
});

export default function SignInPage() {
  return <SignInRedirector />;
}

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthDialog } from '@/components/auth/auth-dialog-context';
import { authClient } from '@/lib/auth-client';

/**
 * Redirector component for the legacy /auth/sign-in page.
 * If already logged in → go to /problems.
 * Otherwise → open auth dialog and navigate to home.
 */
export function SignInRedirector() {
  const { data, isPending } = authClient.useSession();
  const { openAuthDialog } = useAuthDialog();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (data?.user) {
      router.replace('/problems');
    } else {
      openAuthDialog({ mode: 'sign-in' });
      router.replace('/');
    }
  }, [data, isPending, openAuthDialog, router]);

  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="h-6 w-6 animate-pulse border-2 border-primary/30 bg-primary/10" />
    </div>
  );
}

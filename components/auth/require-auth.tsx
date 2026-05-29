'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthDialog } from '@/components/auth/auth-dialog-context';
import { authClient } from '@/lib/auth-client';

/**
 * Client-side auth guard.
 *
 * Wraps protected page content. When the user has no session it
 * automatically opens the auth dialog (with the current pathname as
 * redirect target) and renders a skeleton instead.
 *
 * Once the user authenticates, the dialog closes and the content is revealed.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const { openAuthDialog, isOpen } = useAuthDialog();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;
    if (!data?.user) {
      openAuthDialog({ redirectTo: pathname });
    }
  }, [data?.user, isPending, pathname]);

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-pulse rounded-none border-2 border-primary/30 bg-primary/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
            A verificar sessão…
          </span>
        </div>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="h-12 w-12 flex items-center justify-center border-2 border-primary/30 bg-primary/5">
            <div className="h-3 w-3 bg-primary/40" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            Autenticação necessária
          </p>
          <p className="text-xs text-muted-foreground/70">
            Faz login ou cria uma conta para aceder a este conteúdo.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

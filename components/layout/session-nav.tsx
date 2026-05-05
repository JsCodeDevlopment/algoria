'use client';

import Link from 'next/link';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export function SessionNav() {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return <span className="hidden text-[10px] text-muted-foreground sm:inline">…</span>;
  }

  if (!data?.user) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/pricing"
          className="hidden text-[9px] font-black uppercase tracking-wide text-muted-foreground hover:text-primary sm:inline"
        >
          Preços
        </Link>
        <Link
          href="/auth/sign-in"
          className="text-[9px] font-black uppercase tracking-wide text-muted-foreground hover:text-primary"
        >
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex max-w-[10rem] items-center gap-2">
      <span className="hidden truncate font-mono text-[9px] text-muted-foreground sm:inline" title={data.user.email ?? ''}>
        {data.user.email}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 shrink-0 px-2 text-[9px] font-black uppercase"
        onClick={() => void authClient.signOut()}
      >
        Sair
      </Button>
    </div>
  );
}

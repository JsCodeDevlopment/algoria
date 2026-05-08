'use client';

import { LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await authClient.signOut();
    router.push('/auth/sign-in');
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-none font-bold uppercase tracking-wide gap-2 border-border text-muted-foreground hover:text-foreground"
      onClick={() => void handleSignOut()}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      Sair da Conta
    </Button>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authClient.signIn.email({ email, password });
      if (res.error) {
        setError(res.error.message ?? 'Não foi possível iniciar sessão.');
        return;
      }
      router.push('/problems');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="max-w-sm space-y-4">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div>
        <label htmlFor="signin-email" className="text-xs font-bold uppercase text-muted-foreground">
          Email
        </label>
        <Input
          id="signin-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          required
          className="mt-1 rounded-none"
        />
      </div>
      <div>
        <label htmlFor="signin-password" className="text-xs font-bold uppercase text-muted-foreground">
          Palavra-passe
        </label>
        <Input
          id="signin-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 rounded-none"
        />
      </div>
      <Button type="submit" className="w-full rounded-none font-black uppercase" disabled={loading}>
        {loading ? 'A entrar…' : 'Entrar'}
      </Button>
      <p className="text-xs text-muted-foreground">
        Ainda sem conta?{' '}
        <Link href="/auth/sign-up" className="font-semibold text-primary underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}

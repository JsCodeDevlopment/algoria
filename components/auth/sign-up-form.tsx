'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name: name.trim() || email.split('@')[0] || 'Utilizador',
      });
      if (res.error) {
        setError(res.error.message ?? 'Não foi possível criar a conta.');
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
        <label htmlFor="signup-name" className="text-xs font-bold uppercase text-muted-foreground">
          Nome (opcional)
        </label>
        <Input
          id="signup-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          autoComplete="name"
          className="mt-1 rounded-none"
        />
      </div>
      <div>
        <label htmlFor="signup-email" className="text-xs font-bold uppercase text-muted-foreground">
          Email
        </label>
        <Input
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          required
          className="mt-1 rounded-none"
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="text-xs font-bold uppercase text-muted-foreground">
          Palavra-passe
        </label>
        <Input
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="mt-1 rounded-none"
        />
      </div>
      <Button type="submit" className="w-full rounded-none font-black uppercase" disabled={loading}>
        {loading ? 'A criar…' : 'Criar conta'}
      </Button>
      <p className="text-xs text-muted-foreground">
        Já tens conta?{' '}
        <Link href="/auth/sign-in" className="font-semibold text-primary underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}

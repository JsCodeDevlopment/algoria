'use client';

import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

interface SignUpFormProps {
  onSuccess?: () => void;
  onSwitchToSignIn?: () => void;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SignUpForm({ onSuccess, onSwitchToSignIn }: SignUpFormProps = {}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/problems');
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleSignUp() {
    setError(null);
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch {
      setError('Não foi possível criar conta com Google.');
      setGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        className={cn(
          'relative w-full cursor-pointer gap-3 rounded-none border-2 border-border py-6 text-sm font-bold transition-all duration-200',
          'hover:border-primary/50 hover:bg-primary/4 hover:shadow-md',
        )}
        disabled={googleLoading}
        onClick={() => void onGoogleSignUp()}
      >
        {googleLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <GoogleIcon className="h-5 w-5" />
        )}
        Registar com Google
      </Button>

      <div className="relative flex items-center py-2">
        <div className="flex-1 border-t border-border" />
        <span className="mx-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          ou com email
        </span>
        <div className="flex-1 border-t border-border" />
      </div>

      {error && (
        <div className="border-2 border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={(e) => void onSubmit(e)} className="space-y-5">
        <div>
          <label htmlFor="signup-name" className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            Nome <span className="font-normal normal-case tracking-normal text-muted-foreground/70">(opcional)</span>
          </label>
          <Input
            id="signup-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            autoComplete="name"
            placeholder="Como queres ser chamado?"
            className="h-12 rounded-none border-2 border-border bg-background/60 px-4 text-sm transition-colors focus:border-primary focus:bg-background"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            Email
          </label>
          <Input
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            required
            placeholder="tu@exemplo.com"
            className="h-12 rounded-none border-2 border-border bg-background/60 px-4 text-sm transition-colors focus:border-primary focus:bg-background"
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Palavra-passe
          </label>
          <div className="relative">
            <Input
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              className="h-12 rounded-none border-2 border-border bg-background/60 px-4 pr-12 text-sm transition-colors focus:border-primary focus:bg-background"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
              aria-label={showPassword ? 'Esconder password' : 'Mostrar password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground/70">
            Usa pelo menos 8 caracteres com letras e números.
          </p>
        </div>
        <Button
          type="submit"
          className={cn(
            'group w-full cursor-pointer gap-2 rounded-none border-2 border-primary py-6 text-[11px] font-black uppercase tracking-[0.15em] shadow-none transition-all duration-200',
            'hover:shadow-lg hover:shadow-primary/20',
          )}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Criar conta
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>

      <div className="space-y-3 text-center">
        <p className="text-xs text-muted-foreground">
          Já tens conta?{' '}
          {onSwitchToSignIn ? (
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="font-bold text-primary underline-offset-4 transition-colors hover:underline cursor-pointer"
            >
              Entrar agora
            </button>
          ) : (
            <Link href="/auth/sign-in" className="font-bold text-primary underline-offset-4 transition-colors hover:underline">
              Entrar agora
            </Link>
          )}
        </p>
        <p className="text-[10px] leading-relaxed text-muted-foreground/60">
          Ao criar conta, concordas com os{' '}
          <Link href="/legal/terms" className="underline underline-offset-2 hover:text-foreground">Termos de Serviço</Link>
          {' '}e{' '}
          <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-foreground">Política de Privacidade</Link>.
        </p>
      </div>
    </div>
  );
}

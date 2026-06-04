'use client';

import { useRouter } from 'next/navigation';

import { useAuthDialog } from '@/components/auth/auth-dialog-context';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { AlgoriaMark } from '@/components/branding/algoria-logo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function AuthDialog() {
  const { isOpen, mode, redirectTo, closeAuthDialog, setMode } = useAuthDialog();
  const router = useRouter();

  const handleSuccess = () => {
    closeAuthDialog();
    if (redirectTo) {
      router.push(redirectTo);
    }
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeAuthDialog(); }}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden border-2 border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl shadow-primary/5">
        <div
          className="h-1 bg-gradient-to-r from-primary via-primary/70 to-primary/30"
          aria-hidden
        />

        <div className="px-8 pb-8 pt-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center justify-center py-4">
              <AlgoriaMark className="h-14 w-56" />
            </div>
            <DialogTitle className="text-xl">
              {mode === 'sign-in' ? 'Iniciar sessão' : 'Criar conta'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {mode === 'sign-in'
                ? 'Entra na tua conta para sincronizar progresso e aceder ao conteúdo.'
                : 'Cria a tua conta gratuita e começa a estudar algoritmos.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex mb-6 border-2 border-border">
            <button
              type="button"
              onClick={() => setMode('sign-in')}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors cursor-pointer ${
                mode === 'sign-in'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode('sign-up')}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors cursor-pointer border-l-2 border-border ${
                mode === 'sign-up'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Registar
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {mode === 'sign-in' ? (
              <SignInForm
                onSuccess={handleSuccess}
                onSwitchToSignUp={() => setMode('sign-up')}
              />
            ) : (
              <SignUpForm
                onSuccess={handleSuccess}
                onSwitchToSignIn={() => setMode('sign-in')}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

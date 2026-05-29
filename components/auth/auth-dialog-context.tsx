'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type AuthMode = 'sign-in' | 'sign-up';

interface AuthDialogState {
  isOpen: boolean;
  mode: AuthMode;
  redirectTo: string | null;
}

interface AuthDialogContextValue extends AuthDialogState {
  openAuthDialog: (opts?: { mode?: AuthMode; redirectTo?: string }) => void;
  closeAuthDialog: () => void;
  setMode: (mode: AuthMode) => void;
}

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null);

export function AuthDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthDialogState>({
    isOpen: false,
    mode: 'sign-in',
    redirectTo: null,
  });

  const openAuthDialog = useCallback(
    (opts?: { mode?: AuthMode; redirectTo?: string }) => {
      setState({
        isOpen: true,
        mode: opts?.mode ?? 'sign-in',
        redirectTo: opts?.redirectTo ?? null,
      });
    },
    [],
  );

  const closeAuthDialog = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false, redirectTo: null }));
  }, []);

  const setMode = useCallback((mode: AuthMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const value = useMemo<AuthDialogContextValue>(
    () => ({ ...state, openAuthDialog, closeAuthDialog, setMode }),
    [state, openAuthDialog, closeAuthDialog, setMode],
  );

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
    </AuthDialogContext.Provider>
  );
}

export function useAuthDialog(): AuthDialogContextValue {
  const ctx = useContext(AuthDialogContext);
  if (!ctx) {
    throw new Error('useAuthDialog must be used within an AuthDialogProvider');
  }
  return ctx;
}

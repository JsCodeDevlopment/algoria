'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export function SessionNav() {
  const { data, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  if (isPending) {
    return <span className="hidden text-[10px] text-muted-foreground sm:inline">…</span>;
  }

  if (!data?.user) {
    return (
      <Button
        asChild
        variant="default"
        size="sm"
        className="h-9 shrink-0 rounded-none px-3 text-[9px] font-black uppercase tracking-wide shadow-none sm:px-4"
      >
        <Link href="/auth/sign-in">Entrar</Link>
      </Button>
    );
  }

  const user = data.user;
  const initials = user.name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase() || 'U';

  const handleSignOut = async () => {
    setIsOpen(false);
    await authClient.signOut();
    router.push('/auth/sign-in');
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 rounded-none border-2 border-border p-1 pr-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-none bg-primary/10 text-[10px] font-bold text-primary border border-border/50">
          {user.image ? (
            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <span className="hidden text-xs font-medium sm:inline-block uppercase tracking-wide">
          {user.name || user.email?.split('@')[0]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-none border-2 border-border bg-background shadow-xl animate-in slide-in-from-top-2 z-50">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-bold truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
          </div>
          <div className="p-1 flex flex-col gap-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <UserIcon className="h-3.5 w-3.5" />
              Meu Perfil
            </Link>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair da Conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

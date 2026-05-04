import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.ComponentPropsWithoutRef<'input'>;

/** Input simples para filtros da Fase 1. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors outline-none placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-600',
        'focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-400/20 dark:focus-visible:border-zinc-600 dark:focus-visible:ring-zinc-600/40',
        'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-sans',
        className,
      )}
      {...props}
    />
  );
});

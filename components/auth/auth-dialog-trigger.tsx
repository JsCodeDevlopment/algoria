'use client';

import { useAuthDialog } from '@/components/auth/auth-dialog-context';
import { Button } from '@/components/ui/button';

/**
 * Client-side button that opens the auth dialog.
 * Used in server components that need auth login functionality.
 */
export function AuthDialogTriggerButton({
  children,
  className,
  variant = 'outline',
  size = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
}) {
  const { openAuthDialog } = useAuthDialog();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => openAuthDialog()}
    >
      {children}
    </Button>
  );
}

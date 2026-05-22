'use client';

import { Button } from '@/components/ui/button';
import { toggleFollowUser } from '@/lib/actions/follow';
import { Loader2, UserCheck, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
  isLoggedIn: boolean;
}

export function FollowButton({
  targetUserId,
  initialIsFollowing,
  isLoggedIn,
}: FollowButtonProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const handleFollowClick = () => {
    if (!isLoggedIn) {
      router.push('/auth/sign-in');
      return;
    }

    startTransition(async () => {
      setIsFollowing((prev) => !prev);

      const result = await toggleFollowUser(targetUserId);
      if (result.error) {
        setIsFollowing(initialIsFollowing);
        console.error(result.error);
      } else if (result.success && result.followed !== undefined) {
        setIsFollowing(result.followed);
      }
    });
  };

  return (
    <Button
      onClick={handleFollowClick}
      disabled={isPending}
      variant={isFollowing ? 'outline' : 'default'}
      className={`h-9 rounded-none font-black uppercase tracking-widest text-[10px] border-2 transition-all gap-2 px-5 ${
        isFollowing
          ? 'border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 hover:text-white/80 shadow-[2px_2px_0_0_rgba(var(--primary-rgb),0.1)]'
          : 'border-primary bg-primary text-primary-foreground hover:bg-primary/95 shadow-[4px_4px_0_0_rgba(var(--primary-rgb),0.2)]'
      }`}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="h-3.5 w-3.5 text-primary hover:text-white/80" />
      ) : (
        <UserPlus className="h-3.5 w-3.5" />
      )}
      {isFollowing ? 'Seguindo' : 'Seguir'}
    </Button>
  );
}

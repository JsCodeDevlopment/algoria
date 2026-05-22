'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, UserMinus, ArrowUpRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toggleFollowUser } from '@/lib/actions/follow';

interface NetworkUser {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
  createdAt: Date;
}

interface NetworkSectionProps {
  followers: NetworkUser[];
  following: NetworkUser[];
}

export function NetworkSection({
  followers,
  following: initialFollowing,
}: NetworkSectionProps) {
  const [following, setFollowing] = useState<NetworkUser[]>(initialFollowing);
  const [isPending, startTransition] = useTransition();

  const handleUnfollow = (targetUserId: string) => {
    startTransition(async () => {
      // Optimistic update: remove target from following list
      setFollowing((prev) => prev.filter((u) => u.id !== targetUserId));

      const result = await toggleFollowUser(targetUserId);
      if (result.error) {
        // Rollback
        setFollowing(initialFollowing);
        console.error(result.error);
      }
    });
  };

  const renderUserList = (users: NetworkUser[], isFollowingTab: boolean) => {
    if (users.length === 0) {
      return (
        <div className="border-2 border-dashed border-border p-12 text-center bg-muted/5">
          <p className="text-sm font-medium text-muted-foreground">
            {isFollowingTab
              ? 'Ainda não estás a seguir ninguém.'
              : 'Ainda não tens seguidores.'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {users.map((item) => {
          const initials =
            item.name?.substring(0, 2).toUpperCase() ||
            item.email?.substring(0, 2).toUpperCase() ||
            'U';

          return (
            <div
              key={item.id}
              className="border-2 border-border p-4 bg-background/50 backdrop-blur-md flex items-center justify-between gap-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.02)] hover:shadow-[6px_6px_0_0_rgba(var(--primary-rgb),0.05)] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 border-2 border-primary bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name || ''}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-sm font-black text-primary">
                      {initials}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-sm text-foreground line-clamp-1">
                    {item.name || 'Utilizador'}
                  </h4>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Membro desde {new Date(item.createdAt).getFullYear()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-none text-[9px] uppercase font-black tracking-widest border-border gap-1"
                >
                  <Link href={`/user/${item.id}`} prefetch={false}>
                    Ver <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>

                {isFollowingTab && (
                  <Button
                    onClick={() => handleUnfollow(item.id)}
                    disabled={isPending}
                    variant="destructive"
                    size="sm"
                    className="h-8 rounded-none text-[9px] uppercase font-black tracking-widest gap-1 border-2 border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                  >
                    <UserMinus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="border-2 border-border bg-background/60 backdrop-blur-sm p-6 md:p-8 rounded-none shadow-[12px_12px_0_0_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-10 w-10 bg-primary flex items-center justify-center text-white">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter">
            Minha Rede
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
            Gere as tuas conexões e os perfis que segues.
          </p>
        </div>
      </div>

      <Tabs defaultValue="following" className="w-full">
        <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 h-auto mb-6">
          <TabsTrigger
            value="following"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-black uppercase tracking-widest text-[10px] text-muted-foreground data-[state=active]:text-primary"
          >
            Seguindo ({following.length})
          </TabsTrigger>
          <TabsTrigger
            value="followers"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-black uppercase tracking-widest text-[10px] text-muted-foreground data-[state=active]:text-primary"
          >
            Seguidores ({followers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="following">
          {renderUserList(following, true)}
        </TabsContent>

        <TabsContent value="followers">
          {renderUserList(followers, false)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

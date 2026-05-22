'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userFollower, user } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function toggleFollowUser(targetUserId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: 'Não autorizado. Faça login para seguir outros utilizadores.' };
  }

  const currentUserId = session.user.id;
  if (currentUserId === targetUserId) {
    return { error: 'Não podes seguir-te a ti mesmo.' };
  }

  try {
    // Verificar se o utilizador alvo existe
    const [targetUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, targetUserId))
      .limit(1);

    if (!targetUser) {
      return { error: 'Utilizador não encontrado.' };
    }

    // Verificar se já está a seguir
    const [existingFollow] = await db
      .select()
      .from(userFollower)
      .where(
        and(
          eq(userFollower.followerId, currentUserId),
          eq(userFollower.followingId, targetUserId)
        )
      )
      .limit(1);

    if (existingFollow) {
      // Deixar de seguir
      await db
        .delete(userFollower)
        .where(
          and(
            eq(userFollower.followerId, currentUserId),
            eq(userFollower.followingId, targetUserId)
          )
        );

      revalidatePath(`/user/${targetUserId}`);
      revalidatePath('/profile');
      return { success: true, followed: false };
    } else {
      // Seguir
      await db.insert(userFollower).values({
        followerId: currentUserId,
        followingId: targetUserId,
      });

      revalidatePath(`/user/${targetUserId}`);
      revalidatePath('/profile');
      return { success: true, followed: true };
    }
  } catch (error) {
    console.error('Erro ao seguir/deixar de seguir utilizador:', error);
    return { error: 'Erro interno ao processar a ação.' };
  }
}

export async function getFollowers(userId: string) {
  try {
    const followers = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(userFollower)
      .innerJoin(user, eq(user.id, userFollower.followerId))
      .where(eq(userFollower.followingId, userId));

    return { success: true, data: followers };
  } catch (error) {
    console.error('Erro ao buscar seguidores:', error);
    return { error: 'Erro ao buscar seguidores', data: [] };
  }
}

export async function getFollowing(userId: string) {
  try {
    const following = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(userFollower)
      .innerJoin(user, eq(user.id, userFollower.followingId))
      .where(eq(userFollower.followerId, userId));

    return { success: true, data: following };
  } catch (error) {
    console.error('Erro ao buscar utilizadores seguidos:', error);
    return { error: 'Erro ao buscar utilizadores seguidos', data: [] };
  }
}

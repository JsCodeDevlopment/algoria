'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function requestCreatorRole() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: 'Não autorizado' };

  try {
    const [dbUser] = await db
      .select({ role: user.role, creatorRequestStatus: user.creatorRequestStatus })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!dbUser) return { error: 'Usuário não encontrado' };
    
    if (dbUser.role !== 'USER') {
      return { error: 'Você já possui um cargo privilegiado.' };
    }

    if (dbUser.creatorRequestStatus === 'PENDING') {
      return { error: 'Você já possui uma solicitação pendente.' };
    }

    await db
      .update(user)
      .set({ 
        creatorRequestStatus: 'PENDING',
        updatedAt: new Date() 
      })
      .where(eq(user.id, session.user.id));

    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Erro ao solicitar cargo de criador:', error);
    return { error: 'Erro interno ao processar solicitação' };
  }
}

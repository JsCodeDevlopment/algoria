/**
 * Auth guard para rotas administrativas.
 *
 * Verifica sessão via Better Auth e checa se o user tem role
 * ADMIN ou EDITOR. Retorna os dados da sessão enriquecidos
 * com a role do banco, ou null se não autorizado.
 */
import 'server-only';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export type UserRole = 'USER' | 'CONTRIBUTOR' | 'EDITOR' | 'ADMIN';

export interface AdminSession {
  userId: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
}

/**
 * Retorna a sessão do admin autenticado ou `null` se não tiver permissão.
 * Não redireciona — deixa o caller decidir.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  // Busca role atualizada do banco
  const [dbUser] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!dbUser) return null;

  const role = dbUser.role as UserRole;

  return {
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
    role,
  };
}

/**
 * Guard que redireciona para `/` se o user não tem role ADMIN ou EDITOR.
 * Usa em Server Components de páginas admin.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/admin/content');
  }
  return session;
}

/**
 * Guard que redireciona se o user não é pelo menos CONTRIBUTOR.
 * Usado para rotas do creator studio.
 */
export async function requireContributor(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session || !['ADMIN', 'EDITOR', 'CONTRIBUTOR'].includes(session.role)) {
    redirect('/');
  }
  return session;
}

/** Helper para verificar se um role tem acesso admin total. */
export function isAdminRole(role: UserRole): boolean {
  return role === 'ADMIN';
}

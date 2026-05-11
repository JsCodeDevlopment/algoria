'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  contentReviewComments,
  contents,
  user,
  type contentStatusEnum,
  type userRoleEnum,
} from '@/lib/db/schema';
import { and, count, desc, eq, ilike, sql } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { SYSTEM_TYPES } from '@/lib/content/schemas';

type UserRole = (typeof userRoleEnum.enumValues)[number];
type ContentStatus = (typeof contentStatusEnum.enumValues)[number];

/* ── Helpers ──────────────────────────────────────────────────── */

function sha256(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

async function getAuthenticatedStaff() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const [dbUser] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!dbUser || !['ADMIN', 'EDITOR', 'CONTRIBUTOR'].includes(dbUser.role)) return null;
  return { ...session.user, role: dbUser.role as UserRole };
}

/* ── User Management ─────────────────────────────────────────── */

export async function updateUserRole(targetUserId: string, newRole: UserRole) {
  const admin = await getAuthenticatedStaff();
  if (!admin || !['ADMIN', 'EDITOR'].includes(admin.role)) return { error: 'Não autorizado' };

  // Apenas ADMIN pode promover a ADMIN
  if (newRole === 'ADMIN' && admin.role !== 'ADMIN') {
    return { error: 'Apenas ADMIN pode conceder role ADMIN' };
  }

  // Não pode alterar o próprio role
  if (targetUserId === admin.id) {
    return { error: 'Não é possível alterar o próprio papel' };
  }

  try {
    await db
      .update(user)
      .set({ role: newRole, updatedAt: new Date() })
      .where(eq(user.id, targetUserId));

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar role:', error);
    return { error: 'Erro interno ao atualizar papel' };
  }
}

export async function listUsers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const admin = await getAuthenticatedStaff();
  if (!admin || !['ADMIN', 'EDITOR'].includes(admin.role)) return { error: 'Não autorizado', users: [], total: 0 };

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  try {
    const conditions = params.search
      ? ilike(user.name, `%${params.search}%`)
      : undefined;

    const [totalResult] = await db
      .select({ count: count() })
      .from(user)
      .where(conditions);

    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        creatorRequestStatus: user.creatorRequestStatus,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(conditions)
      .orderBy(desc(user.createdAt))
      .limit(pageSize)
      .offset(offset);

    return {
      users,
      total: totalResult?.count ?? 0,
      page,
      pageSize,
    };
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return { error: 'Erro interno', users: [], total: 0 };
  }
}

export async function approveCreatorRequest(targetUserId: string) {
  const admin = await getAuthenticatedStaff();
  if (!admin || admin.role !== 'ADMIN') return { error: 'Não autorizado' };

  try {
    await db
      .update(user)
      .set({ 
        role: 'EDITOR', 
        creatorRequestStatus: 'APPROVED',
        updatedAt: new Date() 
      })
      .where(eq(user.id, targetUserId));

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Erro ao aprovar solicitação:', error);
    return { error: 'Erro interno ao aprovar' };
  }
}

export async function rejectCreatorRequest(targetUserId: string) {
  const admin = await getAuthenticatedStaff();
  if (!admin || admin.role !== 'ADMIN') return { error: 'Não autorizado' };

  try {
    await db
      .update(user)
      .set({ 
        creatorRequestStatus: 'REJECTED',
        updatedAt: new Date() 
      })
      .where(eq(user.id, targetUserId));

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Erro ao rejeitar solicitação:', error);
    return { error: 'Erro interno ao rejeitar' };
  }
}

/* ── Content Management ──────────────────────────────────────── */

export async function listContents(params: {
  page?: number;
  pageSize?: number;
  type?: string;
  status?: string;
  search?: string;
  tab?: 'editorial' | 'sistema';
}) {
  const admin = await getAuthenticatedStaff();
  if (!admin) return { error: 'Não autorizado', contents: [], total: 0 };

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  try {
    const conditions = [];
    if (params.type) {
      conditions.push(eq(contents.type, params.type as never));
    } else if (params.tab) {
      const { inArray, notInArray } = await import('drizzle-orm');
      if (params.tab === 'sistema') {
        conditions.push(inArray(contents.type, SYSTEM_TYPES as any));
      } else {
        conditions.push(notInArray(contents.type, SYSTEM_TYPES as any));
      }
    }
    
    if (params.status) conditions.push(eq(contents.status, params.status as never));
    if (params.search) {
      conditions.push(
        sql`${contents.title} ILIKE ${`%${params.search}%`} OR ${contents.slug} ILIKE ${`%${params.search}%`}`
      );
    }

    // Role-based filtering: non-admins only see their own content
    if (admin.role !== 'ADMIN') {
      conditions.push(eq(contents.authorId, admin.id));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult] = await db
      .select({ count: count() })
      .from(contents)
      .where(whereClause);

    const rows = await db
      .select({
        id: contents.id,
        slug: contents.slug,
        type: contents.type,
        title: contents.title,
        status: contents.status,
        version: contents.version,
        authorId: contents.authorId,
        authorName: user.name,
        authorImage: user.image,
        publishedAt: contents.publishedAt,
        createdAt: contents.createdAt,
        updatedAt: contents.updatedAt,
      })
      .from(contents)
      .leftJoin(user, eq(contents.authorId, user.id))
      .where(whereClause)
      .orderBy(desc(contents.updatedAt))
      .limit(pageSize)
      .offset(offset);

    return {
      contents: rows,
      total: totalResult?.count ?? 0,
      page,
      pageSize,
    };
  } catch (error) {
    console.error('Erro ao listar conteúdos:', error);
    return { error: 'Erro interno', contents: [], total: 0 };
  }
}

export async function updateContentStatus(contentId: string, newStatus: ContentStatus) {
  const staff = await getAuthenticatedStaff();
  if (!staff) return { error: 'Não autorizado' };

  try {
    const [current] = await db
      .select({ authorId: contents.authorId, status: contents.status })
      .from(contents)
      .where(eq(contents.id, contentId))
      .limit(1);

    if (!current) return { error: 'Conteúdo não encontrado' };

    const isAdmin = staff.role === 'ADMIN';
    const isAuthor = current.authorId === staff.id;

    // Only ADMIN can change to PUBLISHED, REJECTED, APPROVED or CHANGES_REQUESTED for others
    if (['PUBLISHED', 'REJECTED', 'APPROVED', 'CHANGES_REQUESTED'].includes(newStatus) && !isAdmin) {
      return { error: 'Apenas administradores podem realizar esta ação' };
    }

    // Non-admins can only update their own content (to DRAFT or PENDING_REVIEW)
    if (!isAdmin && !isAuthor) {
      return { error: 'Não autorizado a alterar este conteúdo' };
    }

    const updateData: Record<string, unknown> = {
      status: newStatus,
      updatedBy: staff.id,
      updatedAt: new Date(),
    };

    if (newStatus === 'PUBLISHED') {
      updateData.publishedAt = new Date();
    }

    await db
      .update(contents)
      .set(updateData)
      .where(eq(contents.id, contentId));

    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return { error: 'Erro interno ao atualizar status' };
  }
}

export async function getContentById(contentId: string) {
  const staff = await getAuthenticatedStaff();
  if (!staff) return null;

  try {
    const [row] = await db
      .select({
        id: contents.id,
        slug: contents.slug,
        type: contents.type,
        title: contents.title,
        body: contents.body,
        metadata: contents.metadata,
        status: contents.status,
        version: contents.version,
        authorId: contents.authorId,
        updatedBy: contents.updatedBy,
        contentHash: contents.contentHash,
        publishedAt: contents.publishedAt,
        createdAt: contents.createdAt,
        updatedAt: contents.updatedAt,
        authorName: user.name,
        authorImage: user.image,
      })
      .from(contents)
      .leftJoin(user, eq(contents.authorId, user.id))
      .where(eq(contents.id, contentId))
      .limit(1);

    if (!row) return null;

    // Non-admins can only see their own content
    if (staff.role !== 'ADMIN' && row.authorId !== staff.id) {
      return null;
    }

    return row;
  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error);
    return null;
  }
}

/* ── Content CRUD ────────────────────────────────────────────── */

export async function createContent(params: {
  slug: string;
  type: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  publish: boolean;
}) {
  const user = await getAuthenticatedStaff();
  if (!user) return { error: 'Não autorizado' };

  // Restrição de tipo para não-admins
  if (user.role !== 'ADMIN') {
    const allowed = ['interview-en', 'engineering-work'];
    if (!allowed.includes(params.type)) {
      return { error: 'Apenas administradores podem criar este tipo de conteúdo.' };
    }
  }

  // Verificar colisão de slug+type
  const existing = await db
    .select({ id: contents.id })
    .from(contents)
    .where(and(eq(contents.slug, params.slug), eq(contents.type, params.type as never)))
    .limit(1);

  if (existing[0]) {
    return { error: `Já existe um conteúdo com slug "${params.slug}" e tipo "${params.type}".` };
  }

  const hash = sha256(params.body + JSON.stringify(params.metadata));
  const id = crypto.randomUUID();

  try {
    await db.insert(contents).values({
      id,
      slug: params.slug,
      type: params.type as never,
      title: params.title,
      body: params.body,
      metadata: params.metadata,
      status: params.publish ? 'PUBLISHED' : 'DRAFT',
      contentHash: hash,
      authorId: user.id,
      updatedBy: user.id,
      publishedAt: params.publish ? new Date() : null,
    });

    revalidatePath('/admin/content');
    return { success: true, id };
  } catch (error) {
    console.error('Erro ao criar conteúdo:', error);
    return { error: 'Erro interno ao criar conteúdo' };
  }
}

export async function updateContent(
  contentId: string,
  params: {
    title: string;
    body: string;
    metadata: Record<string, unknown>;
    publish: boolean;
  },
) {
  const staff = await getAuthenticatedStaff();
  if (!staff) return { error: 'Não autorizado' };

  try {
    const [existing] = await db
      .select({ 
        version: contents.version, 
        status: contents.status,
        authorId: contents.authorId 
      })
      .from(contents)
      .where(eq(contents.id, contentId))
      .limit(1);

    if (!existing) return { error: 'Conteúdo não encontrado' };

    // Permitir se for dono ou ADMIN
    if (existing.authorId !== staff.id && staff.role !== 'ADMIN') {
      return { error: 'Você não tem permissão para editar este conteúdo.' };
    }

    // Apenas ADMIN pode publicar diretamente no update
    if (params.publish && staff.role !== 'ADMIN') {
      return { error: 'Apenas administradores podem publicar conteúdo.' };
    }

    const hash = sha256(params.body + JSON.stringify(params.metadata));
    const newStatus = params.publish ? 'PUBLISHED' : existing.status;

    await db
      .update(contents)
      .set({
        title: params.title,
        body: params.body,
        metadata: params.metadata,
        status: newStatus,
        contentHash: hash,
        version: existing.version + 1,
        updatedBy: staff.id,
        updatedAt: new Date(),
        ...(params.publish ? { publishedAt: new Date() } : {}),
      })
      .where(eq(contents.id, contentId));

    revalidatePath('/admin/content');
    revalidatePath(`/admin/content/${contentId}/review`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar conteúdo:', error);
    return { error: 'Erro interno ao atualizar conteúdo' };
  }
}

export async function deleteContent(contentId: string) {
  const admin = await getAuthenticatedStaff();
  if (!admin || admin.role !== 'ADMIN') return { error: 'Não autorizado' };

  try {
    await db.delete(contents).where(eq(contents.id, contentId));
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir conteúdo:', error);
    return { error: 'Erro interno ao excluir conteúdo' };
  }
}

/* ── Review Comments ─────────────────────────────────────────── */

export async function addReviewComment(contentId: string, comment: string) {
  const admin = await getAuthenticatedStaff();
  if (!admin) return { error: 'Não autorizado' };

  try {
    await db.insert(contentReviewComments).values({
      contentId,
      authorId: admin.id,
      comment,
    });

    revalidatePath(`/admin/content/${contentId}/review`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    return { error: 'Erro interno ao adicionar comentário' };
  }
}

export async function resolveReviewComment(commentId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: 'Não autenticado' };

  try {
    await db
      .update(contentReviewComments)
      .set({ resolved: true })
      .where(eq(contentReviewComments.id, commentId));

    return { success: true };
  } catch (error) {
    console.error('Erro ao resolver comentário:', error);
    return { error: 'Erro interno' };
  }
}

export async function getReviewComments(contentId: string) {
  try {
    const comments = await db
      .select({
        id: contentReviewComments.id,
        comment: contentReviewComments.comment,
        resolved: contentReviewComments.resolved,
        createdAt: contentReviewComments.createdAt,
        authorId: contentReviewComments.authorId,
        authorName: user.name,
        authorImage: user.image,
      })
      .from(contentReviewComments)
      .innerJoin(user, eq(contentReviewComments.authorId, user.id))
      .where(eq(contentReviewComments.contentId, contentId))
      .orderBy(desc(contentReviewComments.createdAt));

    return comments;
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return [];
  }
}

/* ── Dashboard Stats ─────────────────────────────────────────── */

export async function getDashboardStats() {
  const admin = await getAuthenticatedStaff();
  if (!admin) return null;

  try {
    const [totalUsers] = await db.select({ count: count() }).from(user);
    const [totalContents] = await db.select({ count: count() }).from(contents);
    const [pendingReview] = await db
      .select({ count: count() })
      .from(contents)
      .where(eq(contents.status, 'PENDING_REVIEW'));
    const [publishedContents] = await db
      .select({ count: count() })
      .from(contents)
      .where(eq(contents.status, 'PUBLISHED'));

    // Role distribution
    const roleStats = await db
      .select({
        role: user.role,
        count: count(),
      })
      .from(user)
      .groupBy(user.role);

    return {
      totalUsers: totalUsers?.count ?? 0,
      totalContents: totalContents?.count ?? 0,
      pendingReview: pendingReview?.count ?? 0,
      publishedContents: publishedContents?.count ?? 0,
      roleDistribution: roleStats,
    };
  } catch (error) {
    console.error('Erro ao buscar stats do dashboard:', error);
    return null;
  }
}

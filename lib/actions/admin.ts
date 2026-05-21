'use server';

import { auth } from '@/lib/auth';
import { revalidateContentPaths } from '@/lib/content/revalidate';
import { SYSTEM_TYPES } from '@/lib/content/schemas';
import { db } from '@/lib/db';
import {
  contentReviewComments,
  contents,
  user,
  contentCategories,
  pricingPlans,
  pricingFeatures,
  pricingInventory,
  type contentStatusEnum,
  type ContentType,
  type userRoleEnum
} from '@/lib/db/schema';
import { and, count, desc, eq, ilike, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createHash } from 'node:crypto';
import { requireAdmin } from '@/lib/admin/auth-guard';
import { getContentRepository } from '@/lib/content/content-repository';

type UserRole = (typeof userRoleEnum.enumValues)[number];
type ContentStatus = (typeof contentStatusEnum.enumValues)[number];
const SYSTEM_TYPES_LIST = SYSTEM_TYPES as unknown as ContentType[];

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

/**
 * Sincroniza o conteúdo com a tabela de inventário de pricing.
 * Itens 'pro' ganham um registro, itens 'free' têm seu registro removido.
 */
async function syncPricingInventorySync(contentId: string, access: 'free' | 'pro', type: string) {
  if (access === 'pro') {
    const defaultCategory = 
      type === 'problem' ? 'Problemas Hero' : 
      type === 'concept' ? 'Guias Teóricos' :
      type === 'technical-test' ? 'Simulados Técnicos' :
      type === 'interview-en' ? 'Inglês Técnico' :
      type === 'engineering-work' ? 'Engenharia' :
      'Conteúdo Pro';

    await db.insert(pricingInventory)
      .values({ 
        contentId, 
        pricingCategory: defaultCategory 
      })
      .onConflictDoNothing();
  } else {
    await db.delete(pricingInventory).where(eq(pricingInventory.contentId, contentId));
  }
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
  access?: string;
  category?: string;
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
        conditions.push(inArray(contents.type, SYSTEM_TYPES_LIST));
      } else {
        conditions.push(notInArray(contents.type, SYSTEM_TYPES_LIST));
      }
    }

    if (params.access) {
      conditions.push(eq(contents.access, params.access as never));
    }

    if (params.category) {
      // Filtra dentro do JSONB metadata -> categories
      conditions.push(
        sql`${contents.metadata}->'categories' @> ${JSON.stringify([params.category])}::jsonb`
      );
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
        access: contents.access,
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
      .select({
        authorId: contents.authorId,
        status: contents.status,
        type: contents.type,
        slug: contents.slug,
        metadata: contents.metadata
      })
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

    revalidateContentPaths(current.type, current.slug, current.metadata as Record<string, unknown>);
    revalidatePath(`/admin/content/${contentId}/edit`);
    revalidatePath(`/admin/content/${contentId}/review`);
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
        access: contents.access,
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
    const access = (params.metadata.access as 'free' | 'pro') || 'free';

    await db.insert(contents).values({
      id,
      slug: params.slug,
      type: params.type as never,
      title: params.title,
      body: params.body,
      metadata: params.metadata,
      access,
      status: params.publish ? 'PUBLISHED' : 'DRAFT',
      contentHash: hash,
      authorId: user.id,
      updatedBy: user.id,
      publishedAt: params.publish ? new Date() : null,
    });

    await syncPricingInventorySync(id, access, params.type);

    revalidateContentPaths(params.type as ContentType, params.slug, params.metadata);
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
        authorId: contents.authorId,
        type: contents.type,
        slug: contents.slug,
        access: contents.access,
        metadata: contents.metadata
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

    const access = (params.metadata.access as 'free' | 'pro') || existing.access;

    await db
      .update(contents)
      .set({
        title: params.title,
        body: params.body,
        metadata: params.metadata,
        access,
        status: newStatus,
        contentHash: hash,
        version: existing.version + 1,
        updatedBy: staff.id,
        updatedAt: new Date(),
        ...(params.publish ? { publishedAt: new Date() } : {}),
      })
      .where(eq(contents.id, contentId));

    await syncPricingInventorySync(contentId, access, existing.type);

    revalidateContentPaths(existing.type, existing.slug, params.metadata);
    revalidatePath(`/admin/content/${contentId}/edit`);
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
    const [existing] = await db
      .select({ type: contents.type, slug: contents.slug, metadata: contents.metadata })
      .from(contents)
      .where(eq(contents.id, contentId))
      .limit(1);

    if (existing) {
      await db.delete(contents).where(eq(contents.id, contentId));
      revalidateContentPaths(existing.type, existing.slug, existing.metadata as Record<string, unknown>);
    }
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

/* ── Category Management ─────────────────────────────────────── */

export async function listCategories() {
  const staff = await getAuthenticatedStaff();
  if (!staff) return [];

  try {
    const rows = await db
      .select()
      .from(contentCategories)
      .orderBy(contentCategories.name);
    return rows;
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return [];
  }
}

export async function createCategory(params: { name: string; slug: string; description?: string }) {
  const admin = await getAuthenticatedStaff();
  if (!admin || admin.role !== 'ADMIN') return { error: 'Não autorizado' };

  try {
    await db.insert(contentCategories).values({
      name: params.name,
      slug: params.slug,
      description: params.description,
    });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return { error: 'Erro ao criar categoria. Talvez o nome/slug já exista.' };
  }
}

export async function updateCategory(id: string, params: { name: string; slug: string; description?: string }) {
  const admin = await getAuthenticatedStaff();
  if (!admin || admin.role !== 'ADMIN') return { error: 'Não autorizado' };

  try {
    await db
      .update(contentCategories)
      .set({
        name: params.name,
        slug: params.slug,
        description: params.description,
        updatedAt: new Date(),
      })
      .where(eq(contentCategories.id, id));
    
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return { error: 'Erro ao atualizar categoria' };
  }
}

export async function deleteCategory(id: string) {
  const admin = await getAuthenticatedStaff();
  if (!admin || admin.role !== 'ADMIN') return { error: 'Não autorizado' };

  try {
    await db.delete(contentCategories).where(eq(contentCategories.id, id));
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return { error: 'Erro ao excluir categoria' };
  }
}

// Atualizado para usar a nova tabela oficial
export async function getTechnicalTestTopics() {
  const staff = await getAuthenticatedStaff();
  if (!staff) return [];

  try {
    const rows = await db
      .select({ name: contentCategories.name })
      .from(contentCategories)
      .orderBy(contentCategories.name);
    
    return rows.map(r => r.name);
  } catch (error) {
    console.error('Erro ao buscar tópicos oficiais:', error);
    return [];
  }
}

export async function updateContentAccess(id: string, access: 'free' | 'pro') {
  const admin = await requireAdmin();
  if (!admin) return { error: 'Não autorizado' };

  try {
    const [existing] = await db.select().from(contents).where(eq(contents.id, id)).limit(1);
    if (!existing) return { error: 'Conteúdo não encontrado' };

    // Update both column and metadata JSON for consistency
    const newMetadata = {
      ...(existing.metadata as Record<string, unknown>),
      access,
    };

    await db
      .update(contents)
      .set({
        access,
        metadata: newMetadata,
        updatedBy: admin.userId,
        updatedAt: new Date(),
      })
      .where(eq(contents.id, id));

    await syncPricingInventorySync(id, access, existing.type);

    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    console.error('Error updating content access:', error);
    return { error: 'Erro ao atualizar acesso' };
  }
}

export async function getContentAccessCountsAction() {
  const staff = await getAuthenticatedStaff();
  if (!staff) return null;

  const repo = getContentRepository();
  return await repo.getContentCountsByAccess();
}

/* ── Pricing Management ───────────────────────────────────────── */

export async function getPricingPlans() {
  const staff = await getAuthenticatedStaff();
  if (!staff) return [];

  const plans = await db.select().from(pricingPlans).orderBy(pricingPlans.id);
  
  // Se não houver planos, criar padrões iniciais
  if (plans.length === 0) {
    const defaults = [
      { id: 'free', title: 'Plano Gratuito', description: 'Ideal para experimentares o método Algoria.' },
      { id: 'pro', title: 'Plano Pro', description: 'Desbloqueia a experiência completa.', priceDisplay: '19€', yearlyNote: 'Ou 190€/ano' }
    ];
    for (const d of defaults) {
      await db.insert(pricingPlans).values(d).onConflictDoNothing();
    }
    return db.select().from(pricingPlans).orderBy(pricingPlans.id);
  }

  return plans;
}

export async function updatePricingPlan(id: string, data: Partial<typeof pricingPlans.$inferInsert>) {
  const admin = await requireAdmin();
  if (!admin) return { error: 'Não autorizado' };

  await db.update(pricingPlans)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(pricingPlans.id, id));
  
  revalidatePath('/pricing');
  revalidatePath('/admin/pricing');
  return { success: true };
}

export async function getPricingFeatures(planId: string) {
  return db.select().from(pricingFeatures).where(eq(pricingFeatures.planId, planId)).orderBy(pricingFeatures.order);
}

export async function addPricingFeature(planId: string, type: 'manual' | 'automatic', label?: string, categoryName?: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: 'Não autorizado' };

  await db.insert(pricingFeatures).values({
    planId,
    type,
    label,
    categoryName,
    order: 0
  });

  revalidatePath('/pricing');
  revalidatePath('/admin/pricing');
  return { success: true };
}

export async function updatePricingFeature(id: string, label: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: 'Não autorizado' };

  await db.update(pricingFeatures)
    .set({ label })
    .where(eq(pricingFeatures.id, id));
  
  revalidatePath('/pricing');
  return { success: true };
}

export async function removePricingFeature(id: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: 'Não autorizado' };

  await db.delete(pricingFeatures).where(eq(pricingFeatures.id, id));
  
  revalidatePath('/pricing');
  revalidatePath('/admin/pricing');
  return { success: true };
}

export async function getPricingInventory() {
  const staff = await getAuthenticatedStaff();
  if (!staff) return [];

  return db.select({
    id: pricingInventory.id,
    contentId: pricingInventory.contentId,
    pricingCategory: pricingInventory.pricingCategory,
    createdAt: pricingInventory.createdAt,
    contentTitle: contents.title,
    contentType: contents.type,
    contentSlug: contents.slug,
    metadata: contents.metadata
  })
  .from(pricingInventory)
  .innerJoin(contents, eq(pricingInventory.contentId, contents.id))
  .orderBy(desc(pricingInventory.createdAt));
}

export async function updateInventoryCategory(id: string, category: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: 'Não autorizado' };

  await db.update(pricingInventory)
    .set({ pricingCategory: category })
    .where(eq(pricingInventory.id, id));

  revalidatePath('/pricing');
  return { success: true };
}

export async function getPricingSummary() {
  const staff = await getAuthenticatedStaff();
  if (!staff) return { pro: [], free: [] };

  // Sumário PRO (do Inventário de Marketing)
  const proRows = await db.select({
    category: pricingInventory.pricingCategory,
    count: count()
  })
  .from(pricingInventory)
  .groupBy(pricingInventory.pricingCategory);

  // Sumário FREE (do Conteúdo Geral)
  const freeRows = await db.select({
    type: contents.type,
    count: count()
  })
  .from(contents)
  .where(eq(contents.access, 'free'))
  .groupBy(contents.type);

  // Mapear tipos de conteúdo para nomes amigáveis para o Free
  const typeLabels: Record<string, string> = {
    'problem': 'Problemas',
    'concept': 'Guias Teóricos',
    'technical-test': 'Simulados',
    'interview-en': 'Inglês',
    'engineering-work': 'Engenharia'
  };

  return {
    pro: proRows,
    free: freeRows.map(r => ({
      label: typeLabels[r.type] || r.type,
      count: r.count
    }))
  };
}

/**
 * Utilitário para forçar a sincronização de tudo que já é PRO hoje.
 */
export async function syncAllProContent() {
  const admin = await requireAdmin();
  if (!admin) return { error: 'Não autorizado' };

  const proContents = await db.select().from(contents).where(eq(contents.access, 'pro'));
  
  for (const c of proContents) {
    await syncPricingInventorySync(c.id, 'pro', c.type);
  }

  return { success: true, count: proContents.length };
}

export async function importContent(params: {
  title: string;
  slug: string;
  type: string;
  body: string;
  publish?: boolean;
  meta: Record<string, unknown>;
}) {
  const staff = await getAuthenticatedStaff();
  if (!staff) return { error: 'Não autorizado' };

  if (staff.role !== 'ADMIN' && staff.role !== 'EDITOR') {
    return { error: 'Apenas administradores e editores podem importar conteúdo.' };
  }

  if (!params.title || !params.slug || !params.type || !params.body) {
    return { error: 'Campos obrigatórios ausentes: title, slug, type, body.' };
  }

  const allowedTypes = ['problem', 'concept', 'interview-en', 'engineering-work', 'course', 'technical-test'];
  if (!allowedTypes.includes(params.type)) {
    return { error: `Tipo de conteúdo inválido: ${params.type}` };
  }

  const existing = await db
    .select({
      id: contents.id,
      authorId: contents.authorId,
      version: contents.version,
      access: contents.access,
      status: contents.status
    })
    .from(contents)
    .where(and(eq(contents.slug, params.slug), eq(contents.type, params.type as never)))
    .limit(1);

  const hash = sha256(params.body + JSON.stringify(params.meta));
  const access = (params.meta.access as 'free' | 'pro') || 'free';
  const status = params.publish ? 'PUBLISHED' : 'DRAFT';

  try {
    if (existing[0]) {
      const record = existing[0];
      await db
        .update(contents)
        .set({
          title: params.title,
          body: params.body,
          metadata: params.meta,
          access,
          status: params.publish ? 'PUBLISHED' : record.status,
          contentHash: hash,
          version: record.version + 1,
          updatedBy: staff.id,
          updatedAt: new Date(),
          ...(params.publish ? { publishedAt: new Date() } : {}),
        })
        .where(eq(contents.id, record.id));

      await syncPricingInventorySync(record.id, access, params.type);
      return { success: true, action: 'updated', id: record.id };
    } else {
      const id = crypto.randomUUID();
      await db.insert(contents).values({
        id,
        slug: params.slug,
        type: params.type as never,
        title: params.title,
        body: params.body,
        metadata: params.meta,
        access,
        status,
        contentHash: hash,
        authorId: staff.id,
        updatedBy: staff.id,
        publishedAt: params.publish ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await syncPricingInventorySync(id, access, params.type);
      return { success: true, action: 'created', id };
    }
  } catch (error: any) {
    console.error('Error importing content:', error);
    return { error: `Erro no banco de dados: ${error.message}` };
  }
}


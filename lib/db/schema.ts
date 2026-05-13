import { boolean, integer, json, pgEnum, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

/* ── Enums ────────────────────────────────────────────────────────── */

export const userRoleEnum = pgEnum('user_role', ['USER', 'CONTRIBUTOR', 'EDITOR', 'ADMIN']);

export const contentStatusEnum = pgEnum('content_status', [
  'DRAFT',
  'PENDING_REVIEW',
  'CHANGES_REQUESTED',
  'APPROVED',
  'PUBLISHED',
  'REJECTED',
]);

export const contentAccessEnum = pgEnum('content_access', ['free', 'pro']);

export const creatorRequestStatusEnum = pgEnum('creator_request_status', [
  'NONE',
  'PENDING',
  'APPROVED',
  'REJECTED',
]);

export const contentTypeEnum = pgEnum('content_type', [
  'problem',
  'concept',
  'interview-en',
  'engineering-work',
  'track',
  'course',
  'technical-test',
  'changelog',
  'legal-page',
  'landing-section',
  'pricing-copy',
  'navigation',
  'taxonomy',
]);

export type ContentType = (typeof contentTypeEnum.enumValues)[number];

export const technicalAssessmentResults = pgTable('technical_assessment_results', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  testSlug: text('testSlug').notNull(),
  testTitle: text('testTitle').notNull(),
  track: text('track').notNull(),
  level: text('level').notNull(),
  language: text('language').notNull().default('javascript'),
  quizScore: integer('quizScore').notNull(),
  totalQuestions: integer('totalQuestions').notNull(),
  codePassed: boolean('codePassed').notNull(),
  resolutionCode: text('resolutionCode'),
  isPublic: boolean('isPublic').notNull().default(false),
  explanation: text('explanation'),
  completedAt: timestamp('completedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});



/** Tabelas core do Better Auth (nomes de campos alinhados ao adapter Drizzle). */
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: userRoleEnum('role').notNull().default('USER'),
  creatorRequestStatus: creatorRequestStatusEnum('creator_request_status').notNull().default('NONE'),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt', { mode: 'date', withTimezone: true }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt', { mode: 'date', withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', { mode: 'date', withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt', { mode: 'date', withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const subscription = pgTable('subscription', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  stripeCustomerId: text('stripeCustomerId').notNull().unique(),
  stripeSubscriptionId: text('stripeSubscriptionId'),
  status: text('status').notNull(),
  currentPeriodEnd: timestamp('currentPeriodEnd', { mode: 'date', withTimezone: true }),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const userProgress = pgTable('user_progress', {
  userId: text('userId')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  data: text('data').notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const authSchema = {
  user,
  session,
  account,
  verification,
};

export const userProfile = pgTable('user_profile', {
  userId: text('userId')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  headline: text('headline'),
  bio: text('bio'),
  technologies: text('technologies').array(),
  githubUrl: text('githubUrl'),
  linkedinUrl: text('linkedinUrl'),
  experiences: text('experiences'), // JSON string of professional experiences
  projects: text('projects'), // JSON string of projects
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

/* ── Content tables (migration + CMS) ─────────────────────────────── */

export const contents = pgTable(
  'contents',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text('slug').notNull(),
    type: contentTypeEnum('type').notNull(),
    title: text('title').notNull(),
    /** Markdown bruto — fonte canônica de conteúdo. */
    body: text('body').notNull().default(''),
    /** Metadados estruturados por tipo (ex: difficulty, categories, examples). */
    metadata: json('metadata').$type<Record<string, unknown>>().default({}),
    access: contentAccessEnum('access').notNull().default('free'),
    status: contentStatusEnum('status').notNull().default('DRAFT'),
    version: integer('version').notNull().default(1),
    authorId: text('authorId').references(() => user.id, { onDelete: 'set null' }),
    updatedBy: text('updatedBy').references(() => user.id, { onDelete: 'set null' }),
    /** Hash SHA-256 do body para auditoria e idempotência de import. */
    contentHash: text('contentHash'),
    publishedAt: timestamp('publishedAt', { mode: 'date', withTimezone: true }),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('contents_slug_type_idx').on(table.slug, table.type)],
);

export const contentReviewComments = pgTable('content_review_comments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  contentId: text('contentId')
    .notNull()
    .references(() => contents.id, { onDelete: 'cascade' }),
  authorId: text('authorId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  comment: text('comment').notNull(),
  resolved: boolean('resolved').notNull().default(false),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const contentCategories = pgTable('content_categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

/* ── Pricing & Plans ─────────────────────────────────────────────── */

export const pricingPlans = pgTable('pricing_plans', {
  id: text('id').primaryKey(), // 'free', 'pro'
  title: text('title').notNull(),
  description: text('description'),
  priceDisplay: text('priceDisplay'), // e.g. "19€"
  yearlyNote: text('yearlyNote'), // e.g. "Ou 190€/ano"
  updatedAt: timestamp('updatedAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

export const pricingFeatures = pgTable('pricing_features', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  planId: text('planId').notNull().references(() => pricingPlans.id, { onDelete: 'cascade' }),
  type: text('type').notNull().default('manual'), // 'manual' | 'automatic'
  label: text('label'), // For manual perks
  categoryName: text('categoryName'), // For automatic counts grouping
  order: integer('order').notNull().default(0),
});

/**
 * Tabela que espelha os conteúdos PRO para fins de marketing e precificação.
 * Sincronizada automaticamente com a tabela contents.
 */
export const pricingInventory = pgTable('pricing_inventory', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  contentId: text('contentId')
    .notNull()
    .unique()
    .references(() => contents.id, { onDelete: 'cascade' }),
  /** Categoria de exibição amigável no pricing (ex: "Estruturas de Dados") */
  pricingCategory: text('pricingCategory').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
});

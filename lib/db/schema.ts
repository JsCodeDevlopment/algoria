import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

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

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  passwordHash: text('password_hash').notNull(),
  plan: text('plan').notNull().default('free'),
  stripeCustomerId: text('stripe_customer_id'),
  preferredAiModel: text('preferred_ai_model').default('gpt-4'),
  settings: text('settings', { mode: 'json' }).default('{}'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Content table
export const content = sqliteTable('content', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  body: text('body').notNull(),
  platform: text('platform').notNull(),
  contentType: text('content_type').notNull(),
  tone: text('tone').notNull(),
  metadata: text('metadata', { mode: 'json' }).notNull(),
  aiModel: text('ai_model'),
  tokensUsed: integer('tokens_used'),
  cost: real('cost'),
  status: text('status').notNull().default('draft'),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Subscriptions table
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  stripeSubscriptionId: text('stripe_subscription_id').notNull(),
  plan: text('plan').notNull(),
  status: text('status').notNull(),
  currentPeriodStart: integer('current_period_start', { mode: 'timestamp' }).notNull(),
  currentPeriodEnd: integer('current_period_end', { mode: 'timestamp' }).notNull(),
  cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Usage tracking table
export const usage = sqliteTable('usage', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  month: text('month').notNull(), // YYYY-MM format
  contentGenerations: integer('content_generations').default(0),
  tokensUsed: integer('tokens_used').default(0),
  cost: real('cost').default(0),
  plan: text('plan').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Templates table
export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  industry: text('industry'),
  platform: text('platform').notNull(),
  contentType: text('content_type').notNull(),
  prompt: text('prompt').notNull(),
  variables: text('variables', { mode: 'json' }).notNull(),
  usageCount: integer('usage_count').default(0),
  isPublic: integer('is_public', { mode: 'boolean' }).default(true),
  createdBy: text('created_by').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Analytics table
export const analytics = sqliteTable('analytics', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  contentId: text('content_id').references(() => content.id),
  platform: text('platform').notNull(),
  metric: text('metric').notNull(), // views, likes, shares, comments, etc.
  value: integer('value').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Trends table
export const trends = sqliteTable('trends', {
  id: text('id').primaryKey(),
  keyword: text('keyword').notNull(),
  platform: text('platform').notNull(),
  volume: integer('volume').notNull(),
  growth: real('growth').notNull(),
  sentiment: text('sentiment').notNull(),
  relatedKeywords: text('related_keywords', { mode: 'json' }).notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Instagram insights table
export const instagramInsights = sqliteTable('instagram_insights', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  postId: text('post_id').notNull(),
  impressions: integer('impressions').notNull(),
  reach: integer('reach').notNull(),
  engagement: integer('engagement').notNull(),
  likes: integer('likes').notNull(),
  comments: integer('comments').notNull(),
  shares: integer('shares').notNull(),
  saves: integer('saves').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Sessions table for authentication
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// API keys table
export const apiKeys = sqliteTable('api_keys', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  key: text('key').notNull().unique(),
  permissions: text('permissions', { mode: 'json' }).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  lastUsed: integer('last_used', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Webhooks table
export const webhooks = sqliteTable('webhooks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  url: text('url').notNull(),
  events: text('events', { mode: 'json' }).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  secret: text('secret').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Usage = typeof usage.$inferSelect;
export type NewUsage = typeof usage.$inferInsert;
export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
export type Analytics = typeof analytics.$inferSelect;
export type NewAnalytics = typeof analytics.$inferInsert;
export type Trend = typeof trends.$inferSelect;
export type NewTrend = typeof trends.$inferInsert;
export type InstagramInsight = typeof instagramInsights.$inferSelect;
export type NewInstagramInsight = typeof instagramInsights.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
export type Webhook = typeof webhooks.$inferSelect;
export type NewWebhook = typeof webhooks.$inferInsert; 
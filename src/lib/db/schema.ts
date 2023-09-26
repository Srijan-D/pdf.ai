import { integer, pgTable, serial, text, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['user', 'system'])

export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    pdfName: text('pdf_name').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    fileKey: text('file_key').notNull(),
})
export type DrizzleChat = typeof chats.$inferSelect


export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),//each chat id
    chatId: integer('chat_id').references(() => chats.id).notNull(),//one to many function each chat belongs to single pdf
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    role: userSystemEnum('role').notNull(),
})


export const userSubscriptions = pgTable('user_subscriptions', {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull().unique(),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).notNull().unique(),
    subscriptionId: varchar('subscription_id', { length: 255 }).unique(),
    stripePriceId: varchar('stripe_price_id', { length: 255 }),
    stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
})

// drizzle orm is what interacts with the database

//drizzle kit is used for migrations 
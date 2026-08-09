import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

export const counterSchema = pgTable('counter', {
  id: serial('id').primaryKey(),
  count: integer('count').default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

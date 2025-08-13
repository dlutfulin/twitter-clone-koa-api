import { integer, pgTable, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  is_active: boolean().default(true),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
import {
  integer,
  pgTable,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  is_active: boolean().default(true),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  avatarS3Key: varchar("avatar_s3_key", { length: 500 }),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar({ length: 500 }).notNull().unique(),
  expires_at: timestamp().notNull(),
  is_revoked: boolean().default(false).notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: varchar({ length: 280 }).notNull(),
  media_url: varchar({ length: 500 }),
  likes_count: integer().default(0).notNull(),
  retweets_count: integer().default(0).notNull(),
  comments_count: integer().default(0).notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  mediaS3Key: varchar("media_s3_key", { length: 500 }),
});

export const likes = pgTable("likes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  post_id: integer()
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }), 
  created_at: timestamp("created_at").defaultNow().notNull(),
});


export const notifications = pgTable("notifications", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  actor_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar({ length: 50 }).notNull(),
  post_id: integer().references(() => posts.id, { onDelete: "cascade" }),
  message: varchar({ length: 500 }).notNull(),
  is_read: boolean().default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const retweets = pgTable("retweets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  post_id: integer()
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  post_id: integer()
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  content: varchar({ length: 500 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});


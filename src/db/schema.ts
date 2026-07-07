import { pgTable, uuid, text, numeric, timestamp, integer } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  color: text("color").notNull().default("#6366f1"),
  icon: text("icon").default("tag"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique(),
  monthlyLimit: numeric("monthly_limit", { precision: 12, scale: 2 }).notNull().default("5000"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;

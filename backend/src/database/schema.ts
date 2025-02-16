import { relations } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { pgTable, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export const userRoleEnum = pgEnum("user_role", [UserRole.ADMIN, UserRole.USER]);

export const userTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  googleId: varchar("googleId", { length: 255 }),
  facebookId: varchar("facebookId", { length: 255 }),
  is2FAEnabled: boolean("is2FAEnabled").default(false),
  twoFactorSecret: varchar("twoFactorSecret", { length: 255 }),
  role: userRoleEnum("role").notNull().default(UserRole.USER),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const emailTable = pgTable("emails", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => userTable.id),
  mailId: varchar("mailId", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const blacklistTable = pgTable("blacklist", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 300 }),
});

export const userRelations = relations(userTable, ({ many }) => ({
  emails: many(emailTable),
}));

export const emailRelations = relations(emailTable, ({ one }) => ({
  user: one(userTable, {
    fields: [emailTable.userId],
    references: [userTable.id],
  }),
}));

export type InsertUser = (typeof userTable.$inferInsert & { password: string; googleId?: never }) | (typeof userTable.$inferInsert & { googleId: string; password?: never });

export type InsertEmail = typeof emailTable.$inferInsert;
export type InsertBlacklist = typeof blacklistTable.$inferInsert;

export type User = typeof userTable.$inferSelect;
export type Email = typeof emailTable.$inferSelect;
export type Blacklist = typeof blacklistTable.$inferSelect;

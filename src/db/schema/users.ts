import { pgTable, uuid, varchar, timestamp, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";

export const userRoles = pgEnum("user_roles", ["admin", "manager", "user"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});


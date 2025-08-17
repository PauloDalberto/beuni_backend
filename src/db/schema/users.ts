import { pgTable, uuid, varchar, timestamp, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const userRoles = pgEnum("user_roles", ["admin", "manager", "user"]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    organization_id: uuid("organization_id").notNull().references(() => organizations.id),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    role: userRoles("role").default("user").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueEmailPerOrg: uniqueIndex("user_email_org_unique").on(table.organization_id, table.email),
  })
);

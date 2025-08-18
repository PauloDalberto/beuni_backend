import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { userRoles, users } from "./users";
import { organizations } from "./organizations";

export const usersOrganizations = pgTable("users_organizations", {
  userId: uuid("user_id").notNull().references(() => users.id),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  role: userRoles("role").default("user").notNull(),
}, (table) => ({
  pk: primaryKey({
    columns: [table.userId, table.organizationId],
  })
}));

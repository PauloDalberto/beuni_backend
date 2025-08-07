import { pgTable, uuid, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  organization_id: uuid("organization_id").notNull().references(() => organizations.id),
  name: varchar("name", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  }, 
  (table) => ({
    uniqueDepartmentNamePerOrg: uniqueIndex("department_name_org_id_unique").on(
      table.organization_id,
      table.name
    ),
  })
);

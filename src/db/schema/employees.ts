import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { departments } from "./departments";

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  organization_id: uuid("organization_id").notNull().references(() => organizations.id),
  department_id: uuid("department_id").references(() => departments.id),
  name: varchar("name", { length: 100 }).notNull(),
  birth_date: date("birth_date").notNull(),
  job_title: varchar("job_title", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});


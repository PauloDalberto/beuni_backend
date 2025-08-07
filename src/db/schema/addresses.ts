import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { employees } from "./employees";

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  cep: varchar("cep", { length: 9 }).notNull(),
  street: varchar("street", { length: 255 }).notNull(),
  number: varchar("number", { length: 20 }).notNull(),
  complement: varchar("complement", { length: 100 }),
  neighborhood: varchar("neighborhood", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  employee_id: uuid("employee_id").references(() => employees.id)
});

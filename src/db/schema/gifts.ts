import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { organizations } from "./organizations";

export const giftStatus = pgEnum("gift_status", ["pending", "sent", "delivered"]);

export const gifts = pgTable("gifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  employee_id: uuid("employee_id").notNull().references(() => employees.id),
  organization_id: uuid("organization_id").notNull().references(() => organizations.id),
  gift_type: varchar("gift_type", { length: 100 }).notNull(),
  status: giftStatus("status").default("pending").notNull(),
  send_date: date("send_date").notNull(),
  delivery_date: date("delivery_date"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

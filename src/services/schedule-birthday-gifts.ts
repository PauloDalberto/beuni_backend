import { db } from "../db/connection";
import { schema } from "../db/schema";
import { addBusinessDays, format } from "date-fns";
import { sql, eq } from "drizzle-orm";

export async function sendBirthdayGifts() {
  const today = new Date();

  const targetDate = addBusinessDays(today, 7);
  const targetDateStr = format(targetDate, "yyyy-MM-dd");

  const employeesToSend = await db
    .select()
    .from(schema.employees)
    .where(sql`TO_CHAR(${schema.employees.birth_date}, 'MM-DD') = TO_CHAR(${targetDateStr}::date, 'MM-DD')`);

  for (const employee of employeesToSend) {
    await db
      .update(schema.gifts)
      .set({
        status: "sent",
        send_date: format(today, "yyyy-MM-dd")
      })
      .where(eq(schema.gifts.employee_id, employee.id));
  }
}

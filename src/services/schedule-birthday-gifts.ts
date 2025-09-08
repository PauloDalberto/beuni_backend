import { db } from "../db/connection";
import { schema } from "../db/schema";
import { format } from "date-fns";
import { eq, and, lte } from "drizzle-orm";

export async function sendBirthdayGifts() {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const giftsToSend = await db
    .select()
    .from(schema.gifts)
    .where(
      and(
        eq(schema.gifts.status, "pending"),
        lte(schema.gifts.send_date, todayStr)
      )
    );

  for (const gift of giftsToSend) {
    await db
      .update(schema.gifts)
      .set({ status: "sent" })
      .where(eq(schema.gifts.id, gift.id));
  }

  return giftsToSend.length;
}

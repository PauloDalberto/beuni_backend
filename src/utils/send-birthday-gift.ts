import cron from "node-cron";
import { sendBirthdayGifts } from "../services/schedule-birthday-gifts";

cron.schedule("0 8 * * *", async () => {
  try {
    const updated = await sendBirthdayGifts();
    console.log(`${updated} gifts enviados hoje.`);
  } catch (error) {
    console.error("Erro no cron:", error);
  }
});

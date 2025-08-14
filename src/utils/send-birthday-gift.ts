import cron from "node-cron";
import { sendBirthdayGifts } from "../services/schedule-birthday-gifts";

cron.schedule("0 8 * * *", async () => {
  try {
    await sendBirthdayGifts()
  } catch (error) {
    console.log(error)
    throw new Error("Error cron")
  }
})


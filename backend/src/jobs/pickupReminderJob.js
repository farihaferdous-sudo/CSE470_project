import cron from "node-cron";
import Food from "../models/Food.js";

cron.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();
    const reminderTimeStart = new Date(now.getTime() + 25 * 60 * 1000);
    const reminderTimeEnd   = new Date(now.getTime() + 30 * 60 * 1000);

    const foods = await Food.find({
      status: "claimed",
      pickupReminderSent: false,
      pickupTime: {
        $gte: reminderTimeStart,
        $lte: reminderTimeEnd
      }
    });

    for (const food of foods) {
      // TEMP: console notification (replace with email later)
      console.log("🔔 PICKUP REMINDER");
      console.log("Food:", food.foodType);
      console.log("Donor ID:", food.donorId);
      console.log("Receiver ID:", food.receiverId);
      console.log("Pickup Time:", food.pickupTime);

      food.pickupReminderSent = true;
      await food.save();
    }
  } catch (error) {
    console.error("Pickup reminder job failed:", error);
  }
});

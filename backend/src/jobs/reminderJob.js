import cron from "node-cron";
import Food from "../models/Food.js";
import axios from "axios"; // we'll call our own API to add notifications

// ---------- Function to send a reminder notification ----------
const sendReminder = async (food, message) => {
  try {
    if (!food) return;

    // Donor notification
    if (food.donorId) {
      await axios.post(`http://localhost:5001/api/user/${food.donorId}/notifications`, {
        notification: {
          message,
          createdAt: new Date()
        }
      });
    }

    // Recipient notification
    if (food.recipientId) {
      await axios.post(`http://localhost:5001/api/user/${food.recipientId}/notifications`, {
        notification: {
          message,
          createdAt: new Date()
        }
      });
    }

    // Mark reminder as sent
    food.reminderSent = true;
    await food.save();
  } catch (err) {
    console.error("Error sending reminder for food:", food._id, err.message);
  }
};

// ---------- Function to schedule a single notification ----------
export const scheduleNotification = async (userId, message, pickupTime, minutesBefore = 30) => {
  try {
    const scheduleTime = new Date(new Date(pickupTime).getTime() - minutesBefore * 60 * 1000);
    const now = new Date();

    if (scheduleTime <= now) {
      // Send immediately if time passed
      await axios.post(`http://localhost:5001/api/user/${userId}/notifications`, {
        notification: {
          message,
          createdAt: new Date()
        }
      });
    } else {
      // Schedule with cron
      const cronTime = `${scheduleTime.getMinutes()} ${scheduleTime.getHours()} ${scheduleTime.getDate()} ${scheduleTime.getMonth() + 1} *`;
      cron.schedule(cronTime, async () => {
        await axios.post(`http://localhost:5001/api/user/${userId}/notifications`, {
          notification: {
            message,
            createdAt: new Date()
          }
        });
      });
    }
  } catch (err) {
    console.error("Error scheduling notification:", err.message);
  }
};

// ---------- Cron job to check for upcoming pickups every 5 minutes ----------
export const startReminderJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Checking for upcoming pickups...");
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 mins from now

    try {
      const foods = await Food.find({
        status: "available",
        pickupTime: { $gte: now, $lte: reminderTime },
        reminderSent: false
      });

      for (let food of foods) {
        const donorMessage = `Reminder: Your food donation (${food.foodType}) is scheduled for pickup at ${new Date(food.pickupTime).toLocaleString()}`;
        const receiverMessage = `Reminder: You have a food pickup (${food.foodType}) scheduled at ${new Date(food.pickupTime).toLocaleString()}`;
        await sendReminder(food, donorMessage);
        await sendReminder(food, receiverMessage);
      }

      if (foods.length > 0) {
        console.log(`Sent reminders for ${foods.length} food(s).`);
      }
    } catch (err) {
      console.error("Error fetching foods for reminders:", err.message);
    }
  });
};

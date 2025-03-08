const cron = require("node-cron");
const Message = require("../models/message-model");

// Runs every hour to delete expired messages
cron.schedule("0 * * * *", async () => {
  try {
    console.log("Running cron job: Deleting expired messages...");

    const now = new Date();
    const result = await Message.deleteMany({ expiresAt: { $lt: now } });

    console.log(`Deleted ${result.deletedCount} expired messages.`);
  } catch (error) {
    console.error("Error deleting expired messages:", error);
  }
});

module.exports = cron;

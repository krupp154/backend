const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Stranger", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Stranger", required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true }, // Auto-delete in 24 hours
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;

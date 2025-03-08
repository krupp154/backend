const mongoose = require("mongoose");
const Message = require("../models/message-model");

const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ message: "Invalid sender or receiver ID" });
    }

    const message = new Message({
      sender: new mongoose.Types.ObjectId(sender),
      receiver: new mongoose.Types.ObjectId(receiver),
      content,
      isRead: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Auto-delete in 24 hours
    });

    await message.save();
    res.status(201).json({ message });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


// Read & Delete Message
const readMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message expired or not found" });
    res.json({ message: message.content });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMessageAfterSeen = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    
    if (!message) return res.status(404).json({ message: "Message not found or already deleted" });

    await message.deleteOne(); // Delete the message after reading
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { sendMessage, readMessage, deleteMessageAfterSeen };

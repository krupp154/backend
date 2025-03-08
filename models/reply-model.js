const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  like: { type: Number },
  dislike: { type: Number },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;

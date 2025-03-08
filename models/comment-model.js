const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  like:{type:Number},
  dislike:{type:Number},
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Add this line
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

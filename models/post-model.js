const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

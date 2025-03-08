const Reply = require("../models/reply-model");
const Comment = require("../models/comment-model");

const addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    const reply = new Reply({ content, comment: comment._id });
    await reply.save();
    comment.replies.push(reply._id); // Use the correct field name "replies"
    await comment.save();
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getReply = async (req,res)=>{
  try {
    const replies = await Reply.find({comment:req.params.commentId});
    res.status(200).json(replies)
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

//get all reply on one comment

module.exports = { addReply, getReply};

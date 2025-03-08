const Post = require("../models/post-model");
const Comment = require("../models/comment-model");

const newComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      if (!post) return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({ content, post: post._id });

    
    await comment.save();

    post.comment.push(comment._id);
    await post.save(); 

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const getComment = async (req,res)=>{
    try {
        const comments = await Comment.find({ post: req.params.postId });
        res.json(comments);
    } catch (error) {
        res.status(505).json({message:"internal server error"})
      }
    }
    


module.exports = { newComment,getComment } 
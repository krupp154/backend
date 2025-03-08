const Post = require('../models/post-model');

// Function to add a new post
const addPost = async (req, res) => {
  try {
    const { content, username, userInstaId } = req.body;
    const post = new Post({ content, username, userInstaId });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to show all posts
const showPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get a post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params; // Correctly extract the post ID from the request parameters
    const post = await Post.findById(id).populate('comment'); // Assuming comments are populated
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// Function to like a post
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.like += 1;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to dislike a post
const dislikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.dislike += 1;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addPost, showPosts, getPostById, likePost, dislikePost };

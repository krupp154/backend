const express = require('express');
const router = express.Router();
const { addPost, showPosts, getPostById, likePost, dislikePost } = require('../controllers/post-controllre');

// Route to show all posts
router.get("/", showPosts);

// Route to add a new post
router.post("/upload", addPost);

// Route to get a specific post by ID
router.get("/:id", getPostById);

// Route to like a post
router.post("/:id/like", likePost);

// Route to dislike a post
router.post("/:id/dislike", dislikePost);

module.exports = router;

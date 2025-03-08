const express = require('express')
const {newComment,getComment} = require('../controllers/comment-controller')
const router = express.Router()

router.post('/:postId',newComment)
router.get('/:postId',getComment)

module.exports = router
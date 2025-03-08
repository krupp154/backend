const express = require('express')
const router = express.Router()
const { addReply, getReply } = require('../controllers/reply-controller')

router.post("/:commentId",addReply)
router.get("/:commentId",getReply)

module.exports = router
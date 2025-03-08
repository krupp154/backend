const express = require("express");
const { sendMessage, readMessage, deleteMessageAfterSeen } = require("../controllers/message-controller");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/read/:messageId", readMessage);
router.delete("/delete/:messageId", deleteMessageAfterSeen);
module.exports = router;

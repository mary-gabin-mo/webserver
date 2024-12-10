const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
router.get("/chatUsers", messageController.getChatUsers);
router.post("/sendMessage", messageController.sendMessage);
router.get("/chat", messageController.getChat);
module.exports = router;

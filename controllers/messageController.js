const Message = require("../model/messageModel");

const getChatUsers = async (req, res) => {
  const { user_ID } = req.query;
  if (!user_ID) {
    return res.status(400).json({ message: "User ID not found" });
  }

  try {
    const [results] = await Message.getChatUsers(user_ID);
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const sendMessage = async (req, res) => {
  const { sender_ID, receiver_ID, content } = req.body;
  if (!sender_ID || !receiver_ID || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await Message.sendMessage(sender_ID, receiver_ID, content);
    res.status(201).json({
      message_ID: result.insertId,
      message: "Message sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getChat = async (req, res) => {
  const { user1_ID, user2_ID } = req.query;
  if (!user1_ID || !user2_ID) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [results] = await Message.getChat(user1_ID, user2_ID);
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getChatUsers,
  sendMessage,
  getChat,
};

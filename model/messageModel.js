const db = require("../config/dbConn");

const chatUsersQuery = `
  SELECT DISTINCT 
      CASE 
          WHEN sender_ID = ? THEN receiver_ID
          ELSE sender_ID
      END AS user_ID,
      U.email
  FROM Message
  JOIN User AS U ON U.user_ID = 
      CASE 
          WHEN sender_ID = ? THEN receiver_ID
          ELSE sender_ID
      END
  WHERE sender_ID = ? OR receiver_ID = ?;
`;

const sendMessageQuery = `
  INSERT INTO Message (sender_ID, receiver_ID, content, time_stamp)
  VALUES (?, ?, ?, CURRENT_TIMESTAMP);
`;

const getChatQuery = `
  SELECT M.message_ID, M.sender_ID, M.receiver_ID, M.content, M.time_stamp
  FROM Message AS M
  WHERE (M.receiver_ID = ? AND M.sender_ID = ?)
  OR (M.receiver_ID = ? AND M.sender_ID = ?)
  ORDER BY M.time_stamp DESC;
`;

module.exports = class Message {
  constructor() {}

  static async getChatUsers(user_ID) {
    try {
      return await db.execute(chatUsersQuery, [
        user_ID,
        user_ID,
        user_ID,
        user_ID,
      ]);
    } catch (error) {
      console.log(err);
    }
  }

  static async sendMessage(sender_ID, receiver_ID, content) {
    try {
      return await db.execute(sendMessageQuery, [
        sender_ID,
        receiver_ID,
        content,
      ]);
    } catch (error) {
      console.log(err);
    }
  }

  static async getChat(user1_ID, user2_ID) {
    /* test 
    http://localhost:3500/message/chat?user1_ID=93&user2_ID=94 */
    try {
      return await db.execute(getChatQuery, [
        user1_ID,
        user2_ID,
        user2_ID,
        user1_ID,
      ]);
    } catch (error) {
      console.log(err);
    }
  }
};

/*
localhost:3500/message/sendMessage
{
  "receiver_ID": 93, 
  "sender_ID": 94,  
  "content": "hello"
}
*/
